import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { BookingInput } from "./booking-schema";
import { MIN_FILL_MS } from "./booking-schema";
import { availabilityFor, isKnownService, isSlotOffered } from "./availability";

const BUCKET = "booking-inspiration";

function decodeDataUrl(dataUrl: string): Uint8Array {
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Verify the bytes really are an image, not a renamed file. */
function looksLikeImage(bytes: Uint8Array) {
  const b = bytes;
  const jpeg = b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  const png = b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
  const riff = String.fromCharCode(...b.slice(0, 4)) === "RIFF";
  const webp = riff && String.fromCharCode(...b.slice(8, 12)) === "WEBP";
  const heic = String.fromCharCode(...b.slice(4, 8)) === "ftyp";
  return jpeg || png || webp || heic;
}

function safeExtension(name: string, type: string) {
  const fromName = name.includes(".") ? name.split(".").pop()! : "";
  const ext = (fromName || type.split("/")[1] || "jpg").toLowerCase();
  return /^[a-z0-9]{2,5}$/.test(ext) ? ext : "jpg";
}

export type StoredBooking = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  service: string;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  inspiration_urls: string[];
  created_at: string;
};

/** Slots already requested for a service on a given date. */
export async function fetchTakenSlots(service: string, dateKey: string) {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("preferred_time")
    .eq("service", service)
    .eq("preferred_date", dateKey);

  if (error) {
    console.error("Availability lookup failed", error.message);
    return [] as string[];
  }
  return (data ?? [])
    .map((row) => (row as { preferred_time: string | null }).preferred_time)
    .filter((slot): slot is string => Boolean(slot));
}

export async function getServiceAvailability(service: string, dateKey: string) {
  const config = availabilityFor(service);
  const taken = await fetchTakenSlots(service, dateKey);
  return {
    durationLabel: config.durationLabel,
    slots: config.slots.map((slot) => ({ slot, available: !taken.includes(slot) })),
  };
}

export async function createBooking(input: BookingInput) {
  // Spam protection: honeypot + submission speed.
  if (input.website) throw new Error("Your request could not be verified. Please try again.");
  if (input.elapsedMs < MIN_FILL_MS) {
    throw new Error("That was a little too quick — please review your details and resend.");
  }
  if (!isKnownService(input.service)) throw new Error("Please choose a service from the list.");

  // Rate limit: same email may not send more than 3 requests per hour.
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabaseAdmin
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("email", input.email)
    .gte("created_at", hourAgo);
  if ((count ?? 0) >= 3) {
    throw new Error("You already have recent requests pending. Please call or email instead.");
  }

  const date = input.preferredDate ?? "";
  const time = input.preferredTime ?? "";
  if (time) {
    if (!date) throw new Error("Please pick a date for the selected time.");
    if (!isSlotOffered(input.service, date, time)) {
      throw new Error("That time is no longer offered. Please choose another slot.");
    }
    const taken = await fetchTakenSlots(input.service, date);
    if (taken.includes(time)) {
      throw new Error("That time was just requested by someone else. Please choose another slot.");
    }
  }

  const folder = crypto.randomUUID();
  const paths: string[] = [];

  for (const [index, file] of input.attachments.entries()) {
    const bytes = decodeDataUrl(file.dataUrl);
    if (!looksLikeImage(bytes)) {
      throw new Error(`${file.name} is not a valid image file.`);
    }
    const path = `${folder}/${index + 1}.${safeExtension(file.name, file.type)}`;
    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: file.type, upsert: false });
    if (error) {
      console.error("Inspiration upload failed", error.message);
      continue;
    }
    paths.push(path);
  }

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .insert({
      full_name: input.fullName,
      email: input.email,
      phone: input.phone,
      service: input.service,
      preferred_date: date ? date : null,
      preferred_time: time ? time : null,
      message: input.message ? input.message : null,
      inspiration_urls: paths,
    })
    .select("id, created_at")
    .single();

  if (error) {
    console.error("Booking insert failed", error.message);
    if (error.code === "23505" || error.message.includes("bookings_service_slot_unique")) {
      throw new Error("That time was just booked. Please choose another slot.");
    }
    throw new Error("We could not save your request. Please call or email instead.");
  }

  return {
    reference: data.id.slice(0, 8).toUpperCase(),
    createdAt: data.created_at as string,
    attachmentCount: paths.length,
  };
}

export async function fetchBookings() {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select(
      "id, full_name, email, phone, service, preferred_date, preferred_time, message, inspiration_urls, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw new Error(error.message);

  const bookings = (data ?? []) as StoredBooking[];

  return Promise.all(
    bookings.map(async (booking) => {
      const signed = await Promise.all(
        booking.inspiration_urls.map(async (path) => {
          const { data: signedData } = await supabaseAdmin.storage
            .from(BUCKET)
            .createSignedUrl(path, 60 * 60);
          return signedData?.signedUrl ?? null;
        }),
      );
      return {
        ...booking,
        attachments: signed.filter((url): url is string => Boolean(url)),
      };
    }),
  );
}

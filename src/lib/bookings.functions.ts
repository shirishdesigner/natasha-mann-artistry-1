import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { bookingSchema, OWNER_EMAIL } from "./booking-schema";
import { createBooking, fetchBookings, getServiceAvailability } from "./bookings.server";
import { availabilitySchema } from "./availability-schema";

export const submitBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }) => createBooking(data));

export const getAvailability = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => availabilitySchema.parse(data))
  .handler(async ({ data }) => getServiceAvailability(data.service, data.date));

export const listBookings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const email = (context.claims as { email?: string } | null)?.email;
    if (email?.toLowerCase() !== OWNER_EMAIL) {
      throw new Error("This account is not allowed to view bookings.");
    }
    return fetchBookings();
  });

import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  CalendarPlus,
  CheckCircle2,
  FileDown,
  ImagePlus,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { BRAND, SERVICE_OPTIONS } from "./brand";
import { Reveal, SectionHeading } from "./Reveal";
import { submitBooking, getAvailability } from "@/lib/bookings.functions";
import {
  ACCEPT_ATTRIBUTE,
  ACCEPTED_IMAGE_TYPES,
  MAX_ATTACHMENTS,
  MAX_ATTACHMENT_BYTES,
  MIN_ATTACHMENT_BYTES,
} from "@/lib/booking-schema";
import {
  availabilityFor,
  formatSlot,
  isDateOffered,
  parseDateKey,
  toDateKey,
} from "@/lib/availability";
import { downloadBookingPdf, downloadIcs } from "@/lib/booking-doc";

const FIELD =
  "w-full border-0 border-b border-border bg-transparent pb-3 text-sm font-light text-foreground transition-colors duration-500 outline-none placeholder:text-muted-foreground/60 focus:border-champagne";

const LABEL = "block text-[0.6rem] tracking-[0.28em] text-muted-foreground uppercase";

type Attachment = { name: string; type: string; dataUrl: string };

type SlotState = { slot: string; available: boolean };

type Confirmation = {
  reference: string;
  fullName: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  email: string;
  phone: string;
  message: string;
  attachmentCount: number;
};

const readAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that file"));
    reader.readAsDataURL(file);
  });

const prettyDate = (dateKey: string) =>
  dateKey
    ? parseDateKey(dateKey).toLocaleDateString("en-CA", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

export function Contact({ preselectService }: { preselectService?: string | undefined } = {}) {
  const [submitting, setSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const startedAt = useRef(Date.now());
  const send = useServerFn(submitBooking);
  const loadAvailability = useServerFn(getAvailability);

  const matched = SERVICE_OPTIONS.find(
    (option) => option.toLowerCase() === (preselectService ?? "").toLowerCase(),
  );
  const [service, setService] = useState<string>(matched ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<SlotState[] | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const config = useMemo(() => availabilityFor(service || SERVICE_OPTIONS[0]), [service]);
  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + config.leadDays);
    return toDateKey(d);
  }, [config.leadDays]);

  useEffect(() => {
    if (matched) setService(matched);
  }, [matched]);

  // Load service-specific availability whenever service + date are both chosen.
  useEffect(() => {
    setTime("");
    if (!service || !date) {
      setSlots(null);
      return;
    }
    if (!isDateOffered(service, date)) {
      setSlots([]);
      return;
    }
    let active = true;
    setLoadingSlots(true);
    loadAvailability({ data: { service, date } })
      .then((result) => {
        if (active) setSlots(result.slots);
      })
      .catch(() => {
        if (active) setSlots(config.slots.map((slot) => ({ slot, available: true })));
      })
      .finally(() => {
        if (active) setLoadingSlots(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, date]);


  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const room = MAX_ATTACHMENTS - attachments.length;
    if (room <= 0) {
      toast.error(`You can attach up to ${MAX_ATTACHMENTS} inspiration photos.`);
      return;
    }
    const next: Attachment[] = [];
    for (const file of Array.from(files).slice(0, room)) {
      if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type.toLowerCase())) {
        toast.error(`${file.name} must be a JPG, PNG, WebP or HEIC image.`);
        continue;
      }
      if (file.size > MAX_ATTACHMENT_BYTES) {
        toast.error(`${file.name} is larger than 4 MB.`);
        continue;
      }
      if (file.size < MIN_ATTACHMENT_BYTES) {
        toast.error(`${file.name} looks empty or corrupted.`);
        continue;
      }
      if (attachments.some((existing) => existing.name === file.name)) {
        toast.error(`${file.name} is already attached.`);
        continue;
      }
      next.push({ name: file.name, type: file.type.toLowerCase(), dataUrl: await readAsDataUrl(file) });
    }
    if (next.length > 0) setAttachments((current) => [...current, ...next]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const payload = {
      fullName: String(values.get("fullName") ?? "").trim(),
      email: String(values.get("email") ?? "").trim(),
      phone: String(values.get("phone") ?? "").trim(),
      service,
      preferredDate: date,
      preferredTime: time,
      message: String(values.get("message") ?? "").trim(),
      attachments,
      website: String(values.get("website") ?? ""),
      elapsedMs: Date.now() - startedAt.current,
    };

    if (payload.website) return;
    if (date && !time && slots && slots.some((entry) => entry.available)) {
      toast.error("Please choose an available time slot.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await send({ data: payload });
      setConfirmation({
        reference: result.reference,
        fullName: payload.fullName,
        service: payload.service,
        preferredDate: payload.preferredDate,
        preferredTime: payload.preferredTime,
        email: payload.email,
        phone: payload.phone,
        message: payload.message ?? "",
        attachmentCount: result.attachmentCount,
      });
      form.reset();
      setAttachments([]);
      setService(matched ?? "");
      setDate("");
      setTime("");
      setSlots(null);
      startedAt.current = Date.now();
      window.scrollTo({ top: window.scrollY, behavior: "auto" });
    } catch (error) {
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong. Please call or email instead.",
      );
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <section id="contact" className="bg-background py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionHeading
          eyebrow="Let's Talk"
          title="Contact & Booking"
          subtitle="Share a few details and Natasha will get back to you personally."
        />

        <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <Reveal>
            <dl className="space-y-10">
              <div>
                <dt className={LABEL}>Email</dt>
                <dd className="mt-3">
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="group inline-flex min-w-0 items-center gap-3 text-base font-light break-all transition-colors duration-500 hover:text-champagne"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-champagne" strokeWidth={1.2} aria-hidden />
                    {BRAND.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className={LABEL}>Phone</dt>
                <dd className="mt-3">
                  <a
                    href={BRAND.phoneHref}
                    className="inline-flex items-center gap-3 text-base font-light transition-colors duration-500 hover:text-champagne"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-champagne" strokeWidth={1.2} aria-hidden />
                    {BRAND.phone}
                  </a>
                </dd>
                <p className="mt-2 text-xs font-light text-muted-foreground">
                  Mobile service — call to discuss
                </p>
              </div>
              <div>
                <dt className={LABEL}>Location</dt>
                <dd className="mt-3 inline-flex items-center gap-3 text-base font-light">
                  <MapPin className="h-4 w-4 shrink-0 text-champagne" strokeWidth={1.2} aria-hidden />
                  {BRAND.location}
                </dd>
              </div>
            </dl>

            <div className="rule-champagne mt-12 w-24" />
            <p className="script mt-10 text-3xl text-foreground/80">
              Let&rsquo;s create something beautiful.
            </p>
          </Reveal>

          <Reveal delay={120}>
            {confirmation ? (
              <div
                role="status"
                aria-live="polite"
                className="border border-champagne/40 bg-secondary/40 p-9 sm:p-12"
              >
                <CheckCircle2 className="h-9 w-9 text-champagne" strokeWidth={1.1} aria-hidden />
                <p className="eyebrow mt-7 text-champagne">Request Confirmed</p>
                <h3 className="mt-5 font-display text-3xl text-foreground sm:text-4xl">
                  Thank you, {confirmation.fullName.split(" ")[0]}.
                </h3>
                <p className="mt-5 max-w-md text-sm leading-[1.9] font-light text-muted-foreground">
                  Your booking request is saved and Natasha will personally reply to{" "}
                  {confirmation.email} to confirm availability, usually within 24 hours.
                </p>

                <dl className="mt-9 space-y-5 border-t border-border pt-8">
                  <div className="flex justify-between gap-6">
                    <dt className={LABEL}>Reference</dt>
                    <dd className="text-sm font-light text-foreground">
                      NM-{confirmation.reference}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className={LABEL}>Service</dt>
                    <dd className="text-right text-sm font-light text-foreground">
                      {confirmation.service}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className={LABEL}>Preferred Date</dt>
                    <dd className="text-right text-sm font-light text-foreground">
                      {confirmation.preferredDate
                        ? prettyDate(confirmation.preferredDate)
                        : "To be confirmed"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className={LABEL}>Time Slot</dt>
                    <dd className="text-sm font-light text-foreground">
                      {confirmation.preferredTime
                        ? formatSlot(confirmation.preferredTime)
                        : "To be confirmed"}
                    </dd>
                  </div>

                  <div className="flex justify-between gap-6">
                    <dt className={LABEL}>Inspiration Photos</dt>
                    <dd className="text-sm font-light text-foreground">
                      {confirmation.attachmentCount}
                    </dd>
                  </div>
                </dl>

                <div className="mt-10 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!downloadIcs(confirmation)) {
                        toast.error("Add a date and time to create a calendar invite.");
                      }
                    }}
                    className="inline-flex items-center gap-2.5 border border-champagne px-7 py-4 text-[0.62rem] font-medium tracking-[0.22em] text-foreground uppercase transition-colors duration-500 hover:bg-champagne hover:text-ink"
                  >
                    <CalendarPlus className="h-4 w-4" strokeWidth={1.3} aria-hidden />
                    Add To Calendar
                  </button>
                  <button
                    type="button"
                    onClick={() => void downloadBookingPdf(confirmation)}
                    className="inline-flex items-center gap-2.5 border border-border px-7 py-4 text-[0.62rem] font-medium tracking-[0.22em] text-foreground uppercase transition-colors duration-500 hover:border-champagne hover:text-champagne"
                  >
                    <FileDown className="h-4 w-4" strokeWidth={1.3} aria-hidden />
                    PDF Summary
                  </button>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setConfirmation(null)}
                    className="sweep bg-ink px-9 py-4 text-[0.66rem] font-medium tracking-[0.24em] text-ivory uppercase transition-colors duration-500 hover:bg-champagne hover:text-ink"
                  >
                    Send Another Request
                  </button>
                  <a
                    href={BRAND.phoneHref}
                    className="px-2 py-4 text-[0.66rem] font-medium tracking-[0.24em] text-muted-foreground uppercase transition-colors duration-500 hover:text-champagne"
                  >
                    Call {BRAND.phone}
                  </a>
                </div>

              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-9 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label className={LABEL} htmlFor="fullName">
                    Full Name <span className="text-champagne">*</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    required
                    maxLength={120}
                    autoComplete="name"
                    placeholder="Your name"
                    className={`${FIELD} mt-4`}
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className={LABEL} htmlFor="email">
                    Email <span className="text-champagne">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    maxLength={255}
                    autoComplete="email"
                    placeholder="you@email.com"
                    className={`${FIELD} mt-4`}
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className={LABEL} htmlFor="phone">
                    Phone <span className="text-champagne">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    maxLength={40}
                    autoComplete="tel"
                    placeholder="647-000-0000"
                    className={`${FIELD} mt-4`}
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className={LABEL} htmlFor="service">
                    Service <span className="text-champagne">*</span>
                  </label>
                  <select
                    id="service"
                    name="service"
                    required
                    value={service}
                    onChange={(event) => setService(event.target.value)}
                    className={`${FIELD} mt-4 appearance-none`}
                  >
                    <option value="" disabled>
                      Select a service
                    </option>
                    {SERVICE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className={LABEL} htmlFor="date">
                    Preferred Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    min={minDate}
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className={`${FIELD} mt-4`}
                  />
                  <p className="mt-3 text-xs font-light text-muted-foreground">
                    {service
                      ? `${service} — ${config.durationLabel}. Requires ${config.leadDays} day${config.leadDays === 1 ? "" : "s"} notice.`
                      : "Select a service to see available dates and times."}
                  </p>
                </div>

                {date ? (
                  <div className="sm:col-span-2">
                    <span className={LABEL}>Available Times</span>
                    {loadingSlots ? (
                      <p className="mt-4 text-xs font-light text-muted-foreground">
                        Checking availability…
                      </p>
                    ) : slots && slots.length > 0 ? (
                      <>
                        <div
                          role="radiogroup"
                          aria-label="Available appointment times"
                          className="mt-4 flex flex-wrap gap-3"
                        >
                          {slots.map((entry) => {
                            const selected = time === entry.slot;
                            return (
                              <button
                                key={entry.slot}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                disabled={!entry.available}
                                onClick={() => setTime(selected ? "" : entry.slot)}
                                className={`border px-5 py-3 text-[0.62rem] tracking-[0.2em] uppercase transition-colors duration-500 ${
                                  selected
                                    ? "border-champagne bg-champagne text-ink"
                                    : entry.available
                                      ? "border-border text-foreground hover:border-champagne hover:text-champagne"
                                      : "border-border/50 text-muted-foreground/50 line-through"
                                }`}
                              >
                                {formatSlot(entry.slot)}
                              </button>
                            );
                          })}
                        </div>
                        <p className="mt-3 text-xs font-light text-muted-foreground">
                          {prettyDate(date)} — crossed-out times are already requested.
                        </p>
                      </>
                    ) : (
                      <p className="mt-4 text-xs font-light text-muted-foreground">
                        Natasha isn&rsquo;t taking this service on that date. Please choose another
                        day, or call {BRAND.phone}.
                      </p>
                    )}
                  </div>
                ) : null}

                <div className="hidden" aria-hidden>
                  <label htmlFor="website">Website</label>
                  <input id="website" name="website" tabIndex={-1} autoComplete="off" />
                </div>


                <div className="sm:col-span-2">
                  <label className={LABEL} htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    maxLength={2000}
                    placeholder="Tell Natasha about your occasion, venue, and the look you have in mind."
                    className={`${FIELD} mt-4 resize-none`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <span className={LABEL}>Inspiration Photos</span>
                  <p className="mt-3 text-xs font-light text-muted-foreground">
                    Attach up to {MAX_ATTACHMENTS} reference images (JPG, PNG or WebP, max 4 MB
                    each) for this request.
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    {attachments.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="group relative h-20 w-20 overflow-hidden border border-border"
                      >
                        <img
                          src={file.dataUrl}
                          alt={`Inspiration reference ${index + 1}: ${file.name}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setAttachments((current) => current.filter((_, i) => i !== index))
                          }
                          aria-label={`Remove ${file.name}`}
                          className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center bg-ink/80 text-ivory transition-colors duration-500 hover:text-champagne"
                        >
                          <X className="h-3 w-3" strokeWidth={1.6} />
                        </button>
                      </div>
                    ))}

                    {attachments.length < MAX_ATTACHMENTS ? (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex h-20 w-20 flex-col items-center justify-center gap-1.5 border border-dashed border-border text-muted-foreground transition-colors duration-500 hover:border-champagne hover:text-champagne"
                      >
                        <ImagePlus className="h-5 w-5" strokeWidth={1.2} aria-hidden />
                        <span className="text-[0.52rem] tracking-[0.2em] uppercase">Add</span>
                      </button>
                    ) : null}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPT_ATTRIBUTE}
                    multiple
                    className="hidden"
                    onChange={(event) => void onFiles(event.target.files)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="sweep w-full bg-ink px-10 py-4 text-[0.66rem] font-medium tracking-[0.24em] text-ivory uppercase transition-colors duration-500 hover:bg-champagne hover:text-ink disabled:opacity-60 sm:w-auto"
                  >
                    {submitting ? "Sending…" : "Send Booking Request"}
                  </button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

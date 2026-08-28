import { z } from "zod";

export const OWNER_EMAIL = "shirish2306@gmail.com";

export const MAX_ATTACHMENTS = 4;
export const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;
export const MIN_ATTACHMENT_BYTES = 512;

/** Accepted inspiration photo types. HEIC/HEIF are converted by the browser on many devices,
 *  so they are accepted but validated by their declared type + signature check server-side. */
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

export const ACCEPT_ATTRIBUTE = ACCEPTED_IMAGE_TYPES.join(",");

/** Minimum time (ms) a real person needs to fill the form. Faster than this = bot. */
export const MIN_FILL_MS = 3500;

const base64Length = (dataUrl: string) => {
  const comma = dataUrl.indexOf(",");
  const body = comma === -1 ? "" : dataUrl.slice(comma + 1);
  const padding = body.endsWith("==") ? 2 : body.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((body.length * 3) / 4) - padding);
};

export const attachmentSchema = z
  .object({
    name: z.string().trim().min(1).max(200),
    type: z.enum(ACCEPTED_IMAGE_TYPES, {
      message: "Only JPG, PNG, WebP or HEIC images are accepted",
    }),
    dataUrl: z.string().startsWith("data:image/"),
  })
  .superRefine((file, ctx) => {
    const bytes = base64Length(file.dataUrl);
    if (bytes < MIN_ATTACHMENT_BYTES) {
      ctx.addIssue({ code: "custom", message: `${file.name} looks empty or corrupted.` });
    }
    if (bytes > MAX_ATTACHMENT_BYTES) {
      ctx.addIssue({ code: "custom", message: `${file.name} is larger than 4 MB.` });
    }
    const declared = file.dataUrl.slice(5, file.dataUrl.indexOf(";")).toLowerCase();
    if (declared !== file.type.toLowerCase()) {
      ctx.addIssue({ code: "custom", message: `${file.name} has a mismatched file type.` });
    }
    if (/[\\/]|\.\./.test(file.name)) {
      ctx.addIssue({ code: "custom", message: "Invalid file name." });
    }
  });

const LINK_PATTERN = /(https?:\/\/|www\.|\[url=|<a\s)/i;

export const bookingSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name is required")
    .max(120)
    .regex(/^[\p{L}\p{M}'’.\- ]+$/u, "Please enter your name using letters only"),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(40)
    .regex(/^[+()\d\s.\-]+$/, "Enter a valid phone number"),
  service: z.string().trim().min(1, "Choose a service").max(120),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("")),
  preferredTime: z
    .string()
    .regex(/^[0-2]\d:[0-5]\d$/)
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .max(2000)
    .refine((value) => !LINK_PATTERN.test(value), "Links are not allowed in the message")
    .optional()
    .or(z.literal("")),
  attachments: z.array(attachmentSchema).max(MAX_ATTACHMENTS).default([]),
  /** Honeypot — must stay empty. */
  website: z.literal("").optional().default(""),
  /** Milliseconds the form was open before submitting. */
  elapsedMs: z.number().int().nonnegative().max(1000 * 60 * 60 * 24),
});

export type BookingInput = z.infer<typeof bookingSchema>;

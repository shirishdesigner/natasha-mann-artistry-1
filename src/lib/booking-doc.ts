import { BRAND } from "@/components/site/brand";
import { availabilityFor, formatSlot, parseDateKey } from "./availability";

export type BookingDocument = {
  reference: string;
  fullName: string;
  email: string;
  phone?: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  attachmentCount?: number;
  createdAt?: string;
};

export const prettyDate = (dateKey: string) =>
  dateKey
    ? parseDateKey(dateKey).toLocaleDateString("en-CA", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "To be confirmed";

/** Appointment start/end as local Date objects. */
export function appointmentRange(doc: BookingDocument) {
  if (!doc.preferredDate || !doc.preferredTime) return null;
  const [hour, minute] = doc.preferredTime.split(":").map(Number);
  const start = parseDateKey(doc.preferredDate);
  start.setHours(hour ?? 9, minute ?? 0, 0, 0);
  const end = new Date(start.getTime() + availabilityFor(doc.service).durationMinutes * 60_000);
  return { start, end };
}

const stamp = (date: Date) => `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;

const escapeIcs = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/** RFC 5545 calendar invite for the appointment. */
export function buildIcs(doc: BookingDocument) {
  const range = appointmentRange(doc);
  if (!range) return null;
  const summary = `${doc.service} — ${BRAND.name}`;
  const description = [
    `Booking reference: NM-${doc.reference}`,
    `Service: ${doc.service}`,
    `Artist: ${BRAND.name} · ${BRAND.phone}`,
    doc.message ? `Notes: ${doc.message}` : "",
    "Natasha will confirm final details by email.",
  ]
    .filter(Boolean)
    .join("\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Natasha Mann Artistry//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:nm-${doc.reference}@natashamannartistry`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(range.start)}`,
    `DTEND:${stamp(range.end)}`,
    `SUMMARY:${escapeIcs(summary)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    `LOCATION:${escapeIcs(BRAND.location)}`,
    `ORGANIZER;CN=${escapeIcs(BRAND.name)}:mailto:${BRAND.email}`,
    "STATUS:TENTATIVE",
    "BEGIN:VALARM",
    "TRIGGER:-PT24H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcs(`Tomorrow: ${summary}`)}`,
    "END:VALARM",
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcs(`In 2 hours: ${summary}`)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadIcs(doc: BookingDocument) {
  const ics = buildIcs(doc);
  if (!ics) return false;
  triggerDownload(new Blob([ics], { type: "text/calendar;charset=utf-8" }), `NM-${doc.reference}.ics`);
  return true;
}

const INK = [26, 24, 22] as const;
const CHAMPAGNE = [183, 138, 106] as const;
const MUTED = [116, 108, 100] as const;

/** Editorial one-page confirmation summary. */
export async function downloadBookingPdf(doc: BookingDocument) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const width = pdf.internal.pageSize.getWidth();
  const margin = 56;

  // Header band
  pdf.setFillColor(...INK);
  pdf.rect(0, 0, width, 150, "F");
  pdf.setTextColor(245, 240, 235);
  pdf.setFont("times", "normal");
  pdf.setFontSize(30);
  pdf.text("Natasha Mann", margin, 74);
  pdf.setFontSize(11);
  pdf.setTextColor(...CHAMPAGNE);
  pdf.text("A R T I S T R Y", margin, 96);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.setTextColor(200, 190, 182);
  pdf.text("BOOKING CONFIRMATION", width - margin, 74, { align: "right" });
  pdf.setTextColor(...CHAMPAGNE);
  pdf.setFontSize(12);
  pdf.text(`NM-${doc.reference}`, width - margin, 94, { align: "right" });

  let y = 210;
  pdf.setTextColor(...INK);
  pdf.setFont("times", "normal");
  pdf.setFontSize(24);
  pdf.text(`Thank you, ${doc.fullName.split(" ")[0]}.`, margin, y);

  y += 26;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(...MUTED);
  const intro = pdf.splitTextToSize(
    "Your appointment request has been received. Natasha will personally confirm availability and final details, usually within 24 hours.",
    width - margin * 2,
  );
  pdf.text(intro, margin, y);
  y += intro.length * 15 + 22;

  pdf.setDrawColor(...CHAMPAGNE);
  pdf.setLineWidth(1);
  pdf.line(margin, y, margin + 70, y);
  y += 34;

  const range = appointmentRange(doc);
  const rows: [string, string][] = [
    ["Service", doc.service],
    ["Date", prettyDate(doc.preferredDate)],
    [
      "Time",
      doc.preferredTime
        ? `${formatSlot(doc.preferredTime)}${range ? ` – ${formatSlot(`${String(range.end.getHours()).padStart(2, "0")}:${String(range.end.getMinutes()).padStart(2, "0")}`)}` : ""}`
        : "To be confirmed",
    ],
    ["Duration", availabilityFor(doc.service).durationLabel],
    ["Client", doc.fullName],
    ["Email", doc.email],
    ...(doc.phone ? ([["Phone", doc.phone]] as [string, string][]) : []),
    ["Inspiration photos", String(doc.attachmentCount ?? 0)],
    ["Location", BRAND.location],
  ];

  for (const [label, value] of rows) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(...MUTED);
    pdf.text(label.toUpperCase(), margin, y);
    pdf.setFontSize(11);
    pdf.setTextColor(...INK);
    const lines = pdf.splitTextToSize(value, width - margin * 2 - 150);
    pdf.text(lines, margin + 150, y);
    y += Math.max(lines.length * 14, 14) + 14;
    pdf.setDrawColor(232, 226, 219);
    pdf.setLineWidth(0.5);
    pdf.line(margin, y - 9, width - margin, y - 9);
  }

  if (doc.message) {
    y += 14;
    pdf.setFontSize(7.5);
    pdf.setTextColor(...MUTED);
    pdf.text("YOUR NOTES", margin, y);
    y += 16;
    pdf.setFontSize(10.5);
    pdf.setTextColor(...INK);
    const notes = pdf.splitTextToSize(doc.message, width - margin * 2);
    pdf.text(notes, margin, y);
    y += notes.length * 14;
  }

  // Footer
  const bottom = pdf.internal.pageSize.getHeight();
  pdf.setFillColor(...INK);
  pdf.rect(0, bottom - 84, width, 84, "F");
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(245, 240, 235);
  pdf.text(`${BRAND.phone}   ·   ${BRAND.email}`, margin, bottom - 48);
  pdf.setTextColor(...CHAMPAGNE);
  pdf.setFontSize(8);
  pdf.text(BRAND.tagline.toUpperCase(), margin, bottom - 28);

  pdf.save(`NM-${doc.reference}-booking.pdf`);
}

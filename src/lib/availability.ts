import { SERVICE_OPTIONS } from "@/components/site/brand";

export type ServiceAvailability = {
  /** Approximate chair time, shown to the client. */
  durationLabel: string;
  /** Appointment length in minutes, used for calendar invites. */
  durationMinutes: number;
  /** Weekday numbers (0 = Sunday) the service is offered on. */
  days: number[];
  /** Start times in 24h HH:MM. */
  slots: string[];
  /** Minimum notice, in days, before a date can be requested. */
  leadDays: number;
};

const BRIDAL_SLOTS = ["05:00", "06:30", "08:00", "09:30", "11:00"];
const PARTY_SLOTS = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00"];
const HAIR_SLOTS = ["09:30", "11:00", "12:30", "14:00", "15:30", "17:00", "18:30"];

export const AVAILABILITY: Record<string, ServiceAvailability> = {
  "Bridal Makeup & Hairstyle": {
    durationLabel: "approx. 2 hr 30 min",
    durationMinutes: 150,
    days: [0, 1, 2, 3, 4, 5, 6],
    slots: BRIDAL_SLOTS,
    leadDays: 7,
  },
  "Bridal Makeup": {
    durationLabel: "approx. 1 hr 30 min",
    durationMinutes: 90,
    days: [0, 1, 2, 3, 4, 5, 6],
    slots: BRIDAL_SLOTS,
    leadDays: 7,
  },
  "Party Makeup & Hairstyle": {
    durationLabel: "approx. 2 hr",
    durationMinutes: 120,
    days: [0, 2, 3, 4, 5, 6],
    slots: PARTY_SLOTS,
    leadDays: 2,
  },
  "Party Hairstyle": {
    durationLabel: "approx. 1 hr",
    durationMinutes: 60,
    days: [0, 2, 3, 4, 5, 6],
    slots: HAIR_SLOTS,
    leadDays: 1,
  },
  "Party Makeup": {
    durationLabel: "approx. 1 hr",
    durationMinutes: 60,
    days: [0, 2, 3, 4, 5, 6],
    slots: PARTY_SLOTS,
    leadDays: 1,
  },
};

export const DEFAULT_AVAILABILITY: ServiceAvailability = {
  durationLabel: "approx. 1 hr 30 min",
    durationMinutes: 90,
  days: [0, 1, 2, 3, 4, 5, 6],
  slots: PARTY_SLOTS,
  leadDays: 2,
};

export function availabilityFor(service: string): ServiceAvailability {
  return AVAILABILITY[service] ?? DEFAULT_AVAILABILITY;
}

export const isKnownService = (service: string) =>
  (SERVICE_OPTIONS as readonly string[]).includes(service);

/** "14:30" -> "2:30 PM" */
export function formatSlot(slot: string) {
  const [hourText, minute] = slot.split(":");
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${minute} ${suffix}`;
}

/** Local (not UTC) YYYY-MM-DD for a Date. */
export function toDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function parseDateKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year!, (month ?? 1) - 1, day ?? 1);
}

export function isDateOffered(service: string, dateKey: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return false;
  const config = availabilityFor(service);
  const date = parseDateKey(dateKey);
  if (Number.isNaN(date.getTime())) return false;
  if (!config.days.includes(date.getDay())) return false;
  const earliest = new Date();
  earliest.setHours(0, 0, 0, 0);
  earliest.setDate(earliest.getDate() + config.leadDays);
  return date.getTime() >= earliest.getTime();
}

export function isSlotOffered(service: string, dateKey: string, slot: string) {
  return isDateOffered(service, dateKey) && availabilityFor(service).slots.includes(slot);
}

/** The next N offered dates for a service, from today forward. */
export function upcomingDates(service: string, count = 12) {
  const config = availabilityFor(service);
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() + config.leadDays);
  const dates: string[] = [];
  for (let i = 0; i < 90 && dates.length < count; i += 1) {
    if (config.days.includes(cursor.getDay())) dates.push(toDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

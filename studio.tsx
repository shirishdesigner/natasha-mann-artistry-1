import { formatSlot } from "@/lib/availability";
import { downloadBookingPdf, downloadIcs, type BookingDocument } from "@/lib/booking-doc";

type StudioBooking = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  service: string;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  attachments: string[];
  created_at: string;
};

const toDocument = (booking: StudioBooking): BookingDocument => ({
  reference: booking.id.slice(0, 8).toUpperCase(),
  fullName: booking.full_name,
  email: booking.email,
  phone: booking.phone,
  service: booking.service,
  preferredDate: booking.preferred_date ?? "",
  preferredTime: booking.preferred_time ?? "",
  message: booking.message ?? "",
  attachmentCount: booking.attachments.length,
  createdAt: booking.created_at,
});
import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { listBookings } from "@/lib/bookings.functions";
import { OWNER_EMAIL } from "@/lib/booking-schema";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Studio Bookings | Natasha Mann Artistry" },
      {
        name: "description",
        content: "Private studio area for reviewing booking requests sent through the website.",
      },
      { property: "og:title", content: "Studio Bookings | Natasha Mann Artistry" },
      {
        property: "og:description",
        content: "Private studio area for reviewing booking requests.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: StudioPage,
});

const FIELD =
  "w-full border-0 border-b border-border bg-transparent pb-3 text-sm font-light text-foreground outline-none transition-colors duration-500 focus:border-champagne";

function StudioPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const fetchBookings = useServerFn(listBookings);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessionEmail(data.session?.user.email ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionEmail(session?.user.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const bookings = useQuery({
    queryKey: ["bookings", sessionEmail],
    queryFn: () => fetchBookings(),
    enabled: Boolean(sessionEmail),
  });

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
  };

  const signUp = async () => {
    if (!email || !password) {
      toast.error("Enter an email and password first.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/studio` },
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Account created", { description: "Check your inbox to confirm, then sign in." });
  };

  if (!ready) {
    return <div className="min-h-screen bg-background pt-40 pb-24" />;
  }

  if (!sessionEmail) {
    return (
      <section className="min-h-screen bg-background px-6 pt-40 pb-24">
        <div className="mx-auto max-w-md">
          <p className="eyebrow text-champagne">Private</p>
          <h1 className="mt-6 font-display text-4xl text-foreground">Studio Bookings</h1>
          <p className="mt-5 text-sm leading-relaxed font-light text-muted-foreground">
            Sign in with {OWNER_EMAIL} to review booking requests sent through the website.
          </p>
          <form onSubmit={signIn} className="mt-10 space-y-8">
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={FIELD}
            />
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={FIELD}
            />
            <div className="flex flex-wrap items-center gap-6">
              <button
                type="submit"
                disabled={busy}
                className="sweep bg-ink px-9 py-4 text-[0.66rem] font-medium tracking-[0.24em] text-ivory uppercase transition-colors duration-500 hover:bg-champagne hover:text-ink disabled:opacity-60"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => void signUp()}
                disabled={busy}
                className="text-[0.62rem] tracking-[0.24em] text-muted-foreground uppercase transition-colors duration-500 hover:text-champagne"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-background px-6 pt-40 pb-24 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-champagne">Private</p>
            <h1 className="mt-5 font-display text-4xl text-foreground">Booking Requests</h1>
            <p className="mt-3 text-xs font-light text-muted-foreground">
              Signed in as {sessionEmail}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void supabase.auth.signOut()}
            className="text-[0.62rem] tracking-[0.24em] text-muted-foreground uppercase transition-colors duration-500 hover:text-champagne"
          >
            Sign Out
          </button>
        </div>

        {bookings.isLoading ? (
          <p className="mt-14 text-sm font-light text-muted-foreground">Loading requests…</p>
        ) : bookings.isError ? (
          <p className="mt-14 text-sm font-light text-destructive">
            {bookings.error instanceof Error
              ? bookings.error.message
              : "Could not load bookings."}
          </p>
        ) : (bookings.data ?? []).length === 0 ? (
          <p className="mt-14 text-sm font-light text-muted-foreground">
            No booking requests yet.
          </p>
        ) : (
          <div className="mt-14 space-y-6">
            {(bookings.data ?? []).map((booking) => (
              <article key={booking.id} className="border border-border bg-secondary/30 p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <h2 className="font-display text-2xl text-foreground">{booking.full_name}</h2>
                  <span className="text-[0.6rem] tracking-[0.24em] text-champagne uppercase">
                    NM-{booking.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <dl className="mt-6 grid gap-4 text-sm font-light text-muted-foreground sm:grid-cols-2">
                  <div>
                    <dt className="text-[0.58rem] tracking-[0.24em] uppercase">Service</dt>
                    <dd className="mt-1 text-foreground">{booking.service}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.58rem] tracking-[0.24em] uppercase">
                      Preferred date &amp; time
                    </dt>
                    <dd className="mt-1 text-foreground">
                      {booking.preferred_date ?? "To be confirmed"}
                      {booking.preferred_time ? ` · ${formatSlot(booking.preferred_time)}` : ""}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[0.58rem] tracking-[0.24em] uppercase">Email</dt>
                    <dd className="mt-1 break-all text-foreground">
                      <a href={`mailto:${booking.email}`}>{booking.email}</a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.58rem] tracking-[0.24em] uppercase">Phone</dt>
                    <dd className="mt-1 text-foreground">
                      <a href={`tel:${booking.phone}`}>{booking.phone}</a>
                    </dd>
                  </div>
                </dl>
                {booking.message ? (
                  <p className="mt-6 border-t border-border pt-5 text-sm leading-relaxed font-light text-muted-foreground">
                    {booking.message}
                  </p>
                ) : null}
                {booking.attachments.length > 0 ? (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {booking.attachments.map((url, index) => (
                      <a key={url} href={url} target="_blank" rel="noreferrer">
                        <img
                          src={url}
                          alt={`Inspiration photo ${index + 1} from ${booking.full_name}`}
                          className="h-24 w-24 border border-border object-cover"
                        />
                      </a>
                    ))}
                  </div>
                ) : null}
                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-6">
                  <button
                    type="button"
                    onClick={() => void downloadBookingPdf(toDocument(booking))}
                    className="border border-border px-6 py-3 text-[0.58rem] tracking-[0.22em] uppercase transition-colors duration-500 hover:border-champagne hover:text-champagne"
                  >
                    Download PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadIcs(toDocument(booking))}
                    disabled={!booking.preferred_date || !booking.preferred_time}
                    className="border border-border px-6 py-3 text-[0.58rem] tracking-[0.22em] uppercase transition-colors duration-500 hover:border-champagne hover:text-champagne disabled:opacity-40"
                  >
                    Calendar Invite
                  </button>
                  <span className="text-[0.58rem] tracking-[0.24em] text-muted-foreground uppercase">
                    Received {new Date(booking.created_at).toLocaleString()}
                  </span>
                </div>

              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactUs() {
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ msg: "", color: "bg-green-500" });

  const valid = emailRe.test(email.trim()) && body.trim().length > 0;

  useEffect(() => {
    if (!status.msg) return;
    const t = setTimeout(() => setStatus((s) => ({ ...s, msg: "" })), 3000);
    return () => clearTimeout(t);
  }, [status.msg]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!valid || loading) {
      setStatus({
        msg: !emailRe.test(email.trim())
          ? "Enter a valid email."
          : "Message is required.",
        color: "bg-yellow-600",
      });
      return;
    }
    // fake submission
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 600));
      setStatus({
        msg: "Sent successfully! (To no where, it's a demo)",
        color: "bg-green-500 opacity-90",
      });
      setEmail("");
      setBody("");
    } catch {
      setStatus({ msg: "Network error.", color: "bg-red-600" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center gap-6 py-20">
      <section className="flex flex-col items-center justify-center gap-4 text-center">
        <header className="w-4/5 text-4xl sm:text-6xl font-semibold">
          Ask about our secret recipe!
        </header>
        <span className="font-semibold">
          We usually answer within 1–2 business days unless urgent.
        </span>
        <span>
          If relevant provide details about the Order itself to help us speed
          the process.
        </span>
        <span className="flex flex-col items-center">
          <span className="flex items-center gap-1">
            Order cancellations offer{" "}
            <span className="text-lg text-red-600 font-semibold">
              NO REFUNDS.
            </span>
          </span>
        </span>
      </section>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-xl flex-col gap-4"
      >
        <label className="flex flex-col gap-1">
          <span>Email *</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 rounded-md border px-3"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span>Message *</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="h-40 w-full rounded-md border p-3"
            placeholder="Write your message…"
            required
          />
        </label>

        <button
          type="submit"
          disabled={!valid || loading}
          className="ml-auto mr-auto rounded-3xl border-2 border-indigo-900 bg-indigo-900 px-10 py-2 text-[#fff9f5] hover:bg-transparent hover:text-indigo-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {status.msg ? (
        <div
          className={`fixed right-5 top-5 rounded px-6 py-3 text-black shadow-lg ${status.color}`}
        >
          {status.msg}
        </div>
      ) : null}

      <section className="pt-18 flex flex-col gap-10">
        <header className="text-4xl sm:text-6xl font-semibold">
          Location & Hours
        </header>
        <ul className="flex flex-col items-center justify-center gap-6 text-center">
          <li className="w-4/5 sm:w-1/2">
            <p>500 Rainbow Blvd, Somewhere City, CA 94123</p>
          </li>
          <li className="w-4/5 sm:w-1/2">
            <p>Sun - Thu: 9am - 7pm</p>
            <p>Fri: 9am - 12pm</p>
          </li>
        </ul>
      </section>
    </main>
  );
}

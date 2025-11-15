import { useState } from "react";
import * as motion from "motion/react-client";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function WavyText({ text, delay = 0 }) {
  return (
    <span className="inline-block">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: 0 }}
          animate={{ y: [-2, -6, 0] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: delay + i * 0.04,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function ContactUs() {
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", color: "" });

  const valid = emailRe.test(email.trim()) && body.trim().length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/inquiry/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, body }),
        }
      );
      if (!response.ok) {
        setToast({
          msg: `Error ${response.status}: ${response.statusText}`,
          color: "bg-red-600 opacity-85",
        });
        setTimeout(() => setToast({ msg: "", color: "" }), 3000);
        return;
      }
    } catch (err) {
      console.error(err);
    }

    try {
      setLoading(true);
      setToast({
        msg: "Sent successfully!",
        color: "bg-green-600 opacity-85",
      });
      setTimeout(() => setToast({ msg: "", color: "" }), 3000);
      setEmail("");
      setBody("");
    } catch {
      setToast({ msg: "Network error.", color: "bg-red-600 opacity-85" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center gap-6 py-20">
      <section className="flex md:w-full w-xs flex-col items-center justify-center gap-4 text-center">
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
        className="flex w-xs md:w-full max-w-xl flex-col gap-4"
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
            maxLength={228}
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

      {toast.msg ? (
        <div
          className={`fixed right-5 top-5 rounded px-6 py-3 text-black shadow-lg ${toast.color}`}
        >
          {toast.msg}
        </div>
      ) : null}

      <section className="pt-18 flex flex-col gap-10 items-center">
        <header className="text-4xl sm:text-6xl font-semibold text-center">
          <WavyText text="Location & Hours" />
        </header>
        <ul className="flex flex-col items-center justify-center gap-6 text-center">
          <li className="w-4/5 sm:w-1/2">
            <WavyText
              text="500 Rainbow Blvd, Somewhere City, CA 94123"
              delay={0.2}
            />
          </li>
          <li className="w-4/5 sm:w-1/2">
            <WavyText text="Sun - Thu: 9am - 7pm" delay={0.35} />
            <br />
            <WavyText text="Fri: 9am - 12pm" delay={0.5} />
          </li>
        </ul>
      </section>
    </main>
  );
}

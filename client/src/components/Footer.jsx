import { useState } from "react";

function Footer() {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [toast, setToast] = useState({ msg: "", color: "" });

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid = emailRe.test(email.trim()) && agreed;

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(`/api/subscriber/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        setToast({
          msg: `Error ${response.status}: ${response.statusText}`,
          color: "bg-red-600 opacity-85",
        });
        setTimeout(() => setToast({ msg: "", color: "" }), 3000);
        return;
      }
      setEmail("");
      setAgreed(false);
      setToast({
        msg: "Sent!",
        color: "bg-green-600 opacity-85",
      });
      setTimeout(() => setToast({ msg: "", color: "" }), 3000);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <footer className="relative flex md:flex-row flex-col justify-between bg-orange-200 p-10 py-20 opacity-90 border-t-2">
      <section className="flex flex-col gap-6">
        <span className="w-[200px]">
          <label className="font-semibold">Address</label>
          <p>500 Rainbow Blvd, Somewhere City, CA 94123</p>
        </span>
        <span>
          <label className="font-semibold">Contact</label>
          <p className="w-1/5">info@platter.com</p>
          <span>050-123-1234</span>
        </span>
      </section>

      <section className="flex flex-col gap-6">
        <span>
          <label className="font-semibold">Opening Hours</label>
          <p>Sun - Thu: 9am - 7pm</p>
          <p>Fri: 9am - 12pm</p>
        </span>
        <span>
          <label className="font-semibold">Follow Us</label>
          <p>
            <a href="https://www.instagram.com/">Instagram</a>
          </p>
          <p>
            <a href="https://www.facebook.com/">Facebook</a>
          </p>
          <p>
            <a href="https://www.tiktok.com/">Tiktok</a>
          </p>
        </span>
      </section>

      <section className="flex flex-col gap-8 pt-10">
        <header className="w-4/5 font-semibold">
          Subscribe to our newsletter for some juicy stuff
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <span>
            <label htmlFor="email" className="block">
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-[90%] border-b-2 outline-none"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </span>

          <label className="flex items-center gap-3 pt-4">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="transform scale-150 border-1 border-indigo-900 p-1"
            />
            <span>Yes, subscribe me to your newsletter.</span>
          </label>

          <button
            type="submit"
            disabled={!valid}
            className="w-[300px] cursor-pointer rounded-3xl border-2 border-indigo-900 bg-indigo-900 py-[8px] text-[#fff9f5] duration-300 hover:bg-[#fff9f5] hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </form>

        {toast.msg ? (
          <div
            className={`fixed right-5 top-5 z-50 rounded px-6 py-3 text-white shadow-lg ${toast.color}`}
            role="status"
          >
            {toast.msg}
          </div>
        ) : null}
      </section>
    </footer>
  );
}

export default Footer;

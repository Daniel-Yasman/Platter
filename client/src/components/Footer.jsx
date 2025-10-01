import { useEffect, useMemo, useState } from "react";

function Footer() {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState({ msg: "", color: "bg-green-500" });
  const [loading, setLoading] = useState(false);

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid = useMemo(
    () => emailRe.test(email.trim()) && agreed,
    [email, agreed]
  );

  useEffect(() => {
    if (!status.msg) return;
    const t = setTimeout(
      () => setStatus({ msg: "", color: status.color }),
      3000
    );
    return () => clearTimeout(t);
  }, [status]);

  // async function handleSubmit(e) {
  //   e?.preventDefault();
  //   if (!valid || loading) {
  //     if (!agreed)
  //       setStatus({
  //         msg: "You must agree to subscribe!",
  //         color: "bg-yellow-600",
  //       });
  //     else setStatus({ msg: "Enter a valid email.", color: "bg-yellow-600" });
  //     return;
  //   }
  //   try {
  //     setLoading(true);
  //     const res = await fetch("/api/news/addSubscriber", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include",
  //       body: JSON.stringify({ email }),
  //     });

  //     if (res.status === 201) {
  //       setStatus({ msg: "Sent successfully!", color: "bg-green-500" });
  //       setEmail("");
  //       setAgreed(false);
  //     } else if (res.status === 409) {
  //       setStatus({ msg: "Mail already exists!", color: "bg-yellow-600" });
  //     } else if (res.status === 400) {
  //       setStatus({ msg: "Missing or invalid email!", color: "bg-red-600" });
  //     } else {
  //       setStatus({ msg: "An error occurred!", color: "bg-red-600" });
  //     }
  //   } catch {
  //     setStatus({ msg: "Network error!", color: "bg-red-600" });
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  return (
    <footer className="relative flex justify-between bg-orange-200 p-10 py-20 opacity-90">
      <section className="flex flex-col gap-6">
        <span className="w-[200px]">
          <label className="font-semibold">Address</label>
          <p>500 Some where Over, The Rainbow, ASS 94123</p>
        </span>
        <span>
          <label className="font-semibold">Contact</label>
          <p className="w-1/5">ozzy.oz@ye.com</p>
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
          <p>Pisstagram</p>
          <p>Facegook</p>
          <p>ShitTok</p>
        </span>
      </section>

      <section className="flex flex-col gap-8 pt-10">
        <header className="w-4/5 font-semibold">
          Subscribe to our newsletter for some juicy stuff
        </header>

        <form onSubmit={null/*handleSubmit*/} className="flex flex-col gap-4">
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
            disabled={!valid || loading}
            className="w-[300px] cursor-pointer rounded-3xl border-2 border-indigo-900 bg-indigo-900 py-[8px] text-[#fff9f5] duration-300 hover:bg-[#fff9f5] hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit{/* {loading ? "Submitting..." : "Submit"} */}
          </button>
        </form>

        {status.msg && (
          <div
            className={`fixed right-5 top-5 z-50 px-6 py-3 text-black shadow-lg ${status.color} rounded`}
            role="status"
          >
            {status.msg}
          </div>
        )}
      </section>
    </footer>
  );
}

export default Footer;

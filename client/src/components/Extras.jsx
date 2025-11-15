import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState } from "react";

function Extras() {
  const [userCount, setUserCount] = useState(0);
  const usCount = useMotionValue(0);
  const roundedUs = useTransform(() => Math.round(usCount.get()));

  const [reservationCount, setReservationCount] = useState(0);
  const resCount = useMotionValue(0);
  const roundedRes = useTransform(() => Math.round(resCount.get()));

  const [foodCount, setFoodCount] = useState(0);
  const foCount = useMotionValue(0);
  const roundedFo = useTransform(() => Math.round(foCount.get()));

  const [toast, setToast] = useState({ msg: "", color: "" });

  // Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/`
        );
        if (!response.ok) {
          setToast({
            msg: `Error ${response.status}: ${response.statusText}`,
            color: "bg-red-600 opacity-85",
          });
          setTimeout(() => setToast({ msg: "", color: "" }), 3000);
          return;
        }
        const parsed = await response.json();
        setUserCount(parsed.users.length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const controls = animate(usCount, userCount, { duration: 1.5 });
    return () => controls.stop();
  }, [userCount]);

  // Reservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/reservation/`
        );
        if (!response.ok) {
          setToast({
            msg: `Error ${response.status}: ${response.statusText}`,
            color: "bg-red-600 opacity-85",
          });
          setTimeout(() => setToast({ msg: "", color: "" }), 3000);
          return;
        }
        const parsed = await response.json();
        setReservationCount(parsed.reservations.length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReservations();
  }, []);

  useEffect(() => {
    const controls = animate(resCount, reservationCount, { duration: 1.5 });
    return () => controls.stop();
  }, [reservationCount]);

  // Foods
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/food/`
        );
        if (!response.ok) {
          setToast({
            msg: `Error ${response.status}: ${response.statusText}`,
            color: "bg-red-600 opacity-85",
          });
          setTimeout(() => setToast({ msg: "", color: "" }), 3000);
          return;
        }
        const parsed = await response.json();
        setFoodCount(parsed.foods.length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFoods();
  }, []);

  useEffect(() => {
    const controls = animate(foCount, foodCount, { duration: 1.5 });
    return () => controls.stop();
  }, [foodCount]);

  return (
    <div className="py-24 font-semibold text-2xl">
      <section className="pb-24 flex flex-col justify-center items-center">
        <header className="text-6xl max-w-2xl text-center leading-snug tracking-tight font-semibold">
          Indulge. Regret nothing.
        </header>
      </section>
      <div className="flex md:flex-row flex-col gap-4 md:gap-0 justify-evenly">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{
            duration: 0.4,
            scale: { type: "spring", bounce: 0.5 },
          }}
        >
          <section className="flex flex-col items-center justify-center">
            <img
              className="w-32 h-32"
              src={`${
                import.meta.env.VITE_API_URL
              }/images/pages/home/Carnivores Table Nuggets Icon.png`}
              alt="Visit our Store"
              loading="lazy"
              decoding="async"
            />
            <div className="flex">
              <p className="flex gap-1">
                Over
                <motion.pre>{roundedUs}</motion.pre>
                Satisfied Customers!
              </p>
            </div>
          </section>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{
            duration: 0.4,
            scale: { type: "spring", bounce: 0.5 },
          }}
        >
          <section className="flex flex-col items-center justify-center">
            <img
              className="w-32 h-32"
              src={`${
                import.meta.env.VITE_API_URL
              }/images/pages/home/Pizza Icon.png`}
              alt="Order Online & Save Time"
              loading="lazy"
              decoding="async"
            />
            <div className="flex">
              <p className="flex gap-1">
                <motion.pre>{roundedRes}</motion.pre> Reservations made!
              </p>
            </div>
          </section>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{
            duration: 0.4,
            scale: { type: "spring", bounce: 0.5 },
          }}
        >
          <section className="flex flex-col justify-center items-center">
            <img
              className="w-32 h-32"
              src={`${
                import.meta.env.VITE_API_URL
              }/images/pages/home/Cake Icon.png`}
              alt="Table Ready in Seconds"
              loading="lazy"
              decoding="async"
            />
            <div className="flex">
              <div className="flex">
                <p className="flex gap-1">
                  <motion.pre>{roundedFo}</motion.pre> foods to choose from!
                </p>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
      {/* Toast */}
      {toast.msg ? (
        <div
          className={`fixed right-5 top-5 z-50 rounded px-6 py-3 text-white shadow-lg ${toast.color}`}
        >
          {toast.msg}
        </div>
      ) : null}
    </div>
  );
}

export default Extras;

import { useRef, useState, forwardRef } from "react";
import { AnimatePresence, motion, usePresenceData, wrap } from "motion/react";

const IMAGES = [
  `${import.meta.env.VITE_API_URL}/images/pages/home/Mainpage.png`,
  `${import.meta.env.VITE_API_URL}/images/pages/home/Mainpage-2.png`,
  `${import.meta.env.VITE_API_URL}/images/pages/home/Mainpage-3.png`,
  `${import.meta.env.VITE_API_URL}/images/pages/home/Mainpage-4.png`,
];

export default function HeroBanner() {
  const containerRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  function go(dir) {
    const next = wrap(0, IMAGES.length, index + dir);
    setIndex(next);
    setDirection(dir);
  }

  return (
    <div className="flex flex-col justify-center items-center py-14">
      <header className="hidden md:block text-3xl md:text-5xl mb-6 text-center leading-none">
        Order once. Obsess forever.
      </header>
      <div
        ref={containerRef}
        className="hidden md:block relative w-[38%] h-[820px] overflow-hidden rounded-2xl bg-slate-900"
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <HeroSlide key={index} src={IMAGES[index]} />
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="cursor-pointer absolute left-6 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/70 text-black"
          initial={false}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft />
        </motion.button>

        <motion.button
          type="button"
          onClick={() => go(1)}
          aria-label="Next slide"
          className="cursor-pointer absolute right-6 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/70 text-black"
          initial={false}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowRight />
        </motion.button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {IMAGES.map((_, i) => {
            const isActive = i === index;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => {
                  if (i === index) return;
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className={
                  isActive
                    ? "cursor-pointer h-2 w-8 rounded-full bg-white transition-all"
                    : "cursor-pointer h-2 w-2 rounded-full bg-white/40 transition-all"
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

const HeroSlide = forwardRef(function HeroSlide({ src }, ref) {
  const presence = usePresenceData();
  const direction =
    typeof presence === "number" && presence !== 0 ? presence : 1;

  return (
    <motion.img
      ref={ref}
      src={src}
      alt="Mainpage"
      loading="lazy"
      decoding="async"
      className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none select-none"
      initial={{ opacity: 0, x: direction * 80 }}
      animate={{
        opacity: 1,
        x: 0,
        transition: {
          delay: 0.12,
          type: "spring",
          visualDuration: 0.35,
          bounce: 0.35,
        },
      }}
      exit={{ opacity: 0, x: direction * -80 }}
    />
  );
});

function ArrowLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

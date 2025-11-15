import * as motion from "motion/react-client";

function AboutUs() {
  return (
    <div className="flex justify-center items-center overflow-x-hidden">
      <main className="p-18 flex md:flex-row flex-col gap-12">
        <section className="flex items-center md:items-start flex-col">
          <header className="pb-8 text-6xl font-semibold">Our Story</header>
          <div className="md:w-md w-xs tracking-wider flex flex-col gap-6">
            <p>
              <span className="font-semibold">Platter</span> was born from one
              obvious, painful truth: waiting at restaurants is the worst.
              Waiting for a table. Waiting to order. Waiting for the check while
              your server vanishes into a mysterious server void. So we built
              Platter to skip the nonsense.
            </p>
            <p>
              With Platter, you can{" "}
              <span className="font-semibold">
                pre-order your meal, reserve your table
              </span>
              , and just show up when it’s ready. No lines, no awkward stares at
              the host stand, no hanger-fueled life regrets. Just walk in, sit
              down, and eat like someone with priorities.
            </p>
            <p>
              Under the hood, Platter runs on sleek tech that works smoothly
              across any device no app install, no fuss. Menus stay up to date
              in real time, inventory is accurate (because we don’t do “sorry,
              we’re out”), and restaurants get tools that make their lives
              easier, not harder.
            </p>
            <p>
              We're here for busy people who want to eat well without playing
              the “dining experience” patience game. And for restaurant owners
              who are tired of juggling orders on sticky notes.
            </p>
            <p className="font-semibold">
              Platter makes food faster. Not worse. Because mealtime should feel
              like a break, not a punishment.
            </p>
          </div>
        </section>

        <div className="flex justify-center mt-20 relative w-[400px] h-fit">
          <motion.img
            className="md:w-fit w-[250px]"
            src={`${
              import.meta.env.VITE_API_URL
            }/images/pages/about/Hostess.png`}
            alt="Hostess"
            loading="lazy"
            decoding="async"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          />
          <motion.img
            className="absolute w-[100px] -top-20 right-8 md:-right-24 md:w-[180px] md:h-[280px]"
            src={`${
              import.meta.env.VITE_API_URL
            }/images/pages/about/Shawarma with hand.png`}
            alt="Shawarma with hand"
            loading="lazy"
            decoding="async"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          />
        </div>
      </main>
    </div>
  );
}

export default AboutUs;

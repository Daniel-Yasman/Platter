function AboutUs() {
  return (
    <div className="flex justify-center items-center">
      <main className="p-18 flex gap-12">
        <section className="flex flex-col">
          <header className="pb-8 text-6xl font-semibold">Our Story</header>
          <div className="w-[500px] tracking-wider flex flex-col gap-6">
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
              across any device no app install, no fuss (as long as you're at
              1080p that is). Menus stay up to date in real time, inventory is
              accurate (because we don’t do “sorry, we’re out”), and restaurants
              get tools that make their lives easier, not harder.
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

        <div className="mt-20 relative w-[400px] h-fit">
          <img
            className="w-fit"
            src={`${
              import.meta.env.VITE_API_URL
            }/images/pages/about/Hostess.png`}
            alt="Hostess"
            loading="lazy"
            decoding="async"
          />
          <img
            className="absolute -top-20 -right-24 w-[180px] h-[280px]"
            src={`${
              import.meta.env.VITE_API_URL
            }/images/pages/about/Shawarma with hand.png`}
            alt="Shawarma with hand"
            loading="lazy"
            decoding="async"
          />
        </div>
      </main>
    </div>
  );
}

export default AboutUs;

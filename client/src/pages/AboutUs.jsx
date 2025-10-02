function AboutUs() {
  return (
    <div className="flex justify-center items-center">
      <main className="p-18 flex gap-12">
        <section className="flex flex-col">
          <header className="pb-8 text-6xl font-semibold">Our Story</header>
          <div className="w-[500px] tracking-wider flex flex-col gap-6">
            <p>
              Carnivores Table was born from a simple but powerful idea: to
              transform the dining experience by eliminating wait times and
              simplifying the process of ordering food at a restaurant. In
              today's fast-paced world, time is a precious commodity, and we
              recognized that traditional dining methods often leave customers
              waiting—whether for a table, their food, or service. Our solution
              was to create an intuitive, seamless platform that allows diners
              to pre-order their meals and reserve their table for a specific
              time, ensuring that when they arrive, everything is ready and
              waiting. By blending advanced technology with user-friendly
              design, Carnivores Table enables customers to browse menus,
              customize their orders, and pay securely, all from their devices,
              freeing them from the typical frustrations of restaurant visits.
              We built this system to cater especially to busy individuals who
              value efficiency but still want to enjoy a delicious, freshly
              prepared meal without compromise.
            </p>
            <p>
              Behind the scenes, Carnivores Table operates on a robust, modern
              tech stack designed for speed, security, and reliability.
              Utilizing cutting-edge web technologies, our platform runs
              smoothly across devices without requiring app installation, with
              real-time synchronization of menu availability and inventory
              management that guarantees accuracy and freshness. Our system not
              only enhances the dining experience for guests but also empowers
              restaurant managers with easy-to-use tools to control inventory,
              manage orders, and update menus instantly. Every aspect of
              Carnivores Table reflects our commitment to innovation,
              convenience, and exceptional service—bringing the future of dining
              to your fingertips today.
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
          />
          <img
            className="absolute -top-20 -right-24 w-[180px] h-[280px]"
            src={`${
              import.meta.env.VITE_API_URL
            }/images/pages/about/Shawarma with hand.png`}
            alt="Shawarma with hand"
          />
        </div>
      </main>
    </div>
  );
}

export default AboutUs;

const Extras = () => {
  return (
    <div className="py-24 font-semibold text-2xl">
      <section className="pb-24 flex flex-col justify-center items-center">
        <header className="text-6xl max-w-2xl text-center leading-snug tracking-tight font-semibold">
          Indulge. Regret nothing.
        </header>
      </section>

      <div className="flex justify-around">
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
          <p className="w-32 text-center">Visit our Store</p>
        </section>

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
          <p className="w-32 text-center">Order Online & Save Time</p>
        </section>

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
          <p className="w-32 text-center">Table Ready in Seconds</p>
        </section>
      </div>
    </div>
  );
};

export default Extras;

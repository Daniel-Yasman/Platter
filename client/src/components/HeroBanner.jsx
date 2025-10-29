import { useRef } from "react";

const HeroBanner = () => {
  const containerRef = useRef(null);
  return (
    <div className="flex flex-col justify-center items-center py-20">
      <header className="text-7xl mb-10">Order once. Obsess forever.</header>
      <div
        ref={containerRef}
        className="w-[90%] h-[800px] overflow-hidden relative"
      >
        <img
          className="absolute top-0 left-0 w-full h-auto min-h-[120%]"
          src={`${import.meta.env.VITE_API_URL}/images/pages/home/Mainpage.png`}
          alt="Mainpage"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
};

export default HeroBanner;

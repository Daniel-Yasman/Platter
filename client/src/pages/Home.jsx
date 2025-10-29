import RandomMealShowcase from "../components/RandomMealShowcase";
import Extras from "../components/Extras";
import HeroBanner from "../components/HeroBanner";
function Home() {
  return (
    <div>
      <HeroBanner />
      <RandomMealShowcase />
      <Extras />
    </div>
  );
}
export default Home;

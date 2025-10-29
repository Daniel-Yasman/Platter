import MealsList from "./MealsList";

export default function RandomMealShowcase() {
  return (
    <section className="flex flex-col items-center justify-center py-20">
      <header className="text-5xl sm:text-7xl font-semibold">
        What Are You Craving?
      </header>
      <MealsList randomize size={3} />
    </section>
  );
}

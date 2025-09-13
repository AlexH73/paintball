import Hero from "../components/sections/Hero/Hero";
import UpcomingEvents from "../components/sections/UpcomingEvents/UpcomingEvents";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Ближайшие события
        </h2>
        <UpcomingEvents />
      </div>
    </div>
  );
};

export default Home;

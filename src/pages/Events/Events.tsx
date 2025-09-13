import EventsList from "../../components/sections/EventsList/EventsList";

const Events = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Все события</h1>
      <EventsList />
    </div>
  );
};

export default Events;

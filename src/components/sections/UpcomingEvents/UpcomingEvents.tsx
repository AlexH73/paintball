import Card from "../../ui/Card/Card";
import LoadingSpinner from "../../ui/LoadingSpinner/LoadingSpinner";
import { useEvents } from "../../../hooks/useEvents/useEvents";

const UpcomingEvents = () => {
  const { events, loading } = useEvents();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Ближайшие события</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="p-6">
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            <p className="text-gray-600 mb-4">{event.date}</p>
            <p>{event.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default UpcomingEvents;

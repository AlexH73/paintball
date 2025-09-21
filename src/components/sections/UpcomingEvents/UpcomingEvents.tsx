import { useEvents } from "../../../hooks/useEvents/useEvents";
import Card from "../../ui/Card/Card";
import LoadingSpinner from "../../ui/LoadingSpinner/LoadingSpinner";
import { Link } from "react-router-dom";

const UpcomingEvents = () => {
  const { events, loading } = useEvents();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Берем только первые 3 события для показа на главной
  const upcomingEvents = events.slice(0, 3);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {upcomingEvents.map((event) => (
          <Card
            key={event._id}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              {event.title}
            </h3>
            <p className="text-gray-600 mb-4">{event.date}</p>
            <p className="text-gray-700 mb-4 line-clamp-3">
              {event.description}
            </p>
            <Link
              to={`/events/${event._id}`}
              className="text-camouflage-500 hover:text-camouflage-600 font-semibold"
            >
              Подробнее →
            </Link>
          </Card>
        ))}
      </div>
      <div className="text-center">
        <Link
          to="/events"
          className="inline-block bg-camouflage-500 hover:bg-camouflage-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Все события
        </Link>
      </div>
    </>
  );
};

export default UpcomingEvents;

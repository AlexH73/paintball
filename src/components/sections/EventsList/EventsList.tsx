import { Link } from "react-router-dom";
import Card from "../../ui/Card/Card";
import { useEvents } from "../../../hooks/useEvents/useEvents";
import LoadingSpinner from "../../ui/LoadingSpinner/LoadingSpinner";

const EventsList = () => {
  const { events, loading } = useEvents();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card
          key={event._id || event.id}
          className="p-6 hover:shadow-lg transition-shadow"
        >
          {event.photos && event.photos.length > 0 && (
            <img
              src={event.photos[0]}
              alt={event.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          )}
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            {event.title}
          </h3>
          <p className="text-gray-600 mb-4">{event.date}</p>
          <p className="text-gray-700 mb-4 line-clamp-3">{event.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {event.participants?.length || 0} участников
            </span>
            <Link
              to={`/events/${event._id || event.id}`}
              className="bg-camouflage-500 hover:bg-camouflage-600 text-white px-4 py-2 rounded transition-colors"
            >
              Подробнее
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EventsList;

import { useParams, Link } from "react-router-dom";
import { useApp } from "../../contexts/AppContext/AppContext";
import Card from "../../components/ui/Card/Card";
import Button from "../../components/ui/Button/Button";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useApp();

  const event = state.events.find((event) => event.id === id);

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Событие не найдено</h2>
        <Link to="/events">
          <Button>Вернуться к событиям</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/events"
          className="text-camouflage-500 hover:text-camouflage-600"
        >
          ← Назад к событиям
        </Link>
      </div>

      <Card className="p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
        <p className="text-gray-600 mb-4">{event.date}</p>
        <p className="text-lg mb-6">{event.description}</p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Участники:</h2>
          <div className="flex flex-wrap gap-2">
            {event.participants.map((participant, index) => (
              <span
                key={index}
                className="bg-camouflage-100 text-camouflage-800 px-3 py-1 rounded-full text-sm"
              >
                {participant}
              </span>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Фотографии</h2>
          {event.photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {event.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Фото с события ${event.title}`}
                  className="rounded-lg"
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Фотографии пока не добавлены</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Видео</h2>
          {event.videos.length > 0 ? (
            <div className="space-y-4">
              {event.videos.map((video, index) => (
                <div key={index} className="aspect-video">
                  <iframe
                    src={video}
                    title={`Видео с события ${event.title}`}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Видео пока не добавлены</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EventDetails;

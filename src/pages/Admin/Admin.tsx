import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLogin from "../../components/auth/AdminLogin/AdminLogin";
import EventForm from "../../components/forms/EventForm/EventForm";
import type { Event } from "../../types/Event";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("adminToken");
      setIsAuthenticated(!!token);
      setIsCheckingAuth(false);
    };

    checkAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "adminToken") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE}/events`);
      if (response.ok) {
        const eventsData = await response.json();
        setEvents(eventsData);
      }
    } catch (error) {
      console.error("Ошибка при загрузке событий:", error);
    }
  };

  const handleLoginSuccess = () => {
    console.log("Login success callback called");

    // Принудительно проверяем аутентификацию сразу после входа
    console.log(
      "Token in success callback:",
      localStorage.getItem("adminToken")
    );

    setIsAuthenticated(true);

    // Дополнительная проверка через короткий промежуток времени
    setTimeout(() => {
      const newToken = localStorage.getItem("adminToken");
      console.log("Token after timeout:", newToken);
      if (newToken) {
        setIsAuthenticated(true);
      }
    }, 100);
  };

  const handleLogout = () => {
    console.log("Logging out");
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setEditingEvent(null);
    setIsCreating(false);
    navigate("/");
  };

  const handleEventSuccess = () => {
    fetchEvents();
    setEditingEvent(null);
    setIsCreating(false);
  };

  const deleteEvent = async (id: string) => {
    if (!window.confirm("Вы уверены, что хотите удалить это событие?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE}/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Событие успешно удалено!");
        fetchEvents();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete event");
      }
    } catch (error) {
      console.error("Ошибка при удалении события:", error);
      alert("Ошибка при удалении события");
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Проверка авторизации...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={handleLoginSuccess} />;
  }

  if (isCreating || editingEvent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {editingEvent ? "Редактирование события" : "Добавление события"}
          </h1>
          <button
            onClick={() => {
              setEditingEvent(null);
              setIsCreating(false);
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Назад к списку
          </button>
        </div>

        <EventForm
          existingEvent={editingEvent || undefined}
          onSuccess={handleEventSuccess}
          onCancel={() => {
            setEditingEvent(null);
            setIsCreating(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Панель администратора</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsCreating(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Добавить событие
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Выйти
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Управление событиями</h2>

        {events.length === 0 ? (
          <p className="text-gray-600">Событий пока нет</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-2">
                  {new Date(event.date).toLocaleDateString("ru-RU")}
                </p>
                <p className="text-gray-600 mb-4">{event.location}</p>

                {event.photos && event.photos.length > 0 && (
                  <img
                    src={event.photos[0]}
                    alt={event.title}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                )}

                <div className="flex justify-between">
                  <button
                    onClick={() => setEditingEvent(event)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-md transition-colors text-sm"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => deleteEvent(event._id as string)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md transition-colors text-sm"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

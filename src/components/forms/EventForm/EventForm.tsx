import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Event } from "../../../types/Event";
import ImageUpload from "../ImageUpload/ImageUpload";

interface EventFormProps {
  existingEvent?: Event;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const EventForm: React.FC<EventFormProps> = ({
  existingEvent,
  onSuccess,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: "",
    date: "",
    location: "",
    description: "",
    participants: [],
    photos: [],
    videos: [],
  });
  const [eventFormData, setEventFormData] = useState({
    title: "",
    date: "",
    location: "",
  });

  const navigate = useNavigate();

  // Инициализация формы при монтировании или изменении existingEvent
  useEffect(() => {
    if (existingEvent) {
      // Преобразуем дату для input[type="date"]
      const dateForInput = existingEvent.date
        ? new Date(existingEvent.date).toISOString().split("T")[0]
        : "";

      setFormData({
        ...existingEvent,
        date: dateForInput,
      });

      setUploadedImages(existingEvent.photos || []);

      setEventFormData({
        title: existingEvent.title,
        date: dateForInput,
        location: existingEvent.location,
      });
    } else {
      // Сброс формы для создания нового события
      setFormData({
        title: "",
        date: "",
        location: "",
        description: "",
        participants: [],
        photos: [],
        videos: [],
      });
      setUploadedImages([]);
      setEventFormData({
        title: "",
        date: "",
        location: "",
      });
    }
  }, [existingEvent]);

  const handleImageUpload = (imageUrl: string) => {
    const newImages = [...uploadedImages, imageUrl];
    setUploadedImages(newImages);
    setFormData((prev) => ({
      ...prev,
      photos: newImages,
    }));
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setFormData((prev) => ({
      ...prev,
      photos: newImages,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Not authenticated");
      }

      // Подготовка данных для отправки
      const payload = {
        ...formData,
        date: new Date(formData.date as string).toISOString(),
        photos: uploadedImages,
      };

      // Удаляем _id при создании нового события
      if (!existingEvent && payload._id) {
        delete payload._id;
      }

      const url = existingEvent
        ? `${API_BASE}/events/${existingEvent._id}`
        : `${API_BASE}/events`;

      const method = existingEvent ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save event");
      }

      if (onSuccess) {
        onSuccess();
      }

      alert(
        existingEvent
          ? "Событие успешно обновлено!"
          : "Событие успешно создано!"
      );

      navigate("/events");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setEventFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleParticipantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const participants = e.target.value
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p);
    setFormData((prev) => ({ ...prev, participants }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {existingEvent ? "Редактировать событие" : "Добавить новое событие"}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="title">
            Название события
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-camouflage-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2" htmlFor="date">
            Дата события
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-camouflage-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2" htmlFor="location">
            Место проведения
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-camouflage-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2" htmlFor="description">
            Описание
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-camouflage-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2" htmlFor="participants">
            Участники (через запятую)
          </label>
          <input
            type="text"
            id="participants"
            name="participants"
            defaultValue={formData.participants?.join(", ")}
            onChange={handleParticipantsChange}
            placeholder="Иван, Алексей, Дмитрий"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-camouflage-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Фотографии события</label>
          <ImageUpload
            onUpload={handleImageUpload}
            multiple={true}
            eventData={eventFormData}
          />

          {uploadedImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                Загруженные изображения:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {uploadedImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Preview ${index}`}
                      className="rounded-lg object-cover h-24 w-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Отмена
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-camouflage-500 hover:bg-camouflage-600 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            {isSubmitting
              ? existingEvent
                ? "Обновление..."
                : "Создание..."
              : existingEvent
              ? "Обновить событие"
              : "Создать событие"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;

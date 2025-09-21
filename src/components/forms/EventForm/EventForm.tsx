import React, { useState } from "react";
import type { Event } from "../../../types/Event";

interface EventFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const EventForm: React.FC<EventFormProps> = ({ onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: "",
    date: "",
    location: "",
    description: "",
    participants: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`${API_BASE}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create event");
      }

      if (onSuccess) {
        onSuccess();
      }
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
  };

  const handleParticipantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const participants = e.target.value.split(",").map((p) => p.trim());
    setFormData((prev) => ({ ...prev, participants }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-500">
      {" "}
      {/* Добавили рамку для видимости */}
      <h2 className="text-2xl font-bold mb-4">Добавить новое событие</h2>
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
            onChange={handleParticipantsChange}
            placeholder="Иван, Алексей, Дмитрий"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-camouflage-500"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Отмена
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-camouflage-500 hover:bg-camouflage-600 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Создание..." : "Создать событие"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;

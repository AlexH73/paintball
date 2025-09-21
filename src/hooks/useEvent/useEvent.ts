import { useState, useEffect } from "react";
import type { Event } from "../../types/Event";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const useEvent = (eventId: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/events/${eventId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }

        const eventData: Event = await response.json();
        setEvent(eventData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  return {
    event,
    loading,
    error,
  };
};

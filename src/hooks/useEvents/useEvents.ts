import { useEffect, useRef } from "react";
import { useApp } from "../../contexts/AppContext/AppContext";
import type { Event } from "../../types/Event";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Добавим глобальную переменную для кеширования
let eventsCache: Event[] | null = null;

export const useEvents = () => {
  const { state, dispatch } = useApp();
  const isFetching = useRef(false);

  useEffect(() => {
    const fetchEvents = async () => {
      // Если уже загружаем или есть кеш, пропускаем
      if (isFetching.current || eventsCache) {
        if (eventsCache) {
          dispatch({ type: "SET_EVENTS", payload: eventsCache });
        }
        return;
      }

      isFetching.current = true;
      dispatch({ type: "SET_LOADING", payload: true });

      try {
        const response = await fetch(`${API_BASE}/events`);

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const events: Event[] = await response.json();
        eventsCache = events; // Сохраняем в кеш
        dispatch({ type: "SET_EVENTS", payload: events });
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
        isFetching.current = false;
      }
    };

    fetchEvents();
  }, [dispatch]);

  return {
    events: state.events,
    loading: state.loading,
  };
};

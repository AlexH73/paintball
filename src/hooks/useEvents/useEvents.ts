import { useEffect } from "react";
import { useApp } from "../../contexts/AppContext/AppContext";

// Временные моковые данные
const mockEvents = [
  {
    id: "1",
    title: "Весенний турнир 2024",
    date: "15 мая 2024",
    description:
      "Присоединяйтесь к нашему весеннему турниру! Шашлыки, пиво и отличная игра.",
    participants: ["Алексей", "Дмитрий", "Сергей", "Иван"],
    photos: [],
    videos: [],
  },
  {
    id: "2",
    title: "Летние игры",
    date: "20 июня 2024",
    description: "Летний сезон открыт! Ждем всех на поле.",
    participants: ["Алексей", "Дмитрий", "Сергей"],
    photos: [],
    videos: [],
  },
];

export const useEvents = () => {
  const { state, dispatch } = useApp();

  useEffect(() => {
    const loadEvents = async () => {
      dispatch({ type: "SET_LOADING", payload: true });

      // Имитация загрузки данных
      setTimeout(() => {
        dispatch({ type: "SET_EVENTS", payload: mockEvents });
        dispatch({ type: "SET_LOADING", payload: false });
      }, 1000);
    };

    loadEvents();
  }, [dispatch]);

  return {
    events: state.events,
    loading: state.loading,
  };
};

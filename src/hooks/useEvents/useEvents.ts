import { useEffect } from "react";
import { useApp } from "../../contexts/AppContext/AppContext";

export const useEvents = () => {
  const { state, dispatch } = useApp();

  useEffect(() => {
    const fetchEvents = async () => {
      dispatch({ type: "SET_LOADING", payload: true });

      // Имитация загрузки данных
      setTimeout(() => {
        const mockEvents = [
          {
            id: 1,
            title: "Весенний турнир 2024",
            date: "15 мая 2024",
            description:
              "Присоединяйтесь к нашему весеннему турниру! Шашлыки, пиво и отличная игра.",
          },
          {
            id: 2,
            title: "Летние игры",
            date: "20 июня 2024",
            description: "Летний сезон открыт! Ждем всех на поле.",
          },
        ];

        dispatch({ type: "SET_EVENTS", payload: mockEvents });
        dispatch({ type: "SET_LOADING", payload: false });
      }, 1000);
    };

    fetchEvents();
  }, [dispatch]);

  return {
    events: state.events,
    loading: state.loading,
  };
};

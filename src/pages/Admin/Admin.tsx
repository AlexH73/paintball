import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLogin from "../../components/auth/AdminLogin/AdminLogin";
import EventForm from "../../components/forms/EventForm/EventForm";

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      console.log(
        "Checking auth, token from localStorage:",
        localStorage.getItem("adminToken")
      );
      const token = localStorage.getItem("adminToken");
      setIsAuthenticated(!!token);
      setIsCheckingAuth(false);
    };

    checkAuth();

    // Слушаем изменения в localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "adminToken") {
        console.log("adminToken changed in storage:", e.newValue);
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Также проверяем аутентификацию периодически
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLoginSuccess = () => {
    console.log("Login success callback called");

    // Принудительно проверяем аутентификацию сразу после входа
    const token = localStorage.getItem("adminToken");
    console.log("Token in success callback:", token);

    setIsAuthenticated(true); // Непосредственно устанавливаем аутентификацию

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
    navigate("/");
  };

  const handleEventCreated = () => {
    alert("Событие успешно создано!");
  };

if (isCheckingAuth) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">Проверка авторизации...</div>
    </div>
  );
}

console.log("Rendering Admin, isAuthenticated:", isAuthenticated);

if (!isAuthenticated) {
  console.log("Showing AdminLogin form");
  return <AdminLogin onSuccess={handleLoginSuccess} />;
}

console.log("Showing Admin panel");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Панель администратора</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          Выйти
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Добавить новое событие</h2>
        <EventForm onSuccess={handleEventCreated} />
      </div>
    </div>
  );
};

export default Admin;

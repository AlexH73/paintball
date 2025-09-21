import React, { useState } from "react";

interface AdminLoginProps {
  onSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting login with password:", password);

      // Простая проверка пароля для тестирования
      if (password === "admin") {
        console.log("Password is correct, setting token");
        const token = "test-admin-token"; // Простой токен для теста
        localStorage.setItem("adminToken", token);
        console.log(
          "Token immediately after set:",
          localStorage.getItem("adminToken")
        );
        console.log("Token set to localStorage, calling onSuccess");
        onSuccess();
      } else {
        console.log("Password is incorrect");
        setError('Неверный пароль. Для теста используйте "admin"');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Ошибка при авторизации");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Административный доступ</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Пароль
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-camouflage-500"
            placeholder="Введите 'admin' для теста"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-camouflage-500 hover:bg-camouflage-600 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {isLoading ? "Вход..." : "Войти"}
        </button>
      </form>

      <div className="mt-4 p-3 bg-gray-100 rounded-md">
        <p className="text-sm text-gray-600">
          <strong>Для тестирования:</strong> используйте пароль{" "}
          <code>admin</code>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

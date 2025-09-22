import React from "react";
import { useApp } from "../../../contexts/AppContext/AppContext";

const DebugInfo: React.FC = () => {
  const { state } = useApp();

  const [apiStatus, setApiStatus] = React.useState<string>("Checking...");
  const [apiUrl, setApiUrl] = React.useState<string>("");

  React.useEffect(() => {
    const checkApi = async () => {
      try {
        // Проверяем, находимся ли мы на сервере (бэкенде)
        const isBackend = window.location.origin.includes("railway");

        if (isBackend) {
          setApiUrl("Server environment - no VITE_API_URL needed");
          setApiStatus("OK (Server)");
          return;
        }

        // Для фронтенда проверяем API
        const apiUrl = import.meta.env.VITE_API_URL || "Not set";
        setApiUrl(apiUrl);

        const response = await fetch(`${apiUrl}/health`);
        if (response.ok) {
          setApiStatus("OK");
        } else {
          setApiStatus(`Error: ${response.status}`);
        }
      } catch (error) {
        setApiStatus("Offline");
      }
    };

    checkApi();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg text-xs z-50 max-w-md">
      <div className="font-bold mb-2">Debug Information</div>
      <div>Environment: {import.meta.env.MODE}</div>
      <div>Events: {state.events.length}</div>
      <div>Loading: {state.loading ? "Yes" : "No"}</div>
      <div>Error: {state.error || "None"}</div>
      <div>API URL: {apiUrl}</div>
      <div>API Status: {apiStatus}</div>
      <div>Current origin: {window.location.origin}</div>
      <div>Build time: {import.meta.env.BUILD_TIME || "Unknown"}</div>
    </div>
  );
};

export default DebugInfo;

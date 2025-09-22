import React from "react";
import { useApp } from "../../../contexts/AppContext/AppContext";

const DebugInfo: React.FC = () => {
  const { state } = useApp();

  // Проверяем, доступен ли API
  const [apiStatus, setApiStatus] = React.useState<string>("Checking...");
  
  React.useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);
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
      <div>
        API URL: {import.meta.env.VITE_API_URL || "Not set"}
      </div>
      <div>API Status: {apiStatus}</div>
      <div>Current origin: {window.location.origin}</div>
      <div>Build time: {import.meta.env.BUILD_TIME || "Unknown"}</div>
    </div>
  );
};

export default DebugInfo;
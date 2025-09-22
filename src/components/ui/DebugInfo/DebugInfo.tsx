import React from "react";
import { useApp } from "../../../contexts/AppContext/AppContext";

const DebugInfo: React.FC = () => {
  const { state } = useApp();

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg text-xs">
      <div>Events: {state.events.length}</div>
      <div>Loading: {state.loading ? "Yes" : "No"}</div>
      <div>
        API: {import.meta.env.VITE_API_URL || "http://localhost:3001/api"}
        <br />
        Current origin: {window.location.origin}
      </div>
    </div>
  );
};

export default DebugInfo;

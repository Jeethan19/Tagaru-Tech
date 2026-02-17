import React from "react";
import useLiveData from "./useLiveData";

const LiveFeed = () => {
  const data = useLiveData();

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", marginTop: "1rem" }}>
      <h2>📡 Live Goat Health Data</h2>
      {data ? (
        <>
          <p><strong>Animal ID:</strong> {data.animal_id}</p>
          <p><strong>Temperature:</strong> {data.temperature} °C</p>
          <p><strong>Heart Rate:</strong> {data.heart_rate} bpm</p>
          <p><strong>Step Count:</strong> {data.step_count}</p>
        </>
      ) : (
        <p>Waiting for data from MQTT...</p>
      )}
    </div>
  );
};

export default LiveFeed;

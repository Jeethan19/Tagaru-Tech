import { useEffect, useState } from "react";

const useLiveData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");

    socket.onopen = () => console.log("✅ Connected to WebSocket server");

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log("📡 Live data received:", msg);

        // Normalize keys based on your MQTT data
        setData({
          temperature: msg.temperature ?? null,
          BPM: msg.BPM ?? msg.heart_rate ?? null,
          motion: msg.motion ?? 0,
          humidity: msg.humidity ?? null,
          SpO2: msg.SpO2 ?? null,
        });
      } catch (err) {
        console.error("❌ Error parsing live data:", err);
      }
    };

    socket.onerror = (err) => console.error("WebSocket error:", err);
    socket.onclose = () => console.log("⚠️ WebSocket disconnected");

    return () => socket.close();
  }, []);

  return data;
};

export default useLiveData;

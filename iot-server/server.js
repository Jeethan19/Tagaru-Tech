import mqtt from "mqtt";
import WebSocket, { WebSocketServer } from "ws";
import http from "http";

// ✅ HiveMQ Cloud credentials (from your HiveMQ dashboard)
const mqtt_server = "1be86c5964294c2d94fc99e4b534da19.s1.eu.hivemq.cloud";
const mqtt_port = 8883; // TLS port
const mqtt_user = "jeethan"; // from HiveMQ Cloud
const mqtt_pass = "Amjj.1011"; // your password

// ✅ Connect to HiveMQ Cloud securely
const mqttClient = mqtt.connect({
  host: mqtt_server,
  port: mqtt_port,
  protocol: "mqtts",
  username: mqtt_user,
  password: mqtt_pass,
});

mqttClient.on("connect", () => {
  console.log("✅ Connected to HiveMQ Cloud MQTT broker");
  mqttClient.subscribe("livestock/data", (err) => {
    if (!err) console.log("📡 Subscribed to topic: livestock/data");
  });
});

mqttClient.on("message", (topic, message) => {
  console.log("📩 Received:", message.toString());
  const data = JSON.parse(message.toString());
  // Broadcast to all WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
});

// ✅ Create WebSocket Server for frontend
const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", () => {
  console.log("🌐 Frontend connected to WebSocket");
});

server.listen(3001, () => {
  console.log("🚀 WebSocket server running on port 3001");
});

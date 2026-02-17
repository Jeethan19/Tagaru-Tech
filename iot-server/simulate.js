const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');

const topic = 'livestock/data';

client.on('connect', () => {
  console.log('✅ Connected to MQTT broker');

  setInterval(() => {
    const data = {
      animal_id: 4,
      temperature: parseFloat((96 + Math.random() * 6).toFixed(2)),
      heart_rate: Math.floor(80 + Math.random() * 20),
      step_count: Math.floor(5000 + Math.random() * 8000),
      weight: parseFloat((20 + Math.random() * 5).toFixed(2))
    };

    client.publish(topic, JSON.stringify(data));
    console.log('📡 Sent:', data);
  }, 5000); // every 5 seconds
});

const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
let db;
let client;

async function connectToMongo() {
  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db("paintball");
    console.log("Connected to MongoDB successfully!");

    // Создаем коллекцию, если она не существует
    const collections = await db.listCollections().toArray();
    const collectionExists = collections.some((col) => col.name === "events");

    if (!collectionExists) {
      await db.createCollection("events");
      console.log("Created events collection");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

// Простые маршруты для тестирования
app.get("/api/health", (req, res) => {
  res.json({
    status: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// Получить все события
app.get("/api/events", async (req, res) => {
  try {
    const events = await db.collection("events").find().toArray();

    // Преобразуем ObjectId в строку
    const eventsWithStringIds = events.map((event) => ({
      ...event,
      _id: event._id.toString(),
      id: event._id.toString(), // Добавляем поле id для совместимости
    }));

    res.json(eventsWithStringIds);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Получить событие по ID
app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await db.collection('events').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Преобразуем ObjectId в строку
    const eventWithStringId = {
      ...event,
      _id: event._id.toString(),
      id: event._id.toString()
    };
    
    res.json(eventWithStringId);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Создать новое событие
app.post("/api/events", async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      photos: req.body.photos || [], // Добавляем пустой массив, если не предоставлено
      videos: req.body.videos || [], // Добавляем пустой массив, если не предоставлено
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("events").insertOne(eventData);
    res.status(201).json({
      success: true,
      id: result.insertedId,
      message: "Event created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create event" });
  }
});

// Запуск сервера
connectToMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
  process.exit(0);
});

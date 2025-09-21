require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const uploadRoutes = require("./routes/upload");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware для проверки аутентификации
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Неавторизованный доступ" });
  }

  next();
};

const allowedOrigins = [
  "http://localhost:5173", // Для разработки
  "https://paintball-seven.vercel.app", // Ваш Vercel URL
  "https://paintball-production.up.railway.app", // Замените на ваш фактический Vercel URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Разрешаем запросы без origin (например, из мобильных приложений)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.options("*", cors());
app.use(express.json());
app.use("/api/upload", uploadRoutes);
app.use("/uploads", express.static("uploads"));

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
app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await db.collection("events").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Преобразуем ObjectId в строку
    const eventWithStringId = {
      ...event,
      _id: event._id.toString(),
      id: event._id.toString(),
    };

    res.json(eventWithStringId);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

// Создать новое событие (требует аутентификации)
app.post("/api/events", authenticate, async (req, res) => {
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

// Обновить событие (требует аутентификации)
app.patch("/api/events/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };

    const result = await db
      .collection("events")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Событие не найдено" });
    }

    res.json({ message: "Событие обновлено!", eventId: id });
  } catch (error) {
    console.error("Ошибка при обновлении события:", error);
    res.status(500).json({ error: "Не удалось обновить событие" });
  }
});

// Удалить событие (требует аутентификации)
app.delete("/api/events/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.collection("events").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Событие не найдено" });
    }

    res.json({ message: "Событие удалено!" });
  } catch (error) {
    console.error("Ошибка при удалении события:", error);
    res.status(500).json({ error: "Не удалось удалить событие" });
  }
});

// Запуск сервера
connectToMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log("====Current working directory:", process.cwd());
    console.log("====Environment variables loaded:====");
    console.log(
      "CLOUDINARY_CLOUD_NAME:",
      process.env.CLOUDINARY_CLOUD_NAME ? "SET" : "MISSING"
    );
    console.log(
      "CLOUDINARY_API_KEY:",
      process.env.CLOUDINARY_API_KEY ? "SET" : "MISSING"
    );
    console.log(
      "CLOUDINARY_API_SECRET:",
      process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING"
    );
    console.log("ADMIN_TOKEN:", process.env.ADMIN_TOKEN ? "SET" : "MISSING");
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

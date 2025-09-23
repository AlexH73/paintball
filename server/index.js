require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const uploadRoutes = require("./routes/upload");

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:5173",
  "https://paintball-alexh73s-projects.vercel.app",
  "https://paintball-seven.vercel.app",
  "https://paintball-*-alexh73s-projects.vercel.app",
  "https://paintball-*-vercel.app",
];

// Упрощенная и более надежная настройка CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Разрешаем все origin для тестирования
      callback(null, true);

      // Для production можно использовать более строгий подход:
      /*
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        const domainPattern = allowedOrigin.replace('*', '.*');
        const regex = new RegExp(domainPattern);
        return regex.test(origin);
      }
      return origin === allowedOrigin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
    */
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Явная обработка OPTIONS запросов для всех маршрутов
app.options("*", cors());

// Middleware для проверки аутентификации
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Неавторизованный доступ" });
  }

  next();
};

// Middleware
app.use(express.json({ limit: "10mb" })); // Увеличиваем лимит для загрузки изображений
app.use("/api/upload", uploadRoutes);

// Добавим middleware для логирования запросов (для отладки)
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${
      req.headers.origin
    }`
  );
  next();
});

// Подключение к MongoDB
let db;
let client;

async function connectToMongo() {
  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db("paintball");
    console.log("Connected to MongoDB successfully!");

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
    status: "Server and database are running!",
    timestamp: new Date().toISOString(),
    database: "Connected",
  });
});

// Получить все события
app.get("/api/events", async (req, res) => {
  try {
    const events = await db
      .collection("events")
      .find()
      .sort({ date: -1 })
      .toArray();

    const eventsWithStringIds = events.map((event) => ({
      ...event,
      _id: event._id.toString(),
      id: event._id.toString(),
    }));

    res.json(eventsWithStringIds);
  } catch (error) {
    console.error("Error fetching events:", error);
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

    const eventWithStringId = {
      ...event,
      _id: event._id.toString(),
      id: event._id.toString(),
    };

    res.json(eventWithStringId);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

// Создать новое событие (требует аутентификации)
app.post("/api/events", authenticate, async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      photos: req.body.photos || [],
      videos: req.body.videos || [],
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
    console.error("Error creating event:", error);
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

// Добавим корневой маршрут для информации
app.get("/", (req, res) => {
  res.json({
    message: "Paintball API Server is running!",
    endpoints: {
      health: "/api/health",
      events: "/api/events",
      upload: "/api/upload",
    },
    documentation:
      "See frontend at https://paintball-alexh73s-projects.vercel.app/",
  });
});

// Обработка 404 для API маршрутов
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Запуск сервера
connectToMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
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

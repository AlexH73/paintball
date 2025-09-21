const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const { authenticate } = require("../middleware/auth");

const router = express.Router();
const client = new MongoClient(process.env.MONGODB_URI || "");

// Подключаемся к базе данных
let db: any;
(async () => {
  try {
    await client.connect();
    db = client.db("paintball");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
})();

// Получить все события
router.get("/", async (req, res) => {
  try {
    const events = await db
      .collection("events")
      .find()
      .sort({ date: -1 })
      .toArray();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Создать новое событие (требует аутентификации)
router.post("/", authenticate, async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("events").insertOne(eventData);
    res.status(201).json({ ...eventData, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: "Failed to create event" });
  }
});

module.exports = router;

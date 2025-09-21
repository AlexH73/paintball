const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const stream = require("stream");
const path = require("path");
const router = express.Router();

// Настройка Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Настройка Multer для загрузки в память
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Функция для транслитерации и очистки строки
function formatFileName(text) {
  if (!text) return "";

  // Транслитерация кириллицы в латиницу
  const translitMap = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "yo",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
    А: "A",
    Б: "B",
    В: "V",
    Г: "G",
    Д: "D",
    Е: "E",
    Ё: "YO",
    Ж: "ZH",
    З: "Z",
    И: "I",
    Й: "Y",
    К: "K",
    Л: "L",
    М: "M",
    Н: "N",
    О: "O",
    П: "P",
    Р: "R",
    С: "S",
    Т: "T",
    У: "U",
    Ф: "F",
    Х: "H",
    Ц: "TS",
    Ч: "CH",
    Ш: "SH",
    Щ: "SCH",
    Ъ: "",
    Ы: "Y",
    Ь: "",
    Э: "E",
    Ю: "YU",
    Я: "YA",
  };

  // Транслитерация
  let result = text
    .split("")
    .map((char) => translitMap[char] || char)
    .join("");

  // Замена пробелов и специальных символов на дефисы
  result = result
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase();

  // Удаляем повторяющиеся дефисы
  result = result.replace(/-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");

  return result;
}

// Маршрут для загрузки изображений
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("Upload request received");

    if (!req.file) {
      console.log("No file in request");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File details:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    // Получаем данные события из тела запроса
    const { eventTitle, eventLocation, eventDate } = req.body;

    // Форматируем название файла
    const formattedTitle = formatFileName(eventTitle);
    const formattedLocation = formatFileName(eventLocation);

    // Форматируем дату
    const dateObj = eventDate ? new Date(eventDate) : new Date();
    const formattedDate = dateObj.toISOString().split("T")[0].replace(/-/g, "");

    // Создаем public_id для Cloudinary
    let publicId = `paintball-${formattedDate}`;

    if (formattedTitle) {
      publicId += `-${formattedTitle}`;
    }

    if (formattedLocation) {
      publicId += `-${formattedLocation}`;
    }

    // Добавляем timestamp для уникальности
    publicId += `-${Date.now()}`;

    console.log("Generated public_id:", publicId);

    // Загружаем в Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      console.log("Starting Cloudinary upload");

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "paintball-events",
          public_id: publicId,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("Cloudinary upload successful:", result);
            resolve(result);
          }
        }
      );

      // Создаем поток из буфера
      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);
      bufferStream.pipe(uploadStream);
    });

    res.json({
      success: true,
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error("Upload error details:", error);
    res.status(500).json({
      error: "Upload failed: " + (error.message || "Unknown error"),
      details: error.toString(),
    });
  }
});

module.exports = router;

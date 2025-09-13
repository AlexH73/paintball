import { MongoClient } from "mongodb";

const uri = process.env.VITE_MONGODB_URI; // Строка подключения из переменных окружения Vercel
const options = {};

let client;
let clientPromise;

if (!process.env.VITE_MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

// В производственном режиме используем глобальную переменную,
// чтобы не создавать новое подключение при каждой горячей перезагрузке
if (process.env.NODE_ENV === "production") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // В режиме разработки создаем новое подключение
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

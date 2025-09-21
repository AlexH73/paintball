import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import type { Event } from "../../../types/Event";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db("paintball");

    if (req.method === "GET") {
      const events = await db
        .collection<Event>("events")
        .find({})
        .sort({ date: -1 })
        .toArray();

      return res.status(200).json(events);
    }

    if (req.method === "POST") {
      // Проверяем авторизацию
      const { authorization } = req.headers;

      if (
        !authorization ||
        authorization !== `Bearer ${process.env.ADMIN_TOKEN}`
      ) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const eventData: Event = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await db.collection<Event>("events").insertOne(eventData);

      return res.status(201).json({
        success: true,
        id: result.insertedId,
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

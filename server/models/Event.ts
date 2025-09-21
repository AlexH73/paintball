import { ObjectId } from "mongodb";

export interface Event {
  _id?: ObjectId;
  title: string;
  date: string;
  location: string;
  description: string;
  participants: string[];
  photos: string[];
  videos: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

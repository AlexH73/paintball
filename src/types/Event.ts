export interface Event {
  _id?: string;
  id?: string;
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

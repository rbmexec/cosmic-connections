export interface NotificationData {
  id: string;
  userId: string;
  type: "match" | "message" | "like" | "retrograde" | "event";
  title: string;
  body: string;
  data: string;
  readAt: string | null;
  createdAt: string;
}

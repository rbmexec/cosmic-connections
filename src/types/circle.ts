export type RelationshipType = "partner" | "parent" | "sibling" | "friend" | "child" | "colleague" | "other";

export interface CircleConnection {
  id: string;
  name: string;
  birthday: string; // "YYYY-MM-DD"
  relationship: RelationshipType;
  createdAt: string; // ISO timestamp
}


export const PREDEFINED_TAGS = [
  { name: "Vegetarian",     type: "dietary",   color: "#4CAF50", emoji: "🥬" },
  { name: "Non-Vegetarian", type: "dietary",   color: "#FF5722", emoji: "🍖" },
  { name: "Chef Special",   type: "highlight", color: "#4ECDC4", emoji: "👨‍🍳" },
  { name: "Spicy",          type: "highlight", color: "#FF3D00", emoji: "🌶️" },
  { name: "Jain",           type: "dietary",   color: "#2E7D32", emoji: "🟢" },
] as const

export function getTagMeta(name: string) {
  return PREDEFINED_TAGS.find(t => t.name === name) ?? null
}

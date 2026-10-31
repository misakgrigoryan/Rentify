import { Wrench, Plane, Projector, Bike, Shirt } from "lucide-react";

export const CATEGORY_ICONS = {
  Tools: Wrench,
  Drones: Plane,
  Projectors: Projector,
  Sports: Bike,
  Costumes: Shirt,
};

// Returns the icon for a category, with a safe fallback
export function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || Wrench;
}

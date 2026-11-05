import { Wrench, Plane, Projector, Bike, Droplet, Zap, Hammer, PaintRoller, Sparkles, Car, Truck, Flower2, Camera, GraduationCap, ChefHat, Settings, Tag } from "lucide-react";

// Item categories (things you can rent)
export const CATEGORY_ICONS = {
  Tools: Wrench,
  Drones: Plane,
  Projectors: Projector,
  Sports: Bike,
};

// Service categories (people you can book)
export const SERVICE_ICONS = {
  Plumber: Droplet,
  Electrician: Zap,
  Carpenter: Hammer,
  Painter: PaintRoller,
  Cleaner: Sparkles,
  Driver: Car,
  Mover: Truck,
  Gardener: Flower2,
  Photographer: Camera,
  Tutor: GraduationCap,
  Mechanic: Settings,
  Cook: ChefHat,
};

export const SERVICE_CATEGORIES = Object.keys(SERVICE_ICONS);

// Any category, including ones the user typed themselves
export function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || SERVICE_ICONS[category] || Tag;
}

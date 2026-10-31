import { Router } from "express";
import { getFavorites, getFavoriteIds, addFavorite, removeFavorite } from "../controllers/favorite.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.use(requireAuth);
router.get("/", getFavorites);
router.get("/ids", getFavoriteIds);
router.post("/:listingId", addFavorite);
router.delete("/:listingId", removeFavorite);

export default router;

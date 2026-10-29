import { Router } from "express";
import {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
} from "../controllers/listing.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getListings);
router.get("/:id", getListing);
router.post("/", requireAuth, createListing);
router.put("/:id", requireAuth, updateListing);
router.delete("/:id", requireAuth, deleteListing);

export default router;

import { Router } from "express";
import { getListings, createListing } from "../controllers/listing.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getListings);
router.post("/", requireAuth, createListing);

export default router;

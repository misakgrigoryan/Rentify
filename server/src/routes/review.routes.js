import { Router } from "express";
import { createReview, getListingReviews } from "../controllers/review.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/listing/:listingId", getListingReviews);
router.post("/", requireAuth, createReview);

export default router;

import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  getRequests,
  updateBookingStatus,
} from "../controllers/booking.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Every booking route needs a logged-in user
router.use(requireAuth);

router.post("/", createBooking);
router.get("/mine", getMyBookings);
router.get("/requests", getRequests);
router.patch("/:id/status", updateBookingStatus);

export default router;

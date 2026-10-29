import { Router } from "express";
import { listAllListings, setListingStatus, listUsers, setBan } from "../controllers/admin.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

// Every admin route needs a logged-in admin
router.use(requireAuth, requireRole("SUPER_ADMIN", "MODERATOR"));

router.get("/listings", listAllListings);
router.patch("/listings/:id", setListingStatus);

// Super Admin only
router.get("/users", requireRole("SUPER_ADMIN"), listUsers);
router.patch("/users/:id/ban", requireRole("SUPER_ADMIN"), setBan);

export default router;

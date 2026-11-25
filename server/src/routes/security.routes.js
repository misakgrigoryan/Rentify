import { Router } from "express";
import { getSecurity } from "../controllers/security.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", requireAuth, requireRole("SUPER_ADMIN"), getSecurity);

export default router;

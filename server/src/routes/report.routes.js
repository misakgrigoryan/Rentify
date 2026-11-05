import { Router } from "express";
import { createReport, listReports, resolveReport } from "../controllers/report.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, createReport);
router.get("/", requireAuth, requireRole("SUPER_ADMIN", "MODERATOR"), listReports);
router.patch("/:id", requireAuth, requireRole("SUPER_ADMIN", "MODERATOR"), resolveReport);

export default router;

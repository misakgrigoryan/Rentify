import { Router } from "express";
import { getOwnerProfile } from "../controllers/owner.controller.js";

const router = Router();
router.get("/:id", getOwnerProfile);

export default router;

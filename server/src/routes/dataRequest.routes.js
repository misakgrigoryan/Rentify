import { Router } from "express";
import { createDataRequest } from "../controllers/dataRequest.controller.js";

const router = Router();
router.post("/", createDataRequest);

export default router;

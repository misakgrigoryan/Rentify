import { Router } from "express";
import { getTestimonials } from "../controllers/testimonial.controller.js";

const router = Router();
router.get("/", getTestimonials);

export default router;

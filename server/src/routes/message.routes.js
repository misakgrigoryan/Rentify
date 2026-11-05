import { Router } from "express";
import {
  getConversations,
  getUnreadCount,
  getThread,
  sendMessage,
} from "../controllers/message.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Every message route needs a logged-in user
router.use(requireAuth);

router.get("/conversations", getConversations);
router.get("/unread", getUnreadCount);
router.get("/with/:userId", getThread);
router.post("/", sendMessage);

export default router;

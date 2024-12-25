import express from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import { getUserForSidebar, getMessages, sendMessage } from '../controllers/message.controller';

const router = express.Router();

router.get("/users", protectRoute, getUserForSidebar);

router.get("/:id", protectRoute, getMessages);

router.get("/send/:id", protectRoute, sendMessage);

export default router;
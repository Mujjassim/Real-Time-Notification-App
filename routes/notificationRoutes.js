import express from "express";
import {
  notifyUser,
  notifyRole,
  getNotifications,
  markNotificationsRead,
} from "../controllers/notificationController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Notify a specific user
router.post("/user/:id", authenticate, authorize("Admin", "Moderator"), notifyUser);

// Notify all users with a specific role
router.post("/role/:role", authenticate, authorize("Admin"), notifyRole);

// Fetch all unread notifications for the logged-in user
router.get("/", authenticate, getNotifications);

// Mark notifications as read
router.put("/mark-read", authenticate, markNotificationsRead);

export default router;

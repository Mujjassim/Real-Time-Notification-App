import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import { io } from "../services/socketService.js";

export const notifyUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const notification = await Notification.create({ message, recipient: id });

    if (user.isConnected) {
      io.to(user._id.toString()).emit("notification:receive", notification);
    }

    res.json({ message: "Notification sent to specific user" });
  } catch (err) {
    next(err);
  }
};

export const notifyRole = async (req, res, next) => {
  try {
    const { role } = req.params;
    const { message } = req.body;

    if (!["Admin", "User", "Moderator"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const users = await User.find({ role });
    if (users.length === 0) {
      return res.status(404).json({ message: `No users found with the role: ${role}` });
    }

    const notifications = await Notification.create(
      users.map((user) => ({
        message,
        role,
        recipient: user._id,
      }))
    );

    users.forEach((user) => {
      if (user.isConnected) {
        io.to(user._id.toString()).emit("notification:receive", notifications);
      }
    });

    res.json({ message: `Notification sent to all ${role}s` });
  } catch (err) {
    next(err);
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
      isRead: false,
    });

    res.json({ notifications });
  } catch (err) {
    next(err);
  }
};

export const markNotificationsRead = async (req, res, next) => {
  try {
    const notifications = await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ message: "Notifications marked as read" });
  } catch (err) {
    next(err);
  }
};

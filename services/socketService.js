import { Server } from "socket.io";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import Notification from "../models/notificationModel.js";

export let io;

export const initializeSocket = (server) => {
  io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    const token = socket.handshake.headers.auth_token;
    if (!token) {
      socket.disconnect(true);  // Force disconnect if token is not provided
      return;
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.error("JWT verification failed:", err.message);
        socket.disconnect(true);  // Force disconnect if token is invalid
        return;
      }
      
      try {
        // Update user's connection status in the DB
        await User.findByIdAndUpdate(decoded.id, { isConnected: true });
        socket.join(decoded.id.toString());

        socket.on("disconnect", async () => {
          try {
            // Update user's disconnection status in DB
            await User.findByIdAndUpdate(decoded.id, { isConnected: false });
          } catch (dbError) {
            console.error("Failed to update user disconnection status:", dbError.message);
          }
        });

        // Handle notification:acknowledge event
        socket.on("notification:acknowledge", async (notificationId) => {
          try {
            const notification = await Notification.findById(notificationId);
            if (notification) {
              // Mark the notification as read
              notification.isRead = true;
              await notification.save();
            }
          } catch (error) {
            console.error("Error acknowledging notification:", error);
          }
        });
      } catch (dbError) {
        socket.disconnect(true);  // Disconnect user if DB update fails
      }
    });
  });
};

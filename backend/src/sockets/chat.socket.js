
import mongoose from "mongoose";

import Conversation from "../models/Conversation.models.js";
import Message from "../models/Message.models.js";

const initializeChatSocket = (io) => {

    io.on("connection", async (socket) => {

        // These values will be assigned by Socket.IO authentication
        // middleware in index.js.
        const userId = socket.userId;
        const userRole = socket.userRole;

        console.log(
            `Chat ${userRole} connected:`,
            userId
        );

        let currentConversationRoom = null;

        // ==========================================
        // VERIFY SOCKET IDENTITY
        // ==========================================

        if (!userId || !["user", "admin"].includes(userRole)) {
            socket.disconnect(true);
            return;
        }

        // ==========================================
        // JOIN ADMIN NOTIFICATION ROOM
        // ==========================================

        if (userRole === "admin") {
            const adminRoom = `admin_${userId}`;

            socket.join(adminRoom);

            console.log(
                `Admin ${userId} joined notification room ${adminRoom}`
            );
        }

        // ==========================================
        // JOIN CONVERSATION ROOM
        // ==========================================

        socket.on("join-conversation", async (conversationId) => {

            try {
                if (!mongoose.Types.ObjectId.isValid(conversationId)) {
                    socket.emit("socket-error", {
                        message: "Invalid conversation ID"
                    });
                    return;
                }

                // Check membership according to the socket role.
                const membershipQuery = userRole === "admin"
                    ? { admin: userId }
                    : { customer: userId, status: "active" };

                const conversation = await Conversation.findOne({
                    _id: conversationId,
                    ...membershipQuery
                });

                if (!conversation) {
                    socket.emit("socket-error", {
                        message: "You are not authorized to join this conversation."
                    });
                    return;
                }

                // Leave the previously selected conversation room.
                if (currentConversationRoom) {
                    await socket.leave(currentConversationRoom);
                }

                const roomId = `conversation_${conversationId}`;

                await socket.join(roomId);

                currentConversationRoom = roomId;

                socket.emit("joined-conversation", {
                    success: true,
                    conversationId
                });

                console.log(
                    `${userRole} ${userId} joined room ${roomId}`
                );

            } catch (error) {
                console.error("Join conversation error:", error);

                socket.emit("socket-error", {
                    message: "Unable to join conversation."
                });
            }
        });

        // ==========================================
        // SEND MESSAGE
        // ==========================================

        socket.on("send-message", async (data, callback) => {

            try {
                const { conversationId, message } = data || {};

                // Validate conversation ID.
                if (!mongoose.Types.ObjectId.isValid(conversationId)) {
                    return callback?.({
                        success: false,
                        message: "Invalid conversation ID"
                    });
                }

                // Validate message.
                if (
                    typeof message !== "string" ||
                    !message.trim()
                ) {
                    return callback?.({
                        success: false,
                        message: "Message cannot be empty"
                    });
                }

                // Verify conversation membership according to role.
                const membershipQuery = userRole === "admin"
                    ? { admin: userId }
                    : { customer: userId, status: "active" };

                const conversation = await Conversation.findOne({
                    _id: conversationId,
                    ...membershipQuery
                });

                if (!conversation) {
                    return callback?.({
                        success: false,
                        message: "You are not authorized to send messages in this conversation."
                    });
                }

                // Admin history includes assigned conversations even when
                // closed. A new reply reopens the conversation for both sides.
                if (userRole === "admin" && conversation.status !== "active") {
                    conversation.status = "active";
                }

                // Save message in MongoDB.
                const newMessage = await Message.create({
                    conversation: conversation._id,
                    sender: userId,
                    message: message.trim()
                });

                // Update conversation activity.
                conversation.updatedAt = new Date();
                await conversation.save();

                // Get sender information.
                const populatedMessage = await Message.findById(
                    newMessage._id
                ).populate("sender", "name role");

                // Broadcast message to both participants.
                const roomId = `conversation_${conversationId}`;

                io.to(roomId).emit("new-message", {
                    conversationId: conversationId.toString(),
                    message: populatedMessage
                });

                // Notify the assigned admin.
                io.to(`admin_${conversation.admin}`).emit(
                    "admin-conversation-updated",
                    {
                        conversationId: conversationId.toString(),
                        message: populatedMessage
                    }
                );

                // Confirm successful message delivery.
                callback?.({
                    success: true,
                    message: "Message sent successfully",
                    newMessage: populatedMessage
                });

            } catch (error) {
                console.error("Send socket message error:", error);

                callback?.({
                    success: false,
                    message: "Unable to send message"
                });
            }
        });

        // ==========================================
        // DISCONNECT
        // ==========================================

        socket.on("disconnect", () => {

            console.log(
                `Chat ${userRole} disconnected:`,
                userId
            );

        });

    });

};

export default initializeChatSocket;

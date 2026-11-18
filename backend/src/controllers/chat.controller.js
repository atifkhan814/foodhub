
import mongoose from "mongoose";

import Conversation from "../models/Conversation.models.js";
import Message from "../models/Message.models.js";
import User from "../models/User.models.js";

// ==========================================
// HELPER: GET CUSTOMER'S ACTIVE CONVERSATION
// ==========================================

const getCustomerActiveConversation = async (customerId) => {
    const admin = await User.findOne({ role: "admin" });

    if (!admin) {
        return null;
    }

    const conversation = await Conversation.findOne({
        customer: customerId,
        admin: admin._id,
        status: "active"
    });

    return conversation;
};

// ==========================================
// 1. CREATE OR GET CUSTOMER CONVERSATION
// ==========================================

export const createOrGetConversation = async (req, res) => {
    try {
        const customerId = req.user._id;

        const admin = await User.findOne({ role: "admin" });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin account not found"
            });
        }

        let conversation = await Conversation.findOne({
            customer: customerId,
            admin: admin._id,
            status: "active"
        }).sort({ updatedAt: -1 });

        if (!conversation) {
            // Reuse a closed conversation after customer login instead of
            // creating a second conversation and splitting the message history.
            conversation = await Conversation.findOne({
                customer: customerId,
                admin: admin._id
            }).sort({ updatedAt: -1 });

            if (conversation) {
                conversation.status = "active";
                await conversation.save();
            } else {
                conversation = await Conversation.create({
                    customer: customerId,
                    admin: admin._id,
                    status: "active"
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: "Conversation retrieved successfully",
            conversation
        });

    } catch (error) {
        console.error("Create conversation error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// ==========================================
// 2. GET LOGGED-IN CUSTOMER MESSAGES
// ==========================================

export const getMyMessages = async (req, res) => {
    try {
        const customerId = req.user._id;

        // Use the same lookup as createOrGetConversation
        const conversation = await getCustomerActiveConversation(customerId);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "No active conversation found"
            });
        }

        const messages = await Message.find({
            conversation: conversation._id
        })
            .populate("sender", "name role")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            conversationId: conversation._id,
            messages
        });

    } catch (error) {
        console.error("Get customer messages error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// ==========================================
// 3. GET ALL CONVERSATIONS (ADMIN)
// ==========================================

export const getAllConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            admin: req.user._id
        })
            .populate("customer", "name email")
            .sort({ updatedAt: -1 });

        const conversationsWithLastMessage = await Promise.all(
            conversations.map(async (conversation) => {
                const lastMessage = await Message.findOne({
                    conversation: conversation._id
                })
                    .sort({ createdAt: -1 })
                    .populate("sender", "name role");

                return {
                    ...conversation.toObject(),
                    lastMessage
                };
            })
        );

        return res.status(200).json({
            success: true,
            conversations: conversationsWithLastMessage
        });

    } catch (error) {
        console.error("Get all conversations error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// ==========================================
// 4. GET SELECTED CONVERSATION MESSAGES (ADMIN)
// ==========================================

export const getConversationMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid conversation ID"
            });
        }

        const conversation = await Conversation.findOne({
            _id: conversationId,
            admin: req.user._id
        }).populate("customer", "name email");

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        const messages = await Message.find({
            conversation: conversation._id
        })
            .populate("sender", "name role")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            conversation,
            messages
        });

    } catch (error) {
        console.error("Get conversation messages error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// ==========================================
// 5. SEND CUSTOMER MESSAGE (HTTP)
// ==========================================

export const sendMessage = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { message } = req.body;

        if (!message || typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message cannot be empty"
            });
        }

        const conversation = await getCustomerActiveConversation(customerId);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "No active conversation found"
            });
        }

        const newMessage = await Message.create({
            conversation: conversation._id,
            sender: customerId,
            message: message.trim()
        });

        conversation.updatedAt = new Date();
        await conversation.save();

        const populatedMessage = await Message.findById(newMessage._id)
            .populate("sender", "name role");

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            newMessage: populatedMessage
        });

    } catch (error) {
        console.error("Send message error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// ==========================================
// 6. SEND ADMIN MESSAGE (HTTP)
// ==========================================

export const sendAdminMessage = async (req, res) => {
    try {
        const adminId = req.user._id;
        const { conversationId } = req.params;
        const { message } = req.body;

        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid conversation ID"
            });
        }

        if (!message || typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message cannot be empty"
            });
        }

        const conversation = await Conversation.findOne({
            _id: conversationId,
            admin: adminId
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        // Replying to an assigned historical conversation reopens it.
        conversation.status = "active";

        const newMessage = await Message.create({
            conversation: conversation._id,
            sender: adminId,
            message: message.trim()
        });

        conversation.updatedAt = new Date();
        await conversation.save();

        const populatedMessage = await Message.findById(newMessage._id)
            .populate("sender", "name role");

        return res.status(201).json({
            success: true,
            message: "Admin reply sent successfully",
            newMessage: populatedMessage
        });

    } catch (error) {
        console.error("Send admin message error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


import { Router } from "express";

import customerMiddleware from "../middlewares/customer.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

import {
    createOrGetConversation,
    getMyMessages,
    getAllConversations,
    getConversationMessages,
    sendMessage,
    sendAdminMessage
} from "../controllers/chat.controller.js";

const router = Router();

// ==========================================
// CUSTOMER CHAT ROUTES
// ==========================================

// Create a conversation or get the existing one
router.post(
    "/conversation",
    customerMiddleware,
    createOrGetConversation
);

// Get messages of the logged-in customer
router.get(
    "/messages",
    customerMiddleware,
    getMyMessages
);

// Send a customer message
router.post(
    "/messages",
    customerMiddleware,
    sendMessage
);


// ==========================================
// ADMIN CHAT ROUTES
// ==========================================

// Get all customer conversations
router.get(
    "/admin/conversations",
    adminMiddleware,
    getAllConversations
);

// Get messages of a selected conversation
router.get(
    "/admin/conversations/:conversationId/messages",
    adminMiddleware,
    getConversationMessages
);

// Send an admin reply
router.post(
    "/admin/conversations/:conversationId/messages",
    adminMiddleware,
    sendAdminMessage
);

export default router;

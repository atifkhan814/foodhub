
import "dotenv/config";
import process from "node:process";
import { createServer } from "node:http";
import { Server } from "socket.io";

import connectDB from "./db/index.js";
import User from "./models/User.models.js";
import app from "./app.js";
import sessionMiddleware from "./middlewares/session.middleware.js";
import initializeChatSocket from "./sockets/chat.socket.js";

const PORT = process.env.PORT || 8000;

// ==========================================
// CREATE HTTP SERVER
// ==========================================

const httpServer = createServer(app);

// ==========================================
// CREATE SOCKET.IO SERVER
// ==========================================

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST"]
    }
});

// ==========================================
// SHARE EXPRESS SESSION WITH SOCKET.IO
// ==========================================

io.engine.use(sessionMiddleware);

// ==========================================
// AUTHENTICATE SOCKET CONNECTIONS
// ==========================================

io.use(async (socket, next) => {
    try {
        const session = socket.request.session;

        if (!session) {
            return next(
                new Error("Unauthorized: Session not found")
            );
        }

        // Identify which account is connecting.
        const requestedRole = socket.handshake.auth?.role;

        let userId;

        if (requestedRole === "customer") {
            userId = session.customerUserId;
        } else if (requestedRole === "admin") {
            userId = session.adminUserId;
        } else {
            return next(
                new Error("Unauthorized: Invalid socket role")
            );
        }

        // Check whether the requested account is logged in.
        if (!userId) {
            return next(
                new Error("Unauthorized: Please login first")
            );
        }

        // Verify the account and its role in MongoDB.
        const expectedDatabaseRole =
            requestedRole === "customer" ? "user" : "admin";

        const user = await User.findOne({
            _id: userId,
            role: expectedDatabaseRole
        }).select("_id role");

        if (!user) {
            return next(
                new Error("Unauthorized: Invalid user session")
            );
        }

        // Attach verified identity to the socket.
        socket.userId = user._id.toString();
        socket.userRole = user.role;

        console.log(
            `Socket authenticated: ${socket.userRole} - ${socket.userId}`
        );

        next();

    } catch (error) {
        console.error("Socket authentication error:", error);

        next(
            new Error("Socket authentication failed")
        );
    }
});

// ==========================================
// INITIALIZE CHAT SOCKET EVENTS
// ==========================================

initializeChatSocket(io);

// ==========================================
// CONNECT DATABASE AND START SERVER
// ==========================================

try {
    await connectDB();

    httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log("Socket.IO is ready");
    });

} catch (error) {
    console.error(
        "Application startup failed:",
        error.message
    );

    process.exit(1);
}

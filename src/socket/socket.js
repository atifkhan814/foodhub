
import { io } from "socket.io-client";

// ==========================================
// CUSTOMER SOCKET
// ==========================================

export const customerSocket = io("http://localhost:8000", {
    withCredentials: true,
    autoConnect: false,
    auth: {
        role: "customer"
    }
});

// ==========================================
// ADMIN SOCKET
// ==========================================

export const adminSocket = io("http://localhost:8000", {
    withCredentials: true,
    autoConnect: false,
    auth: {
        role: "admin"
    }
});

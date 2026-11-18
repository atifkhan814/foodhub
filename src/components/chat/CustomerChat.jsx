
import { useEffect, useRef, useState } from "react";

import {
    MessageCircle,
    X,
    Send,
    Headset
} from "lucide-react";

import toast from "react-hot-toast";

import { customerSocket as socket } from "../../socket/socket";
import "./CustomerChat.css";

const API_URL = "http://localhost:8000/api/chat";

const CustomerChat = () => {

    // Detect admin routes without importing React Router.
    const isAdminRoute = window.location.pathname.startsWith("/admin");

    // CHAT STATES
    const [isOpen, setIsOpen] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // Track the latest history request.
    const historyRequestRef = useRef(0);

    // CREATE OR GET CUSTOMER CONVERSATION
    const initializeChat = async () => {

        if (isLoading) return;

        const requestId = ++historyRequestRef.current;

        try {
            setIsLoading(true);
            setMessages([]);

            const response = await fetch(
                `${API_URL}/conversation`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to start chat"
                );
            }

            const id = data.conversation?._id;

            if (!id) {
                throw new Error("Conversation ID was not returned");
            }

            setConversationId(id);

            // FETCH EXISTING CHAT HISTORY
            const historyResponse = await fetch(
                `${API_URL}/messages`,
                {
                    credentials: "include"
                }
            );

            const historyData = await historyResponse.json();

            if (!historyResponse.ok) {
                throw new Error(
                    historyData.message || "Unable to load messages"
                );
            }

            // Ignore an older initialization request.
            if (requestId !== historyRequestRef.current) {
                return;
            }

            const historyMessages = historyData.messages || [];

            // Merge history with messages received through Socket.IO.
            setMessages((currentMessages) => {

                const uniqueMessages = new Map();

                [...historyMessages, ...currentMessages].forEach((item) => {
                    uniqueMessages.set(item._id, item);
                });

                return Array.from(uniqueMessages.values()).sort(
                    (a, b) =>
                        new Date(a.createdAt) - new Date(b.createdAt)
                );
            });

        } catch (error) {

            console.error("Initialize chat error:", error);
            toast.error(error.message);

        } finally {

            if (requestId === historyRequestRef.current) {
                setIsLoading(false);
            }
        }
    };

    // OPEN CUSTOMER CHAT
    const handleOpenChat = () => {

        setIsOpen(true);

        if (!conversationId) {
            initializeChat();
        }
    };

    // SOCKET.IO CONNECTION AND MESSAGE LISTENERS
    useEffect(() => {

        // Customer chat should not run inside admin panel.
        if (isAdminRoute || !conversationId) return;

        // JOIN CONVERSATION ROOM
        const handleConnect = () => {

            socket.emit(
                "join-conversation",
                conversationId
            );
        };

        // CONFIRM ROOM JOIN
        const handleJoined = (data) => {

            console.log(
                "Joined customer chat:",
                data
            );
        };

        // RECEIVE NEW MESSAGE
        const handleNewMessage = (data) => {

            if (
                String(data?.conversationId) !==
                String(conversationId)
            ) {
                return;
            }

            if (!data.message?._id) return;

            setMessages((previousMessages) => {

                const alreadyExists = previousMessages.some(
                    (item) => item._id === data.message._id
                );

                if (alreadyExists) {
                    return previousMessages;
                }

                return [...previousMessages, data.message].sort(
                    (a, b) =>
                        new Date(a.createdAt) - new Date(b.createdAt)
                );
            });
        };

        // SOCKET ERROR
        const handleSocketError = (data) => {

            toast.error(
                data?.message || "Chat connection error"
            );
        };

        // REGISTER SOCKET EVENTS
        socket.on("connect", handleConnect);

        socket.on(
            "joined-conversation",
            handleJoined
        );

        socket.on(
            "new-message",
            handleNewMessage
        );

        socket.on(
            "socket-error",
            handleSocketError
        );

        // CONNECT SOCKET
        if (socket.connected) {

            handleConnect();

        } else {

            socket.connect();
        }

        // REMOVE EVENT LISTENERS
        return () => {

            socket.off("connect", handleConnect);

            socket.off(
                "joined-conversation",
                handleJoined
            );

            socket.off(
                "new-message",
                handleNewMessage
            );

            socket.off(
                "socket-error",
                handleSocketError
            );
        };

    }, [conversationId, isAdminRoute]);

    // DISCONNECT CUSTOMER SOCKET WHEN COMPONENT UNMOUNTS
    useEffect(() => {

        return () => {
            socket.disconnect();
        };

    }, []);

    // Clear the previous customer's chat session after logout.
    useEffect(() => {
        const handleAuthChange = () => {
            historyRequestRef.current += 1;
            socket.disconnect();
            setIsOpen(false);
            setConversationId(null);
            setMessages([]);
            setMessage("");
            setIsLoading(false);
            setIsSending(false);
        };

        window.addEventListener(
            "foodhub-auth-change",
            handleAuthChange
        );

        return () => {
            window.removeEventListener(
                "foodhub-auth-change",
                handleAuthChange
            );
        };
    }, []);

    // SEND CUSTOMER MESSAGE
    const handleSendMessage = (e) => {

        e.preventDefault();

        const trimmedMessage = message.trim();

        if (
            !trimmedMessage ||
            !conversationId ||
            isSending ||
            isLoading
        ) {
            return;
        }

        if (!socket.connected) {

            toast.error("Chat connection is not ready");
            return;
        }

        setIsSending(true);

        socket.emit(
            "send-message",
            {
                conversationId,
                message: trimmedMessage
            },
            (response) => {

                setIsSending(false);

                if (!response?.success) {

                    toast.error(
                        response?.message ||
                        "Message could not be sent"
                    );

                    return;
                }

                setMessage("");
            }
        );
    };

    // HIDE CUSTOMER CHAT ON ADMIN ROUTES
    if (isAdminRoute) {
        return null;
    }

    // CHAT UI
    return (

        <div className="customer-chat">

            {/* FLOATING CHAT BUTTON */}

            {!isOpen && (

                <button
                    className="customer-chat-toggle"
                    onClick={handleOpenChat}
                    aria-label="Open customer support chat"
                    disabled={isLoading}
                >

                    <MessageCircle size={25} />

                    <span className="customer-chat-dot"></span>

                </button>
            )}

            {/* CHAT WINDOW */}

            {isOpen && (

                <div className="customer-chat-window">

                    {/* CHAT HEADER */}

                    <div className="customer-chat-header">

                        <div className="customer-chat-header-info">

                            <div className="customer-chat-avatar">
                                <Headset size={22} />
                            </div>

                            <div>
                                <h3>FoodHub Support</h3>

                                <span>
                                    We're here to help you
                                </span>
                            </div>

                        </div>

                        <button
                            className="customer-chat-close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                        >

                            <X size={21} />

                        </button>

                    </div>

                    {/* MESSAGE AREA */}

                    <div className="customer-chat-messages">

                        {isLoading ? (

                            <p className="customer-chat-status">
                                Loading conversation...
                            </p>

                        ) : messages.length === 0 ? (

                            <div className="customer-chat-empty">

                                <MessageCircle size={32} />

                                <h4>
                                    How can we help?
                                </h4>

                                <p>
                                    Send us a message and our team
                                    will assist you.
                                </p>

                            </div>

                        ) : (

                            messages.map((item) => {

                                const isCustomer =
                                    item.sender?.role === "user";

                                return (

                                    <div
                                        key={item._id}
                                        className={`customer-chat-message ${
                                            isCustomer
                                                ? "customer-message"
                                                : "admin-message"
                                        }`}
                                    >

                                        <div className="customer-chat-bubble">

                                            <p>
                                                {item.message}
                                            </p>

                                            <span>
                                                {new Date(
                                                    item.createdAt
                                                ).toLocaleTimeString(
                                                    [],
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    }
                                                )}
                                            </span>

                                        </div>

                                    </div>
                                );
                            })

                        )}

                    </div>

                    {/* MESSAGE INPUT */}

                    <form
                        className="customer-chat-input-area"
                        onSubmit={handleSendMessage}
                    >

                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                            disabled={
                                !conversationId ||
                                isLoading ||
                                isSending
                            }
                        />

                        <button
                            type="submit"
                            disabled={
                                !message.trim() ||
                                isSending ||
                                isLoading ||
                                !conversationId
                            }
                            aria-label="Send message"
                        >

                            <Send size={19} />

                        </button>

                    </form>

                </div>
            )}

        </div>
    );
};

export default CustomerChat;

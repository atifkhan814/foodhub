
import { useCallback, useEffect, useRef, useState } from "react";

import {
    Search,
    Send,
    MessageCircle,
    UserRound
} from "lucide-react";

import toast from "react-hot-toast";

import { adminSocket as socket } from "../../socket/socket";
import "./AdminChat.css";

const API_URL = "http://localhost:8000/api/chat";

function AdminChat() {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Prevent an older message-history request from replacing newer data.
    const messagesRequestRef = useRef(0);
    const messageListRef = useRef(null);

    // Fetch all customer conversations.
    const fetchConversations = useCallback(async () => {
        const response = await fetch(
            `${API_URL}/admin/conversations`,
            {
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to load conversations"
            );
        }

        return data.conversations || [];
    }, []);

    // Fetch messages for the selected conversation.
    const fetchMessages = useCallback(async (conversationId) => {
        const requestId = ++messagesRequestRef.current;

        try {
            const response = await fetch(
                `${API_URL}/admin/conversations/${conversationId}/messages`,
                {
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to load messages"
                );
            }

            // Ignore an old request if another conversation was selected.
            if (requestId !== messagesRequestRef.current) {
                return;
            }

            const historyMessages = data.messages || [];

            // Merge history with messages received while history was loading.
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
            if (requestId === messagesRequestRef.current) {
                console.error("Fetch messages error:", error);
                toast.error(error.message);
            }
        }
    }, []);

    // Add a message only once.
    const addMessage = useCallback((newMessage) => {
        if (!newMessage?._id) return;

        setMessages((previousMessages) => {
            const alreadyExists = previousMessages.some(
                (item) => item._id === newMessage._id
            );

            if (alreadyExists) {
                return previousMessages;
            }

            return [...previousMessages, newMessage].sort(
                (a, b) =>
                    new Date(a.createdAt) - new Date(b.createdAt)
            );
        });
    }, []);

    // Keep the newest message in view after history loads or a live update arrives.
    useEffect(() => {
        const messageList = messageListRef.current;

        if (messageList) {
            messageList.scrollTo({
                top: messageList.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages, selectedConversation?._id]);

    // Load conversations when Admin Chat opens.
    useEffect(() => {
        let ignore = false;

        const loadConversations = async () => {
            try {
                const data = await fetchConversations();

                if (!ignore) {
                    setConversations(data);
                }

            } catch (error) {
                if (!ignore) {
                    console.error("Fetch conversations error:", error);
                    toast.error(error.message);
                }

            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        };

        loadConversations();

        return () => {
            ignore = true;
        };
    }, [fetchConversations]);

    // Connect admin socket and listen for conversation updates.
    useEffect(() => {
        const refreshConversations = async () => {
            try {
                const data = await fetchConversations();

                setConversations(data);

                // Keep selected conversation information up to date.
                setSelectedConversation((currentSelected) => {
                    if (!currentSelected) return currentSelected;

                    return (
                        data.find(
                            (item) => item._id === currentSelected._id
                        ) || currentSelected
                    );
                });

            } catch (error) {
                console.error("Refresh conversations error:", error);
            }
        };

        const handleAdminConversationUpdate = (data) => {
            // If this conversation is currently open, add the message.
            if (
                data?.conversationId === selectedConversation?._id &&
                data?.message
            ) {
                addMessage(data.message);
            }

            refreshConversations();
        };

        const handleConnect = () => {
            console.log("Admin chat socket connected:", socket.id);
        };

        socket.on("connect", handleConnect);

        socket.on(
            "admin-conversation-updated",
            handleAdminConversationUpdate
        );

        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            socket.off("connect", handleConnect);

            socket.off(
                "admin-conversation-updated",
                handleAdminConversationUpdate
            );
        };
    }, [
        fetchConversations,
        addMessage,
        selectedConversation?._id
    ]);

    // Select a customer conversation.
    const handleSelectConversation = (conversation) => {
        // Invalidate any previous message-history request.
        messagesRequestRef.current += 1;

        setSelectedConversation(conversation);
        setMessages([]);

        fetchMessages(conversation._id);
    };

    // Join selected conversation and receive its messages.
    useEffect(() => {
        if (!selectedConversation?._id) return;

        const conversationId = selectedConversation._id;

        const handleConnect = () => {
            socket.emit("join-conversation", conversationId);
        };

        const handleNewMessage = (data) => {
            if (data?.conversationId !== conversationId) return;

            addMessage(data.message);

            // Refresh the preview and latest message in the sidebar.
            fetchConversations()
                .then((updatedConversations) => {
                    setConversations(updatedConversations);
                })
                .catch((error) => {
                    console.error(
                        "Refresh conversations error:",
                        error
                    );
                });
        };

        const handleSocketError = (data) => {
            toast.error(
                data?.message || "Chat connection error"
            );
        };

        socket.on("connect", handleConnect);
        socket.on("new-message", handleNewMessage);
        socket.on("socket-error", handleSocketError);

        if (socket.connected) {
            handleConnect();
        } else {
            socket.connect();
        }

        return () => {
            socket.off("connect", handleConnect);
            socket.off("new-message", handleNewMessage);
            socket.off("socket-error", handleSocketError);
        };
    }, [
        selectedConversation?._id,
        addMessage,
        fetchConversations
    ]);

    // Disconnect admin socket when AdminChat unmounts.
    useEffect(() => {
        return () => {
            socket.disconnect();
        };
    }, []);

    // Send admin message.
    const handleSendMessage = (e) => {
        e.preventDefault();

        const trimmedMessage = message.trim();

        if (
            !trimmedMessage ||
            !selectedConversation ||
            isSending
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
                conversationId: selectedConversation._id,
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

                // The server broadcasts the saved message through
                // the conversation room.
            }
        );
    };

    // Search customer conversations.
    const filteredConversations = conversations.filter(
        (conversation) =>
            conversation.customer?.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-chat">

            {/* PAGE HEADING */}
            <header className="admin-chat-heading">
                <div>
                    <h1>Customer Support</h1>
                    <p>
                        Manage customer conversations and provide assistance.
                    </p>
                </div>
            </header>

            <div className="admin-chat-container">

                {/* CONVERSATION SIDEBAR */}
                <aside className="admin-chat-sidebar">

                    <div className="admin-chat-sidebar-heading">
                        <h2>Conversations</h2>
                        <span>{conversations.length}</span>
                    </div>

                    <div className="admin-chat-search">
                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                        />
                    </div>

                    <div className="admin-chat-conversations">

                        {isLoading ? (
                            <p className="admin-chat-empty">
                                Loading conversations...
                            </p>
                        ) : filteredConversations.length === 0 ? (
                            <p className="admin-chat-empty">
                                No conversations found.
                            </p>
                        ) : (
                            filteredConversations.map((conversation) => (
                                <button
                                    type="button"
                                    key={conversation._id}
                                    className={`admin-chat-conversation ${
                                        selectedConversation?._id ===
                                        conversation._id
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleSelectConversation(conversation)
                                    }
                                >
                                    <div className="admin-chat-customer-avatar">
                                        <UserRound size={21} />
                                    </div>

                                    <div className="admin-chat-customer-info">
                                        <h3>
                                            {conversation.customer?.name ||
                                                "Customer"}
                                        </h3>

                                        <p>
                                            {conversation.lastMessage?.message ||
                                                "Start a conversation"}
                                        </p>
                                    </div>
                                </button>
                            ))
                        )}

                    </div>
                </aside>

                {/* MAIN CHAT WINDOW */}
                <section className="admin-chat-main">

                    {selectedConversation ? (
                        <>
                            <div className="admin-chat-header">

                                <div className="admin-chat-customer-avatar">
                                    <UserRound size={22} />
                                </div>

                                <div>
                                    <h2>
                                        {selectedConversation.customer?.name}
                                    </h2>

                                    <span>
                                        Customer Support Conversation
                                    </span>
                                </div>

                            </div>

                            <div className="admin-chat-messages" ref={messageListRef}>

                                {messages.length === 0 ? (
                                    <div className="admin-chat-empty">
                                        No messages yet.
                                    </div>
                                ) : (
                                    messages.map((item) => {
                                        const isAdmin =
                                            item.sender?.role === "admin";

                                        return (
                                            <div
                                                key={item._id}
                                                className={`admin-chat-message ${
                                                    isAdmin
                                                        ? "admin-chat-sent"
                                                        : "admin-chat-received"
                                                }`}
                                            >
                                                <div className="admin-chat-bubble">
                                                    <p>{item.message}</p>

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

                            <form
                                className="admin-chat-input-area"
                                onSubmit={handleSendMessage}
                            >
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={message}
                                    onChange={(e) =>
                                        setMessage(e.target.value)
                                    }
                                    disabled={isSending}
                                />

                                <button
                                    type="submit"
                                    disabled={
                                        !message.trim() || isSending
                                    }
                                    aria-label="Send message"
                                >
                                    <Send size={19} />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="admin-chat-welcome">
                            <MessageCircle size={48} />

                            <h2>Select a conversation</h2>

                            <p>
                                Choose a customer from the conversation
                                list to view and reply to their messages.
                            </p>
                        </div>
                    )}

                </section>

            </div>
        </div>
    );
}

export default AdminChat;

import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import "./PatientPagesStyles/Messaging.css";
import { FaArrowLeft, FaPaperPlane, FaUser, FaPlus } from "react-icons/fa";

const Messaging = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [newChatRecipient, setNewChatRecipient] = useState("");
    const [contacts, setContacts] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const [view, setView] = useState("chatList");
    const [chatMessages, setChatMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const fetchContacts = useCallback(async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/chat/contact-list/${currentUser._id}`
            );
            setContacts(response.data);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    }, [currentUser]);

    const handleChatClick = async (chat) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/chat/chat-details/${chat._id}/${currentUser._id}`
            );
            setSelectedChat(response.data);
            setChatMessages(response.data.messages);
            setView("chatDetail");
        } catch (error) {
            console.error("Error fetching chat details:", error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await axios.post(
                "http://localhost:5000/api/chat/create-message",
                {
                    chatId: selectedChat._id,
                    senderId: currentUser._id,
                    receiverID: selectedChat.otherUser._id,
                    content: newMessage,
                }
            );

            // Update the local state with the new message
            setChatMessages((prevMessages) => [
                ...prevMessages,
                response.data.messages[response.data.messages.length - 1],
            ]);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleBackToChats = async () => {
        setSelectedChat(null);
        // Refresh the chat list when going back
        await fetchUserChats();
        setView("chatList");
    };

    const handleCreateNewChat = async () => {
        if (!newChatRecipient) return;
        try {
            const response = await axios.post(
                "http://localhost:5000/api/chat/create-chat",
                {
                    senderID: currentUser._id,
                    receiverID: newChatRecipient,
                }
            );
            console.log("New chat response:", response.data);
            const newChat = response.data;

            // Fetch chat details before updating the state
            const chatDetailsResponse = await axios.get(
                `http://localhost:5000/api/chat/chat-details/${newChat._id}/${currentUser._id}`
            );
            const detailedChat = chatDetailsResponse.data;

            setChats((prevChats) => [...prevChats, detailedChat]);
            setNewChatRecipient("");
            setSelectedChat(detailedChat);
            setChatMessages(detailedChat.messages);

            setView("chatDetail");
        } catch (error) {
            console.error("Error creating new chat:", error);
        }
    };

    const handleNewChatClick = () => {
        fetchContacts();
        setView("newChat");
    };

    const fetchUserChats = useCallback(async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/chat/user-chats/${currentUser._id}`
            );
            setChats(response.data);
        } catch (error) {
            console.error("Error fetching user chats:", error);
        }
    }, [currentUser._id]);

    useEffect(() => {
        fetchUserChats();
    }, [fetchUserChats]);

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    useEffect(() => {
        if (view === "chatDetail" && selectedChat) {
            const intervalId = setInterval(async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:5000/api/chat/chat-details/${selectedChat._id}/${currentUser._id}`
                    );
                    const newMessages = response.data.messages;

                    // Compare new messages with existing messages
                    if (JSON.stringify(newMessages) !== JSON.stringify(chatMessages)) {
                        setChatMessages(newMessages);
                    }
                } catch (error) {
                    console.error("Error fetching new messages:", error);
                }
            }, 2000);

            // Cleanup interval on component unmount or when view changes
            return () => clearInterval(intervalId);
        }
    }, [view, selectedChat, currentUser._id, chatMessages]);

    useEffect(() => {
        const intervalId = setInterval(async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/chat/user-chats/${currentUser._id}`
                );
                const newChats = response.data;

                // Compare new chats with existing chats
                if (JSON.stringify(newChats) !== JSON.stringify(chats)) {
                    setChats(newChats);
                }
            } catch (error) {
                console.error("Error fetching user chats:", error);
            }
        }, 2000); // Adjust the interval as needed

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [currentUser._id, chats]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="messaging-container">
            <div className="messaging-content">
                {view === "chatList" && (
                    <div className="chat-list">
                        <h1 className="messaging-title">My Messages</h1>
                        {chats.map((chat) => (
                            <div
                                key={chat._id}
                                className="chat-item"
                                onClick={() => handleChatClick(chat)}
                            >
                                <div className="chat-avatar">
                                    <FaUser />
                                </div>
                                <div className="chat-preview">
                                    <h3>
                                        {chat.otherUser.name}{" "}
                                        {chat.otherUser.fatherName}
                                    </h3>
                                    <p>
                                        {chat.messages[chat.messages.length - 1]
                                            ?.content.substring(0, 15)|| "No messages"}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <button
                            className="new-chat-button"
                            onClick={handleNewChatClick}
                        >
                            <FaPlus />
                        </button>
                    </div>
                )}
                {view === "chatDetail" && selectedChat && (
                    <div className="chat-detail">
                        <div className="chat-header">
                            <button
                                onClick={handleBackToChats}
                                className="backbtn"
                            >
                                <FaArrowLeft />
                            </button>
                            <div className="chat-user-info">
                                <div className="chat-avatar">
                                    <FaUser />
                                </div>
                                <h2>
                                    {selectedChat.otherUser.name}{" "}
                                    {selectedChat.otherUser.fatherName}
                                </h2>
                            </div>
                        </div>
                        <div className="chat-messages">
                            {chatMessages.map((message) => (
                                <div
                                    key={message._id}
                                    className={`message ${message.sender === currentUser._id ? 'sent' : 'received'}`}
                                >
                                    <div className="message-content">
                                        {message.content}
                                    </div>
                                    <div className="message-time">
                                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="message-input">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button onClick={handleSendMessage}>
                                <FaPaperPlane />
                            </button>
                        </div>
                    </div>
                )}
                {view === "newChat" && (
                    <div className="new-chat-page">
                        <div className="chat-header">
                            <button
                                onClick={handleBackToChats}
                                className="back-button"
                            >
                                <FaArrowLeft />
                            </button>
                            <h2>Create New Chat</h2>
                        </div>
                        <div className="new-chat-form">
                            <select
                                value={newChatRecipient}
                                onChange={(e) =>
                                    setNewChatRecipient(e.target.value)
                                }
                            >
                                <option value="">Select a contact</option>
                                {contacts.map((contact) => (
                                    <option
                                        key={contact._id}
                                        value={contact.user._id}
                                    >
                                        {`${contact.user.name} ${contact.user.fatherName} ${contact.user.grandfatherName} - ${contact.department}`}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleCreateNewChat}
                                disabled={!newChatRecipient}
                            >
                                Create Chat
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messaging;

"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import {
  FiSend, FiMoreVertical, FiSearch, FiPlus,
  FiPhone, FiVideo, FiPaperclip, FiSmile,
} from "react-icons/fi";

// const socket = io("http://localhost:4000");
// const CURRENT_USER = {
//   id: 1,
//   name: "You",
//   avatar: "YU"
// };

export default function ChatSystem() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [userTyping, setUserTyping] = useState(null);
  const scrollRef = useRef(null);

  // Fetch chat history
  const fetchHistory = async (chatId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/chat-history/${chatId}`);
      setMessages((prev) => ({
        ...prev,
        [chatId]: response.data.map(msg => ({
          ...msg,
          isOwn: msg.sender_id === CURRENT_USER.id
        }))
      }));
    } catch (error) {
      console.error("History fetch error:", error);
    }
  };

  // Handle typing indicator
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    // Emit typing event
    if (e.target.value.trim()) {
      socket.emit("typing", {
        chatId: selectedChat,
        userId: CURRENT_USER.id,
        userName: CURRENT_USER.name
      });
    } else {
      socket.emit("stop_typing", {
        chatId: selectedChat,
        userId: CURRENT_USER.id
      });
    }
  };

  // useEffect(() => {
  //   fetchHistory(selectedChat);
  //   socket.on("receive_message", (incomingMsg) => {
  //     if (incomingMsg.chat_id === selectedChat) {
  //       setMessages((prev) => ({
  //         ...prev,
  //         [selectedChat]: [
  //           ...(prev[selectedChat] || []), 
  //           {
  //             ...incomingMsg,
  //             isOwn: incomingMsg.sender_id === CURRENT_USER.id
  //           }
  //         ],
  //       }));
  //     }
  //   });

  //   // Listen for typing events
  //   socket.on("user_typing", (data) => {
  //     if (data.chatId === selectedChat && data.userId !== CURRENT_USER.id) {
  //       setUserTyping(data.userName);
        
  //       // Clear typing indicator after 2 seconds
  //       setTimeout(() => {
  //         setUserTyping(null);
  //       }, 2000);
  //     }
  //   });

  //   socket.on("user_stop_typing", (data) => {
  //     if (data.chatId === selectedChat && data.userId !== CURRENT_USER.id) {
  //       setUserTyping(null);
  //     }
  //   });

  //   return () => {
  //     socket.off("receive_message");
  //     socket.off("user_typing");
  //     socket.off("user_stop_typing");
  //   };
  // }, [selectedChat]);

  // Scroll to bottom effect
  // useEffect(() => {
  //   scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages, selectedChat]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        chat_id: selectedChat,
        sender_id: CURRENT_USER.id,
        sender_name: CURRENT_USER.name,
        receiver_id: conversations.find(c => c.id === selectedChat)?.user_id,
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { 
          hour: "2-digit", 
          minute: "2-digit" 
        }),
        is_own: false, // Will be set by server or receiver
        avatar: CURRENT_USER.avatar
      };

      // Emit to socket
      socket.emit("send_message", messageData);

      // Update local state
      setMessages((prev) => ({
        ...prev,
        [selectedChat]: [
          ...(prev[selectedChat] || []), 
          {
            ...messageData,
            isOwn: true
          }
        ],
      }));

      // Clear input and stop typing
      setNewMessage("");
      socket.emit("stop_typing", {
        chatId: selectedChat,
        userId: CURRENT_USER.id
      });
    }
  };

  // Theme
  const theme = {
    primary: "#3FA7A3",
    secondary: "#6C63FF",
    accent: "#2ECC71",
    dark: "#1E293B",
    light: "#64748B",
    background: "#F8FAFC",
    white: "#FFFFFF",
    lightGray: "#E2E8F0",
  };

  // Conversations with user_id
  const conversations = useMemo(() => {
    const baseConversations = [
      {
        id: 1,
        user_id: 2,
        name: "John Doe",
        avatar: "JD",
        lastMessage: "That's awesome! Let me review it",
        timestamp: "10:33 AM",
        unread: false,
        status: "online",
      },
      {
        id: 2,
        user_id: 3,
        name: "Sarah Smith",
        avatar: "SS",
        lastMessage: "Good morning! Ready for the meeting?",
        timestamp: "9:20 AM",
        unread: true,
        status: "away",
      },
      {
        id: 3,
        user_id: 4,
        name: "Team Group",
        avatar: "TG",
        lastMessage: "Welcome to the team chat! 🎉",
        timestamp: "Yesterday",
        unread: false,
        status: "offline",
      },
    ];

    // Add more users with proper user_id mapping
    const additionalUsers = Array.from({ length: 10 }, (_, i) => {
      const id = i + 4;
      const firstNames = ["Alex", "Emma", "Chris", "Lisa", "David"];
      const lastNames = ["Wilson", "Moore", "Taylor", "Anderson", "Thomas"];
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      const fullName = `${firstName} ${lastName}`;
      const avatar = `${firstName[0]}${lastName[0]}`.toUpperCase();

      const statuses = ["online", "away", "offline"];
      const status = statuses[i % 3];

      const lastMessages = [
        "Sounds good to me!",
        "Let's catch up later",
        "Thanks for the update",
        "See you soon",
        "Perfect! 👍",
      ];

      return {
        id,
        user_id: 100 + i, // Different from chat id
        name: fullName,
        avatar,
        lastMessage: lastMessages[i % lastMessages.length],
        timestamp: `${(i % 12) + 1}:${String((i * 13) % 60).padStart(2, "0")} ${i % 2 === 0 ? "AM" : "PM"}`,
        unread: i % 3 === 0,
        status,
      };
    });

    return [...baseConversations, ...additionalUsers];
  }, []);

  // Search functionality
  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = conversations.filter((conv) =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
  };

  const displayedConversations = searchResults !== null ? searchResults : conversations;

  // Status color
  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return theme.accent;
      case "away":
        return "#F39C12";
      case "offline":
        return theme.light;
      default:
        return theme.light;
    }
  };

  // Handle key press for message sending
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: theme.background }}>
      {/* Left Sidebar */}
      <div className="w-full md:w-80 border-r flex flex-col" style={{ 
        backgroundColor: theme.white, 
        borderColor: theme.lightGray 
      }}>
        {/* Header */}
        <div className="p-6 border-b flex-shrink-0" style={{ borderColor: theme.lightGray }}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold" style={{ color: theme.dark }}>Messages</h1>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <FiPlus size={20} style={{ color: theme.primary }} />
            </button>
          </div>

          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border flex-1"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.lightGray,
              }}
            >
              <FiSearch size={16} style={{ color: theme.light }} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) handleSearch();
                }}
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: theme.dark }}
              />
            </div>
            {searchQuery.trim() && (
              <button
                onClick={handleSearch}
                className="px-3 py-2 rounded-lg font-medium text-sm"
                style={{
                  backgroundColor: theme.primary,
                  color: theme.white,
                }}
              >
                Search
              </button>
            )}
            {searchResults !== null && (
              <button
                onClick={handleClearSearch}
                className="px-3 py-2 rounded-lg font-medium text-sm"
                style={{
                  backgroundColor: theme.lightGray,
                  color: theme.dark,
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {displayedConversations.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p style={{ color: theme.light }}>No conversations found</p>
            </div>
          ) : (
            <>
              {searchResults !== null && (
                <div className="px-4 py-2 text-xs font-medium" style={{ color: theme.light }}>
                  Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                </div>
              )}
              {displayedConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer transition-colors"
                  style={{
                    backgroundColor: selectedChat === conv.id ? "#F0FFFE" : theme.white,
                    borderColor: theme.lightGray,
                    borderLeft: selectedChat === conv.id ? `4px solid ${theme.primary}` : "none",
                  }}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar with status */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white text-sm"
                        style={{ backgroundColor: theme.primary }}
                      >
                        {conv.avatar}
                      </div>
                      <div
                        className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                        style={{
                          backgroundColor: getStatusColor(conv.status),
                          borderColor: theme.white,
                        }}
                      />
                    </div>

                    {/* Conversation info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-semibold text-sm truncate" style={{ color: theme.dark }}>
                          {conv.name}
                        </h3>
                        <span className="text-xs text-gray-500">{conv.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        {conv.lastMessage}
                      </p>
                    </div>

                    {/* Unread indicator */}
                    {conv.unread && (
                      <div className="w-2 h-2 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: theme.primary }} 
                      />
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Right Chat Panel */}
      <div className="hidden md:flex flex-1 flex-col" style={{ backgroundColor: theme.white }}>
        {/* Chat Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center"
          style={{ borderColor: theme.lightGray }}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white text-sm"
                style={{ backgroundColor: theme.secondary }}
              >
                {conversations.find(c => c.id === selectedChat)?.avatar || "U"}
              </div>
              <div
                className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
                style={{
                  backgroundColor: getStatusColor(conversations.find(c => c.id === selectedChat)?.status),
                  borderColor: theme.white,
                }}
              />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: theme.dark }}>
                {conversations.find(c => c.id === selectedChat)?.name || "Unknown User"}
              </h2>
              <p className="text-xs" style={{ color: theme.light }}>
                {userTyping ? `${userTyping} is typing...` : conversations.find(c => c.id === selectedChat)?.status || "offline"}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <FiPhone size={18} style={{ color: theme.primary }} />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <FiVideo size={18} style={{ color: theme.primary }} />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <FiMoreVertical size={18} style={{ color: theme.primary }} />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages[selectedChat]?.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.isOwn ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white text-xs flex-shrink-0"
                style={{
                  backgroundColor: message.isOwn ? theme.accent : theme.secondary,
                }}
              >
                {message.avatar || message.sender_name?.slice(0, 2)}
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col ${message.isOwn ? "items-end" : "items-start"}`}>
                <div
                  className="px-4 py-2 rounded-2xl max-w-xs break-words"
                  style={{
                    backgroundColor: message.isOwn ? theme.primary : theme.background,
                    color: message.isOwn ? theme.white : theme.dark,
                  }}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs" style={{ color: theme.light }}>
                    {message.sender_name || message.sender}
                  </span>
                  <span className="text-xs" style={{ color: theme.light }}>
                    {message.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* Message Input */}
        <div className="px-6 py-4 border-t" style={{ borderColor: theme.lightGray }}>
          <div className="flex items-end gap-3 p-3 rounded-lg border"
            style={{
              backgroundColor: theme.background,
              borderColor: theme.lightGray,
            }}
          >
            <button className="p-2 hover:scale-110 transition-transform">
              <FiPaperclip size={18} style={{ color: theme.primary }} />
            </button>

            <textarea
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-transparent resize-none outline-none text-sm min-h-[40px] max-h-[100px]"
              style={{ color: theme.dark }}
              rows="1"
            />

            <button className="p-2 hover:scale-110 transition-transform">
              <FiSmile size={18} style={{ color: theme.primary }} />
            </button>

            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: newMessage.trim() ? theme.primary : theme.lightGray,
                color: theme.white,
              }}
            >
              <FiSend size={18} />
            </button>
          </div>
          <p className="text-xs mt-2" style={{ color: theme.light }}>
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Mobile Empty State */}
      <div className="md:hidden flex-1 flex items-center justify-center" style={{ backgroundColor: theme.background }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2"
            style={{ borderColor: theme.primary, color: theme.primary }}
          >
            <FiSearch size={28} />
          </div>
          <p className="text-sm" style={{ color: theme.light }}>Select a conversation to start chatting</p>
        </div>
      </div>
    </div>
  );
}




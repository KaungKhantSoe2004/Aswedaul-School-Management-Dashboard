// "use client";

// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import io from "socket.io-client";
// import { 
//   FiSend, FiMoreVertical, FiPhone, FiVideo, 
//   FiPaperclip, FiSmile, FiSearch, FiImage,
//   FiFile, FiMic, FiVideo as FiVideoIcon, FiCheck, FiCheckCircle,
//   FiCalendar, FiClock, FiUser, FiChevronLeft, FiChevronRight,
//   FiMapPin, FiCamera, FiMusic, FiDownload, FiShare, FiCopy, FiTrash2,
//   FiMessageCircle, FiEdit, FiEdit2, FiX, FiSave,
//   FiMoreHorizontal, FiThumbsUp, FiHeart, FiStar
// } from "react-icons/fi";
// import { RiEmojiStickerLine } from "react-icons/ri";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { IoMdAttach } from "react-icons/io";

// // Initialize socket connection
// let socket;
// const getSocket = () => {
//   if (!socket) {
//     socket = io("http://localhost:4000");
//   }
//   return socket;
// };

// export default function ChatRoom({
//   roomId = null,
//   theme = {
//     primary: "#3FA7A3",
//     secondary: "#6C63FF",
//     accent: "#2ECC71",
//     dark: "#1E293B",
//     light: "#64748B",
//     background: "#F8FAFC",
//     white: "#FFFFFF",
//     lightGray: "#E2E8F0",
//   },
//   currentUser = {
//     id: 19,
//     name: "You",
//     avatar: "YU"
//   },
//   onBack = null
// }) {
//   // State
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [userTyping, setUserTyping] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [roomDetails, setRoomDetails] = useState(null);
//   const [error, setError] = useState(null);
//   const [isOnline, setIsOnline] = useState(true);
//   const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [activeMessageMenu, setActiveMessageMenu] = useState(null);
//   const [editingMessage, setEditingMessage] = useState(null);
//   const [editContent, setEditContent] = useState("");
//   const [messageReactions, setMessageReactions] = useState({});
  
//   const scrollRef = useRef(null);
//   const socketRef = useRef(getSocket());
//   const typingTimeoutRef = useRef(null);
//   const messageInputRef = useRef(null);
  
//   // Backend domain
//   const backendDomain = import.meta.env.VITE_BACKEND_DOMAIN_NAME || "http://localhost:4000/";

//   // Get other user info (for private chats)
//   const getOtherUser = () => {
//     if (!roomDetails || roomDetails.type !== "private") return null;
//     return roomDetails.participants?.find(p => p.user_id !== currentUser.id);
//   };

//   // Get sender info for a message
//   const getSenderInfo = (senderId) => {
//     if (senderId === currentUser.id) {
//       return {
//         name: currentUser.name,
//         profile: currentUser.profile,
//         avatar: currentUser.avatar || getInitials(currentUser.name)
//       };
//     }
    
//     if (roomDetails?.type === "private") {
//       const otherUser = getOtherUser();
//       return {
//         name: otherUser?.user_name || otherUser?.name || `User ${senderId}`,
//         profile: otherUser?.profile,
//         avatar: getInitials(otherUser?.user_name || otherUser?.name || `User ${senderId}`)
//       };
//     }
    
//     // For group chats
//     const participant = roomDetails?.participants?.find(p => p.user_id === senderId);
//     return {
//       name: participant?.user_name || participant?.name || `User ${senderId}`,
//       profile: participant?.profile,
//       avatar: getInitials(participant?.user_name || participant?.name || `User ${senderId}`)
//     };
//   };

//   // Helper: Get initials
//   const getInitials = (name) => {
//     if (!name) return "??";
//     const nameParts = name.split(' ');
//     if (nameParts.length >= 2) {
//       return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
//     }
//     return name.slice(0, 2).toUpperCase();
//   };

//   // Format time
//   const formatTime = (timestamp) => {
//     if (!timestamp) return "";
//     try {
//       const date = new Date(timestamp);
//       return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//     } catch (e) {
//       return "";
//     }
//   };

//   // Format date
//   const formatDate = (timestamp) => {
//     if (!timestamp) return "";
//     try {
//       const date = new Date(timestamp);
//       const today = new Date();
//       const yesterday = new Date(today);
//       yesterday.setDate(yesterday.getDate() - 1);
      
//       if (date.toDateString() === today.toDateString()) return "Today";
//       if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
      
//       return date.toLocaleDateString([], { 
//         month: "short", 
//         day: "numeric",
//         year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined
//       });
//     } catch (e) {
//       return "";
//     }
//   };

//   // Get room display name
//   const getRoomName = () => {
//     if (!roomDetails) return "Loading...";
    
//     if (roomDetails.type === "private") {
//       const otherUser = getOtherUser();
//       return otherUser?.user_name || otherUser?.name || "Private Chat";
//     }
    
//     return roomDetails.name || "Group Chat";
//   };

//   // Get room profile
//   const getRoomProfile = () => {
//     if (!roomDetails) return null;
    
//     if (roomDetails.type === "private") {
//       const otherUser = getOtherUser();
//       if (otherUser?.profile) {
//         const profilePath = otherUser.profile.startsWith('uploads/') 
//           ? otherUser.profile 
//           : `uploads/${otherUser.profile}`;
//         return `${backendDomain}${profilePath}`;
//       }
//     }
    
//     return null;
//   };

//   // Render profile image
//   const renderProfile = (profileUrl, fallbackInitials, className = "", isOwn = false) => {
//     if (profileUrl) {
//       return (
//         <img 
//           src={profileUrl}
//           alt="Profile"
//           className={`${className} object-cover`}
//           onError={(e) => {
//             e.target.style.display = 'none';
//           }}
//         />
//       );
//     }
    
//     return (
//       <div 
//         className={`${className} flex items-center justify-center font-semibold`}
//         style={{ 
//           backgroundColor: isOwn ? theme.primary : theme.secondary,
//           color: theme.white,
//           display: profileUrl ? 'none' : 'flex'
//         }}
//       >
//         {fallbackInitials}
//       </div>
//     );
//   };

//   // Fetch room and messages
//   const fetchRoomData = async () => {
//     if (!roomId) {
//       setRoomDetails(null);
//       setMessages([]);
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError(null);
      
//       const response = await axios.get(`http://localhost:4000/api/getRoomWithMessages/${roomId}`);
      
//       if (response.data) {
//         const data = response.data.data;
//         // Handle different response structures
//         if (data) {
//           setRoomDetails(data.room);
//           setMessages(data.messages || []);
//         } else if (data.data) {
//           setRoomDetails(data.data);
//           setMessages(data.data.messages || []);
//         } else {
//           setRoomDetails(data);
//           setMessages(data.messages || []);
//         }
//       }
//     } catch (error) {
//       console.error("Failed to fetch room:", error);
//       setError("Failed to load conversation");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Socket setup
//   const setupSocket = () => {
//     const socket = socketRef.current;
    
//     socket.on("connect", () => {
//       setIsOnline(true);
//       if (roomId) {
//         socket.emit("join_room", { roomId, userId: currentUser.id });
//       }
//     });
    
//     socket.on("disconnect", () => setIsOnline(false));
    
//     socket.on("receive_message", (incomingMsg) => {
//       if (incomingMsg.room_id === roomId || incomingMsg.chat_id === roomId) {
//         setMessages(prev => [...prev, incomingMsg]);
//       }
//     });
    
//     socket.on("user_typing", (data) => {
//       if (data.roomId === roomId && data.userId !== currentUser.id) {
//         const senderInfo = getSenderInfo(data.userId);
//         setUserTyping(senderInfo.name);
//         clearTimeout(typingTimeoutRef.current);
//         typingTimeoutRef.current = setTimeout(() => setUserTyping(null), 2000);
//       }
//     });
    
//     socket.on("message_updated", (data) => {
//       if (data.roomId === roomId) {
//         setMessages(prev => prev.map(msg => 
//           msg._id === data.messageId ? { ...msg, content: data.content } : msg
//         ));
//       }
//     });
    
//     socket.on("message_deleted", (data) => {
//       if (data.roomId === roomId) {
//         setMessages(prev => prev.filter(msg => msg._id !== data.messageId));
//       }
//     });
    
//     return socket;
//   };

//   // Send message
//   const sendMessage = () => {
//     if (!newMessage.trim() || !roomId) return;
    
//     const messageData = {
//       room_id: roomId,
//       sender_id: currentUser.id,
//       content: newMessage.trim(),
//       type: "text",
//       attachments: []
//     };
    
//     const socket = socketRef.current;
//     socket.emit("send_message", messageData);
    
//     // Optimistic update
//     const tempMessage = {
//       _id: `temp_${Date.now()}`,
//       ...messageData,
//       createdAt: new Date().toISOString(),
//       status: "sending"
//     };
    
//     setMessages(prev => [...prev, tempMessage]);
//     setNewMessage("");
    
//     socket.emit("stop_typing", { roomId, userId: currentUser.id });
//   };

//   // Update message
//   const updateMessage = (messageId) => {
//     if (!editContent.trim() || !roomId) return;
    
//     const socket = socketRef.current;
//     socket.emit("update_message", {
//       roomId,
//       messageId,
//       content: editContent.trim(),
//       userId: currentUser.id
//     });
    
//     // Optimistic update
//     setMessages(prev => prev.map(msg => 
//       msg._id === messageId ? { ...msg, content: editContent.trim() } : msg
//     ));
    
//     setEditingMessage(null);
//     setEditContent("");
//   };

//   // Delete message
//   const deleteMessage = (messageId) => {
//     if (!roomId) return;
    
//     const socket = socketRef.current;
//     socket.emit("delete_message", {
//       roomId,
//       messageId,
//       userId: currentUser.id
//     });
    
//     // Optimistic update
//     setMessages(prev => prev.filter(msg => msg._id !== messageId));
//     setActiveMessageMenu(null);
//   };

//   // Start editing
//   const startEditing = (message) => {
//     setEditingMessage(message._id);
//     setEditContent(message.content);
//     setActiveMessageMenu(null);
//   };

//   // Cancel editing
//   const cancelEditing = () => {
//     setEditingMessage(null);
//     setEditContent("");
//   };

//   // Handle file upload
//   const handleFileUpload = (fileType) => {
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = fileType === 'image' ? 'image/*' : 
//                   fileType === 'video' ? 'video/*' : 
//                   fileType === 'audio' ? 'audio/*' : 
//                   '.pdf,.doc,.docx,.txt';
    
//     input.onchange = async (e) => {
//       const file = e.target.files[0];
//       if (file && roomId) {
//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('room_id', roomId);
//         formData.append('sender_id', currentUser.id);
//         formData.append('type', fileType);
        
//         try {
//           const response = await axios.post('http://localhost:4000/api/upload', formData, {
//             headers: { 'Content-Type': 'multipart/form-data' }
//           });
          
//           if (response.data?.url) {
//             const messageData = {
//               room_id: roomId,
//               sender_id: currentUser.id,
//               content: `[${fileType.toUpperCase()}] ${file.name}`,
//               type: fileType,
//               attachments: [{ url: response.data.url, name: file.name, type: fileType }]
//             };
            
//             const socket = socketRef.current;
//             socket.emit("send_message", messageData);
            
//             const tempMsg = {
//               _id: `temp_file_${Date.now()}`,
//               ...messageData,
//               createdAt: new Date().toISOString(),
//               status: "sending"
//             };
            
//             setMessages(prev => [...prev, tempMsg]);
//           }
//         } catch (error) {
//           console.error("Upload failed:", error);
//           setError("Failed to upload file");
//         }
//       }
//     };
    
//     input.click();
//     setShowAttachmentMenu(false);
//   };

//   // Handle typing
//   const handleTyping = (e) => {
//     setNewMessage(e.target.value);
    
//     const socket = socketRef.current;
//     if (e.target.value.trim() && roomId) {
//       socket.emit("typing", { roomId, userId: currentUser.id });
//     } else if (roomId) {
//       socket.emit("stop_typing", { roomId, userId: currentUser.id });
//     }
//   };

//   // Key press handler
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       if (editingMessage) {
//         updateMessage(editingMessage);
//       } else {
//         sendMessage();
//       }
//     }
//   };

//   // Add reaction to message
//   const addReaction = (messageId, reaction) => {
//     setMessageReactions(prev => ({
//       ...prev,
//       [messageId]: [...(prev[messageId] || []), reaction]
//     }));
//   };

//   // Auto-scroll
//   useEffect(() => {
//     if (messages.length > 0) {
//       setTimeout(() => {
//         scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//       }, 100);
//     }
//   }, [messages]);

//   // Focus input on mount
//   useEffect(() => {
//     if (messageInputRef.current) {
//       messageInputRef.current.focus();
//     }
//   }, []);

//   // Initialize
//   useEffect(() => {
//     fetchRoomData();
    
//     const socket = setupSocket();
//     if (roomId) {
//       socket.emit("join_room", { roomId, userId: currentUser.id });
//     }
    
//     return () => {
//       if (roomId) {
//         socket.emit("leave_room", { roomId, userId: currentUser.id });
//       }
//       socket.off("connect");
//       socket.off("disconnect");
//       socket.off("receive_message");
//       socket.off("user_typing");
//       socket.off("message_updated");
//       socket.off("message_deleted");
      
//       if (typingTimeoutRef.current) {
//         clearTimeout(typingTimeoutRef.current);
//       }
//     };
//   }, [roomId]);

//   // Quick reactions
//   const quickReactions = [
//     { emoji: "👍", label: "thumbs up" },
//     { emoji: "❤️", label: "heart" },
//     { emoji: "😂", label: "laughing" },
//     { emoji: "😮", label: "wow" },
//     { emoji: "😢", label: "sad" },
//     { emoji: "🔥", label: "fire" },
//   ];

//   // If no roomId, show uninitialized chat
//   if (!roomId) {
//     return (
//       <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-gray-50 to-white">
//         <div className="flex-1 flex items-center justify-center p-8">
//           <div className="text-center max-w-md">
//             <div className="relative mb-8">
//               <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto shadow-lg">
//                 <FiMessageCircle className="w-16 h-16 text-indigo-400" />
//               </div>
//               <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
//                 <FiPlus className="w-5 h-5 text-white" />
//               </div>
//             </div>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
//               Start a Conversation
//             </h1>
//             <p className="text-gray-500 mb-8 text-lg">
//               Select a chat from the sidebar or create a new conversation to get started
//             </p>
//             <div className="flex gap-4 justify-center">
//               <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow">
//                 New Chat
//               </button>
//               <button className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-indigo-300 transition-colors">
//                 Create Group
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-white via-gray-50/50 to-white">
//       {/* Enhanced Chat Header */}
//       <div className="px-6 py-4 bg-white border-b border-gray-100 shadow-sm">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             {onBack && (
//               <button 
//                 onClick={onBack}
//                 className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
//                 style={{ color: theme.primary }}>
//                 <FiChevronLeft size={22} />
//               </button>
//             )}
            
//             <div className="relative">
//               <div className="w-14 h-14 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-indigo-100 to-purple-100">
//                 {renderProfile(
//                   getRoomProfile(),
//                   getInitials(getRoomName()),
//                   "w-full h-full"
//                 )}
//               </div>
//               <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
//             </div>
            
//             <div className="flex-1">
//               <div className="flex items-center gap-2">
//                 <h2 className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
//                   {getRoomName()}
//                 </h2>
//                 {roomDetails?.type === "group" && (
//                   <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg">
//                     Group
//                   </span>
//                 )}
//               </div>
//               <p className="text-sm flex items-center gap-2 text-gray-500">
//                 {userTyping ? (
//                   <span className="flex items-center gap-2 text-indigo-600 font-medium animate-pulse">
//                     <span className="flex gap-1">
//                       <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
//                       <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.1s' }}></span>
//                       <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.2s' }}></span>
//                     </span>
//                     {userTyping} is typing...
//                   </span>
//                 ) : (
//                   <span className="flex items-center gap-2">
//                     <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
//                     {roomDetails?.type === "group" ? 
//                       `${roomDetails.participants?.length || 0} members` : 
//                       isOnline ? "Online" : "Offline"}
//                   </span>
//                 )}
//               </p>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-2">
//             <button className="p-3.5 rounded-xl hover:bg-gray-100 transition-colors group relative">
//               <FiPhone size={20} className="text-gray-600 group-hover:text-indigo-600" />
//             </button>
//             <button className="p-3.5 rounded-xl hover:bg-gray-100 transition-colors group relative">
//               <FiVideo size={20} className="text-gray-600 group-hover:text-indigo-600" />
//             </button>
//             <button className="p-3.5 rounded-xl hover:bg-gray-100 transition-colors group relative">
//               <FiMoreVertical size={20} className="text-gray-600 group-hover:text-indigo-600" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Messages Container */}
//       <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white via-gray-50/30 to-white">
//         {isLoading ? (
//           <div className="h-full flex items-center justify-center">
//             <div className="text-center">
//               <div className="relative">
//                 <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-indigo-100 to-purple-100 animate-pulse mx-auto mb-4"></div>
//                 <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-pulse"></div>
//               </div>
//               <p className="text-gray-500 mt-4">Loading messages...</p>
//             </div>
//           </div>
//         ) : messages.length === 0 ? (
//           <div className="h-full flex flex-col items-center justify-center p-8">
//             <div className="relative mb-8">
//               <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center mx-auto shadow-xl">
//                 <div className="relative">
//                   <FiMessageCircle className="w-24 h-24 text-indigo-300" />
//                   <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
//                     <FiSend className="w-6 h-6 text-white" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
//               Start Your Conversation
//             </h3>
//             <p className="text-gray-500 text-lg max-w-md text-center mb-8">
//               No messages yet. Send your first message to begin chatting with {getRoomName()}
//             </p>
//             <button
//               onClick={() => setNewMessage("Hello! 👋 How are you doing?")}
//               className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 transform hover:-translate-y-0.5"
//             >
//               <FiMessageCircle className="inline mr-3" size={20} />
//               Say Hello!
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-1 p-6">
//             {messages.map((message, index) => {
//               const isOwn = message.sender_id === currentUser.id;
//               const senderInfo = getSenderInfo(message.sender_id);
//               const showDate = index === 0 || 
//                 formatDate(message.createdAt) !== formatDate(messages[index - 1]?.createdAt);

//               return (
//                 <div key={message._id || index} className="relative">
//                   {showDate && (
//                     <div className="sticky top-2 z-10 flex justify-center my-6">
//                       <div className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full text-sm font-medium text-gray-600 shadow-sm border border-gray-200">
//                         <FiCalendar className="inline mr-2" size={14} />
//                         {formatDate(message.createdAt)}
//                       </div>
//                     </div>
//                   )}
                  
//                   <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2 group`}>
//                     <div className={`flex items-end gap-3 max-w-[75%] ${isOwn ? "flex-row-reverse" : ""}`}>
                      
//                       {/* Profile with animation */}
//                       {!isOwn && (
//                         <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-md transition-transform group-hover:scale-105">
//                           {renderProfile(
//                             senderInfo.profile,
//                             senderInfo.avatar,
//                             "w-full h-full",
//                             isOwn
//                           )}
//                         </div>
//                       )}
                      
//                       {/* Message Content */}
//                       <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                        
//                         {/* Sender name in groups */}
//                         {!isOwn && roomDetails?.type === "group" && (
//                           <span className="text-xs font-medium mb-1.5 text-gray-500 px-2">
//                             {senderInfo.name}
//                           </span>
//                         )}
                        
//                         {/* Message bubble */}
//                         <div 
//                           className={`relative group/message px-5 py-3 rounded-2xl ${
//                             isOwn 
//                               ? "rounded-br-none bg-gradient-to-r from-indigo-500 to-purple-500 text-white" 
//                               : "rounded-bl-none bg-white text-gray-800 border border-gray-200"
//                           } shadow-md hover:shadow-lg transition-all duration-200`}
//                           onContextMenu={(e) => {
//                             e.preventDefault();
//                             setActiveMessageMenu(message._id);
//                           }}
//                         >
//                           {editingMessage === message._id ? (
//                             <div className="flex flex-col gap-3">
//                               <textarea
//                                 value={editContent}
//                                 onChange={(e) => setEditContent(e.target.value)}
//                                 className="w-full bg-white/10 backdrop-blur-sm resize-none outline-none rounded-lg p-3 text-sm"
//                                 rows={2}
//                                 autoFocus
//                                 style={{ color: isOwn ? 'white' : 'inherit' }}
//                               />
//                               <div className="flex justify-end gap-2">
//                                 <button 
//                                   onClick={cancelEditing}
//                                   className="p-2 rounded-lg hover:bg-white/20 transition-colors"
//                                 >
//                                   <FiX size={16} />
//                                 </button>
//                                 <button 
//                                   onClick={() => updateMessage(message._id)}
//                                   className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
//                                 >
//                                   <FiSave size={16} />
//                                 </button>
//                               </div>
//                             </div>
//                           ) : (
//                             <>
//                               <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                              
//                               {/* Quick reactions */}
//                               <div className={`flex gap-1 mt-3 opacity-0 group-hover/message:opacity-100 transition-opacity ${isOwn ? 'justify-end' : 'justify-start'}`}>
//                                 {quickReactions.map((reaction) => (
//                                   <button
//                                     key={reaction.emoji}
//                                     onClick={() => addReaction(message._id, reaction.emoji)}
//                                     className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center text-sm transition-transform hover:scale-125"
//                                   >
//                                     {reaction.emoji}
//                                   </button>
//                                 ))}
//                               </div>
                              
//                               {/* Existing reactions */}
//                               {messageReactions[message._id] && (
//                                 <div className={`flex gap-1 mt-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
//                                   {messageReactions[message._id].map((reaction, idx) => (
//                                     <span key={idx} className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
//                                       {reaction}
//                                     </span>
//                                   ))}
//                                 </div>
//                               )}
//                             </>
//                           )}
                          
//                           {/* Message actions menu */}
//                           {activeMessageMenu === message._id && (
//                             <div className={`absolute top-full mt-2 bg-white rounded-xl shadow-xl border z-20 min-w-[160px] ${
//                               isOwn ? "right-0" : "left-0"
//                             }`} style={{ borderColor: theme.lightGray }}>
//                               {isOwn && (
//                                 <button 
//                                   className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 w-full rounded-t-xl"
//                                   onClick={() => startEditing(message)}
//                                 >
//                                   <FiEdit2 size={14} /> Edit Message
//                                 </button>
//                               )}
//                               <button 
//                                 className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 w-full"
//                                 onClick={() => navigator.clipboard.writeText(message.content)}
//                               >
//                                 <FiCopy size={14} /> Copy Text
//                               </button>
//                               <button 
//                                 className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 w-full"
//                                 onClick={() => {/* Add to favorites */}}
//                               >
//                                 <FiStar size={14} /> Add to Favorites
//                               </button>
//                               {isOwn && (
//                                 <button 
//                                   className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-red-50 text-red-500 w-full rounded-b-xl border-t"
//                                   style={{ borderColor: theme.lightGray }}
//                                   onClick={() => deleteMessage(message._id)}
//                                 >
//                                   <FiTrash2 size={14} /> Delete Message
//                                 </button>
//                               )}
//                             </div>
//                           )}
                          
//                           {/* Message menu button */}
//                           <button
//                             onClick={() => setActiveMessageMenu(message._id)}
//                             className={`absolute top-2 opacity-0 group-hover/message:opacity-100 transition-opacity ${
//                               isOwn ? 'left-2' : 'right-2'
//                             } p-1.5 rounded-lg hover:bg-white/20`}
//                           >
//                             <BsThreeDotsVertical size={14} />
//                           </button>
//                         </div>
                        
//                         {/* Time and status */}
//                         <div className="flex items-center gap-2 mt-1.5 px-2">
//                           <span className="text-xs text-gray-400">
//                             {formatTime(message.createdAt)}
//                           </span>
//                           {isOwn && (
//                             <span className="text-xs">
//                               {message.status === "sending" ? (
//                                 <span className="text-gray-400">Sending...</span>
//                               ) : (
//                                 <FiCheckCircle size={12} className="text-green-500" />
//                               )}
//                             </span>
//                           )}
//                         </div>
//                       </div>
                      
//                       {/* Own profile */}
//                       {isOwn && (
//                         <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-md transition-transform group-hover:scale-105">
//                           {renderProfile(
//                             currentUser.profile,
//                             getInitials(currentUser.name),
//                             "w-full h-full",
//                             true
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//             <div ref={scrollRef} className="h-4" />
//           </div>
//         )}
//       </div>

//       {/* Enhanced Message Input */}
//       <div className="px-6 py-4 bg-white border-t border-gray-100 shadow-lg">
//         {showAttachmentMenu && (
//           <div className="absolute bottom-20 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-white rounded-2xl shadow-2xl border p-4 z-10 animate-in slide-in-from-bottom-5"
//             style={{ borderColor: theme.lightGray }}>
//             <div className="grid grid-cols-4 gap-3">
//               {[
//                 { type: 'image', icon: FiImage, label: 'Photo', color: 'from-blue-500 to-cyan-500' },
//                 { type: 'video', icon: FiVideo, label: 'Video', color: 'from-purple-500 to-pink-500' },
//                 { type: 'document', icon: FiFile, label: 'File', color: 'from-green-500 to-emerald-500' },
//                 { type: 'audio', icon: FiMic, label: 'Audio', color: 'from-orange-500 to-red-500' }
//               ].map((item) => (
//                 <button 
//                   key={item.type}
//                   className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:scale-105 group"
//                   onClick={() => handleFileUpload(item.type)}
//                 >
//                   <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-2 group-hover:shadow-lg`}>
//                     <item.icon size={20} className="text-white" />
//                   </div>
//                   <span className="text-xs font-medium text-gray-600">{item.label}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
        
//         <div className="flex items-center gap-3 p-2 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200 shadow-sm">
//           {/* Attachment button */}
//           <button 
//             className={`p-3.5 rounded-xl transition-all duration-200 ${showAttachmentMenu ? 'bg-indigo-50 text-indigo-600 rotate-45' : 'hover:bg-gray-100 text-gray-600'}`}
//             onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
//           >
//             <IoMdAttach size={22} />
//           </button>
          
//           {/* Message input */}
//           <div className="flex-1 relative">
//             <textarea
//               ref={messageInputRef}
//               value={newMessage}
//               onChange={handleTyping}
//               onKeyPress={handleKeyPress}
//               placeholder={`Message ${getRoomName()}...`}
//               className="w-full bg-transparent resize-none outline-none text-sm min-h-[48px] py-3 px-4 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
//               style={{ 
//                 color: theme.dark,
//               }}
//               rows="1"
//             />
//             {userTyping && (
//               <div className="absolute -top-6 left-0 text-xs text-indigo-600 font-medium animate-pulse">
//                 <span className="flex items-center gap-1">
//                   <span className="flex gap-0.5">
//                     <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce"></span>
//                     <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.1s' }}></span>
//                     <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.2s' }}></span>
//                   </span>
//                   {userTyping} is typing...
//                 </span>
//               </div>
//             )}
//           </div>
          
//           {/* Emoji button */}
//           <button className="p-3.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
//             <FiSmile size={22} />
//           </button>
          
//           {/* Send button */}
//           <button
//             onClick={sendMessage}
//             disabled={!newMessage.trim()}
//             className={`p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
//               newMessage.trim() 
//                 ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-lg hover:shadow-indigo-200 text-white' 
//                 : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//             }`}
//           >
//             <FiSend size={20} />
//           </button>
//         </div>
        
//         {/* Quick message suggestions */}
//         {!newMessage.trim() && (
//           <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
//             {["Hello! 👋", "How are you?", "Can we schedule a call?", "Thanks! 😊"].map((text) => (
//               <button
//                 key={text}
//                 onClick={() => setNewMessage(text)}
//                 className="px-3 py-1.5 text-xs bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-600 rounded-lg border border-gray-200 transition-all hover:scale-105 whitespace-nowrap"
//               >
//                 {text}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
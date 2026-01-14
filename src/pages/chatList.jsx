// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { FiSearch, FiPlus, FiMessageSquare, FiUser, FiChevronDown, FiChevronUp } from "react-icons/fi";

// export default function ChatList({
//   selectedChat,
//   onSelectRoom,
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
//   currentUserId = 22,
// }) {
//   // State management
//   const [rooms, setRooms] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState(null);
//   const [isLoadingRooms, setIsLoadingRooms] = useState(true);
//   const [error, setError] = useState(null);
//   const [uninitializedUsers, setUninitializedUsers] = useState([]);
//   const [isCreatingRoom, setIsCreatingRoom] = useState(false);
//   const [showAvailableUsers, setShowAvailableUsers] = useState(true);

//   // Mock data for testing (fallback)
//   const mockRooms = [
//     {
//       _id: "room1",
//       type: "private",
//       name: "",
//       avatar_url: "",
//       last_message: "Hey, how are you?",
//       participants: [
//         {
//           user_id: 12,
//           username: "john_doe",
//           name: "John Doe",
//           role: "admin",
//           avatar_url: "https://example.com/john.jpg",
//           status: "online"
//         },
//         {
//           user_id: 13,
//           username: "jane_smith",
//           name: "Jane Smith",
//           role: "user",
//           avatar_url: "https://example.com/jane.jpg",
//           status: "online"
//         }
//       ],
//       unread_counts: { 12: 0, 13: 0 },
//       updated_at: "2024-01-15T10:30:00Z"
//     },
//     {
//       _id: "room2",
//       type: "private",
//       name: "",
//       avatar_url: "",
//       last_message: "Meeting at 3 PM tomorrow",
//       participants: [
//         {
//           user_id: 12,
//           username: "john_doe",
//           name: "John Doe",
//           role: "admin",
//           avatar_url: "https://example.com/john.jpg",
//           status: "online"
//         },
//         {
//           user_id: 14,
//           username: "bob_wilson",
//           name: "Bob Wilson",
//           role: "user",
//           avatar_url: "https://example.com/bob.jpg",
//           status: "away"
//         }
//       ],
//       unread_counts: { 12: 3, 14: 0 },
//       updated_at: "2024-01-15T09:15:00Z"
//     },
//     {
//       _id: "room3",
//       type: "group",
//       name: "Project Team",
//       avatar_url: "https://example.com/team.jpg",
//       last_message: "Please review the latest changes",
//       participants: [
//         {
//           user_id: 12,
//           username: "john_doe",
//           name: "John Doe",
//           role: "admin",
//           avatar_url: "https://example.com/john.jpg",
//           status: "online"
//         },
//         {
//           user_id: 13,
//           username: "jane_smith",
//           name: "Jane Smith",
//           role: "user",
//           avatar_url: "https://example.com/jane.jpg",
//           status: "online"
//         },
//         {
//           user_id: 14,
//           username: "bob_wilson",
//           name: "Bob Wilson",
//           role: "user",
//           avatar_url: "https://example.com/bob.jpg",
//           status: "away"
//         },
//         {
//           user_id: 15,
//           username: "alice_johnson",
//           name: "Alice Johnson",
//           role: "user",
//           avatar_url: "https://example.com/alice.jpg",
//           status: "offline"
//         }
//       ],
//       unread_counts: { 12: 0, 13: 1, 14: 0, 15: 0 },
//       updated_at: "2024-01-15T11:45:00Z"
//     }
//   ];

//   // API: Fetch all chat rooms for the current user
//   const fetchRooms = async () => {
//     try {
//       setIsLoadingRooms(true);
//       setError(null);
      
//       console.log(`Fetching rooms for user: ${currentUserId}`);
      
//       const response = await axios.get(`http://localhost:4000/api/rooms/${currentUserId}`);
      
//       console.log("User Rooms API Response:", response.data);
      
//       let roomsData = [];
//       let uninitializedUsersData = [];
//       if (response.status === 200 && response.data) {
//         roomsData = response.data.data || [];
//         uninitializedUsersData = response.data.users || [];
//       }
      
//       console.log("Rooms data loaded:", roomsData.length, "rooms");
//       console.log("Available users:", uninitializedUsersData.length, "users");
//       setRooms(roomsData);
//       setUninitializedUsers(uninitializedUsersData);
      
//       // Auto-select first room if none selected and callback is provided
//       if (!selectedChat && roomsData.length > 0 && onSelectRoom) {
//         onSelectRoom(roomsData[0]._id);
//       }
      
//       return roomsData;
//     } catch (error) {
//       console.error("Failed to fetch user rooms:", error);
//       setError("Failed to load conversations. Using demo data.");
      
//       // Use mock data as fallback
//       setRooms(mockRooms);
//       setUninitializedUsers([]);
      
//       if (!selectedChat && mockRooms.length > 0 && onSelectRoom) {
//         onSelectRoom(mockRooms[0]._id);
//       }
      
//       return mockRooms;
//     } finally {
//       setIsLoadingRooms(false);
//     }
//   };

//   // API: Create a new chat room with a user
//   const createNewRoom = async (otherUserId, userData) => {
//     try {
//       setIsCreatingRoom(true);
      
//       console.log(`Creating room between ${currentUserId} and ${otherUserId}`);
      
//       const response = await axios.post("http://localhost:4000/api/rooms", {
//         user_ids: [currentUserId, otherUserId],
//         type: "private"
//       });
      
//       if (response.status === 200 || response.status === 201) {
//         console.log("Room created successfully:", response.data);
        
//         // Remove this user from uninitialized users
//         const updatedUninitialized = uninitializedUsers.filter(
//           user => user.userid !== otherUserId
//         );
//         setUninitializedUsers(updatedUninitialized);
        
//         // Add the new room to rooms list
//         const newRoom = {
//           _id: response.data._id || `temp_${Date.now()}`,
//           type: "private",
//           name: "",
//           avatar_url: "",
//           last_message: null,
//           participants: [
//             {
//               user_id: currentUserId,
//               username: `user_${currentUserId}`,
//               name: "You",
//               role: "user",
//               avatar_url: "",
//               status: "online"
//             },
//             {
//               user_id: otherUserId,
//               username: userData.username || `user_${otherUserId}`,
//               name: userData.name || `User ${otherUserId}`,
//               role: userData.role || "user",
//               avatar_url: userData.profile || "",
//               status: "offline"
//             }
//           ],
//           unread_counts: { [currentUserId]: 0, [otherUserId]: 0 },
//           updated_at: new Date().toISOString()
//         };
        
//         setRooms(prev => [newRoom, ...prev]);
        
//         // Select the new room
//         if (onSelectRoom) {
//           onSelectRoom(newRoom._id);
//         }
        
//         return newRoom;
//       }
//     } catch (error) {
//       console.error("Failed to create room:", error);
//       setError("Failed to start new conversation");
//       return null;
//     } finally {
//       setIsCreatingRoom(false);
//     }
//   };

//   // Load rooms on component mount
//   useEffect(() => {
//     fetchRooms();
//   }, [currentUserId]);

//   // Get friend's info from participants array for private chats
//   const getFriendInfo = (room) => {
//     if (!room || !room.participants || !Array.isArray(room.participants)) {
//       return null;
//     }
    
//     // Find the participant who is NOT the current user
//     const friend = room.participants.find(p => p.user_id !== currentUserId);
    
//     if (friend) {
//       const backend_domain_name = import.meta.env.VITE_BACKEND_DOMAIN_NAME || "";
//       const avatarUrl = friend.profile ? `${backend_domain_name}uploads/${friend.profile}` : null;
      
//       return {
//         id: friend.user_id,
//         name: friend.user_name || friend.name || `User ${friend.user_id}`,    
//         avatar: avatarUrl || friend.avatar_url,
//         role: friend.role || "user",
//         status: friend.status || "offline"
//       };
//     }
    
//     return null;
//   };

//   // Get room display name - shows friend's name for private chats, room name for groups
//   const getRoomDisplayName = (room) => {
//     if (!room) return "Unknown";
    
//     if (room.type === "private") {
//       const friend = getFriendInfo(room);
//       return friend?.name || "Private Chat";
//     }
    
//     // For group chats
//     return room.name || "Group Chat";
//   };

//   // Get room avatar - shows friend's avatar for private chats
//   const getRoomAvatar = (room) => {
//     if (!room) return "??";
    
//     if (room.type === "private") {
//       const friend = getFriendInfo(room);
//       if (friend?.avatar) {
//         return friend.avatar;
//       }
//       if (friend?.name) {
//         const nameParts = friend.name.split(' ');
//         if (nameParts.length >= 2) {
//           return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
//         }
//         return friend.name.slice(0, 2).toUpperCase();
//       }
//       return "??";
//     }
    
//     // For group chats
//     if (room.name) {
//       const nameParts = room.name.split(' ');
//       if (nameParts.length >= 2) {
//         return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
//       }
//       return room.name.slice(0, 2).toUpperCase();
//     }
    
//     return "GC";
//   };

//   // Get status for display (for initialized rooms)
//   const getRoomStatus = (room) => {
//     if (room.type === "private") {
//       const friend = getFriendInfo(room);
//       return friend?.status || "offline";
//     }
    
//     return "group";
//   };

//   // Get friend's role for display
//   const getFriendRole = (room) => {
//     if (room.type === "private") {
//       const friend = getFriendInfo(room);
//       return friend?.role || "";
//     }
    
//     return "";
//   };

//   // Get user avatar for uninitialized users
//   const getUserAvatar = (user) => {
//     if (user.profile) {
//       const backend_domain_name = import.meta.env.VITE_BACKEND_DOMAIN_NAME || "";
//       return `${backend_domain_name}uploads/${user.profile}`;
//     }
    
//     if (user.name) {
//       const nameParts = user.name.split(' ');
//       if (nameParts.length >= 2) {
//         return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
//       }
//       return user.name.slice(0, 2).toUpperCase();
//     }
    
//     return "??";
//   };

//   // Search functionality
//   const handleSearch = () => {
//     if (searchQuery.trim()) {
//       // Search in existing rooms
//       const roomResults = rooms.filter((room) => {
//         const searchTerm = searchQuery.toLowerCase();
        
//         // For private chats, search in friend's name
//         if (room.type === "private") {
//           const friend = getFriendInfo(room);
//           if (friend?.name?.toLowerCase().includes(searchTerm)) {
//             return true;
//           }
//         }
        
//         // Search in room name for all chats
//         if (room.name?.toLowerCase().includes(searchTerm)) {
//           return true;
//         }
        
//         // Search in last message
//         if (room.last_message?.toLowerCase().includes(searchTerm)) {
//           return true;
//         }
        
//         return false;
//       });

//       // Search in uninitialized users
//       const userResults = uninitializedUsers.filter((user) => {
//         const searchTerm = searchQuery.toLowerCase();
        
//         if (user.name?.toLowerCase().includes(searchTerm)) {
//           return true;
//         }
        
//         if (user.role?.toLowerCase().includes(searchTerm)) {
//           return true;
//         }
        
//         if (user.grade?.toString().includes(searchTerm)) {
//           return true;
//         }
        
//         return false;
//       });

//       setSearchResults({
//         rooms: roomResults,
//         users: userResults
//       });
//     }
//   };

//   const handleClearSearch = () => {
//     setSearchQuery("");
//     setSearchResults(null);
//   };

//   // Status color mapping
//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "online":
//         return theme.accent;
//       case "away":
//         return "#F39C12";
//       case "offline":
//         return theme.light;
//       case "group":
//         return theme.secondary;
//       case "available":
//         return theme.primary;
//       default:
//         return theme.light;
//     }
//   };

//   // Get status text for display
//   const getStatusText = (status) => {
//     switch (status?.toLowerCase()) {
//       case "online":
//         return "Online";
//       case "away":
//         return "Away";
//       case "offline":
//         return "Offline";
//       case "group":
//         return "Group";
//       case "available":
//         return "Available";
//       default:
//         return "Offline";
//     }
//   };

//   // Handle key press for search
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && searchQuery.trim()) {
//       handleSearch();
//     }
//   };

//   // Handle room selection
//   const handleRoomClick = (roomId) => {
//     if (onSelectRoom) {
//       onSelectRoom(roomId);
//     }
//     setSearchResults(null);
//     setSearchQuery("");
//   };

//   // Handle starting a new chat with uninitialized user
//   const handleStartNewChat = async (user) => {
//     if (isCreatingRoom) return;
    
//     await createNewRoom(user.userid, user);
//   };

//   // Toggle available users section
//   const toggleAvailableUsers = () => {
//     setShowAvailableUsers(!showAvailableUsers);
//   };

//   // Get display data based on search or normal mode
//   const displayData = searchResults !== null ? searchResults : {
//     rooms: rooms,
//     users: uninitializedUsers
//   };

//   return (
//     <div className="w-full md:w-80 border-r flex flex-col h-full" style={{ 
//       backgroundColor: theme.white, 
//       borderColor: theme.lightGray 
//     }}>
//       {/* Header */}
//       <div className="p-4 md:p-6 border-b flex-shrink-0" style={{ borderColor: theme.lightGray }}>
//         <div className="flex justify-between items-center mb-3 md:mb-4">
//           <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.dark }}>Messages</h1>
//           <button 
//             className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//             onClick={fetchRooms}
//             title="Refresh conversations"
//             aria-label="Refresh conversations"
//           >
//             <FiPlus size={18} style={{ color: theme.primary }} />
//           </button>
//         </div>

//         {error && (
//           <div className="mb-3 p-2 rounded text-xs" style={{ 
//             backgroundColor: "#FEF2F2", 
//             color: "#DC2626" 
//           }}>
//             {error}
//           </div>
//         )}

//         <div className="flex gap-2">
//           <div className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border flex-1"
//             style={{
//               backgroundColor: theme.background,
//               borderColor: theme.lightGray,
//             }}
//           >
//             <FiSearch size={14} style={{ color: theme.light }} />
//             <input
//               type="text"
//               placeholder="Search conversations or contacts..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="w-full bg-transparent text-xs md:text-sm outline-none"
//               style={{ color: theme.dark }}
//             />
//           </div>
//           {searchQuery.trim() && (
//             <button
//               onClick={handleSearch}
//               className="px-3 py-2 rounded-lg font-medium text-xs md:text-sm min-w-[60px] md:min-w-[70px]"
//               style={{
//                 backgroundColor: theme.primary,
//                 color: theme.white,
//               }}
//             >
//               Search
//             </button>
//           )}
//           {searchResults !== null && (
//             <button
//               onClick={handleClearSearch}
//               className="px-3 py-2 rounded-lg font-medium text-xs md:text-sm min-w-[60px] md:min-w-[70px]"
//               style={{
//                 backgroundColor: theme.lightGray,
//                 color: theme.dark,
//               }}
//             >
//               Clear
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Rooms List */}
//       <div className="flex-1 overflow-y-auto">
//         {isLoadingRooms ? (
//           <div className="flex items-center justify-center h-full">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2" style={{ borderColor: theme.primary }}></div>
//               <p style={{ color: theme.light }} className="text-sm">Loading conversations...</p>
//             </div>
//           </div>
//         ) : (
//           <>
//             {/* Search Results Header */}
//             {searchResults !== null && (
//               <div className="px-3 md:px-4 py-2 text-xs font-medium border-b" style={{ color: theme.light, borderColor: theme.lightGray }}>
//                 Found {displayData.rooms.length + displayData.users.length} result{(displayData.rooms.length + displayData.users.length) !== 1 ? "s" : ""}
//               </div>
//             )}

//             {/* Initialized Rooms Section */}
//             <div>
//               {displayData.rooms.length > 0 ? (
//                 <div className="px-3 md:px-4 py-2">
//                   <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.light }}>
//                     {searchResults !== null ? "Conversations" : "Active Chats"} ({displayData.rooms.length})
//                   </h3>
//                 </div>
//               ) : !searchResults && (
//                 <div className="flex flex-col items-center justify-center py-8 text-center">
//                   <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" 
//                     style={{ backgroundColor: theme.background }}>
//                     <FiMessageSquare size={24} style={{ color: theme.primary }} />
//                   </div>
//                   <p className="text-sm font-medium mb-1" style={{ color: theme.dark }}>No active conversations</p>
//                   <p className="text-xs" style={{ color: theme.light }}>Start chatting with someone below</p>
//                 </div>
//               )}
              
//               {/* First .map() for Initialized Rooms */}
//               {displayData.rooms.map((room) => {
//                 const displayName = getRoomDisplayName(room);
//                 const avatar = getRoomAvatar(room);
//                 const status = getRoomStatus(room);
//                 const statusColor = getStatusColor(status);
//                 const statusText = getStatusText(status);
//                 const friendRole = getFriendRole(room);
//                 const isGroup = room.type === "group";
//                 const participantCount = isGroup ? room.participants?.length || 0 : null;
//                 const isSelected = selectedChat === room._id;
                
//                 return (
//                   <div
//                     key={room._id}
//                     onClick={() => handleRoomClick(room._id)}
//                     className={`px-3 md:px-4 py-3 mx-2 md:mx-0 my-1 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 ${isSelected ? 'ring-2' : ''}`}
//                     style={{
//                       backgroundColor: isSelected ? "#F0FFFE" : theme.white,
//                       border: `1px solid ${isSelected ? theme.primary : theme.lightGray}`,
//                       boxShadow: isSelected ? `0 0 0 1px ${theme.primary}40` : '0 1px 2px rgba(0, 0, 0, 0.05)',
//                       borderLeft: isSelected ? `4px solid ${theme.primary}` : 'none',
//                     }}
//                   >
//                     <div className="flex items-center gap-3">
//                       {/* Avatar with status */}
//                       <div className="relative flex-shrink-0">
//                         <div
//                           className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-semibold text-white text-sm overflow-hidden"
//                           style={{ 
//                             backgroundColor: isGroup ? theme.secondary : theme.primary 
//                           }}
//                         >
//                           {avatar && typeof avatar === 'string' && avatar.startsWith('http') ? (
//                             <img 
//                               src={avatar}
//                               alt={displayName}
//                               className="w-full h-full object-cover"
//                               onError={(e) => {
//                                 e.target.style.display = 'none';
//                               }}
//                             />
//                           ) : (
//                             <span className="text-xs md:text-sm">{avatar || displayName?.slice(0, 2).toUpperCase() || "??"}</span>
//                           )}
//                         </div>
//                         {/* Status indicator */}
//                         <div
//                           className="absolute bottom-0 right-0 w-3 h-3 md:w-3.5 md:h-3.5 rounded-full border-2 flex items-center justify-center"
//                           style={{
//                             backgroundColor: statusColor,
//                             borderColor: theme.white,
//                             boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
//                           }}
//                         >
//                           {status === "group" && (
//                             <FiUser size={6} style={{ color: theme.white }} />
//                           )}
//                         </div>
//                       </div>

//                       {/* Room info */}
//                       <div className="flex-1 min-w-0">
//                         <div className="flex justify-between items-start mb-1">
//                           <div>
//                             <h3 className="font-semibold text-sm truncate" style={{ color: theme.dark }}>
//                               {displayName}
//                               {isGroup && participantCount > 0 && (
//                                 <span className="ml-1 text-xs font-normal" style={{ color: theme.light }}>
//                                   ({participantCount})
//                                 </span>
//                               )}
//                             </h3>
//                             <div className="flex items-center gap-2 mt-0.5">
//                               {friendRole && !isGroup && (
//                                 <span className="text-xs font-normal capitalize px-1.5 py-0.5 rounded"
//                                   style={{ 
//                                     backgroundColor: `${theme.primary}10`,
//                                     color: theme.primary
//                                   }}
//                                 >
//                                   {friendRole}
//                                 </span>
//                               )}
//                               {isGroup && (
//                                 <span className="text-xs font-normal capitalize px-1.5 py-0.5 rounded"
//                                   style={{ 
//                                     backgroundColor: `${theme.secondary}10`,
//                                     color: theme.secondary
//                                   }}
//                                 >
//                                   Group
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                           {/* Status and time display */}
//                           <div className="flex flex-col items-end gap-1">
//                             <span className="text-xs text-gray-500 whitespace-nowrap">
//                               {room.updated_at ? new Date(room.updated_at).toLocaleTimeString([], { 
//                                 hour: '2-digit', 
//                                 minute: '2-digit' 
//                               }) : ""}
//                             </span>
//                             <span className="text-xs font-medium whitespace-nowrap"
//                               style={{ color: statusColor }}
//                             >
//                               {statusText}
//                             </span>
//                           </div>
//                         </div>
                        
//                         <div className="flex justify-between items-center">
//                           <p className="text-xs text-gray-500 truncate">
//                             {room.last_message || "No messages yet"}
//                           </p>
                          
//                           {/* Unread indicator */}
//                           {room.unread_counts && room.unread_counts[currentUserId] > 0 && (
//                             <div className="flex-shrink-0 ml-2">
//                               <div className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs font-semibold"
//                                 style={{
//                                   backgroundColor: theme.primary,
//                                   color: theme.white,
//                                 }}
//                               >
//                                 {room.unread_counts[currentUserId] > 9 ? "9+" : room.unread_counts[currentUserId]}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Available Users Section (only in normal mode, not search) */}
//             {!searchResults && displayData.users.length > 0 && (
//               <div className="mt-4 border-t" style={{ borderColor: theme.lightGray }}>
//                 <div 
//                   className="px-3 md:px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
//                   onClick={toggleAvailableUsers}
//                   style={{ borderBottom: showAvailableUsers ? `1px solid ${theme.lightGray}` : 'none' }}
//                 >
//                   <div className="flex items-center gap-2">
//                     <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.light }}>
//                       Available Contacts ({displayData.users.length})
//                     </h3>
//                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }}></div>
//                   </div>
//                   <button className="p-1 rounded hover:bg-gray-100">
//                     {showAvailableUsers ? (
//                       <FiChevronUp size={16} style={{ color: theme.light }} />
//                     ) : (
//                       <FiChevronDown size={16} style={{ color: theme.light }} />
//                     )}
//                   </button>
//                 </div>
                
//                 {showAvailableUsers && (
//                   <div className="px-3 md:px-4 py-2">
//                     {/* Second .map() for Available Users */}
//                     {displayData.users.map((user, index) => {
//                       const displayName = user.name || `User ${user.userid}`;
//                       const avatar = getUserAvatar(user);
//                       const isAvatarUrl = typeof avatar === 'string' && avatar.startsWith('http');
//                       const status = "available";
//                       const statusColor = getStatusColor(status);
//                       const statusText = getStatusText(status);
                      
//                       return (
//                         <div
//                           key={`available_${user.userid || index}`}
//                           onClick={() => handleStartNewChat(user)}
//                           className={`px-3 md:px-4 py-3 mx-2 md:mx-0 my-1 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 ${isCreatingRoom ? 'opacity-70' : ''}`}
//                           style={{
//                             backgroundColor: theme.white,
//                             border: `1px solid ${theme.lightGray}`,
//                             boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
//                           }}
//                         >
//                           <div className="flex items-center gap-3">
//                             {/* Avatar with status */}
//                             <div className="relative flex-shrink-0">
//                               <div
//                                 className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-semibold text-white text-sm overflow-hidden"
//                                 style={{ 
//                                   backgroundColor: theme.secondary 
//                                 }}
//                               >
//                                 {isAvatarUrl ? (
//                                   <img 
//                                     src={avatar}
//                                     alt={displayName}
//                                     className="w-full h-full object-cover"
//                                     onError={(e) => {
//                                       e.target.style.display = 'none';
//                                     }}
//                                   />
//                                 ) : (
//                                   <span className="text-xs md:text-sm">{avatar}</span>
//                                 )}
//                               </div>
//                               {/* Status indicator */}
//                               <div
//                                 className="absolute bottom-0 right-0 w-3 h-3 md:w-3.5 md:h-3.5 rounded-full border-2 flex items-center justify-center"
//                                 style={{
//                                   backgroundColor: statusColor,
//                                   borderColor: theme.white,
//                                   boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
//                                 }}
//                               >
//                                 <FiPlus size={6} style={{ color: theme.white }} />
//                               </div>
//                             </div>

//                             {/* User info */}
//                             <div className="flex-1 min-w-0">
//                               <div className="flex justify-between items-start mb-1">
//                                 <div>
//                                   <h3 className="font-semibold text-sm truncate" style={{ color: theme.dark }}>
//                                     {displayName}
//                                   </h3>
//                                   <div className="flex items-center gap-2 mt-0.5">
//                                     <span className="text-xs font-normal capitalize px-1.5 py-0.5 rounded"
//                                       style={{ 
//                                         backgroundColor: `${theme.primary}10`,
//                                         color: theme.primary
//                                       }}
//                                     >
//                                       {user.role || "user"}
//                                     </span>
//                                     {user.grade && (
//                                       <span className="text-xs" style={{ color: theme.light }}>
//                                         • Grade {user.grade}
//                                       </span>
//                                     )}
//                                   </div>
//                                 </div>
//                                 {/* Status display */}
//                                 <div className="flex flex-col items-end gap-1">
//                                   <span className="text-xs font-medium whitespace-nowrap"
//                                     style={{ color: statusColor }}
//                                   >
//                                     {statusText}
//                                   </span>
//                                   {isCreatingRoom && (
//                                     <span className="text-xs italic" style={{ color: theme.light }}>
//                                       Creating...
//                                     </span>
//                                   )}
//                                 </div>
//                               </div>
                              
//                               <p className="text-xs text-gray-500 truncate mt-1">
//                                 Click to start chatting
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Search Results: Available Users Section */}
//             {searchResults !== null && displayData.users.length > 0 && (
//               <div className="mt-4 border-t" style={{ borderColor: theme.lightGray }}>
//                 <div className="px-3 md:px-4 py-2">
//                   <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.light }}>
//                     Available Contacts ({displayData.users.length})
//                   </h3>
//                 </div>
                
//                 {/* Second .map() for Available Users in Search Results */}
//                 {displayData.users.map((user, index) => {
//                   const displayName = user.name || `User ${user.userid}`;
//                   const avatar = getUserAvatar(user);
//                   const isAvatarUrl = typeof avatar === 'string' && avatar.startsWith('http');
//                   const status = "available";
//                   const statusColor = getStatusColor(status);
//                   const statusText = getStatusText(status);
                  
//                   return (
//                     <div
//                       key={`available_search_${user.userid || index}`}
//                       onClick={() => handleStartNewChat(user)}
//                       className={`px-3 md:px-4 py-3 mx-2 md:mx-0 my-1 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 ${isCreatingRoom ? 'opacity-70' : ''}`}
//                       style={{
//                         backgroundColor: theme.white,
//                         border: `1px solid ${theme.lightGray}`,
//                         boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
//                       }}
//                     >
//                       <div className="flex items-center gap-3">
//                         {/* Avatar with status */}
//                         <div className="relative flex-shrink-0">
//                           <div
//                             className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-semibold text-white text-sm overflow-hidden"
//                             style={{ 
//                               backgroundColor: theme.secondary 
//                             }}
//                           >
//                             {isAvatarUrl ? (
//                               <img 
//                                 src={avatar}
//                                 alt={displayName}
//                                 className="w-full h-full object-cover"
//                                 onError={(e) => {
//                                   e.target.style.display = 'none';
//                                 }}
//                               />
//                             ) : (
//                               <span className="text-xs md:text-sm">{avatar}</span>
//                             )}
//                           </div>
//                           {/* Status indicator */}
//                           <div
//                             className="absolute bottom-0 right-0 w-3 h-3 md:w-3.5 md:h-3.5 rounded-full border-2 flex items-center justify-center"
//                             style={{
//                               backgroundColor: statusColor,
//                               borderColor: theme.white,
//                               boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
//                             }}
//                           >
//                             <FiPlus size={6} style={{ color: theme.white }} />
//                           </div>
//                         </div>

//                         {/* User info */}
//                         <div className="flex-1 min-w-0">
//                           <div className="flex justify-between items-start mb-1">
//                             <div>
//                               <h3 className="font-semibold text-sm truncate" style={{ color: theme.dark }}>
//                                 {displayName}
//                               </h3>
//                               <div className="flex items-center gap-2 mt-0.5">
//                                 <span className="text-xs font-normal capitalize px-1.5 py-0.5 rounded"
//                                   style={{ 
//                                     backgroundColor: `${theme.primary}10`,
//                                     color: theme.primary
//                                   }}
//                                 >
//                                   {user.role || "user"}
//                                 </span>
//                                 {user.grade && (
//                                   <span className="text-xs" style={{ color: theme.light }}>
//                                     • Grade {user.grade}
//                                   </span>
//                                 )}
//                               </div>
//                             </div>
//                             {/* Status display */}
//                             <div className="flex flex-col items-end gap-1">
//                               <span className="text-xs font-medium whitespace-nowrap"
//                                 style={{ color: statusColor }}
//                               >
//                                 {statusText}
//                               </span>
//                               {isCreatingRoom && (
//                                 <span className="text-xs italic" style={{ color: theme.light }}>
//                                   Creating...
//                                 </span>
//                               )}
//                             </div>
//                           </div>
                          
//                           <p className="text-xs text-gray-500 truncate mt-1">
//                             Click to start chatting
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </>
//         )}
//       </div>


//     </div>
//   );
// }
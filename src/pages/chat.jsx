// "use client";

// import { useState } from "react";
// import ChatRoom from "./chatRoom";
// import ChatList from "./chatList";



// export default function chat() {
//   const [selectedChat, setSelectedChat] = useState(null);
//   const theme = {
//     primary: "#3FA7A3",
//     secondary: "#6C63FF",
//     accent: "#2ECC71",
//     dark: "#1E293B",
//     light: "#64748B",
//     background: "#F8FAFC",
//     white: "#FFFFFF",
//     lightGray: "#E2E8F0",
//   };

//   const currentUser = {
//     id: 22,
//     name: "You",
//     avatar: "YU"
//   };

//   return (
//     <div className="flex h-screen" style={{ backgroundColor: theme.background }}>
//       {/* ChatList (handles its own API) */}
//       <ChatList
//         selectedChat={selectedChat}
//         onSelectRoom={setSelectedChat}
//         theme={theme}
//         currentUserId={22}
//       />

//       {selectedChat ? (
//         <ChatRoom
//           roomId={selectedChat}
//           theme={theme}
//           currentUser={currentUser}
//           onBack={() => setSelectedChat(null)} // For mobile
//         />
//       ) : (
//         <div className="flex-1 hidden md:flex flex-col items-center justify-center">
//           <div className="text-center">
//             <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
//             <p className="text-sm text-gray-500">Choose a chat to start messaging</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useState } from "react";
import Sidebar from "./sideBar";
import TopBar from "./topBar";
import { Outlet } from "react-router-dom";

export default function NavBar({ userType }) {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const adminData = {
    name: "Kaung Khant Soe",
    userType: "Teacher",
  };
  const onLogout = () => {
    console.log("logging out");
  };
  return (
    <div className="flex" style={{ backgroundColor: "#d4d4d4" }}>
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userType={userType}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          adminData={adminData}
          onLogout={onLogout}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main
          className="flex-1 overflow-auto p-6"
          style={{ backgroundColor: "#F8FAFC" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

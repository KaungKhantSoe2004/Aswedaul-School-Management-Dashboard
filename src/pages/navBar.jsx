import { useEffect, useState } from "react";
import Sidebar from "./sideBar";
import TopBar from "./topBar";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { routeProtector } from "../assets/middleware";
import { useDispatch } from "react-redux";
import { removeProfile } from "../store/reducers/profileReducer";

// 🔹 Loading Indicator Component
const LoadingIndicator = ({ text = "ခဏစောင့်ပေးပါ..." }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900/10 backdrop-blur-sm z-50">
    <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 flex flex-col items-center max-w-xs w-full mx-4">
      {/* Spinner Container */}
      <div className="relative h-16 w-16 mb-4">
        {/* Background Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200/50"></div>
        
        {/* Animated Spinning Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        
        {/* Small inner pulse circle (Optional for extra detail) */}
        <div className="absolute inset-4 rounded-full bg-blue-100 animate-pulse"></div>
      </div>

      {/* Text with subtle animation */}
      <p className="text-gray-700 text-lg font-semibold tracking-wide animate-pulse">
        {text}
      </p>
    </div>
  </div>
);

export default function NavBar() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const backend_domain_name = import.meta.env.VITE_BACKEND_DOMAIN_NAME;
  const navigate = useNavigate();

  // 🔹 Logout
  const onLogout = async () => {
    alert("logged out");
    try {
      const res = await axios.post(
        `${backend_domain_name}api/user/logout`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        console.log(res, 'is response on loggin out')
        dispatch(removeProfile());
        navigate("/login");
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // 🔹 Auth check
  const fetchData = async () => {
    try {
      const data = await routeProtector();
      console.log(data, 'is data bro hehe')
      if (data.status === true) {
        setUserType(data.data.role);
        setUserData(data.data);
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Auth check failed", err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Show loader until auth completes
  if (loading) {
    return <LoadingIndicator text="Authenticating user..." />;
  }

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
          userData={userData}
          onLogout={onLogout}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main
          className="flex-1 overflow-auto p-6"
          style={{ backgroundColor: "#F8FAFC" }}
        >
          {/* 🔹 Pass data to child routes */}
          <Outlet context={{ userType, userData }} />
        </main>
      </div>
    </div>
  );
}

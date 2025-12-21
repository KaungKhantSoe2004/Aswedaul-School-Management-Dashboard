"use client";

import { useState } from "react";
import { FiLogOut, FiBell, FiMenu } from "react-icons/fi";

export default function TopBar({
  adminData,
  onLogout,
  sidebarOpen,
  setSidebarOpen,
}) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div
      className="px-6 py-4 flex items-center justify-between border-b shadow-sm"
      style={{ backgroundColor: "#ffffff", borderColor: "#d4d4d4" }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: "#666", backgroundColor: "#f5f5f5" }}
        >
          <FiMenu size={24} />
        </button>

        <div>
          <h3
            className="text-sm font-bold"
            style={{
              color: "#000",
              fontFamily: "'Bebas Neue', Arial, sans-serif",
            }}
          >
            School Administration
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "#999" }}>
            System Status: Online
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded-lg transition-all"
          style={{ color: "#999" }}
          title="Notifications"
        >
          <FiBell size={20} />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors border"
            style={{ backgroundColor: "#f5f5f5", borderColor: "#d4d4d4" }}
          >
            <img
              src={
                adminData?.avatar ||
                "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
              }
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <span
              className="text-sm font-medium hidden sm:block"
              style={{ color: "#000" }}
            >
              {adminData?.name || "Admin"}
            </span>
          </button>

          {showProfile && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border p-4 space-y-3 z-50"
              style={{ backgroundColor: "#ffffff", borderColor: "#d4d4d4" }}
            >
              <div
                className="flex items-center gap-3 pb-3 border-b"
                style={{ borderColor: "#d4d4d4" }}
              >
                <img
                  src={
                    adminData?.avatar ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#000" }}
                  >
                    {adminData?.name || "Admin"}
                  </p>
                  <p className="text-xs" style={{ color: "#999" }}>
                    {adminData?.email || "admin@test.com"}
                  </p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                style={{ backgroundColor: "#fee2e2", color: "#dc2626" }}
              >
                <FiLogOut size={16} />
                LOGOUT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

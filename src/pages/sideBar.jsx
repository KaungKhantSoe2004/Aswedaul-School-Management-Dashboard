"use client";

import { useEffect, useState } from "react";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import {
  FaChartBar,
  FaUsers,
  FaQuestionCircle,
  FaImages,
  FaCalendar,
  FaBook,
  FaDollarSign,
  FaComments,
  FaGraduationCap,
  FaMarker,
  FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

export default function Sidebar({
  currentPage,
  setCurrentPage,
  sidebarOpen,
  setSidebarOpen,
  userType,
}) {
  const [expandedDropdown, setExpandedDropdown] = useState(null);
  const navigate = useNavigate();
  const toggleDropdown = (dropdown) => {
    setExpandedDropdown(expandedDropdown === dropdown ? null : dropdown);
  };
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  // console.log(user);

  const teacherMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      link: "/",
      icon: FaChartBar,
      onClick: () => {
        setCurrentPage("dashboard");
        setExpandedDropdown(null);
      },
    },
    {
      id: "SubjectList",
      label: "SubjectList",
      link: "/teacher/subjectList",
      icon: FaChartBar,
      onClick: () => {
        setCurrentPage("SubjectList");
        setExpandedDropdown(null);
      },
    },
  ];
  const adminMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      link: "/",
      icon: FaChartBar,
      onClick: () => {
        setCurrentPage("dashboard");
        setExpandedDropdown(null);
      },
    },
    {
      id: "users",
      label: "Users",
      link: "/admin/users",
      icon: FaUsers,
      onClick: () => {
        setCurrentPage("users");
        setExpandedDropdown(null);
      },
    },
    {
      id: "faq",
      label: "FAQ",
      link: "/admin/faq",
      icon: FaQuestionCircle,
      onClick: () => {
        setCurrentPage("faq");
        setExpandedDropdown(null);
      },
    },
    {
      id: "activity",
      label: "Activity",
      link: "/admin/activities",
      icon: FaImages,
      onClick: () => {
        setCurrentPage("activity");
        setExpandedDropdown(null);
      },
    },
    {
      id: "gallery",
      label: "Gallery",
      link: "/admin/gallery",
      icon: FaImages,
      onClick: () => {
        setCurrentPage("gallery");
        setExpandedDropdown(null);
      },
    },
    // {
    //   id: "chat",
    //   label: "Messaging",
    //   link: "/admin/messenger",
    //   icon: FaComments,
    //   onClick: () => {
    //     setCurrentPage("chat");
    //     setExpandedDropdown(null);
    //   },
    // },
    {
      id: "grades",
      label: "Grades",
      link: "/admin/grade/:id",
      icon: FaBook,
      isDropdown: true,
    },
    {
      id: "financial",
      label: "Financial",
      link: "/admin/financial",
      icon: FaDollarSign,
      onClick: () => {
        setCurrentPage("financial");
        setExpandedDropdown(null);
      },
    },
  ];
  const studentMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      link: "/",
      icon: FaChartBar,
      onClick: () => {
        setCurrentPage("dashboard");
        setExpandedDropdown(null);
      },
    },
    {
      id: "Class",
      label: "Class",
      link: "/student/gradeEnv",
      icon: FaGraduationCap,
      onClick: () => {
        setCurrentPage("Class");
        setExpandedDropdown(null);
      },
    },
    {
      id: "Marks",
      label: "Marks",
      link: "/student/marks",
      icon: FaMarker,
      onClick: () => {
        setCurrentPage("Marks");
        setExpandedDropdown(null);
      },
    },
  ];
  const gradeManagerItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      link: "/",
      icon: FaChartBar,
      onClick: () => {
        setCurrentPage("dashboard");
        setExpandedDropdown(null);
      },
    },
    {
      id: "StudentsManagement",
      label: "StudentsManagement",
      link: "/gradeManager/studentManagement",
      icon: FaChartBar,
      onClick: () => {
        setCurrentPage("StudentsManagement");
        setExpandedDropdown(null);
      },
    },
    {
      id: "Admissions",
      label: "Admissions",
      link: "/gradeManager/admissions",
      icon: FaUser,
      onClick: () => {
        setCurrentPage("Admissions");
        setExpandedDropdown(null);
      },
    },
  ];
  const setMenu = () => {
    console.log(userType, 'is User type')
    if (userType == "teacher") {
      return teacherMenuItems;
    } else if (userType == "student") {
      return studentMenuItems;
    } else if (userType == "manager") {
      return gradeManagerItems;
    } else {
      return adminMenuItems;
    }
  };
  const [menuItems, setMenuItems] = useState(setMenu());
  useEffect(() => {}, []);
  return (
    <>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 text-white hover:opacity-90  duration-300"
        style={{
          backgroundColor: "#3FA7A3",
          border: "1px solid #2A8C88",
        }}
      >
        {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static w-64  transition-transform duration-300 z-40 overflow-y-auto border-r`}
        style={{
          backgroundColor: "#121212",
          borderColor: "#333333",
        }}
      >
        {/* Header */}
        <div
          className="p-6 border-b"
          style={{
            borderColor: "#333333",
            background: "linear-gradient(135deg, #121212 0%, #1a1a1a 100%)",
          }}
        >
          <h2
            className="text-2xl font-black tracking-wider"
            style={{
              color: "#FFFFFF",
              fontFamily: "'Orbitron', monospace",
              textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            SCHOOL ADMIN
          </h2>
          <p
            className="text-xs font-semibold mt-2 tracking-wider"
            style={{
              color: "#3FA7A3",
              letterSpacing: "2px",
            }}
          >
            MANAGEMENT SYSTEM
          </p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.isDropdown ? (
                <div>
                  <button
                    onClick={() => toggleDropdown("grades")}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium  duration-200 hover:scale-[1.02]"
                    style={{
                      backgroundColor:
                        expandedDropdown === "grades"
                          ? "#1E1E1E"
                          : "transparent",
                      color:
                        expandedDropdown === "grades" ? "#3FA7A3" : "#CCCCCC",
                      borderLeft:
                        expandedDropdown === "grades"
                          ? "4px solid #3FA7A3"
                          : "4px solid transparent",
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon
                        size={18}
                        style={{
                          color:
                            expandedDropdown === "grades"
                              ? "#3FA7A3"
                              : "#999999",
                        }}
                      />
                      {item.label}
                    </span>
                    <FiChevronDown
                      size={16}
                      style={{
                        color:
                          expandedDropdown === "grades" ? "#3FA7A3" : "#999999",
                      }}
                      className={`transition-transform duration-200 ${
                        expandedDropdown === "grades" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedDropdown === "grades" && (
                    <div
                      className="mt-1 ml-4 space-y-1 py-2 border-l"
                      style={{ borderColor: "#333333" }}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (grade) => (
                          <button
                            key={grade}
                            onClick={() => {
                              navigate(`/admin/grade/${grade}`);
                              setCurrentPage(`grade-${grade}`);
                              setSidebarOpen(false);
                            
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm transition-all duration-200 font-medium hover:scale-[1.02]"
                            style={{
                              backgroundColor:
                                currentPage === `grade-${grade}`
                                  ? "#3FA7A3"
                                  : "transparent",
                              color:
                                currentPage === `grade-${grade}`
                                  ? "#FFFFFF"
                                  : "#999999",
                              borderLeft:
                                currentPage === `grade-${grade}`
                                  ? "3px solid #FFFFFF"
                                  : "3px solid transparent",
                            }}
                          >
                            Grade {grade}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    item.onClick();
                    navigate(item.link);
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    backgroundColor:
                      currentPage === item.id ? "#1E1E1E" : "transparent",
                    color: currentPage === item.id ? "#3FA7A3" : "#CCCCCC",
                    borderLeft:
                      currentPage === item.id
                        ? "4px solid #3FA7A3"
                        : "4px solid transparent",
                  }}
                >
                  <item.icon
                    size={18}
                    style={{
                      color: currentPage === item.id ? "#3FA7A3" : "#999999",
                    }}
                  />
                  {item.label}
                </button>
              )}
            </div>
          ))}

        </nav>

        {/* Footer */}
        <div
          className="absolute bg-zinc-700 bottom-0 left-0 right-0 p-4 border-t"
          style={{
            borderColor: "#333333",
            // backgroundColor: "#1A1A1A",
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: "#2ECC71" }}
            />
            <p className="text-xs font-medium" style={{ color: "#999999" }}>
              System Online
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

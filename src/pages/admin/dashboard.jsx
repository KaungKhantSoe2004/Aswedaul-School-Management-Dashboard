"use client";

import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiUpload,
  FiSave,
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiBook,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const admin_backend_domain_name = import.meta.env.VITE_ADMIN_BACKEND_DOMAIN_NAME;
  const [notices, setNotices] = useState([]);
  const navigate = useNavigate();
  const [newNotice, setNewNotice] = useState("");
  const [editingNotice, setEditingNotice] = useState(null);
  const [editNoticeText, setEditNoticeText] = useState("");
  const [schoolLogo, setSchoolLogo] = useState("/default-logo.png");
  const [schoolName, setSchoolName] = useState("Bright Future Academy");
  const [isEditingSchoolName, setIsEditingSchoolName] = useState(false);
  const [tempSchoolName, setTempSchoolName] = useState("");

  // School theme colors
  const schoolTheme = {
    primary: "#3FA7A3", // Teal
    secondary: "#6C63FF", // Purple
    accent: "#2ECC71", // Green
    dark: "#1E293B",
    light: "#64748B",
    background: "#F8FAFC",
    white: "#FFFFFF",
  };

  // Statistics data
  const statsData = useMemo(
    () => [
      {
        id: 1,
        label: "Total Students",
        value: "1,847",
        icon: FiUsers,
        color: schoolTheme.primary,
        change: "+5.2%",
      },
      {
        id: 2,
        label: "Total Teachers",
        value: "124",
        icon: FiBook,
        color: schoolTheme.secondary,
        change: "+2.1%",
      },
      {
        id: 3,
        label: "Attendance Rate",
        value: "94.3%",
        icon: FiTrendingUp,
        color: schoolTheme.accent,
        change: "+1.8%",
      },
      {
        id: 4,
        label: "Revenue",
        value: "$284,500",
        icon: FiDollarSign,
        color: "#E74C3C",
        change: "+12.7%",
      },
    ],
    [schoolTheme]
  );

  // Recent students data for table
  const recentStudents = useMemo(
    () => [
      {
        id: 1,
        name: "John Smith",
        grade: "Grade 10",
        email: "john.s@school.edu",
        status: "Active",
        joinDate: "2024-09-15",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        grade: "Grade 11",
        email: "sarah.j@school.edu",
        status: "Active",
        joinDate: "2024-09-10",
      },
      {
        id: 3,
        name: "Michael Brown",
        grade: "Grade 9",
        email: "michael.b@school.edu",
        status: "Pending",
        joinDate: "2024-09-20",
      },
      {
        id: 4,
        name: "Emily Davis",
        grade: "Grade 12",
        email: "emily.d@school.edu",
        status: "Active",
        joinDate: "2024-08-28",
      },
      {
        id: 5,
        name: "David Wilson",
        grade: "Grade 8",
        email: "david.w@school.edu",
        status: "Inactive",
        joinDate: "2024-09-05",
      },
    ],
    []
  );

  // Performance data for chart table
  const performanceData = useMemo(
    () => [
      {
        subject: "Mathematics",
        average: 85,
        topScore: 98,
        improvement: "+5.2%",
      },
      { subject: "Science", average: 78, topScore: 95, improvement: "+3.8%" },
      { subject: "English", average: 82, topScore: 96, improvement: "+4.1%" },
      { subject: "History", average: 75, topScore: 92, improvement: "+2.9%" },
      { subject: "Art", average: 88, topScore: 100, improvement: "+6.7%" },
    ],
    []
  );

  // Move impure random data generation to useMemo
  const gradeData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      studentCount: Math.floor(Math.random() * 200) + 50,
      teacherCount: Math.floor(Math.random() * 15) + 5,
      guideTeacherCount: Math.floor(Math.random() * 3) + 1,
      managerCount: Math.floor(Math.random() * 2) + 1,
    }));
  }, []);

const fetchData = async()=> {
 try{
  const response = await axios.get(`${admin_backend_domain_name}api/admin/directDashboard`, {
    withCredentials: true
  });
  console.log(response.data, 'is response data bro ');
  if(response.status == 200){
     setNotices(response.data.data)
  }


}catch(err){

    console.log("in error happending")
    if(err.response.status == 401){
      navigate('/login')
      return
    }
    console.log(err.response.data.message)

}
  
}
  useEffect(() => {
     fetchData()
  }, []);

  // Notice Board Functions
  const addNotice = () => {
    if (newNotice.trim()) {
      const notice = {
        id: Date.now(),
        text: newNotice,
        date: new Date().toISOString().split("T")[0],
      };
      setNotices([notice, ...notices]);
      setNewNotice("");
    }
  };

  const startEditNotice = (notice) => {
    setEditingNotice(notice.id);
    setEditNoticeText(notice.text);
  };

  const saveEditNotice = () => {
    setNotices(
      notices.map((notice) =>
        notice.id === editingNotice
          ? { ...notice, text: editNoticeText }
          : notice
      )
    );
    setEditingNotice(null);
    setEditNoticeText("");
  };

  const deleteNotice = (id) => {
    setNotices(notices.filter((notice) => notice.id !== id));
  };

  // School Info Functions
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSchoolLogo(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditSchoolName = () => {
    setTempSchoolName(schoolName);
    setIsEditingSchoolName(true);
  };

  const saveSchoolName = () => {
    setSchoolName(tempSchoolName);
    setIsEditingSchoolName(false);
  };

  const cancelEditSchoolName = () => {
    setIsEditingSchoolName(false);
    setTempSchoolName("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return schoolTheme.accent;
      case "Pending":
        return "#F39C12";
      case "Inactive":
        return "#E74C3C";
      default:
        return schoolTheme.secondary;
    }
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: schoolTheme.background,
      }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: schoolTheme.dark }}
            >
              Admin Dashboard
            </h1>
            <p className="text-sm" style={{ color: schoolTheme.light }}>
              Welcome to your management dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat) => (
            <div
              key={stat.id}
              className="p-6 transition-all duration-300 hover:scale-105 shadow-md border hover:shadow-lg rounded-lg"
              style={{
                backgroundColor: schoolTheme.white,
                borderColor: "#E2E8F0",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-sm font-medium mb-2"
                    style={{ color: schoolTheme.light }}
                  >
                    {stat.label}
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: schoolTheme.dark }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-xs mt-1 font-medium"
                    style={{ color: stat.color }}
                  >
                    {stat.change}
                  </p>
                </div>
                <div
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: stat.color + "15",
                    border: `1px solid ${stat.color}30`,
                  }}
                >
                  <stat.icon size={24} style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notice Board Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2
            className="text-2xl font-semibold"
            style={{ color: schoolTheme.dark }}
          >
            Notice Board
          </h2>
          <button
            onClick={addNotice}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 border rounded-lg"
            style={{
              backgroundColor: schoolTheme.primary,
              color: schoolTheme.white,
              borderColor: schoolTheme.primary,
              boxShadow: "0 2px 4px rgba(63, 167, 163, 0.2)",
            }}
          >
            <FiPlus size={16} />
            Add Notice
          </button>
        </div>

        {/* Add Notice Input */}
        <div
          className="mb-6 p-6 border shadow-sm rounded-lg"
          style={{
            backgroundColor: schoolTheme.white,
            borderColor: "#E2E8F0",
            borderLeft: `4px solid ${schoolTheme.primary}`,
          }}
        >
          <textarea
            value={newNotice}
            onChange={(e) => setNewNotice(e.target.value)}
            placeholder="Type your notice here..."
            className="w-full p-4 border placeholder-gray-400 rounded"
            style={{
              backgroundColor: schoolTheme.background,
              borderColor: "#E2E8F0",
              color: schoolTheme.dark,
            }}
            rows="3"
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={addNotice}
              className="px-6 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 border rounded-lg flex items-center gap-2"
              style={{
                backgroundColor: schoolTheme.primary,
                color: schoolTheme.white,
                borderColor: schoolTheme.primary,
                boxShadow: "0 2px 4px rgba(63, 167, 163, 0.2)",
              }}
            >
              <FiPlus size={12} />
              Post Notice
            </button>
          </div>
        </div>

        {/* Notices List */}
        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="p-6 border transition-all duration-200 hover:scale-[1.01] shadow-sm rounded-lg"
              style={{
                backgroundColor: schoolTheme.white,
                borderColor: "#E2E8F0",
                borderLeft: `4px solid ${schoolTheme.primary}`,
              }}
            >
              <div className="flex justify-between items-start">
                {editingNotice === notice.id ? (
                  <div className="flex-1">
                    <textarea
                      value={editNoticeText}
                      onChange={(e) => setEditNoticeText(e.target.value)}
                      className="w-full p-3 mb-3 border rounded"
                      style={{
                        backgroundColor: schoolTheme.background,
                        borderColor: "#E2E8F0",
                        color: schoolTheme.dark,
                      }}
                      rows="2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveEditNotice}
                        className="flex items-center gap-1 px-4 py-2 text-sm transition-all duration-200 hover:scale-105 border rounded-lg"
                        style={{
                          backgroundColor: schoolTheme.primary,
                          color: schoolTheme.white,
                          borderColor: schoolTheme.primary,
                        }}
                      >
                        <FiSave size={14} />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingNotice(null)}
                        className="px-4 py-2 text-sm transition-all duration-200 hover:scale-105 border rounded-lg"
                        style={{
                          backgroundColor: schoolTheme.light,
                          color: schoolTheme.white,
                          borderColor: schoolTheme.light,
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="mb-2" style={{ color: schoolTheme.dark }}>
                        {notice.text}
                      </p>
                      <p
                        className="text-sm flex items-center gap-2"
                        style={{ color: schoolTheme.light }}
                      >
                        <FiBook size={10} />
                        {notice.date}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditNotice(notice)}
                        className="p-2 transition-all duration-200 hover:scale-110 border rounded-lg"
                        style={{
                          color: schoolTheme.primary,
                          backgroundColor: schoolTheme.background,
                          borderColor: schoolTheme.primary,
                        }}
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => deleteNotice(notice.id)}
                        className="p-2 transition-all duration-200 hover:scale-110 border rounded-lg"
                        style={{
                          color: "#E74C3C",
                          backgroundColor: "#FEF2F2",
                          borderColor: "#E74C3C",
                        }}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Charts and Tables Section */}
      <section className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students Table */}
        <div
          className="border shadow-sm overflow-hidden rounded-lg"
          style={{
            backgroundColor: schoolTheme.white,
            borderColor: "#E2E8F0",
          }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center gap-2">
              <FiBook style={{ color: schoolTheme.secondary }} size={18} />
              <h3
                className="text-lg font-semibold"
                style={{ color: schoolTheme.dark }}
              >
                Recent Students
              </h3>
            </div>
            <p className="text-sm mt-1" style={{ color: schoolTheme.light }}>
              Newly registered students
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  style={{
                    backgroundColor: schoolTheme.background,
                  }}
                >
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                    style={{ color: schoolTheme.light, borderColor: "#E2E8F0" }}
                  >
                    Name
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                    style={{ color: schoolTheme.light, borderColor: "#E2E8F0" }}
                  >
                    Grade
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                    style={{ color: schoolTheme.light, borderColor: "#E2E8F0" }}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                    style={{ color: schoolTheme.light, borderColor: "#E2E8F0" }}
                  >
                    Join Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="transition-colors duration-200 hover:bg-gray-50"
                  >
                    <td
                      className="px-6 py-4 whitespace-nowrap border"
                      style={{ borderColor: "#E2E8F0" }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-gray-300 rounded" />
                        <div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: schoolTheme.dark }}
                          >
                            {student.name}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: schoolTheme.light }}
                          >
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm border"
                      style={{
                        borderColor: "#E2E8F0",
                        color: schoolTheme.dark,
                      }}
                    >
                      {student.grade}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap border"
                      style={{ borderColor: "#E2E8F0" }}
                    >
                      <span
                        className="inline-flex items-center px-3 py-1 text-xs font-medium border rounded-full"
                        style={{
                          backgroundColor:
                            getStatusColor(student.status) + "15",
                          color: getStatusColor(student.status),
                          borderColor: getStatusColor(student.status),
                        }}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm border"
                      style={{
                        borderColor: "#E2E8F0",
                        color: schoolTheme.light,
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-300 rounded-full" />
                        {student.joinDate}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Chart Table */}
        <div
          className="border shadow-sm overflow-hidden rounded-lg"
          style={{
            backgroundColor: schoolTheme.white,
            borderColor: "#E2E8F0",
          }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center gap-2">
              <FiBook style={{ color: schoolTheme.accent }} size={18} />
              <h3
                className="text-lg font-semibold"
                style={{ color: schoolTheme.dark }}
              >
                Subject Performance
              </h3>
            </div>
            <p className="text-sm mt-1" style={{ color: schoolTheme.light }}>
              Average scores and improvements
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  style={{
                    backgroundColor: schoolTheme.background,
                  }}
                >
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                    style={{ color: schoolTheme.light, borderColor: "#E2E8F0" }}
                  >
                    Subject
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                    style={{ color: schoolTheme.light, borderColor: "#E2E8F0" }}
                  >
                    Average
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                    style={{ color: schoolTheme.light, borderColor: "#E2E8F0" }}
                  >
                    Top Score
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                    style={{ color: schoolTheme.light, borderColor: "#E2E8F0" }}
                  >
                    Improvement
                  </th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((subject, index) => (
                  <tr
                    key={index}
                    className="transition-colors duration-200 hover:bg-gray-50"
                  >
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium border"
                      style={{
                        borderColor: "#E2E8F0",
                        color: schoolTheme.dark,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-gray-300 rounded" />
                        {subject.subject}
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap border"
                      style={{ borderColor: "#E2E8F0" }}
                    >
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 h-2 mr-3 rounded-full overflow-hidden">
                          <div
                            className="h-2"
                            style={{
                              width: `${subject.average}%`,
                              backgroundColor:
                                subject.average >= 80
                                  ? schoolTheme.accent
                                  : subject.average >= 70
                                  ? "#F39C12"
                                  : "#E74C3C",
                            }}
                          />
                        </div>
                        <span
                          className="text-sm font-medium"
                          style={{ color: schoolTheme.dark }}
                        >
                          {subject.average}%
                        </span>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium border"
                      style={{
                        borderColor: "#E2E8F0",
                        color: schoolTheme.dark,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-300 rounded-full" />
                        {subject.topScore}%
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap border"
                      style={{ borderColor: "#E2E8F0" }}
                    >
                      <span
                        className="text-sm font-medium flex items-center gap-2"
                        style={{
                          color: subject.improvement.startsWith("+")
                            ? schoolTheme.accent
                            : "#E74C3C",
                        }}
                      >
                        <div className="w-1 h-3 bg-gray-300 rounded" />
                        {subject.improvement}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Grades Overview Section */}
      <section className="mb-8">
        <h2
          className="text-2xl font-semibold mb-6 flex items-center gap-2"
          style={{ color: schoolTheme.dark }}
        >
          <FiBook />
          Grades Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {gradeData.map((grade) => (
            <div
              key={grade.id}
              className="p-6 border transition-all duration-300 hover:scale-105 shadow-md rounded-lg"
              style={{
                backgroundColor: schoolTheme.white,
                borderColor: "#E2E8F0",
              }}
            >
              <h3
                className="text-xl font-bold mb-5 text-center flex items-center justify-center gap-2"
                style={{ color: schoolTheme.dark }}
              >
                <FiBook size={16} style={{ color: schoolTheme.primary }} />
                Grade {grade.id}
                <FiBook size={16} style={{ color: schoolTheme.primary }} />
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span
                    className="text-sm flex items-center gap-1"
                    style={{ color: schoolTheme.light }}
                  >
                    <div className="w-1 h-3 bg-gray-300 rounded" />
                    Students:
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: schoolTheme.dark }}
                  >
                    {grade.studentCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className="text-sm flex items-center gap-1"
                    style={{ color: schoolTheme.light }}
                  >
                    <div className="w-1 h-3 bg-gray-300 rounded" />
                    Teachers:
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: schoolTheme.dark }}
                  >
                    {grade.teacherCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className="text-sm flex items-center gap-1"
                    style={{ color: schoolTheme.light }}
                  >
                    <div className="w-1 h-3 bg-gray-300 rounded" />
                    Guide Teachers:
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: schoolTheme.dark }}
                  >
                    {grade.guideTeacherCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className="text-sm flex items-center gap-1"
                    style={{ color: schoolTheme.light }}
                  >
                    <div className="w-1 h-3 bg-gray-300 rounded" />
                    Managers:
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: schoolTheme.dark }}
                  >
                    {grade.managerCount}
                  </span>
                </div>
              </div>

              <button
                className="w-full mt-6 py-3 text-sm font-medium transition-all duration-200 hover:scale-105 border rounded-lg flex items-center justify-center gap-2"
                style={{
                  backgroundColor: schoolTheme.primary,
                  color: schoolTheme.white,
                  borderColor: schoolTheme.primary,
                  boxShadow: "0 2px 4px rgba(63, 167, 163, 0.2)",
                }}
              >
                <FiBook size={12} />
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* School Information Section */}
      <section>
        <div
          className="p-8 border shadow-lg rounded-lg"
          style={{
            backgroundColor: schoolTheme.white,
            borderColor: "#E2E8F0",
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo Section */}
            <div className="flex flex-col items-center">
              <div
                className="relative group border-4 rounded-lg overflow-hidden"
                style={{ borderColor: schoolTheme.primary }}
              >
                <img
                  src={schoolLogo}
                  alt="School Logo"
                  className="w-40 h-40 object-cover"
                />
                <label
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  style={{
                    backgroundColor: schoolTheme.primary + "DD",
                    border: `4px solid ${schoolTheme.primary}`,
                  }}
                >
                  <FiUpload size={28} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <span
                className="text-sm mt-3 flex items-center gap-2"
                style={{ color: schoolTheme.light }}
              >
                <FiBook size={12} />
                Click to upload new logo
              </span>
            </div>

            {/* School Name Section */}
            <div className="flex-1 text-center md:text-left">
              {isEditingSchoolName ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={tempSchoolName}
                    onChange={(e) => setTempSchoolName(e.target.value)}
                    className="w-full p-4 text-3xl font-bold text-center border rounded-lg"
                    style={{
                      backgroundColor: schoolTheme.background,
                      borderColor: "#E2E8F0",
                      color: schoolTheme.dark,
                    }}
                  />
                  <div className="flex gap-3 justify-center md:justify-start">
                    <button
                      onClick={saveSchoolName}
                      className="flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 hover:scale-105 border rounded-lg"
                      style={{
                        backgroundColor: schoolTheme.primary,
                        color: schoolTheme.white,
                        borderColor: schoolTheme.primary,
                        boxShadow: "0 2px 4px rgba(63, 167, 163, 0.2)",
                      }}
                    >
                      <FiSave size={16} />
                      Save
                    </button>
                    <button
                      onClick={cancelEditSchoolName}
                      className="px-6 py-3 text-sm font-medium transition-all duration-200 hover:scale-105 border rounded-lg"
                      style={{
                        backgroundColor: schoolTheme.light,
                        color: schoolTheme.white,
                        borderColor: schoolTheme.light,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2
                    className="text-4xl font-bold flex items-center gap-3 justify-center md:justify-start"
                    style={{ color: schoolTheme.dark }}
                  >
                    <FiBook style={{ color: schoolTheme.primary }} />
                    {schoolName}
                    <FiBook style={{ color: schoolTheme.primary }} />
                  </h2>
                  <button
                    onClick={startEditSchoolName}
                    className="flex items-center gap-2 mx-auto md:mx-0 px-6 py-3 text-sm font-medium transition-all duration-200 hover:scale-105 border rounded-lg"
                    style={{
                      backgroundColor: schoolTheme.primary,
                      color: schoolTheme.white,
                      borderColor: schoolTheme.primary,
                      boxShadow: "0 2px 4px rgba(63, 167, 163, 0.2)",
                    }}
                  >
                    <FiEdit size={16} />
                    Edit School Name
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

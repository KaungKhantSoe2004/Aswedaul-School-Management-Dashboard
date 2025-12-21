"use client";

import { useState, useEffect } from "react";
import {
  FiBook,
  FiDollarSign,
  FiUser,
  FiCalendar,
  FiUsers,
  FiBell,
  FiEdit,
  FiTrash2,
  FiBookOpen,
} from "react-icons/fi";

export default function TeacherDashboard() {
  // Theme colors
  const theme = {
    primary: "#3FA7A3",
    primaryLight: "#7EC4C1",
    primaryDark: "#2D8B87",
    primaryBg: "#E8F6F5",

    accent: "#2ECC71",
    warning: "#F39C12",
    danger: "#E74C3C",

    dark: "#1E293B",
    light: "#64748B",
    lighter: "#94A3B8",
    background: "#F8FAFC",
    white: "#FFFFFF",
    border: "#E2E8F0",
  };

  // Teacher Profile
  const [teacherProfile, setTeacherProfile] = useState({
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@school.edu",
    phone: "+1 (555) 123-4567",
    employeeId: "TCH2024001",
    designation: "Senior Teacher",
    department: "Science",
    joinDate: "2020-03-15",
    experience: "4 years",
    qualification: "M.Sc. Physics, B.Ed.",
  });

  // Assigned Subjects
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: "Physics",
      code: "PHY101",
      class: "Grade 10",
      section: "A, B",
      students: 45,
      schedule: "Mon, Wed 9-10 AM",
    },
    {
      id: 2,
      name: "Chemistry",
      code: "CHE101",
      class: "Grade 10",
      section: "C",
      students: 22,
      schedule: "Tue, Thu 10-11 AM",
    },
    {
      id: 3,
      name: "Science Lab",
      code: "SCI102",
      class: "Grade 10",
      section: "A, B, C",
      students: 67,
      schedule: "Fri 2-4 PM",
    },
  ]);

  // Notice Board (Read-only display)
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: "Monthly Staff Meeting",
      content: "All teaching staff are required to attend the monthly meeting on Friday, December 15th at 3 PM in the conference room.",
      date: "Dec 5, 2024",
      priority: "high",
    },
    {
      id: 2,
      title: "Exam Schedule Update",
      content: "Final exam schedule has been updated. Please check the portal for the latest timetable.",
      date: "Dec 3, 2024",
      priority: "medium",
    },
    {
      id: 3,
      title: "Professional Development Workshop",
      content: "Register for the upcoming STEM teaching workshop scheduled for December 20th.",
      date: "Dec 1, 2024",
      priority: "low",
    },
    {
      id: 4,
      title: "Holiday Announcement",
      content: "Winter break will be from December 24th to January 2nd. School reopens on January 3rd.",
      date: "Nov 28, 2024",
      priority: "medium",
    },
  ]);

  // Salary Information
  const [salaryData, setSalaryData] = useState([
    { month: "Jan", amount: 4500, status: "paid" },
    { month: "Feb", amount: 4500, status: "paid" },
    { month: "Mar", amount: 4500, status: "paid" },
    { month: "Apr", amount: 4500, status: "paid" },
    { month: "May", amount: 4500, status: "paid" },
    { month: "Jun", amount: 4500, status: "paid" },
    { month: "Jul", amount: 4500, status: "paid" },
    { month: "Aug", amount: 4700, status: "paid" },
    { month: "Sep", amount: 4700, status: "paid" },
    { month: "Oct", amount: 4700, status: "paid" },
    { month: "Nov", amount: 4700, status: "paid" },
    { month: "Dec", amount: 4700, status: "pending" },
  ]);

  // Current month for salary
  const currentMonth = new Date().toLocaleString("default", { month: "short" });
  const currentSalary = salaryData.find((s) => s.month === currentMonth) || salaryData[salaryData.length - 1];

  // Quick Stats
  const quickStats = {
    totalStudents: subjects.reduce((sum, sub) => sum + sub.students, 0),
    totalClasses: subjects.length,
    currentSalary: currentSalary.amount,
    salaryStatus: currentSalary.status,
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return theme.danger;
      case "medium": return theme.warning;
      case "low": return theme.accent;
      default: return theme.primary;
    }
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: theme.background }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: theme.dark }}>
          Teacher Dashboard
        </h1>
        <p className="text-sm" style={{ color: theme.light }}>
          Welcome back, {teacherProfile.name}! Here's your overview.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Subjects Count */}
        <div
          className="p-4 border rounded-lg"
          style={{ backgroundColor: theme.white, borderColor: theme.border }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: theme.light }}>
                Subjects
              </p>
              <p
                className="text-2xl font-bold mt-1"
                style={{ color: theme.dark }}
              >
                {subjects.length}
              </p>
            </div>
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: theme.primaryBg }}
            >
              <FiBook size={24} style={{ color: theme.primary }} />
            </div>
          </div>
        </div>

        {/* Students Count */}
        <div
          className="p-4 border rounded-lg"
          style={{ backgroundColor: theme.white, borderColor: theme.border }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: theme.light }}>
                Total Students
              </p>
              <p
                className="text-2xl font-bold mt-1"
                style={{ color: theme.dark }}
              >
                {quickStats.totalStudents}
              </p>
            </div>
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: theme.accent + "15" }}
            >
              <FiUsers size={24} style={{ color: theme.accent }} />
            </div>
          </div>
        </div>

        {/* Monthly Salary */}
        <div
          className="p-4 border rounded-lg"
          style={{ backgroundColor: theme.white, borderColor: theme.border }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: theme.light }}>
                Monthly Salary
              </p>
              <p
                className="text-2xl font-bold mt-1"
                style={{ color: theme.dark }}
              >
                ${currentSalary.amount}
              </p>
              <p
                className="text-xs mt-1"
                style={{ 
                  color: currentSalary.status === "paid" ? theme.accent : theme.warning 
                }}
              >
                {currentSalary.status === "paid" ? "✓ Paid" : "⏳ Pending"}
              </p>
            </div>
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: theme.primaryBg }}
            >
              <FiDollarSign size={24} style={{ color: theme.primary }} />
            </div>
          </div>
        </div>

        {/* Notices Count */}
        <div
          className="p-4 border rounded-lg"
          style={{ backgroundColor: theme.white, borderColor: theme.border }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: theme.light }}>
                Total Notices
              </p>
              <p
                className="text-2xl font-bold mt-1"
                style={{ color: theme.dark }}
              >
                {notices.length}
              </p>
            </div>
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: theme.warning + "15" }}
            >
              <FiBell size={24} style={{ color: theme.warning }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Subjects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div
            className="p-6 border rounded-lg"
            style={{ backgroundColor: theme.white, borderColor: theme.border }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className="font-semibold flex items-center gap-2"
                style={{ color: theme.dark }}
              >
                <FiUser style={{ color: theme.primary }} />
                Teacher Profile
              </h2>
              <button
                className="text-sm px-3 py-1 rounded"
                style={{
                  backgroundColor: theme.primaryBg,
                  color: theme.primary,
                }}
              >
                View Details
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm" style={{ color: theme.light }}>
                  Name
                </p>
                <p className="font-medium" style={{ color: theme.dark }}>
                  {teacherProfile.name}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: theme.light }}>
                  Employee ID
                </p>
                <p className="font-medium" style={{ color: theme.dark }}>
                  {teacherProfile.employeeId}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: theme.light }}>
                  Department
                </p>
                <p className="font-medium" style={{ color: theme.dark }}>
                  {teacherProfile.department}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: theme.light }}>
                  Designation
                </p>
                <p className="font-medium" style={{ color: theme.dark }}>
                  {teacherProfile.designation}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: theme.light }}>
                  Experience
                </p>
                <p className="font-medium" style={{ color: theme.dark }}>
                  {teacherProfile.experience}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: theme.light }}>
                  Email
                </p>
                <p className="font-medium" style={{ color: theme.dark }}>
                  {teacherProfile.email}
                </p>
              </div>
            </div>
          </div>

          {/* Assigned Subjects */}
          <div
            className="p-6 border rounded-lg"
            style={{ backgroundColor: theme.white, borderColor: theme.border }}
          >
            <h2
              className="font-semibold mb-4 flex items-center gap-2"
              style={{ color: theme.dark }}
            >
              <FiBookOpen style={{ color: theme.primary }} />
              Assigned Subjects
            </h2>

            <div className="space-y-4">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    borderLeft: `4px solid ${theme.primary}`,
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="font-semibold"
                        style={{ color: theme.dark }}
                      >
                        {subject.name}
                      </h3>
                      <p className="text-sm" style={{ color: theme.light }}>
                        {subject.code} • {subject.class} • Section: {subject.section}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span
                          className="flex items-center gap-1"
                          style={{ color: theme.light }}
                        >
                          <FiUsers size={12} />
                          {subject.students} students
                        </span>
                        <span
                          className="flex items-center gap-1"
                          style={{ color: theme.light }}
                        >
                          <FiCalendar size={12} />
                          {subject.schedule}
                        </span>
                      </div>
                    </div>
                    <button
                      className="px-3 py-1 text-sm rounded"
                      style={{
                        backgroundColor: theme.primaryBg,
                        color: theme.primary,
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Notices & Salary Status */}
        <div className="space-y-6">
          {/* Notice Board */}
          <div
            className="p-6 border rounded-lg"
            style={{ backgroundColor: theme.white, borderColor: theme.border }}
          >
            <h2
              className="font-semibold mb-4 flex items-center gap-2"
              style={{ color: theme.dark }}
            >
              <FiBell style={{ color: theme.primary }} />
              Notice Board
            </h2>

            <div className="space-y-4">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="p-4 border rounded-lg transition-all duration-200 hover:shadow-sm"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    borderLeft: `4px solid ${getPriorityColor(notice.priority)}`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: getPriorityColor(notice.priority) }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4
                          className="font-medium text-sm"
                          style={{ color: theme.dark }}
                        >
                          {notice.title}
                        </h4>
                        <span
                          className="text-xs"
                          style={{ color: theme.light }}
                        >
                          {notice.date}
                        </span>
                      </div>
                      <p
                        className="text-xs mt-2"
                        style={{ color: theme.light }}
                      >
                        {notice.content}
                      </p>
                      <div className="mt-2">
                        <span
                          className="inline-block px-2 py-1 text-xs rounded"
                          style={{
                            backgroundColor: getPriorityColor(notice.priority) + "20",
                            color: getPriorityColor(notice.priority),
                          }}
                        >
                          {notice.priority} priority
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Salary Status */}
          <div
            className="p-6 border rounded-lg"
            style={{ backgroundColor: theme.white, borderColor: theme.border }}
          >
            <h2
              className="font-semibold mb-4 flex items-center gap-2"
              style={{ color: theme.dark }}
            >
              <FiDollarSign style={{ color: theme.primary }} />
              Salary Status - {currentMonth}
            </h2>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm" style={{ color: theme.light }}>
                    Status
                  </p>
                  <p
                    className="text-xl font-bold mt-1"
                    style={{ 
                      color: currentSalary.status === "paid" ? theme.accent : theme.warning 
                    }}
                  >
                    {currentSalary.status === "paid" ? "✓ Salary Paid" : "⏳ Pending Payment"}
                  </p>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg text-center ${
                    currentSalary.status === "paid" 
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                  }`}
                >
                  <p className="text-2xl font-bold">${currentSalary.amount}</p>
                </div>
              </div>

              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(currentSalary.amount / 5000) * 100}%`,
                    backgroundColor: currentSalary.status === "paid" ? theme.accent : theme.warning,
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="p-3 border rounded-lg"
                style={{ backgroundColor: theme.background, borderColor: theme.border }}
              >
                <p className="text-sm" style={{ color: theme.light }}>
                  Year to Date
                </p>
                <p className="font-semibold" style={{ color: theme.dark }}>
                  $
                  {salaryData
                    .filter((s) => s.status === "paid")
                    .reduce((sum, s) => sum + s.amount, 0)}
                </p>
              </div>
              <div
                className="p-3 border rounded-lg"
                style={{ backgroundColor: theme.background, borderColor: theme.border }}
              >
                <p className="text-sm" style={{ color: theme.light }}>
                  Pending
                </p>
                <p className="font-semibold" style={{ color: theme.danger }}>
                  $
                  {salaryData
                    .filter((s) => s.status === "pending")
                    .reduce((sum, s) => sum + s.amount, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
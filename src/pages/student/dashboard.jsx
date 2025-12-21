"use client";
import { useState, useMemo } from "react";
import {
  FiTrendingUp,
  FiCalendar,
  FiBook,
  FiAward,
  FiBarChart2,
  FiEye,
} from "react-icons/fi";

export default function StudentDashboard() {
  const studentTheme = {
    primary: "#3FA7A3",
    secondary: "#6C63FF",
    accent: "#2ECC71",
    dark: "#1E293B",
    light: "#64748B",
    background: "#F8FAFC",
    white: "#FFFFFF",
  };

  const [selectedView, setSelectedView] = useState("dashboard");

  const studentInfo = {
    name: "John Smith",
    class: "Grade 8 - Class A",
    rollNumber: "08-A-045",
    gpa: 3.85,
  };

  const statsData = useMemo(
    () => [
      {
        id: 1,
        label: "Total Exams",
        value: "12",
        icon: FiBook,
        color: studentTheme.primary,
      },
      {
        id: 2,
        label: "Average Grade",
        value: "A-",
        icon: FiAward,
        color: studentTheme.accent,
      },
      {
        id: 3,
        label: "Class Rank",
        value: "5th",
        icon: FiTrendingUp,
        color: studentTheme.secondary,
      },
      {
        id: 4,
        label: "Attendance",
        value: "94.5%",
        icon: FiCalendar,
        color: "#E74C3C",
      },
    ],
    [studentTheme]
  );

  const upcomingExams = useMemo(
    () => [
      {
        id: 1,
        subject: "Mathematics",
        date: "Jan 12, 2025",
        time: "10:00 AM",
        room: "Hall A",
      },
      {
        id: 2,
        subject: "English",
        date: "Jan 18, 2025",
        time: "2:00 PM",
        room: "Hall B",
      },
      {
        id: 3,
        subject: "Science",
        date: "Jan 20, 2025",
        time: "10:00 AM",
        room: "Lab Room",
      },
    ],
    []
  );

  const notices = useMemo(
    () => [
      {
        id: 1,
        text: "Holiday on Jan 15 - Notification Day",
        date: "2025-01-05",
      },
      {
        id: 2,
        text: "Assignment due on Jan 16 - Submit before 5 PM",
        date: "2025-01-06",
      },
      {
        id: 3,
        text: "PT meeting on Jan 25 - Parents invited at 3 PM",
        date: "2025-01-07",
      },
    ],
    []
  );

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: studentTheme.background }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: studentTheme.dark }}
        >
          Welcome, {studentInfo.name}
        </h1>
        <p className="text-sm" style={{ color: studentTheme.light }}>
          {studentInfo.class} • Roll: {studentInfo.rollNumber}
        </p>
      </div>

      {/* Quick Stats */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat) => (
            <div
              key={stat.id}
              className="p-6 shadow-md border"
              style={{
                backgroundColor: studentTheme.white,
                borderColor: "#E2E8F0",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-sm font-medium mb-2"
                    style={{ color: studentTheme.light }}
                  >
                    {stat.label}
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: studentTheme.dark }}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  className="p-3"
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

      {/* Upcoming Exams */}
      <section className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="border shadow-sm overflow-hidden"
          style={{
            backgroundColor: studentTheme.white,
            borderColor: "#E2E8F0",
          }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center gap-2">
              <FiCalendar style={{ color: studentTheme.primary }} size={18} />
              <h3
                className="text-lg font-semibold"
                style={{ color: studentTheme.dark }}
              >
                Upcoming Exams
              </h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {upcomingExams.map((exam) => (
              <div
                key={exam.id}
                className="p-4 border"
                style={{
                  backgroundColor: studentTheme.background,
                  borderColor: "#E2E8F0",
                }}
              >
                <p
                  className="font-semibold mb-2"
                  style={{ color: studentTheme.dark }}
                >
                  {exam.subject}
                </p>
                <p
                  className="text-sm mb-1"
                  style={{ color: studentTheme.light }}
                >
                  Date: {exam.date} • Time: {exam.time}
                </p>
                <p className="text-sm" style={{ color: studentTheme.light }}>
                  Room: {exam.room}
                </p>
              </div>
            ))}
            <button
              className="w-full py-2 text-sm font-medium"
              style={{
                backgroundColor: studentTheme.primary,
                color: studentTheme.white,
                border: `1px solid ${studentTheme.primary}`,
              }}
            >
              View Detailed Schedule
            </button>
          </div>
        </div>

        {/* Notice Board */}
        <div
          className="border shadow-sm overflow-hidden"
          style={{
            backgroundColor: studentTheme.white,
            borderColor: "#E2E8F0",
          }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center gap-2">
              <FiBook style={{ color: studentTheme.accent }} size={18} />
              <h3
                className="text-lg font-semibold"
                style={{ color: studentTheme.dark }}
              >
                Notice Board
              </h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="p-4 border-l-4"
                style={{
                  backgroundColor: studentTheme.background,
                  borderColor: studentTheme.primary,
                  borderLeftWidth: "4px",
                }}
              >
                <p
                  className="text-sm mb-1"
                  style={{ color: studentTheme.dark }}
                >
                  {notice.text}
                </p>
                <p className="text-xs" style={{ color: studentTheme.light }}>
                  {notice.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Shortcuts */}
      <section>
        <h2
          className="text-2xl font-semibold mb-4"
          style={{ color: studentTheme.dark }}
        >
          Quick Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            className="p-6 border shadow-md font-medium"
            style={{
              backgroundColor: studentTheme.white,
              borderColor: "#E2E8F0",
              color: studentTheme.primary,
            }}
          >
            <FiBarChart2 size={24} className="mb-2" />
            View All Marks
          </button>
          <button
            className="p-6 border shadow-md font-medium"
            style={{
              backgroundColor: studentTheme.white,
              borderColor: "#E2E8F0",
              color: studentTheme.secondary,
            }}
          >
            <FiBook size={24} className="mb-2" />
            Study Materials
          </button>
          <button
            className="p-6 border shadow-md font-medium"
            style={{
              backgroundColor: studentTheme.white,
              borderColor: "#E2E8F0",
              color: studentTheme.accent,
            }}
          >
            <FiEye size={24} className="mb-2" />
            Grade Environment
          </button>
        </div>
      </section>
    </div>
  );
}

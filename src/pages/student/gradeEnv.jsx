"use client";
import { useState, useMemo } from "react";
import { FiBook, FiUsers, FiDownload } from "react-icons/fi";
import TopStudent from "./topStudentsByMark";

export default function GradeEnvironment() {
  const studentTheme = {
    primary: "#3FA7A3",
    secondary: "#6C63FF",
    accent: "#2ECC71",
    dark: "#1E293B",
    light: "#64748B",
    background: "#F8FAFC",
    white: "#FFFFFF",
  };

  const [selectedSubjectTab, setSelectedSubjectTab] = useState("Math");

  const teachers = useMemo(
    () => [
      {
        id: 1,
        name: "Mr. David Chen",
        subject: "Mathematics",
        email: "david.chen@school.edu",
      },
      {
        id: 2,
        name: "Ms. Sarah Wilson",
        subject: "English",
        email: "sarah.wilson@school.edu",
      },
      {
        id: 3,
        name: "Mr. Ahmad Hassan",
        subject: "Science",
        email: "ahmad.hassan@school.edu",
      },
      {
        id: 4,
        name: "Ms. Emily Rodriguez",
        subject: "ICT",
        email: "emily.rodriguez@school.edu",
      },
      {
        id: 5,
        name: "Mr. Win Tun",
        subject: "Myanmar",
        email: "win.tun@school.edu",
      },
    ],
    []
  );

  const gradeManagers = useMemo(
    () => [
      { id: 1, name: "Mr. James Smith", email: "james.smith@school.edu" },
      { id: 2, name: "Ms. Lisa Johnson", email: "lisa.johnson@school.edu" },
    ],
    []
  );

  const classStudents = useMemo(
    () => [
      { id: 1, name: "John Smith", class: "A", rollNumber: "08-A-001" },
      { id: 2, name: "Sarah Ahmed", class: "A", rollNumber: "08-A-002" },
      { id: 3, name: "Michael Brown", class: "A", rollNumber: "08-A-003" },
      { id: 4, name: "Emily Davis", class: "A", rollNumber: "08-A-004" },
      { id: 5, name: "David Wilson", class: "A", rollNumber: "08-A-005" },
    ],
    []
  );

  const topStudents = useMemo(
    () => [
      { id: 1, name: "Kyaw Gyi", marks: "92%", rank: "1st", gender: "Boy" },
      { id: 2, name: "Su Su", marks: "95%", rank: "2nd", gender: "Girl" },
      { id: 3, name: "Min Thu", marks: "90%", rank: "3rd", gender: "Boy" },
      { id: 4, name: "Hnin Ei", marks: "93%", rank: "4th", gender: "Girl" },
      { id: 5, name: "Aung Soe", marks: "89%", rank: "5th", gender: "Boy" },
    ],
    []
  );

  const studyMaterials = useMemo(
    () => ({
      Math: [
        { id: 1, name: "Algebra Basics.pdf", type: "pdf", icon: "📄" },
        { id: 2, name: "Geometry Revision Notes.pdf", type: "pdf", icon: "📄" },
        {
          id: 3,
          name: "YouTube: Trigonometry Explained",
          type: "video",
          icon: "🎥",
        },
        { id: 4, name: "BBC Bitesize Math", type: "website", icon: "🌐" },
      ],
      English: [
        { id: 1, name: "Shakespeare Analysis.pdf", type: "pdf", icon: "📄" },
        { id: 2, name: "Grammar Guide.pdf", type: "pdf", icon: "📄" },
        {
          id: 3,
          name: "YouTube: Essay Writing Tips",
          type: "video",
          icon: "🎥",
        },
      ],
      Science: [
        { id: 1, name: "Physics Formulas.pdf", type: "pdf", icon: "📄" },
        { id: 2, name: "Chemistry Notes.pdf", type: "pdf", icon: "📄" },
        { id: 3, name: "Biology Study Guide.pdf", type: "pdf", icon: "📄" },
      ],
      ICT: [
        { id: 1, name: "Python Basics.pdf", type: "pdf", icon: "📄" },
        { id: 2, name: "HTML CSS Guide.pdf", type: "pdf", icon: "📄" },
        { id: 3, name: "Database Design.pdf", type: "pdf", icon: "📄" },
      ],
      Myanmar: [
        { id: 1, name: "Literature Classics.pdf", type: "pdf", icon: "📄" },
        { id: 2, name: "Grammar Rules.pdf", type: "pdf", icon: "📄" },
      ],
    }),
    []
  );

  const subjects = ["Math", "English", "Science", "ICT", "Myanmar"];

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
          Grade 8 Environment
        </h1>
        <p className="text-sm" style={{ color: studentTheme.light }}>
          Teachers, Materials, Rankings, and Classmates
        </p>
      </div>

      {/* Teachers & Managers Section */}
      <section className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teachers */}
        <div
          className="border shadow-sm overflow-hidden"
          style={{
            backgroundColor: studentTheme.white,
            borderColor: "#E2E8F0",
          }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center gap-2">
              <FiUsers style={{ color: studentTheme.primary }} size={18} />
              <h3
                className="text-lg font-semibold"
                style={{ color: studentTheme.dark }}
              >
                Teachers
              </h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: studentTheme.background }}>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                    style={{
                      color: studentTheme.light,
                      borderColor: "#E2E8F0",
                    }}
                  >
                    Subject
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                    style={{
                      color: studentTheme.light,
                      borderColor: "#E2E8F0",
                    }}
                  >
                    Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td
                      className="px-6 py-4 text-sm font-medium border"
                      style={{
                        borderColor: "#E2E8F0",
                        color: studentTheme.dark,
                      }}
                    >
                      {teacher.subject}
                    </td>
                    <td
                      className="px-6 py-4 text-sm border"
                      style={{
                        borderColor: "#E2E8F0",
                        color: studentTheme.dark,
                      }}
                    >
                      {teacher.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grade Managers */}
        <div
          className="border shadow-sm overflow-hidden"
          style={{
            backgroundColor: studentTheme.white,
            borderColor: "#E2E8F0",
          }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center gap-2">
              <FiUsers style={{ color: studentTheme.accent }} size={18} />
              <h3
                className="text-lg font-semibold"
                style={{ color: studentTheme.dark }}
              >
                Grade Managers
              </h3>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {gradeManagers.map((manager) => (
              <div key={manager.id}>
                <p className="font-medium" style={{ color: studentTheme.dark }}>
                  {manager.name}
                </p>
                <p className="text-sm" style={{ color: studentTheme.light }}>
                  {manager.email}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Students & Class Rankings */}
      <section className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Students */}
        <div
          className="border shadow-sm overflow-hidden"
          style={{
            backgroundColor: studentTheme.white,
            borderColor: "#E2E8F0",
          }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center gap-2">
              <FiBook style={{ color: studentTheme.secondary }} size={18} />
              <h3
                className="text-lg font-semibold"
                style={{ color: studentTheme.dark }}
              >
                Top 5 in My Class
              </h3>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {topStudents.map((student) => (
              <div
                key={student.id}
                className="flex justify-between items-center p-3 border"
                style={{
                  backgroundColor: studentTheme.background,
                  borderColor: "#E2E8F0",
                }}
              >
                <div>
                  <p
                    className="font-medium"
                    style={{ color: studentTheme.dark }}
                  >
                    {student.rank}. {student.name}
                  </p>
                  <p className="text-xs" style={{ color: studentTheme.light }}>
                    {student.gender}
                  </p>
                </div>
                <p
                  className="font-bold"
                  style={{ color: studentTheme.primary }}
                >
                  {student.marks}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Class Students */}
        <div
          className="border shadow-sm overflow-hidden"
          style={{
            backgroundColor: studentTheme.white,
            borderColor: "#E2E8F0",
          }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center gap-2">
              <FiUsers style={{ color: studentTheme.accent }} size={18} />
              <h3
                className="text-lg font-semibold"
                style={{ color: studentTheme.dark }}
              >
                My Classmates
              </h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: studentTheme.background }}>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                    style={{
                      color: studentTheme.light,
                      borderColor: "#E2E8F0",
                    }}
                  >
                    Name
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                    style={{
                      color: studentTheme.light,
                      borderColor: "#E2E8F0",
                    }}
                  >
                    Roll
                  </th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td
                      className="px-6 py-4 text-sm border"
                      style={{
                        borderColor: "#E2E8F0",
                        color: studentTheme.dark,
                      }}
                    >
                      {student.name}
                    </td>
                    <td
                      className="px-6 py-4 text-sm border"
                      style={{
                        borderColor: "#E2E8F0",
                        color: studentTheme.light,
                      }}
                    >
                      {student.rollNumber}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <TopStudent />

      {/* Study Materials */}

      <section>
        <h2
          className="text-2xl font-semibold mb-4"
          style={{ color: studentTheme.dark }}
        >
          Study Materials by Subject
        </h2>

        {/* Subject Tabs */}
        <div
          className="flex gap-2 mb-6 border-b"
          style={{ borderColor: "#E2E8F0" }}
        >
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubjectTab(subject)}
              className="px-4 py-3 font-medium border-b-2 transition"
              style={{
                borderColor:
                  selectedSubjectTab === subject
                    ? studentTheme.primary
                    : "transparent",
                color:
                  selectedSubjectTab === subject
                    ? studentTheme.primary
                    : studentTheme.light,
              }}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Materials List */}
        <div
          className="border shadow-sm p-6"
          style={{
            backgroundColor: studentTheme.white,
            borderColor: "#E2E8F0",
          }}
        >
          <div className="space-y-3">
            {studyMaterials[selectedSubjectTab]?.map((material) => (
              <div
                key={material.id}
                className="flex justify-between items-center p-4 border hover:bg-gray-50"
                style={{
                  backgroundColor: studentTheme.background,
                  borderColor: "#E2E8F0",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{material.icon}</span>
                  <div>
                    <p
                      className="font-medium"
                      style={{ color: studentTheme.dark }}
                    >
                      {material.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: studentTheme.light }}
                    >
                      {material.type.charAt(0).toUpperCase() +
                        material.type.slice(1)}
                    </p>
                  </div>
                </div>
                <button
                  className="p-2"
                  style={{
                    backgroundColor: studentTheme.primary,
                    color: studentTheme.white,
                    border: `1px solid ${studentTheme.primary}`,
                  }}
                >
                  <FiDownload size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

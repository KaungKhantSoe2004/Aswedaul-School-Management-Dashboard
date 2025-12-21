"use client";
import { FiMail, FiUsers } from "react-icons/fi";

export default function StudentProfile() {
  const studentTheme = {
    primary: "#3FA7A3",
    secondary: "#6C63FF",
    accent: "#2ECC71",
    dark: "#1E293B",
    light: "#64748B",
    background: "#F8FAFC",
    white: "#FFFFFF",
  };

  const student = {
    name: "John Smith",
    email: "john.smith@school.edu",
    class: "Grade 8 - Class A",
    rollNumber: "08-A-045",
    gpa: 3.85,
    attendance: 94.5,
    dateOfBirth: "2010-05-15",
    profileImage: "/student-profile.png",
  };

  const guardians = [
    { name: "Mr. David Smith", relation: "Father", phone: "+95-9-123-456-789" },
    { name: "Ms. Mary Smith", relation: "Mother", phone: "+95-9-987-654-321" },
  ];

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
          My Profile
        </h1>
      </div>

      {/* Profile Card */}
      <section
        className="mb-8 p-8 border shadow-lg"
        style={{
          backgroundColor: studentTheme.white,
          borderColor: "#E2E8F0",
        }}
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Profile Image */}
          <div>
            <img
              src={student.profileImage || "/placeholder.svg"}
              alt="Profile"
              className="w-32 h-32 object-cover border"
              style={{
                borderColor: studentTheme.primary,
                borderWidth: "4px",
              }}
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h2
              className="text-4xl font-bold mb-2"
              style={{ color: studentTheme.dark }}
            >
              {student.name}
            </h2>
            <p className="text-lg mb-6" style={{ color: studentTheme.light }}>
              {student.class} • Roll: {student.rollNumber}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p
                  className="text-xs uppercase"
                  style={{ color: studentTheme.light }}
                >
                  GPA
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: studentTheme.primary }}
                >
                  {student.gpa}
                </p>
              </div>
              <div>
                <p
                  className="text-xs uppercase"
                  style={{ color: studentTheme.light }}
                >
                  Attendance
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: studentTheme.accent }}
                >
                  {student.attendance}%
                </p>
              </div>
              <div>
                <p
                  className="text-xs uppercase"
                  style={{ color: studentTheme.light }}
                >
                  DOB
                </p>
                <p
                  className="text-lg font-semibold"
                  style={{ color: studentTheme.dark }}
                >
                  {student.dateOfBirth}
                </p>
              </div>
              <div>
                <p
                  className="text-xs uppercase"
                  style={{ color: studentTheme.light }}
                >
                  Email
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: studentTheme.secondary }}
                >
                  {student.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Guardians */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div
          className="p-6 border shadow-sm"
          style={{
            backgroundColor: studentTheme.white,
            borderColor: "#E2E8F0",
          }}
        >
          <div className="flex items-center gap-2 mb-6">
            <FiMail style={{ color: studentTheme.primary }} size={20} />
            <h3
              className="text-lg font-semibold"
              style={{ color: studentTheme.dark }}
            >
              Contact Information
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm" style={{ color: studentTheme.light }}>
                Email Address
              </p>
              <p className="font-medium" style={{ color: studentTheme.dark }}>
                {student.email}
              </p>
            </div>
            <div>
              <p className="text-sm" style={{ color: studentTheme.light }}>
                Class
              </p>
              <p className="font-medium" style={{ color: studentTheme.dark }}>
                {student.class}
              </p>
            </div>
            <div>
              <p className="text-sm" style={{ color: studentTheme.light }}>
                Roll Number
              </p>
              <p className="font-medium" style={{ color: studentTheme.dark }}>
                {student.rollNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Guardians */}
        <div
          className="p-6 border shadow-sm"
          style={{
            backgroundColor: studentTheme.white,
            borderColor: "#E2E8F0",
          }}
        >
          <div className="flex items-center gap-2 mb-6">
            <FiUsers style={{ color: studentTheme.accent }} size={20} />
            <h3
              className="text-lg font-semibold"
              style={{ color: studentTheme.dark }}
            >
              Guardians
            </h3>
          </div>

          <div className="space-y-4">
            {guardians.map((guardian, idx) => (
              <div key={idx}>
                <p className="text-sm" style={{ color: studentTheme.light }}>
                  {guardian.relation}
                </p>
                <p className="font-medium" style={{ color: studentTheme.dark }}>
                  {guardian.name}
                </p>
                <p className="text-xs" style={{ color: studentTheme.light }}>
                  {guardian.phone}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

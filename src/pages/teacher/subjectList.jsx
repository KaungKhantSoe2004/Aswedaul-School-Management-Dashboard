"use client";

import { useState } from "react";

import {
  FiBook,
  FiUsers,
  FiCalendar,
  FiClock,
  FiChevronRight,
  FiSearch,
  FiFilter,
  FiPlus,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function TeacherSubjectsList() {
  const navigate = useNavigate();

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
  const [teacherProfile] = useState({
    name: "Dr. Sarah Johnson",
    designation: "Senior Teacher",
    department: "Science",
    totalSubjects: 3,
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
      materials: 8,
      notices: 3,
      exams: 2,
      lastUpdated: "2024-11-15",
      performance: 85,
      color: "#3FA7A3", // Primary
    },
    {
      id: 2,
      name: "Chemistry",
      code: "CHE101",
      class: "Grade 10",
      section: "C",
      students: 22,
      schedule: "Tue, Thu 10-11 AM",
      materials: 5,
      notices: 2,
      exams: 1,
      lastUpdated: "2024-11-10",
      performance: 78,
      color: "#6C63FF", // Purple
    },
    {
      id: 3,
      name: "Science Lab",
      code: "SCI102",
      class: "Grade 10",
      section: "A, B, C",
      students: 67,
      schedule: "Fri 2-4 PM",
      materials: 12,
      notices: 5,
      exams: 3,
      lastUpdated: "2024-11-12",
      performance: 92,
      color: "#2ECC71", // Green
    },
    {
      id: 4,
      name: "Mathematics",
      code: "MAT101",
      class: "Grade 9",
      section: "A, B",
      students: 38,
      schedule: "Mon, Fri 11-12 PM",
      materials: 6,
      notices: 2,
      exams: 1,
      lastUpdated: "2024-11-08",
      performance: 88,
      color: "#F39C12", // Orange
    },
    {
      id: 5,
      name: "Biology",
      code: "BIO101",
      class: "Grade 11",
      section: "A",
      students: 28,
      schedule: "Tue, Thu 2-3 PM",
      materials: 4,
      notices: 1,
      exams: 0,
      lastUpdated: "2024-11-05",
      performance: 81,
      color: "#E74C3C", // Red
    },
  ]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");

  // Get unique classes and sections for filters
  const uniqueClasses = ["all", ...new Set(subjects.map((s) => s.class))];
  const uniqueSections = [
    "all",
    ...new Set(subjects.flatMap((s) => s.section.split(", "))),
  ];

  // Filter subjects
  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass =
      selectedClass === "all" || subject.class === selectedClass;
    const matchesSection =
      selectedSection === "all" || subject.section.includes(selectedSection);

    return matchesSearch && matchesClass && matchesSection;
  });

  // Calculate statistics
  const statistics = {
    totalSubjects: subjects.length,
    totalStudents: subjects.reduce((sum, sub) => sum + sub.students, 0),
    averagePerformance: Math.round(
      subjects.reduce((sum, sub) => sum + sub.performance, 0) / subjects.length
    ),
    totalMaterials: subjects.reduce((sum, sub) => sum + sub.materials, 0),
  };

  // Navigate to subject details
  const navigateToSubject = (subjectId) => {
    // In a real app, you would use router.push(`/teacher/subjects/${subjectId}`)

    navigate(`/teacher/subjectDetails/${subjectId}`);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: theme.background }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: theme.dark }}>
          My Subjects
        </h1>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-sm" style={{ color: theme.light }}>
            Manage and access all your assigned subjects from one place
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: theme.light }}>Teacher:</span>
            <span className="font-medium" style={{ color: theme.dark }}>
              {teacherProfile.name}
            </span>
            <span
              className="px-2 py-1 rounded"
              style={{ backgroundColor: theme.primaryBg, color: theme.primary }}
            >
              {teacherProfile.department}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div
          className="p-4 border rounded-lg"
          style={{ backgroundColor: theme.white, borderColor: theme.border }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: theme.light }}>
                Total Subjects
              </p>
              <p
                className="text-2xl font-bold mt-1"
                style={{ color: theme.dark }}
              >
                {statistics.totalSubjects}
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
                {statistics.totalStudents}
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

        <div
          className="p-4 border rounded-lg"
          style={{ backgroundColor: theme.white, borderColor: theme.border }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: theme.light }}>
                Avg Performance
              </p>
              <p
                className="text-2xl font-bold mt-1"
                style={{ color: theme.dark }}
              >
                {statistics.averagePerformance}%
              </p>
            </div>
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: theme.warning + "15" }}
            >
              <FiTrendingUp size={24} style={{ color: theme.warning }} />
            </div>
          </div>
        </div>

        <div
          className="p-4 border rounded-lg"
          style={{ backgroundColor: theme.white, borderColor: theme.border }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: theme.light }}>
                Learning Materials
              </p>
              <p
                className="text-2xl font-bold mt-1"
                style={{ color: theme.dark }}
              >
                {statistics.totalMaterials}
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
      </div>

      {/* Search and Filters */}
      <div
        className="mb-6 p-4 border rounded-lg"
        style={{ backgroundColor: theme.white, borderColor: theme.border }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: theme.dark }}
            >
              Search Subjects
            </label>
            <div className="relative">
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: theme.light }}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or code..."
                className="w-full pl-10 pr-4 py-2 border rounded text-sm"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
              />
            </div>
          </div>

          {/* Class Filter */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: theme.dark }}
            >
              Filter by Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2 border rounded text-sm"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.dark,
              }}
            >
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls === "all" ? "All Classes" : cls}
                </option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: theme.dark }}
            >
              Filter by Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full p-2 border rounded text-sm"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.dark,
              }}
            >
              {uniqueSections.map((sec) => (
                <option key={sec} value={sec}>
                  {sec === "all" ? "All Sections" : `Section ${sec}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Subjects List */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold" style={{ color: theme.dark }}>
            Assigned Subjects ({filteredSubjects.length})
          </h2>
          <div className="text-sm" style={{ color: theme.light }}>
            Click on any subject to manage
          </div>
        </div>

        {filteredSubjects.length === 0 ? (
          <div
            className="p-12 border rounded-lg text-center"
            style={{ backgroundColor: theme.white, borderColor: theme.border }}
          >
            <div className="text-6xl mb-4" style={{ color: theme.lightGray }}>
              📚
            </div>
            <p className="text-lg mb-2" style={{ color: theme.dark }}>
              No subjects found
            </p>
            <p style={{ color: theme.light }}>
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject) => (
              <div
                key={subject.id}
                onClick={() => navigateToSubject(subject.id)}
                className="border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  borderTop: `4px solid ${subject.color}`,
                }}
              >
                {/* Subject Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: subject.color }}
                        >
                          {subject.name.charAt(0)}
                        </div>
                        <div>
                          <h3
                            className="font-bold text-lg"
                            style={{ color: theme.dark }}
                          >
                            {subject.name}
                          </h3>
                          <p className="text-sm" style={{ color: theme.light }}>
                            {subject.code}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiStar size={16} style={{ color: theme.warning }} />
                      <span
                        className="text-sm font-medium"
                        style={{ color: theme.dark }}
                      >
                        {subject.performance}%
                      </span>
                    </div>
                  </div>

                  {/* Class and Section */}
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="px-3 py-1 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor: theme.primaryBg,
                        color: theme.primary,
                      }}
                    >
                      {subject.class}
                    </span>
                    <span
                      className="px-3 py-1 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor: subject.color + "15",
                        color: subject.color,
                      }}
                    >
                      Section {subject.section}
                    </span>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div
                      className="text-center p-2 border rounded"
                      style={{ borderColor: theme.border }}
                    >
                      <div
                        className="text-lg font-bold"
                        style={{ color: theme.dark }}
                      >
                        {subject.students}
                      </div>
                      <div className="text-xs" style={{ color: theme.light }}>
                        Students
                      </div>
                    </div>
                    <div
                      className="text-center p-2 border rounded"
                      style={{ borderColor: theme.border }}
                    >
                      <div
                        className="text-lg font-bold"
                        style={{ color: theme.dark }}
                      >
                        {subject.materials}
                      </div>
                      <div className="text-xs" style={{ color: theme.light }}>
                        Materials
                      </div>
                    </div>
                    <div
                      className="text-center p-2 border rounded"
                      style={{ borderColor: theme.border }}
                    >
                      <div
                        className="text-lg font-bold"
                        style={{ color: theme.dark }}
                      >
                        {subject.exams}
                      </div>
                      <div className="text-xs" style={{ color: theme.light }}>
                        Exams
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div
                    className="flex items-center gap-2 text-sm mb-4"
                    style={{ color: theme.light }}
                  >
                    <FiCalendar size={14} />
                    <span>{subject.schedule}</span>
                  </div>

                  {/* Last Updated */}
                  <div className="text-xs" style={{ color: theme.lighter }}>
                    Updated: {formatDate(subject.lastUpdated)}
                  </div>
                </div>

                {/* Footer with Action Button */}
                <div
                  className="px-6 py-4 border-t flex justify-between items-center group-hover:bg-gray-50 transition-colors"
                  style={{ borderColor: theme.border }}
                >
                  <div className="text-sm" style={{ color: theme.light }}>
                    {subject.notices} active notices
                  </div>
                  <div
                    className="flex items-center gap-1 text-sm font-medium"
                    style={{ color: subject.color }}
                  >
                    <span>Manage</span>
                    <FiChevronRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Performance Overview */}
      <div className="mt-8 pt-6 border-t" style={{ borderColor: theme.border }}>
        <h2 className="font-semibold mb-4" style={{ color: theme.dark }}>
          Performance Overview
        </h2>
        <div
          className="p-4 border rounded-lg"
          style={{ backgroundColor: theme.white, borderColor: theme.border }}
        >
          <div className="space-y-4">
            {subjects.map((subject) => (
              <div key={subject.id} className="flex items-center">
                <div className="w-32 text-sm" style={{ color: theme.dark }}>
                  {subject.name}
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${subject.performance}%`,
                        backgroundColor: subject.color,
                      }}
                    />
                  </div>
                </div>
                <div
                  className="w-16 text-right text-sm font-medium"
                  style={{ color: subject.color }}
                >
                  {subject.performance}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div
        className="mt-8 p-4 border rounded-lg"
        style={{ backgroundColor: theme.primaryBg, borderColor: theme.primary }}
      >
        <h3
          className="font-semibold mb-2 flex items-center gap-2"
          style={{ color: theme.primaryDark }}
        >
          <FiBook size={18} />
          Quick Tips for Teachers
        </h3>
        <ul className="text-sm space-y-1" style={{ color: theme.primaryDark }}>
          <li>
            • Upload learning materials before class for better preparation
          </li>
          <li>• Post notices at least 24 hours before important dates</li>
          <li>• Enter exam marks within 3 days of exam completion</li>
          <li>
            • Review student performance regularly to identify areas for
            improvement
          </li>
        </ul>
      </div>
    </div>
  );
}

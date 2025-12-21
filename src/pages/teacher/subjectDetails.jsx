"use client";

import { useState, useEffect } from "react";
import {
  FiBook,
  FiUpload,
  FiVideo,
  FiLink,
  FiFileText,
  FiBell,
  FiUsers,
  FiEdit,
  FiTrash2,
  FiSave,
  FiX,
  FiPlus,
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";

export default function SubjectDetails() {
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

  // Subject data (would come from props/params in real app)
  const [subject, setSubject] = useState({
    id: 1,
    name: "Physics",
    code: "PHY101",
    class: "Grade 10",
    section: "A, B",
    totalStudents: 45,
    schedule: "Mon, Wed 9-10 AM",
  });

  // Tab state
  const [activeTab, setActiveTab] = useState("materials");

  // Learning Materials State
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    type: "video",
    url: "",
    description: "",
  });
  const [editingMaterialId, setEditingMaterialId] = useState(null);

  // Notice Board State
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState({
    title: "",
    content: "",
    notifyStudents: true,
  });
  const [editingNoticeId, setEditingNoticeId] = useState(null);

  // Students List State
  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // Exam Marks State
  const [examMarks, setExamMarks] = useState([]);
  const [isExamPeriod, setIsExamPeriod] = useState(false);
  const [marksEntryMode, setMarksEntryMode] = useState(false);

  // Initialize sample data
  useEffect(() => {
    // Sample learning materials
    const sampleMaterials = [
      {
        id: 1,
        title: "Newton's Laws Explained",
        type: "video",
        url: "https://youtube.com/watch?v=physics-101",
        description: "Comprehensive video explanation of Newton's three laws",
        uploadedDate: "2024-11-01",
        downloads: 45,
      },
      {
        id: 2,
        title: "Physics Formulas Sheet",
        type: "file",
        url: "/materials/physics-formulas.pdf",
        description: "Complete formula sheet for the semester",
        uploadedDate: "2024-10-28",
        downloads: 78,
      },
      {
        id: 3,
        title: "Quantum Mechanics Introduction",
        type: "link",
        url: "https://physics.org/quantum",
        description: "External resource for advanced topics",
        uploadedDate: "2024-10-20",
        clicks: 32,
      },
    ];
    setMaterials(sampleMaterials);

    // Sample notices
    const sampleNotices = [
      {
        id: 1,
        title: "Mid-term Exam Schedule",
        content:
          "Mid-term exams will be held from Nov 25-30. Please prepare accordingly.",
        date: "2024-11-10",
        notified: true,
      },
      {
        id: 2,
        title: "Project Submission Deadline",
        content:
          "Science project submissions are due by Nov 20. Late submissions will be penalized.",
        date: "2024-11-05",
        notified: true,
      },
      {
        id: 3,
        title: "Lab Safety Guidelines",
        content:
          "New lab safety guidelines have been updated. All students must review.",
        date: "2024-11-01",
        notified: false,
      },
    ];
    setNotices(sampleNotices);

    // Sample students data
    const sampleStudents = [
      {
        id: 1,
        name: "John Smith",
        section: "A",
        rollNo: "101",
        totalMarks: 85,
        attendance: 95,
      },
      {
        id: 2,
        name: "Sarah Johnson",
        section: "A",
        rollNo: "102",
        totalMarks: 92,
        attendance: 98,
      },
      {
        id: 3,
        name: "Michael Brown",
        section: "B",
        rollNo: "201",
        totalMarks: 78,
        attendance: 92,
      },
      {
        id: 4,
        name: "Emily Davis",
        section: "B",
        rollNo: "202",
        totalMarks: 88,
        attendance: 96,
      },
      {
        id: 5,
        name: "David Wilson",
        section: "A",
        rollNo: "103",
        totalMarks: 95,
        attendance: 99,
      },
      {
        id: 6,
        name: "Lisa Taylor",
        section: "C",
        rollNo: "301",
        totalMarks: 82,
        attendance: 90,
      },
      {
        id: 7,
        name: "Robert Chen",
        section: "C",
        rollNo: "302",
        totalMarks: 91,
        attendance: 97,
      },
      {
        id: 8,
        name: "Maria Garcia",
        section: "B",
        rollNo: "203",
        totalMarks: 87,
        attendance: 94,
      },
      {
        id: 9,
        name: "James Miller",
        section: "A",
        rollNo: "104",
        totalMarks: 79,
        attendance: 91,
      },
      {
        id: 10,
        name: "Emma Wilson",
        section: "C",
        rollNo: "303",
        totalMarks: 89,
        attendance: 95,
      },
      {
        id: 11,
        name: "Daniel Lee",
        section: "B",
        rollNo: "204",
        totalMarks: 84,
        attendance: 93,
      },
      {
        id: 12,
        name: "Sophia Kim",
        section: "A",
        rollNo: "105",
        totalMarks: 90,
        attendance: 96,
      },
    ];
    setStudents(sampleStudents.sort((a, b) => b.totalMarks - a.totalMarks));

    // Sample exam marks
    const initialMarks = sampleStudents.map((student) => ({
      studentId: student.id,
      name: student.name,
      section: student.section,
      rollNo: student.rollNo,
      marks: "",
      attendance: student.attendance,
    }));
    setExamMarks(initialMarks);
  }, []);

  // Filter students based on search and section
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesSection =
      selectedSection === "all" || student.section === selectedSection;
    return matchesSearch && matchesSection;
  });

  // Pagination for students
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  // Learning Materials CRUD
  const addMaterial = () => {
    if (!newMaterial.title || !newMaterial.url) return;

    const material = {
      id: Date.now(),
      ...newMaterial,
      uploadedDate: new Date().toISOString().split("T")[0],
      downloads: 0,
      clicks: 0,
    };

    setMaterials([material, ...materials]);
    setNewMaterial({ title: "", type: "video", url: "", description: "" });
  };

  const updateMaterial = () => {
    if (!newMaterial.title || !newMaterial.url) return;

    setMaterials(
      materials.map((mat) =>
        mat.id === editingMaterialId ? { ...mat, ...newMaterial } : mat
      )
    );

    setEditingMaterialId(null);
    setNewMaterial({ title: "", type: "video", url: "", description: "" });
  };

  const deleteMaterial = (id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      setMaterials(materials.filter((mat) => mat.id !== id));
    }
  };

  // Notice Board CRUD
  const addNotice = () => {
    if (!newNotice.title || !newNotice.content) return;

    const notice = {
      id: Date.now(),
      ...newNotice,
      date: new Date().toISOString().split("T")[0],
      notified: false,
    };

    setNotices([notice, ...notices]);
    setNewNotice({ title: "", content: "", notifyStudents: true });
  };

  const updateNotice = () => {
    if (!newNotice.title || !newNotice.content) return;

    setNotices(
      notices.map((notice) =>
        notice.id === editingNoticeId ? { ...notice, ...newNotice } : notice
      )
    );

    setEditingNoticeId(null);
    setNewNotice({ title: "", content: "", notifyStudents: true });
  };

  const deleteNotice = (id) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      setNotices(notices.filter((notice) => notice.id !== id));
    }
  };

  const toggleNotification = (id) => {
    setNotices(
      notices.map((notice) =>
        notice.id === id ? { ...notice, notified: !notice.notified } : notice
      )
    );
  };

  // Exam Marks Functions
  const handleMarkChange = (studentId, value) => {
    setExamMarks(
      marks.map((mark) =>
        mark.studentId === studentId ? { ...mark, marks: value } : mark
      )
    );
  };

  const saveMarks = () => {
    // In real app, this would save to backend
    alert("Marks saved successfully!");
    setMarksEntryMode(false);
  };

  const getMaterialTypeIcon = (type) => {
    switch (type) {
      case "video":
        return { icon: FiVideo, color: "#E74C3C", label: "Video" };
      case "file":
        return { icon: FiFileText, color: "#3498DB", label: "File" };
      case "link":
        return { icon: FiLink, color: "#2ECC71", label: "Link" };
      default:
        return { icon: FiFileText, color: theme.light, label: "File" };
    }
  };

  // Tab Components
  const MaterialsTab = () => (
    <div className="space-y-6">
      {/* Add/Edit Material Form */}
      <div
        className="p-6 border rounded-lg"
        style={{ backgroundColor: theme.white, borderColor: theme.border }}
      >
        <h3 className="font-semibold mb-4" style={{ color: theme.dark }}>
          {editingMaterialId ? "Edit Material" : "Add Learning Material"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: theme.dark }}
            >
              Title *
            </label>
            <input
              type="text"
              value={newMaterial.title}
              onChange={(e) =>
                setNewMaterial((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full p-2 border rounded text-sm"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.dark,
              }}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: theme.dark }}
            >
              Material Type
            </label>
            <select
              value={newMaterial.type}
              onChange={(e) =>
                setNewMaterial((prev) => ({ ...prev, type: e.target.value }))
              }
              className="w-full p-2 border rounded text-sm"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.dark,
              }}
            >
              <option value="video">Video Link</option>
              <option value="file">File Upload</option>
              <option value="link">Web Link</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: theme.dark }}
            >
              URL *
            </label>
            <input
              type="text"
              value={newMaterial.url}
              onChange={(e) =>
                setNewMaterial((prev) => ({ ...prev, url: e.target.value }))
              }
              placeholder="https://..."
              className="w-full p-2 border rounded text-sm"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.dark,
              }}
            />
          </div>
          <div className="md:col-span-2">
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: theme.dark }}
            >
              Description
            </label>
            <textarea
              value={newMaterial.description}
              onChange={(e) =>
                setNewMaterial((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows="2"
              className="w-full p-2 border rounded text-sm"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.dark,
              }}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          {editingMaterialId && (
            <button
              onClick={() => {
                setEditingMaterialId(null);
                setNewMaterial({
                  title: "",
                  type: "video",
                  url: "",
                  description: "",
                });
              }}
              className="px-4 py-2 text-sm border rounded"
              style={{
                backgroundColor: theme.white,
                borderColor: theme.border,
                color: theme.dark,
              }}
            >
              Cancel
            </button>
          )}
          <button
            onClick={editingMaterialId ? updateMaterial : addMaterial}
            className="px-4 py-2 text-sm font-medium rounded flex items-center gap-2"
            style={{ backgroundColor: theme.primary, color: theme.white }}
            disabled={!newMaterial.title || !newMaterial.url}
          >
            <FiSave size={14} />
            {editingMaterialId ? "Update Material" : "Add Material"}
          </button>
        </div>
      </div>

      {/* Materials List */}
      <div>
        <h3 className="font-semibold mb-4" style={{ color: theme.dark }}>
          Learning Materials ({materials.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map((material) => {
            const typeInfo = getMaterialTypeIcon(material.type);
            const Icon = typeInfo.icon;

            return (
              <div
                key={material.id}
                className="p-4 border rounded-lg"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: typeInfo.color + "15" }}
                  >
                    <Icon size={20} style={{ color: typeInfo.color }} />
                  </div>
                  <div className="flex-1">
                    <h4
                      className="font-medium text-sm"
                      style={{ color: theme.dark }}
                    >
                      {material.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: typeInfo.color + "15",
                          color: typeInfo.color,
                        }}
                      >
                        {typeInfo.label}
                      </span>
                    </div>
                  </div>
                </div>

                {material.description && (
                  <p className="text-xs mb-3" style={{ color: theme.light }}>
                    {material.description}
                  </p>
                )}

                <div
                  className="flex justify-between items-center text-xs"
                  style={{ color: theme.lighter }}
                >
                  <span>{material.uploadedDate}</span>
                  <span>
                    {material.downloads || material.clicks}{" "}
                    {material.type === "video"
                      ? "views"
                      : material.type === "link"
                      ? "clicks"
                      : "downloads"}
                  </span>
                </div>

                <div
                  className="flex justify-end gap-2 mt-3 pt-3 border-t"
                  style={{ borderColor: theme.border }}
                >
                  <a
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1 rounded"
                    style={{
                      backgroundColor: theme.primaryBg,
                      color: theme.primary,
                    }}
                  >
                    Open
                  </a>
                  <button
                    onClick={() => {
                      setNewMaterial(material);
                      setEditingMaterialId(material.id);
                    }}
                    className="text-xs px-3 py-1 rounded"
                    style={{
                      backgroundColor: theme.primaryBg,
                      color: theme.primary,
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMaterial(material.id)}
                    className="text-xs px-3 py-1 rounded"
                    style={{
                      backgroundColor: theme.danger + "15",
                      color: theme.danger,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const NoticesTab = () => (
    <div className="space-y-6">
      {/* Add/Edit Notice Form */}
      <div
        className="p-6 border rounded-lg"
        style={{ backgroundColor: theme.white, borderColor: theme.border }}
      >
        <h3 className="font-semibold mb-4" style={{ color: theme.dark }}>
          {editingNoticeId ? "Edit Notice" : "Create Notice for Students"}
        </h3>
        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: theme.dark }}
            >
              Title *
            </label>
            <input
              type="text"
              value={newNotice.title}
              onChange={(e) =>
                setNewNotice((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full p-2 border rounded text-sm"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.dark,
              }}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: theme.dark }}
            >
              Content *
            </label>
            <textarea
              value={newNotice.content}
              onChange={(e) =>
                setNewNotice((prev) => ({ ...prev, content: e.target.value }))
              }
              rows="3"
              className="w-full p-2 border rounded text-sm"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.dark,
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="notifyStudents"
              checked={newNotice.notifyStudents}
              onChange={(e) =>
                setNewNotice((prev) => ({
                  ...prev,
                  notifyStudents: e.target.checked,
                }))
              }
              className="w-4 h-4"
              style={{ accentColor: theme.primary }}
            />
            <label
              htmlFor="notifyStudents"
              className="text-sm"
              style={{ color: theme.dark }}
            >
              Send notification to students
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          {editingNoticeId && (
            <button
              onClick={() => {
                setEditingNoticeId(null);
                setNewNotice({ title: "", content: "", notifyStudents: true });
              }}
              className="px-4 py-2 text-sm border rounded"
              style={{
                backgroundColor: theme.white,
                borderColor: theme.border,
                color: theme.dark,
              }}
            >
              Cancel
            </button>
          )}
          <button
            onClick={editingNoticeId ? updateNotice : addNotice}
            className="px-4 py-2 text-sm font-medium rounded flex items-center gap-2"
            style={{ backgroundColor: theme.primary, color: theme.white }}
            disabled={!newNotice.title || !newNotice.content}
          >
            <FiSave size={14} />
            {editingNoticeId ? "Update Notice" : "Publish Notice"}
          </button>
        </div>
      </div>

      {/* Notices List */}
      <div>
        <h3 className="font-semibold mb-4" style={{ color: theme.dark }}>
          Published Notices ({notices.length})
        </h3>
        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="p-4 border rounded-lg"
              style={{
                backgroundColor: theme.white,
                borderColor: theme.border,
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium" style={{ color: theme.dark }}>
                    {notice.title}
                  </h4>
                  <p className="text-sm mt-1" style={{ color: theme.light }}>
                    {notice.content}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: theme.light }}>
                    {notice.date}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      notice.notified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {notice.notified ? "Notified" : "Pending"}
                  </span>
                </div>
              </div>
              <div
                className="flex justify-end gap-2 mt-3 pt-3 border-t"
                style={{ borderColor: theme.border }}
              >
                <button
                  onClick={() => toggleNotification(notice.id)}
                  className="text-xs px-3 py-1 rounded"
                  style={{
                    backgroundColor: notice.notified
                      ? theme.warning + "15"
                      : theme.accent + "15",
                    color: notice.notified ? theme.warning : theme.accent,
                  }}
                >
                  {notice.notified ? "Mark as Pending" : "Send Notification"}
                </button>
                <button
                  onClick={() => {
                    setNewNotice(notice);
                    setEditingNoticeId(notice.id);
                  }}
                  className="text-xs px-3 py-1 rounded"
                  style={{
                    backgroundColor: theme.primaryBg,
                    color: theme.primary,
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteNotice(notice.id)}
                  className="text-xs px-3 py-1 rounded"
                  style={{
                    backgroundColor: theme.danger + "15",
                    color: theme.danger,
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const StudentsTab = () => (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div
        className="p-4 border rounded-lg"
        style={{ backgroundColor: theme.white, borderColor: theme.border }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: theme.dark }}
            >
              Search Students
            </label>
            <div className="relative">
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: theme.light }}
              />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search by name or roll no"
                className="w-full pl-10 pr-4 py-2 border rounded text-sm"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
              />
            </div>
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
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
              <option value="all">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: theme.dark }}
            >
              Actions
            </label>
            <button
              className="w-full p-2 text-sm border rounded flex items-center justify-center gap-2"
              style={{
                backgroundColor: theme.primary,
                color: theme.white,
                borderColor: theme.primary,
              }}
            >
              <FiUsers size={14} />
              Export List
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div
        className="border rounded-lg overflow-hidden"
        style={{ backgroundColor: theme.white, borderColor: theme.border }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: theme.background }}>
                <th
                  className="p-3 text-left text-xs font-medium"
                  style={{ color: theme.light }}
                >
                  Rank
                </th>
                <th
                  className="p-3 text-left text-xs font-medium"
                  style={{ color: theme.light }}
                >
                  Student
                </th>
                <th
                  className="p-3 text-left text-xs font-medium"
                  style={{ color: theme.light }}
                >
                  Section
                </th>
                <th
                  className="p-3 text-left text-xs font-medium"
                  style={{ color: theme.light }}
                >
                  Roll No
                </th>
                <th
                  className="p-3 text-left text-xs font-medium"
                  style={{ color: theme.light }}
                >
                  Total Marks
                </th>
                <th
                  className="p-3 text-left text-xs font-medium"
                  style={{ color: theme.light }}
                >
                  Attendance
                </th>
                <th
                  className="p-3 text-left text-xs font-medium"
                  style={{ color: theme.light }}
                >
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student, index) => {
                const grade =
                  student.totalMarks >= 90
                    ? "A+"
                    : student.totalMarks >= 80
                    ? "A"
                    : student.totalMarks >= 70
                    ? "B"
                    : student.totalMarks >= 60
                    ? "C"
                    : "D";
                const gradeColor =
                  grade === "A+"
                    ? theme.accent
                    : grade === "A"
                    ? theme.primary
                    : grade === "B"
                    ? theme.warning
                    : theme.danger;

                return (
                  <tr
                    key={student.id}
                    className="border-t"
                    style={{ borderColor: theme.border }}
                  >
                    <td className="p-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                        style={{
                          backgroundColor:
                            index < 3 ? theme.primary + "15" : theme.background,
                          color: index < 3 ? theme.primary : theme.dark,
                        }}
                      >
                        {indexOfFirstStudent + index + 1}
                      </div>
                    </td>
                    <td className="p-3">
                      <div
                        className="font-medium text-sm"
                        style={{ color: theme.dark }}
                      >
                        {student.name}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className="px-2 py-1 text-xs rounded"
                        style={{
                          backgroundColor: theme.primaryBg,
                          color: theme.primary,
                        }}
                      >
                        Section {student.section}
                      </span>
                    </td>
                    <td className="p-3 text-sm" style={{ color: theme.dark }}>
                      {student.rollNo}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 h-2 rounded-full mr-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${student.totalMarks}%`,
                              backgroundColor: theme.primary,
                            }}
                          />
                        </div>
                        <span
                          className="text-sm font-medium"
                          style={{ color: theme.dark }}
                        >
                          {student.totalMarks}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className="text-sm font-medium"
                        style={{ color: theme.dark }}
                      >
                        {student.attendance}%
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: gradeColor + "15",
                          color: gradeColor,
                        }}
                      >
                        {grade}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="p-4 border-t flex justify-between items-center"
            style={{ borderColor: theme.border }}
          >
            <div className="text-sm" style={{ color: theme.light }}>
              Showing {indexOfFirstStudent + 1} to{" "}
              {Math.min(indexOfLastStudent, filteredStudents.length)} of{" "}
              {filteredStudents.length} students
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: currentPage === 1 ? theme.lighter : theme.dark,
                }}
              >
                <FiChevronLeft size={16} />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 text-sm border rounded ${
                      currentPage === pageNum ? "font-medium" : ""
                    }`}
                    style={{
                      backgroundColor:
                        currentPage === pageNum ? theme.primary : theme.white,
                      borderColor:
                        currentPage === pageNum ? theme.primary : theme.border,
                      color: currentPage === pageNum ? theme.white : theme.dark,
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 border rounded"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color:
                    currentPage === totalPages ? theme.lighter : theme.dark,
                }}
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

const MarksTab = () => {
  const [marksEntryMode, setMarksEntryMode] = useState(false);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editMarkData, setEditMarkData] = useState({ marks: "", note: "" });
  
  // Sample data - replace with your actual data
  const [examMarks, setExamMarks] = useState([
    {
      studentId: 1,
      name: "John Smith",
      section: "A",
      rollNo: "101",
      attendance: "95",
      marks: "85",
      note: "Excellent performance in practicals"
    },
    {
      studentId: 2,
      name: "Sarah Johnson",
      section: "A",
      rollNo: "102",
      attendance: "88",
      marks: "78",
      note: "Needs improvement in theory"
    },
    {
      studentId: 3,
      name: "Michael Brown",
      section: "B",
      rollNo: "103",
      attendance: "92",
      marks: "91",
      note: "Consistent performer"
    },
    {
      studentId: 4,
      name: "Emily Davis",
      section: "B",
      rollNo: "104",
      attendance: "85",
      marks: "",
      note: ""
    },
  ]);

  const handleMarkChange = (studentId, marks) => {
    setExamMarks(prev => 
      prev.map(mark => 
        mark.studentId === studentId 
          ? { ...mark, marks: marks } 
          : mark
      )
    );
  };

  const saveMarks = () => {
    // Save all marks logic
    alert("All marks saved successfully!");
    setMarksEntryMode(false);
  };

  // Open modal to edit mark with note
  const openEditModal = (student) => {
    setSelectedStudent(student);
    setEditMarkData({
      marks: student.marks || "",
      note: student.note || ""
    });
    setShowMarkModal(true);
  };

  // Save individual mark with note
  const saveMarkWithNote = () => {
    if (selectedStudent) {
      setExamMarks(prev => 
        prev.map(mark => 
          mark.studentId === selectedStudent.studentId 
            ? { ...mark, marks: editMarkData.marks, note: editMarkData.note } 
            : mark
        )
      );
      setShowMarkModal(false);
      setSelectedStudent(null);
    }
  };

  // Marks Edit Modal Component
  const MarkEditModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={() => setShowMarkModal(false)} 
      ></div>

      {/* Modal Content */}
      <div
        className="w-full max-w-md p-6 rounded-xl shadow-2xl relative"
        style={{
          backgroundColor: theme.white,
          border: `1px solid ${theme.border}`,
          zIndex: 60,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 border-b pb-3" style={{borderColor: theme.border}}>
          <h2 className="text-xl font-semibold" style={{ color: theme.dark }}>
            Update Marks & Notes
          </h2>
          <button
            onClick={() => setShowMarkModal(false)}
            className="p-2 rounded-full transition-all duration-200 hover:bg-gray-100"
            style={{ color: theme.light }}
          >
            <FiX size={20} />
          </button>
        </div>

        {selectedStudent && (
          <div className="space-y-4">
            {/* Student Info */}
            <div className="p-3 border rounded-lg" style={{backgroundColor: theme.background, borderColor: theme.border}}>
              <h3 className="font-medium mb-1" style={{color: theme.dark}}>
                {selectedStudent.name}
              </h3>
              <div className="flex gap-4 text-sm">
                <span style={{color: theme.light}}>Section {selectedStudent.section}</span>
                <span style={{color: theme.light}}>Roll No: {selectedStudent.rollNo}</span>
                <span style={{color: theme.light}}>Attendance: {selectedStudent.attendance}%</span>
              </div>
            </div>

            {/* Marks Input */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: theme.dark}}>
                Marks (Out of 100)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={editMarkData.marks}
                  onChange={(e) => setEditMarkData(prev => ({...prev, marks: e.target.value}))}
                  min="0"
                  max="100"
                  className="w-32 p-3 border rounded-lg focus:ring-2 focus:ring-offset-1"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.dark,
                    outlineColor: theme.primary
                  }}
                />
                <span className="text-sm" style={{color: theme.light}}>/ 100</span>
              </div>
            </div>

            {/* Notes Input */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: theme.dark}}>
                Teacher's Notes
              </label>
              <textarea
                value={editMarkData.note}
                onChange={(e) => setEditMarkData(prev => ({...prev, note: e.target.value}))}
                placeholder="Enter any notes or comments about this student's performance..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-offset-1 min-h-[100px]"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.dark,
                  outlineColor: theme.primary
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 justify-end">
              <button
                onClick={() => setShowMarkModal(false)}
                className="px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100"
                style={{
                  backgroundColor: theme.background,
                  color: theme.dark,
                  borderColor: theme.border,
                  borderWidth: '1px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveMarkWithNote}
                disabled={!editMarkData.marks.trim()}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: theme.accent,
                  color: theme.white,
                  boxShadow: `0 4px 6px -1px ${theme.accent}30`,
                }}
              >
                <FiSave size={14} />
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div
        className="p-6 border rounded-lg"
        style={{ backgroundColor: theme.white, borderColor: theme.border }}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold" style={{ color: theme.dark }}>
              Exam Marking System
            </h3>
            <p className="text-sm" style={{ color: theme.light }}>
              Enter and manage student exam marks
            </p>
          </div>

          {!marksEntryMode ? (
            <button
              onClick={() => setMarksEntryMode(true)}
              className="px-4 py-2 text-sm font-medium rounded flex items-center gap-2"
              style={{ backgroundColor: theme.primary, color: theme.white }}
            >
              <FiEdit size={14} />
              Enter Marks
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setMarksEntryMode(false)}
                className="px-4 py-2 text-sm border rounded"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveMarks}
                className="px-4 py-2 text-sm font-medium rounded flex items-center gap-2"
                style={{ backgroundColor: theme.accent, color: theme.white }}
              >
                <FiSave size={14} />
                Save All Marks
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="p-3 border rounded"
            style={{
              backgroundColor: theme.background,
              borderColor: theme.border,
            }}
          >
            <div className="text-sm" style={{ color: theme.light }}>
              Exam Status
            </div>
            <div className="font-medium" style={{ color: theme.dark }}>
              Completed
            </div>
          </div>
          <div
            className="p-3 border rounded"
            style={{
              backgroundColor: theme.background,
              borderColor: theme.border,
            }}
          >
            <div className="text-sm" style={{ color: theme.light }}>
              Total Students
            </div>
            <div className="font-medium" style={{ color: theme.dark }}>
              {examMarks.length}
            </div>
          </div>
          <div
            className="p-3 border rounded"
            style={{
              backgroundColor: theme.background,
              borderColor: theme.border,
            }}
          >
            <div className="text-sm" style={{ color: theme.light }}>
              Marks Entered
            </div>
            <div className="font-medium" style={{ color: theme.dark }}>
              {examMarks.filter((m) => m.marks && m.marks.trim() !== "").length}{" "}
              / {examMarks.length}
            </div>
          </div>
        </div>
      </div>

      {/* Marks Entry Table */}
      {marksEntryMode && (
        <div
          className="border rounded-lg overflow-hidden"
          style={{ backgroundColor: theme.white, borderColor: theme.border }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: theme.background }}>
                  <th
                    className="p-3 text-left text-xs font-medium"
                    style={{ color: theme.light }}
                  >
                    Student
                  </th>
                  <th
                    className="p-3 text-left text-xs font-medium"
                    style={{ color: theme.light }}
                  >
                    Section
                  </th>
                  <th
                    className="p-3 text-left text-xs font-medium"
                    style={{ color: theme.light }}
                  >
                    Roll No
                  </th>
                  <th
                    className="p-3 text-left text-xs font-medium"
                    style={{ color: theme.light }}
                  >
                    Attendance
                  </th>
                  <th
                    className="p-3 text-left text-xs font-medium"
                    style={{ color: theme.light }}
                  >
                    Marks (Out of 100)
                  </th>
                  <th
                    className="p-3 text-left text-xs font-medium"
                    style={{ color: theme.light }}
                  >
                    Notes
                  </th>
                  <th
                    className="p-3 text-left text-xs font-medium"
                    style={{ color: theme.light }}
                  >
                    Actions
                  </th>
                  <th
                    className="p-3 text-left text-xs font-medium"
                    style={{ color: theme.light }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {examMarks.map((mark) => (
                  <tr
                    key={mark.studentId}
                    className="border-t"
                    style={{ borderColor: theme.border }}
                  >
                    <td className="p-3">
                      <div
                        className="font-medium text-sm"
                        style={{ color: theme.dark }}
                      >
                        {mark.name}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className="px-2 py-1 text-xs rounded"
                        style={{
                          backgroundColor: theme.primaryBg,
                          color: theme.primary,
                        }}
                      >
                        Section {mark.section}
                      </span>
                    </td>
                    <td className="p-3 text-sm" style={{ color: theme.dark }}>
                      {mark.rollNo}
                    </td>
                    <td className="p-3">
                      <span className="text-sm" style={{ color: theme.dark }}>
                        {mark.attendance}%
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={mark.marks}
                          onChange={(e) =>
                            handleMarkChange(mark.studentId, e.target.value)
                          }
                          min="0"
                          max="100"
                          className="w-24 p-2 border rounded text-sm"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                            color: theme.dark,
                          }}
                        />
                        <span
                          className="text-xs"
                          style={{ color: theme.light }}
                        >
                          /100
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="max-w-[200px]">
                        {mark.note ? (
                          <div className="group relative">
                            <span className="text-xs text-gray-500 truncate block">
                              {mark.note.length > 30 ? `${mark.note.substring(0, 30)}...` : mark.note}
                            </span>
                            <div className="hidden group-hover:block absolute z-10 p-2 bg-white border rounded shadow-lg max-w-xs text-xs text-gray-600">
                              {mark.note}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No notes</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => openEditModal(mark)}
                        className="px-3 py-1 text-xs rounded flex items-center gap-1"
                        style={{
                          backgroundColor: theme.primaryBg,
                          color: theme.primary,
                        }}
                      >
                        <FiEdit size={10} />
                        Edit
                      </button>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          mark.marks
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {mark.marks ? "Entered" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Statistics Summary */}
      {!marksEntryMode && examMarks.some((m) => m.marks) && (
        <div
          className="p-6 border rounded-lg"
          style={{ backgroundColor: theme.white, borderColor: theme.border }}
        >
          <h3 className="font-semibold mb-4" style={{ color: theme.dark }}>
            Marks Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              className="text-center p-3 border rounded"
              style={{ borderColor: theme.border }}
            >
              <div
                className="text-xl font-bold"
                style={{ color: theme.primary }}
              >
                {Math.round(
                  examMarks
                    .filter((m) => m.marks)
                    .reduce((sum, m) => sum + parseInt(m.marks || 0), 0) /
                    examMarks.filter((m) => m.marks).length
                )}
                %
              </div>
              <div className="text-xs" style={{ color: theme.light }}>
                Average Marks
              </div>
            </div>
            <div
              className="text-center p-3 border rounded"
              style={{ borderColor: theme.border }}
            >
              <div
                className="text-xl font-bold"
                style={{ color: theme.primary }}
              >
                {Math.max(
                  ...examMarks
                    .filter((m) => m.marks)
                    .map((m) => parseInt(m.marks || 0))
                )}
                %
              </div>
              <div className="text-xs" style={{ color: theme.light }}>
                Highest Score
              </div>
            </div>
            <div
              className="text-center p-3 border rounded"
              style={{ borderColor: theme.border }}
            >
              <div
                className="text-xl font-bold"
                style={{ color: theme.primary }}
              >
                {Math.min(
                  ...examMarks
                    .filter((m) => m.marks)
                    .map((m) => parseInt(m.marks || 0))
                )}
                %
              </div>
              <div className="text-xs" style={{ color: theme.light }}>
                Lowest Score
              </div>
            </div>
            <div
              className="text-center p-3 border rounded"
              style={{ borderColor: theme.border }}
            >
              <div
                className="text-xl font-bold"
                style={{ color: theme.primary }}
              >
                {
                  examMarks.filter((m) => m.marks && parseInt(m.marks) >= 70)
                    .length
                }
              </div>
              <div className="text-xs" style={{ color: theme.light }}>
                Passed (≥70%)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show Modal */}
      {showMarkModal && <MarkEditModal />}
    </div>
  );
};
  // Tab configuration
  const tabs = [
    { id: "materials", label: "Learning Materials", component: MaterialsTab },
    { id: "notices", label: "Notice Board", component: NoticesTab },
    { id: "students", label: "Students List", component: StudentsTab },
    { id: "marks", label: "Exam Marks", component: MarksTab },
  ];

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || MaterialsTab;

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: theme.background }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1
              className="text-3xl font-bold mb-2 flex items-center gap-3"
              style={{ color: theme.dark }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
                style={{ backgroundColor: theme.primary }}
              >
                {subject.name.charAt(0)}
              </div>
              {subject.name} ({subject.code})
            </h1>
            <div
              className="flex items-center gap-4 text-sm"
              style={{ color: theme.light }}
            >
              <span>Class: {subject.class}</span>
              <span>Section: {subject.section}</span>
              <span>Students: {subject.totalStudents}</span>
              <span>Schedule: {subject.schedule}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 text-sm border rounded-lg flex items-center gap-2"
              style={{
                backgroundColor: theme.white,
                borderColor: theme.border,
                color: theme.dark,
              }}
            >
              Export Data
            </button>
            <button
              className="px-4 py-2 text-sm border rounded-lg flex items-center gap-2"
              style={{
                backgroundColor: theme.primary,
                color: theme.white,
                borderColor: theme.primary,
              }}
            >
              <FiBook size={14} />
              Subject Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div
          className="flex flex-wrap gap-2 border-b"
          style={{ borderColor: theme.border }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-primary"
                  : "border-transparent hover:border-gray-300"
              }`}
              style={{
                color: activeTab === tab.id ? theme.primary : theme.light,
                borderColor:
                  activeTab === tab.id ? theme.primary : "transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Tab Content */}
      <div>
        <ActiveComponent />
      </div>
    </div>
  );
}

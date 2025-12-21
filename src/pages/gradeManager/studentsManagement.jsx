"use client";
import { useState, useMemo } from "react";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiSave,
  FiX,
} from "react-icons/fi";

export default function StudentsManagement() {
  const gradeManagerId = "manager_001";
  const assignedGrade = 8; // Grade 8

  const gradeTheme = {
    primary: "#3FA7A3",
    secondary: "#6C63FF",
    accent: "#2ECC71",
    dark: "#1E293B",
    light: "#64748B",
    background: "#F8FAFC",
    white: "#FFFFFF",
  };

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john@school.edu",
      phone: "09123456",
      class: "A",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@school.edu",
      phone: "09234567",
      class: "B",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael@school.edu",
      phone: "09345678",
      class: "A",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@school.edu",
      phone: "09456789",
      class: "C",
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david@school.edu",
      phone: "09567890",
      class: "D",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [classFilter, setClassFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    class: "A",
  });

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchClass = classFilter === "All" || student.class === classFilter;
      const matchSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchClass && matchSearch;
    });
  }, [students, classFilter, searchTerm]);

  const openCreateModal = () => {
    setFormData({ name: "", email: "", phone: "", class: "A" });
    setIsEditing(false);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setFormData(student);
    setIsEditing(true);
    setEditingId(student.id);
    setShowModal(true);
  };

  const saveStudent = () => {
    if (formData.name.trim() && formData.email.trim()) {
      if (isEditing) {
        setStudents(
          students.map((s) =>
            s.id === editingId ? { ...formData, id: editingId } : s
          )
        );
      } else {
        setStudents([...students, { ...formData, id: Date.now() }]);
      }
      setShowModal(false);
      setFormData({ name: "", email: "", phone: "", class: "A" });
    }
  };

  const deleteStudent = (id) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: gradeTheme.background }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: gradeTheme.dark }}
        >
          Students Management
        </h1>
        <p className="text-sm" style={{ color: gradeTheme.light }}>
          Manage students for Grade {assignedGrade}
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: gradeTheme.dark }}
          >
            Filter by Class
          </label>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-full p-2 border"
            style={{
              backgroundColor: gradeTheme.white,
              borderColor: "#E2E8F0",
              color: gradeTheme.dark,
            }}
          >
            <option>All</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
            <option>D</option>
            <option>E</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: gradeTheme.dark }}
          >
            Search by Name or Email
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student..."
              className="flex-1 p-2 border"
              style={{
                backgroundColor: gradeTheme.white,
                borderColor: "#E2E8F0",
                color: gradeTheme.dark,
              }}
            />
            <button
              className="px-4 py-2 text-sm font-medium flex items-center gap-2"
              style={{
                backgroundColor: gradeTheme.primary,
                color: gradeTheme.white,
                border: `1px solid ${gradeTheme.primary}`,
              }}
            >
              <FiSearch size={16} />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Add Student Button */}
      <div className="mb-6">
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-6 py-2 text-sm font-medium"
          style={{
            backgroundColor: gradeTheme.primary,
            color: gradeTheme.white,
            border: `1px solid ${gradeTheme.primary}`,
          }}
        >
          <FiPlus size={16} />
          Add New Student
        </button>
      </div>

      {/* Students Table */}
      <div
        className="border shadow-md overflow-hidden"
        style={{
          backgroundColor: gradeTheme.white,
          borderColor: "#E2E8F0",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: gradeTheme.background }}>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                  style={{ color: gradeTheme.light, borderColor: "#E2E8F0" }}
                >
                  Name
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                  style={{ color: gradeTheme.light, borderColor: "#E2E8F0" }}
                >
                  Email
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                  style={{ color: gradeTheme.light, borderColor: "#E2E8F0" }}
                >
                  Phone
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                  style={{ color: gradeTheme.light, borderColor: "#E2E8F0" }}
                >
                  Class
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                  style={{ color: gradeTheme.light, borderColor: "#E2E8F0" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td
                    className="px-6 py-4 text-sm border"
                    style={{
                      borderColor: "#E2E8F0",
                      color: gradeTheme.dark,
                    }}
                  >
                    {student.name}
                  </td>
                  <td
                    className="px-6 py-4 text-sm border"
                    style={{
                      borderColor: "#E2E8F0",
                      color: gradeTheme.dark,
                    }}
                  >
                    {student.email}
                  </td>
                  <td
                    className="px-6 py-4 text-sm border"
                    style={{
                      borderColor: "#E2E8F0",
                      color: gradeTheme.dark,
                    }}
                  >
                    {student.phone}
                  </td>
                  <td
                    className="px-6 py-4 text-sm border"
                    style={{
                      borderColor: "#E2E8F0",
                      color: gradeTheme.dark,
                    }}
                  >
                    Class {student.class}
                  </td>
                  <td
                    className="px-6 py-4 text-sm border"
                    style={{ borderColor: "#E2E8F0" }}
                  >
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(student)}
                        className="p-2"
                        style={{
                          color: gradeTheme.primary,
                          border: `1px solid ${gradeTheme.primary}`,
                          backgroundColor: gradeTheme.background,
                        }}
                      >
                        <FiEdit size={14} />
                      </button>
                      <button
                        onClick={() => deleteStudent(student.id)}
                        className="p-2"
                        style={{
                          color: "#E74C3C",
                          backgroundColor: "#FEF2F2",
                          border: "1px solid #E74C3C",
                        }}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className="bg-white p-6 border shadow-lg max-w-md w-full"
            style={{
              backgroundColor: gradeTheme.white,
              borderColor: "#E2E8F0",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2
                className="text-xl font-semibold"
                style={{ color: gradeTheme.dark }}
              >
                {isEditing ? "Edit Student" : "Add New Student"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1"
                style={{ color: gradeTheme.light }}
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: gradeTheme.dark }}
                >
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-2 border"
                  style={{
                    backgroundColor: gradeTheme.background,
                    borderColor: "#E2E8F0",
                    color: gradeTheme.dark,
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: gradeTheme.dark }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-2 border"
                  style={{
                    backgroundColor: gradeTheme.background,
                    borderColor: "#E2E8F0",
                    color: gradeTheme.dark,
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: gradeTheme.dark }}
                >
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full p-2 border"
                  style={{
                    backgroundColor: gradeTheme.background,
                    borderColor: "#E2E8F0",
                    color: gradeTheme.dark,
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: gradeTheme.dark }}
                >
                  Class (A-E)
                </label>
                <select
                  value={formData.class}
                  onChange={(e) =>
                    setFormData({ ...formData, class: e.target.value })
                  }
                  className="w-full p-2 border"
                  style={{
                    backgroundColor: gradeTheme.background,
                    borderColor: "#E2E8F0",
                    color: gradeTheme.dark,
                  }}
                >
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                  <option>D</option>
                  <option>E</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={saveStudent}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium"
                style={{
                  backgroundColor: gradeTheme.primary,
                  color: gradeTheme.white,
                  border: `1px solid ${gradeTheme.primary}`,
                }}
              >
                <FiSave size={14} />
                Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium"
                style={{
                  backgroundColor: gradeTheme.light,
                  color: gradeTheme.white,
                  border: `1px solid ${gradeTheme.light}`,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import { useState } from "react";
import { FiEye, FiCheck, FiX, FiAlertCircle, FiSave } from "react-icons/fi";

export default function AdmissionFormsReview() {
  const gradeManagerId = "manager_001";
  const assignedGrade = 8;

  const gradeTheme = {
    primary: "#3FA7A3",
    secondary: "#6C63FF",
    accent: "#2ECC71",
    dark: "#1E293B",
    light: "#64748B",
    background: "#F8FAFC",
    white: "#FFFFFF",
  };

  const [admissionForms, setAdmissionForms] = useState([
    {
      id: 1,
      applicantName: "Alex Smith",
      appliedGrade: 8,
      status: "pending",
      examStatus: "not_taken",
      submissionDate: "2024-11-15",
      documents: ["Birth Certificate", "Previous Records"],
      examMarks: {
        math: null,
        english: null,
        science: null,
      },
    },
    {
      id: 2,
      applicantName: "Nina Johnson",
      appliedGrade: 8,
      status: "reviewing",
      examStatus: "completed",
      submissionDate: "2024-11-10",
      documents: [
        "Birth Certificate",
        "Previous Records",
        "Medical Certificate",
      ],
      examMarks: {
        math: 78,
        english: 82,
        science: 75,
      },
    },
    {
      id: 3,
      applicantName: "Tom Brown",
      appliedGrade: 8,
      status: "pending",
      examStatus: "not_taken",
      submissionDate: "2024-11-18",
      documents: ["Birth Certificate"],
      examMarks: {
        math: null,
        english: null,
        science: null,
      },
    },
    {
      id: 4,
      applicantName: "Lily Davis",
      appliedGrade: 8,
      status: "accepted",
      examStatus: "completed",
      submissionDate: "2024-11-05",
      documents: ["Birth Certificate", "Previous Records"],
      examMarks: {
        math: 85,
        english: 88,
        science: 90,
      },
    },
  ]);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("pending");
  const [examMarks, setExamMarks] = useState({
    math: "",
    english: "",
    science: "",
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#F39C12";
      case "reviewing":
        return "#3498DB";
      case "accepted":
        return gradeTheme.accent;
      case "rejected":
        return "#E74C3C";
      default:
        return gradeTheme.light;
    }
  };

  const openReview = (form) => {
    setSelectedForm(form);
    setStatusUpdate(form.status);
    setExamMarks(form.examMarks || { math: "", english: "", science: "" });
    setShowReviewModal(true);
  };

  const updateStatus = (newStatus) => {
    setAdmissionForms(
      admissionForms.map((form) =>
        form.id === selectedForm.id ? { ...form, status: newStatus } : form
      )
    );
    setStatusUpdate(newStatus);
  };

  const saveExamMarks = () => {
    if (selectedForm) {
      setAdmissionForms(
        admissionForms.map((form) =>
          form.id === selectedForm.id
            ? { ...form, examMarks, examStatus: "completed" }
            : form
        )
      );
      setSelectedForm({ ...selectedForm, examMarks, examStatus: "completed" });
    }
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
          Admission Forms Review
        </h1>
        <p className="text-sm" style={{ color: gradeTheme.light }}>
          Review and process admission forms for Grade {assignedGrade}
        </p>
      </div>

      {/* Admission Forms Table */}
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
                  Applicant Name
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                  style={{ color: gradeTheme.light, borderColor: "#E2E8F0" }}
                >
                  Applied Grade
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                  style={{ color: gradeTheme.light, borderColor: "#E2E8F0" }}
                >
                  Status
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                  style={{ color: gradeTheme.light, borderColor: "#E2E8F0" }}
                >
                  Exam Status
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                  style={{ color: gradeTheme.light, borderColor: "#E2E8F0" }}
                >
                  Submission Date
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                  style={{ color: gradeTheme.light, borderColor: "#E2E8F0" }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {admissionForms.map((form) => (
                <tr
                  key={form.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td
                    className="px-6 py-4 text-sm border"
                    style={{
                      borderColor: "#E2E8F0",
                      color: gradeTheme.dark,
                    }}
                  >
                    {form.applicantName}
                  </td>
                  <td
                    className="px-6 py-4 text-sm border"
                    style={{
                      borderColor: "#E2E8F0",
                      color: gradeTheme.dark,
                    }}
                  >
                    Grade {form.appliedGrade}
                  </td>
                  <td
                    className="px-6 py-4 text-sm border"
                    style={{ borderColor: "#E2E8F0" }}
                  >
                    <span
                      className="inline-flex items-center px-3 py-1 text-xs font-medium border"
                      style={{
                        backgroundColor: getStatusColor(form.status) + "15",
                        color: getStatusColor(form.status),
                        borderColor: getStatusColor(form.status),
                      }}
                    >
                      {form.status.charAt(0).toUpperCase() +
                        form.status.slice(1)}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 text-sm border"
                    style={{
                      borderColor: "#E2E8F0",
                      color: gradeTheme.dark,
                    }}
                  >
                    {form.examStatus === "completed"
                      ? "Completed"
                      : "Not Taken"}
                  </td>
                  <td
                    className="px-6 py-4 text-sm border"
                    style={{
                      borderColor: "#E2E8F0",
                      color: gradeTheme.light,
                    }}
                  >
                    {form.submissionDate}
                  </td>
                  <td
                    className="px-6 py-4 text-sm border"
                    style={{ borderColor: "#E2E8F0" }}
                  >
                    <button
                      onClick={() => openReview(form)}
                      className="flex items-center gap-2 px-3 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: gradeTheme.primary,
                        color: gradeTheme.white,
                        border: `1px solid ${gradeTheme.primary}`,
                      }}
                    >
                      <FiEye size={12} />
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div
            className="bg-white p-6 border shadow-lg max-w-2xl w-full my-8"
            style={{
              backgroundColor: gradeTheme.white,
              borderColor: "#E2E8F0",
            }}
          >
            <div className="mb-6">
              <h2
                className="text-2xl font-semibold"
                style={{ color: gradeTheme.dark }}
              >
                Review Admission Form
              </h2>
              <p className="text-sm mt-1" style={{ color: gradeTheme.light }}>
                {selectedForm.applicantName}
              </p>
            </div>

            {/* Student Details */}
            <div
              className="mb-6 p-4 border-l-4"
              style={{
                borderLeftColor: gradeTheme.primary,
                backgroundColor: gradeTheme.background,
              }}
            >
              <h3
                className="font-semibold mb-3"
                style={{ color: gradeTheme.dark }}
              >
                Student Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p style={{ color: gradeTheme.light }}>Applicant Name</p>
                  <p className="font-medium" style={{ color: gradeTheme.dark }}>
                    {selectedForm.applicantName}
                  </p>
                </div>
                <div>
                  <p style={{ color: gradeTheme.light }}>Applied Grade</p>
                  <p className="font-medium" style={{ color: gradeTheme.dark }}>
                    Grade {selectedForm.appliedGrade}
                  </p>
                </div>
                <div>
                  <p style={{ color: gradeTheme.light }}>Submission Date</p>
                  <p className="font-medium" style={{ color: gradeTheme.dark }}>
                    {selectedForm.submissionDate}
                  </p>
                </div>
                <div>
                  <p style={{ color: gradeTheme.light }}>Documents</p>
                  <p className="font-medium" style={{ color: gradeTheme.dark }}>
                    {selectedForm.documents.length} files
                  </p>
                </div>
              </div>
            </div>

            {/* Entrance Exam Marks */}
            <div
              className="mb-6 p-4 border-l-4"
              style={{
                borderLeftColor: gradeTheme.secondary,
                backgroundColor: gradeTheme.background,
              }}
            >
              <h3
                className="font-semibold mb-4"
                style={{ color: gradeTheme.dark }}
              >
                Entrance Exam Marks
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: gradeTheme.dark }}
                  >
                    Math
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={examMarks.math || ""}
                    onChange={(e) =>
                      setExamMarks({
                        ...examMarks,
                        math: Number.parseInt(e.target.value) || null,
                      })
                    }
                    className="w-full p-2 border"
                    style={{
                      backgroundColor: gradeTheme.white,
                      borderColor: "#E2E8F0",
                      color: gradeTheme.dark,
                    }}
                    placeholder="0-100"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: gradeTheme.dark }}
                  >
                    English
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={examMarks.english || ""}
                    onChange={(e) =>
                      setExamMarks({
                        ...examMarks,
                        english: Number.parseInt(e.target.value) || null,
                      })
                    }
                    className="w-full p-2 border"
                    style={{
                      backgroundColor: gradeTheme.white,
                      borderColor: "#E2E8F0",
                      color: gradeTheme.dark,
                    }}
                    placeholder="0-100"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: gradeTheme.dark }}
                  >
                    Science
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={examMarks.science || ""}
                    onChange={(e) =>
                      setExamMarks({
                        ...examMarks,
                        science: Number.parseInt(e.target.value) || null,
                      })
                    }
                    className="w-full p-2 border"
                    style={{
                      backgroundColor: gradeTheme.white,
                      borderColor: "#E2E8F0",
                      color: gradeTheme.dark,
                    }}
                    placeholder="0-100"
                  />
                </div>
              </div>
              <button
                onClick={saveExamMarks}
                className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium"
                style={{
                  backgroundColor: gradeTheme.accent,
                  color: gradeTheme.white,
                  border: `1px solid ${gradeTheme.accent}`,
                }}
              >
                <FiSave size={14} />
                Save Marks
              </button>
            </div>

            {/* Status Update */}
            <div
              className="mb-6 p-4 border-l-4"
              style={{
                borderLeftColor: gradeTheme.accent,
                backgroundColor: gradeTheme.background,
              }}
            >
              <h3
                className="font-semibold mb-4"
                style={{ color: gradeTheme.dark }}
              >
                Application Status
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateStatus("reviewing")}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border"
                  style={{
                    backgroundColor:
                      statusUpdate === "reviewing"
                        ? "#3498DB"
                        : gradeTheme.background,
                    color:
                      statusUpdate === "reviewing"
                        ? gradeTheme.white
                        : "#3498DB",
                    borderColor: "#3498DB",
                  }}
                >
                  <FiAlertCircle size={14} />
                  Under Review
                </button>
                <button
                  onClick={() => updateStatus("accepted")}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border"
                  style={{
                    backgroundColor:
                      statusUpdate === "accepted"
                        ? gradeTheme.accent
                        : gradeTheme.background,
                    color:
                      statusUpdate === "accepted"
                        ? gradeTheme.white
                        : gradeTheme.accent,
                    borderColor: gradeTheme.accent,
                  }}
                >
                  <FiCheck size={14} />
                  Accept
                </button>
                <button
                  onClick={() => updateStatus("rejected")}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border col-span-2"
                  style={{
                    backgroundColor:
                      statusUpdate === "rejected"
                        ? "#E74C3C"
                        : gradeTheme.background,
                    color:
                      statusUpdate === "rejected"
                        ? gradeTheme.white
                        : "#E74C3C",
                    borderColor: "#E74C3C",
                  }}
                >
                  <FiX size={14} />
                  Reject
                </button>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-6 py-2 text-sm font-medium"
                style={{
                  backgroundColor: gradeTheme.light,
                  color: gradeTheme.white,
                  border: `1px solid ${gradeTheme.light}`,
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

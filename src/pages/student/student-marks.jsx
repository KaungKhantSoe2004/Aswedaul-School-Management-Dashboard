"use client";
import { useState, useMemo } from "react";
import { FiFilter } from "react-icons/fi";

export default function MyMarks() {
  const studentTheme = {
    primary: "#3FA7A3",
    secondary: "#6C63FF",
    accent: "#2ECC71",
    dark: "#1E293B",
    light: "#64748B",
    background: "#F8FAFC",
    white: "#FFFFFF",
  };

  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedExam, setSelectedExam] = useState("All");
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [showFinalOnly, setShowFinalOnly] = useState(false);

  const examsData = useMemo(
    () => [
      {
        id: 1,
        exam: "Midterm Exam",
        subject: "Mathematics",
        marks: 92,
        total: 100,
        grade: "A+",
        date: "2024-12-10",
        type: "final",
      },
      {
        id: 2,
        exam: "Midterm Exam",
        subject: "English",
        marks: 88,
        total: 100,
        grade: "A",
        date: "2024-12-10",
        type: "final",
      },
      {
        id: 3,
        exam: "Midterm Exam",
        subject: "Science",
        marks: 85,
        total: 100,
        grade: "A",
        date: "2024-12-12",
        type: "final",
      },
      {
        id: 4,
        exam: "Assignment 1",
        subject: "ICT",
        marks: 45,
        total: 50,
        grade: "A+",
        date: "2024-11-25",
        type: "assignment",
      },
      {
        id: 5,
        exam: "Class Test",
        subject: "Myanmar",
        marks: 78,
        total: 100,
        grade: "B+",
        date: "2024-11-20",
        type: "final",
      },
    ],
    []
  );

  const filteredExams = useMemo(() => {
    let filtered = examsData;

    if (selectedSubject !== "All") {
      filtered = filtered.filter((e) => e.subject === selectedSubject);
    }
    if (selectedExam !== "All") {
      filtered = filtered.filter((e) => e.exam === selectedExam);
    }
    if (showFinalOnly) {
      filtered = filtered.filter((e) => e.type === "final");
    }

    return filtered;
  }, [examsData, selectedSubject, selectedExam, showFinalOnly]);

  const subjects = [
    "All",
    "Mathematics",
    "English",
    "Science",
    "ICT",
    "Myanmar",
  ];
  const exams = ["All", "Midterm Exam", "Assignment 1", "Class Test"];
  const years = ["2024-2025", "2023-2024", "2022-2023"];

  const getGradeColor = (grade) => {
    if (grade.includes("A")) return studentTheme.accent;
    if (grade.includes("B")) return "#F39C12";
    return "#E74C3C";
  };

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
          My Marks
        </h1>
        <p className="text-sm" style={{ color: studentTheme.light }}>
          View all your exam results and performance
        </p>
      </div>

      {/* Filters */}
      <section
        className="mb-8 p-6 border shadow-sm"
        style={{
          backgroundColor: studentTheme.white,
          borderColor: "#E2E8F0",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <FiFilter size={20} style={{ color: studentTheme.primary }} />
          <h2
            className="text-lg font-semibold"
            style={{ color: studentTheme.dark }}
          >
            Filters
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: studentTheme.dark }}
            >
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2 border"
              style={{
                backgroundColor: studentTheme.background,
                borderColor: "#E2E8F0",
                color: studentTheme.dark,
              }}
            >
              {subjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: studentTheme.dark }}
            >
              Exam Type
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full p-2 border"
              style={{
                backgroundColor: studentTheme.background,
                borderColor: "#E2E8F0",
                color: studentTheme.dark,
              }}
            >
              {exams.map((exam) => (
                <option key={exam} value={exam}>
                  {exam}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: studentTheme.dark }}
            >
              Academic Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2 border"
              style={{
                backgroundColor: studentTheme.background,
                borderColor: "#E2E8F0",
                color: studentTheme.dark,
              }}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showFinalOnly}
            onChange={(e) => setShowFinalOnly(e.target.checked)}
          />
          <span style={{ color: studentTheme.dark }}>
            Show only Final exams
          </span>
        </label>
      </section>

      {/* Results Table */}
      <section
        className="border shadow-sm overflow-hidden"
        style={{
          backgroundColor: studentTheme.white,
          borderColor: "#E2E8F0",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: studentTheme.background }}>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                  style={{ color: studentTheme.light, borderColor: "#E2E8F0" }}
                >
                  Exam
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                  style={{ color: studentTheme.light, borderColor: "#E2E8F0" }}
                >
                  Subject
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                  style={{ color: studentTheme.light, borderColor: "#E2E8F0" }}
                >
                  Marks
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                  style={{ color: studentTheme.light, borderColor: "#E2E8F0" }}
                >
                  Grade
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                  style={{ color: studentTheme.light, borderColor: "#E2E8F0" }}
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td
                    className="px-6 py-4 text-sm border"
                    style={{
                      borderColor: "#E2E8F0",
                      color: studentTheme.dark,
                    }}
                  >
                    {exam.exam}
                  </td>
                  <td
                    className="px-6 py-4 text-sm border"
                    style={{
                      borderColor: "#E2E8F0",
                      color: studentTheme.dark,
                    }}
                  >
                    {exam.subject}
                  </td>
                  <td
                    className="px-6 py-4 text-sm font-medium border"
                    style={{
                      borderColor: "#E2E8F0",
                      color: studentTheme.dark,
                    }}
                  >
                    {exam.marks}/{exam.total}
                  </td>
                  <td
                    className="px-6 py-4 text-sm font-semibold border"
                    style={{
                      borderColor: "#E2E8F0",
                      color: getGradeColor(exam.grade),
                    }}
                  >
                    {exam.grade}
                  </td>
                  <td
                    className="px-6 py-4 text-sm border"
                    style={{
                      borderColor: "#E2E8F0",
                      color: studentTheme.light,
                    }}
                  >
                    {exam.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

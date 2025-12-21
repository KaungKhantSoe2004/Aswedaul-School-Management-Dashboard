"use client";
import { useState, useMemo } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function TopStudent() {
  const studentTheme = {
    primary: "#3FA7A3",
    secondary: "#6C63FF",
    accent: "#2ECC71",
    dark: "#1E293B",
    light: "#64748B",
    background: "#F8FAFC",
    white: "#FFFFFF",
  };

  const [currentPages, setCurrentPages] = useState({
    A_boys: 0,
    A_girls: 0,
    B_boys: 0,
    B_girls: 0,
    C_boys: 0,
    C_girls: 0,
    D_boys: 0,
    D_girls: 0,
    E_boys: 0,
    E_girls: 0,
    F_boys: 0,
    F_girls: 0,
  });

  const generateStudents = (gradeClass, gender) => {
    const maleNames = [
      "Kyaw",
      "Min",
      "Aung",
      "Ko",
      "Sein",
      "Thant",
      "Win",
      "Mg",
      "Thura",
      "Lin",
      "John",
      "David",
      "Michael",
      "James",
      "Robert",
      "William",
      "Richard",
      "Joseph",
      "Charles",
      "Daniel",
    ];
    const femaleNames = [
      "Su",
      "Hnin",
      "Thiri",
      "May",
      "Zin",
      "Win",
      "Yu",
      "San",
      "Ei",
      "Aye",
      "Sarah",
      "Emily",
      "Jessica",
      "Ashley",
      "Jennifer",
      "Maria",
      "Maria",
      "Linda",
      "Barbara",
      "Lisa",
    ];
    const surnames = [
      "Gyi",
      "Thu",
      "Soe",
      "Kyaw",
      "Aung",
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
      "Martinez",
      "Hernandez",
      "Lopez",
      "Gonzalez",
      "Wilson",
      "Anderson",
    ];

    const students = [];
    const namePool = gender === "male" ? maleNames : femaleNames;
    for (let i = 1; i <= 50; i++) {
      const score = Math.floor(Math.random() * 40) + 60;
      students.push({
        id: i,
        name: `${namePool[Math.floor(Math.random() * namePool.length)]} ${
          surnames[Math.floor(Math.random() * surnames.length)]
        }`,
        marks: score,
        subject: ["Mathematics", "English", "Science", "ICT", "Myanmar"][
          Math.floor(Math.random() * 5)
        ],
        rank: i,
      });
    }

    return students.sort((a, b) => b.marks - a.marks).slice(0, 5);
  };

  const studentsByClass = useMemo(
    () => ({
      A_boys: generateStudents("A", "male"),
      A_girls: generateStudents("A", "female"),
      B_boys: generateStudents("B", "male"),
      B_girls: generateStudents("B", "female"),
      C_boys: generateStudents("C", "male"),
      C_girls: generateStudents("C", "female"),
      D_boys: generateStudents("D", "male"),
      D_girls: generateStudents("D", "female"),
      E_boys: generateStudents("E", "male"),
      E_girls: generateStudents("E", "female"),
      F_boys: generateStudents("F", "male"),
      F_girls: generateStudents("F", "female"),
    }),
    []
  );

  const ITEMS_PER_PAGE = 5;

  const handlePageChange = (key, increment) => {
    setCurrentPages((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + increment),
    }));
  };

  const StudentTable = ({ title, students, classGrade, gender, pageKey }) => {
    const startIdx = currentPages[pageKey] * ITEMS_PER_PAGE;
    const paginatedStudents = students.slice(
      startIdx,
      startIdx + ITEMS_PER_PAGE
    );
    const totalPages = Math.ceil(students.length / ITEMS_PER_PAGE);

    return (
      <div
        className="border shadow-sm overflow-hidden mb-6"
        style={{
          backgroundColor: studentTheme.white,
          borderColor: "#E2E8F0",
        }}
      >
        <div className="p-4 border-b" style={{ borderColor: "#E2E8F0" }}>
          <h3
            className="text-lg font-semibold"
            style={{ color: studentTheme.dark }}
          >
            {title}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: studentTheme.background }}>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                  style={{ color: studentTheme.light, borderColor: "#E2E8F0" }}
                >
                  Rank
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                  style={{ color: studentTheme.light, borderColor: "#E2E8F0" }}
                >
                  Name
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                  style={{ color: studentTheme.light, borderColor: "#E2E8F0" }}
                >
                  Marks %
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                  style={{ color: studentTheme.light, borderColor: "#E2E8F0" }}
                >
                  Subject Highlight
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td
                    className="px-6 py-4 text-sm font-bold border"
                    style={{
                      borderColor: "#E2E8F0",
                      color: studentTheme.primary,
                    }}
                  >
                    #{student.rank}
                  </td>
                  <td
                    className="px-6 py-4 text-sm font-medium border"
                    style={{
                      borderColor: "#E2E8F0",
                      color: studentTheme.dark,
                    }}
                  >
                    {student.name}
                  </td>
                  <td
                    className="px-6 py-4 text-sm font-bold border"
                    style={{
                      borderColor: "#E2E8F0",
                      color: studentTheme.accent,
                    }}
                  >
                    {student.marks}%
                  </td>
                  <td
                    className="px-6 py-4 text-sm border"
                    style={{
                      borderColor: "#E2E8F0",
                      color: studentTheme.dark,
                    }}
                  >
                    {student.subject}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className="p-4 flex items-center justify-between"
          style={{ borderColor: "#E2E8F0" }}
        >
          <button
            onClick={() => handlePageChange(pageKey, -1)}
            disabled={currentPages[pageKey] === 0}
            className="p-2 disabled:opacity-50"
            style={{
              backgroundColor:
                currentPages[pageKey] === 0 ? "#E2E8F0" : studentTheme.primary,
              color: studentTheme.white,
              border: `1px solid ${
                currentPages[pageKey] === 0 ? "#E2E8F0" : studentTheme.primary
              }`,
            }}
          >
            <FiChevronLeft size={16} />
          </button>
          <span style={{ color: studentTheme.dark }}>
            Page {currentPages[pageKey] + 1} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pageKey, 1)}
            disabled={currentPages[pageKey] >= totalPages - 1}
            className="p-2 disabled:opacity-50"
            style={{
              backgroundColor:
                currentPages[pageKey] >= totalPages - 1
                  ? "#E2E8F0"
                  : studentTheme.primary,
              color: studentTheme.white,
              border: `1px solid ${
                currentPages[pageKey] >= totalPages - 1
                  ? "#E2E8F0"
                  : studentTheme.primary
              }`,
            }}
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  const classes = ["A", "B", "C", "D", "E", "F"];

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
          Top Students by Class
        </h1>
        <p className="text-sm" style={{ color: studentTheme.light }}>
          Top 5 Male and Female students for each class (A - F)
        </p>
      </div>

      {/* Classes */}
      {classes.map((classGrade) => (
        <section key={classGrade} className="mb-12">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: studentTheme.dark }}
          >
            Class {classGrade}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 5 Boys */}
            <StudentTable
              title={`Class ${classGrade} - Top 5 Boys`}
              students={studentsByClass[`${classGrade}_boys`]}
              classGrade={classGrade}
              gender="boys"
              pageKey={`${classGrade}_boys`}
            />

            {/* Top 5 Girls */}
            <StudentTable
              title={`Class ${classGrade} - Top 5 Girls`}
              students={studentsByClass[`${classGrade}_girls`]}
              classGrade={classGrade}
              gender="girls"
              pageKey={`${classGrade}_girls`}
            />
          </div>
        </section>
      ))}
    </div>
  );
}

"use client";
import axios from "axios";
import { useState, useMemo, useEffect } from "react";
import { FiFilter } from "react-icons/fi";
import { useSelector } from "react-redux";

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
  
  const admin_backend_domain_name = import.meta.env.VITE_ADMIN_BACKEND_DOMAIN_NAME;
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedExam, setSelectedExam] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [showFinalOnly, setShowFinalOnly] = useState(false);
  const [examsData, setExamsData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const profile = useSelector(state => state.profile.profile);

  // Transform API response array to match component structure
  const transformData = (apiDataArray) => {
    if (!Array.isArray(apiDataArray) || apiDataArray.length === 0) return [];

    return apiDataArray.map(examData => {
      // Extract exam info
      const examInfo = {
        id: examData.id,
        exam_name: examData.exam_name || "Exam",
        exam_type: examData.exam_type || "unit_test",
        exam_start_date: examData.exam_start_date,
        exam_end_date: examData.exam_end_date,
        grade: examData.grade,
        status: examData.status,
        created_at: examData.created_at,
        updated_at: examData.updated_at,
        academic_year: examData.marks?.[0]?.academic_year || "2026"
      };

      // Filter marks for the current student
      const studentMarks = examData.marks?.filter(mark => 
        mark.student_id === profile?.id
      ) || [];

      // Transform student marks into subjects
      const subjects = studentMarks.map(mark => {
        const percentage = (parseFloat(mark.get_mark) / parseFloat(mark.max_mark)) * 100;
        const grade = calculateGrade(percentage);
        
        return {
          id: mark.id,
          subject_id: mark.subject_id,
          subject_name: mark.subject_name,
          marks: parseFloat(mark.get_mark),
          total: parseFloat(mark.max_mark),
          min_mark: mark.min_mark,
          is_passed: mark.is_passed,
          status: mark.status,
          grade: grade,
          percentage: percentage,
          note: mark.note || "",
          teacher_id: mark.teacher_id
        };
      });

      // Find student's overall result for this exam
      const studentResult = examData.result?.find(result => 
        result.exam_id === examData.id && result.student_id === profile?.id
      ) || {};

      // Calculate overall stats
      const totalGotMarks = parseFloat(studentResult.total_got_marks || 0);
      const fullMarks = parseFloat(studentResult.full_marks || subjects.reduce((sum, subj) => sum + subj.total, 0));
      const overallPercentage = fullMarks > 0 ? (totalGotMarks / fullMarks) * 100 : 0;
      const overallGrade = calculateGrade(overallPercentage);

      // Format dates
      const examDate = new Date(examData.exam_start_date);
      const formattedDate = examDate.toISOString().split('T')[0];
      const formattedFullDate = examDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      return {
        exam_id: examData.id,
        exam_name: examData.exam_name,
        exam_type: examData.exam_type,
        exam_start_date: formattedDate,
        exam_end_date: examData.exam_end_date,
        formatted_full_date: formattedFullDate,
        subjects: subjects,
        overall_percentage: overallPercentage,
        overall_grade: overallGrade,
        total_got_marks: totalGotMarks,
        full_marks: fullMarks,
        result_status: studentResult.result_status || "pending",
        academic_year: examInfo.academic_year,
        status: examData.status
      };
    });
  };

  // Grade calculation function
  const calculateGrade = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C+";
    if (percentage >= 40) return "C";
    return "F";
  };

  // Get all unique subjects from exams data
  const getAllSubjects = (exams) => {
    const subjectsSet = new Set(["All"]);
    exams.forEach(exam => {
      exam.subjects?.forEach(subject => {
        subjectsSet.add(subject.subject_name);
      });
    });
    return Array.from(subjectsSet);
  };

  // Get all unique exams from exams data
  const getAllExams = (exams) => {
    const examsSet = new Set(["All"]);
    exams.forEach(exam => {
      examsSet.add(exam.exam_name);
    });
    return Array.from(examsSet);
  };

  // Get all unique academic years from exams data
  const getAllYears = (exams) => {
    const yearsSet = new Set(["All"]);
    exams.forEach(exam => {
      if (exam.academic_year) {
        yearsSet.add(exam.academic_year);
      }
    });
    return Array.from(yearsSet);
  };

  // Flatten all subjects for the table
  const flattenSubjects = (exams) => {
    const flattened = [];
    exams.forEach(exam => {
      exam.subjects?.forEach(subject => {
        flattened.push({
          ...subject,
          exam_id: exam.exam_id,
          exam_name: exam.exam_name,
          exam_date: exam.exam_start_date,
          exam_type: exam.exam_type,
          academic_year: exam.academic_year,
          overall_grade: exam.overall_grade,
          overall_percentage: exam.overall_percentage,
          result_status: exam.result_status
        });
      });
    });
    return flattened;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${admin_backend_domain_name}api/student/marks/${profile.grade}/${profile.id}`, 
        { withCredentials: true }
      );
      
      if (response.status === 200 && Array.isArray(response.data?.data)) {
        const transformedData = transformData(response.data.data);
        setExamsData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching marks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.grade && profile?.id) {
      fetchData();
    }
  }, [profile]);

  // Get unique subjects, exams, and years
  const subjects = getAllSubjects(examsData);
  const exams = getAllExams(examsData);
  const years = getAllYears(examsData);

  // Flatten and filter subjects
  const flattenedSubjects = flattenSubjects(examsData);
  const filteredSubjects = useMemo(() => {
    let filtered = flattenedSubjects;

    if (selectedSubject !== "All") {
      filtered = filtered.filter((e) => e.subject_name === selectedSubject);
    }
    if (selectedExam !== "All") {
      filtered = filtered.filter((e) => e.exam_name === selectedExam);
    }
    if (selectedYear !== "All") {
      filtered = filtered.filter((e) => e.academic_year === selectedYear);
    }
    if (showFinalOnly) {
      filtered = filtered.filter((e) => e.exam_type === "final");
    }

    return filtered;
  }, [flattenedSubjects, selectedSubject, selectedExam, selectedYear, showFinalOnly]);

  const getGradeColor = (grade) => {
    if (grade.includes("A+")) return "#10B981"; // Emerald
    if (grade.includes("A")) return "#3B82F6"; // Blue
    if (grade.includes("B+")) return "#8B5CF6"; // Violet
    if (grade.includes("B")) return "#F59E0B"; // Amber
    if (grade.includes("C+")) return "#EC4899"; // Pink
    if (grade.includes("C")) return "#14B8A6"; // Teal
    return "#EF4444"; // Red for F
  };

  const getExamTypeLabel = (type) => {
    switch(type) {
      case 'unit_test': return 'Unit Test';
      case 'midterm': return 'Midterm';
      case 'final': return 'Final';
      case 'assignment': return 'Assignment';
      default: return type || 'Exam';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: studentTheme.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: studentTheme.primary }}></div>
          <p className="mt-4" style={{ color: studentTheme.dark }}>Loading marks...</p>
        </div>
      </div>
    );
  }

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
        className="mb-8 p-6 border shadow-sm rounded-lg"
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: studentTheme.white,
                borderColor: "#E2E8F0",
                color: studentTheme.dark,
                focusRingColor: studentTheme.primary
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
              Exam
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: studentTheme.white,
                borderColor: "#E2E8F0",
                color: studentTheme.dark,
                focusRingColor: studentTheme.primary
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
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: studentTheme.white,
                borderColor: "#E2E8F0",
                color: studentTheme.dark,
                focusRingColor: studentTheme.primary
              }}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 p-2">
              <input
                type="checkbox"
                checked={showFinalOnly}
                onChange={(e) => setShowFinalOnly(e.target.checked)}
                className="w-4 h-4"
                style={{ accentColor: studentTheme.primary }}
              />
              <span className="text-sm" style={{ color: studentTheme.dark }}>
                Final Exams Only
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* Results Table */}
      <section
        className="border shadow-sm overflow-hidden mb-8 rounded-lg"
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
                  Percentage
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border"
                  style={{ color: studentTheme.light, borderColor: "#E2E8F0" }}
                >
                  Status
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
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => (
                  <tr key={`${subject.exam_id}_${subject.subject_id}`} className="hover:bg-gray-50">
                    <td
                      className="px-6 py-4 text-sm border"
                      style={{
                        borderColor: "#E2E8F0",
                        color: studentTheme.dark,
                      }}
                    >
                      <div className="font-medium">{subject.exam_name}</div>
                      <div className="text-xs" style={{ color: studentTheme.light }}>
                        {getExamTypeLabel(subject.exam_type)}
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 text-sm border"
                      style={{
                        borderColor: "#E2E8F0",
                        color: studentTheme.dark,
                      }}
                    >
                      {subject.subject_name}
                    </td>
                    <td
                      className="px-6 py-4 text-sm font-medium border"
                      style={{
                        borderColor: "#E2E8F0",
                        color: studentTheme.dark,
                      }}
                    >
                      {subject.marks}/{subject.total}
                    </td>
                    <td
                      className="px-6 py-4 text-sm font-semibold border"
                      style={{
                        borderColor: "#E2E8F0",
                        color: getGradeColor(subject.grade),
                      }}
                    >
                      {subject.grade}
                    </td>
                    <td
                      className="px-6 py-4 text-sm border"
                      style={{
                        borderColor: "#E2E8F0",
                        color: studentTheme.dark,
                      }}
                    >
                      {subject.percentage.toFixed(1)}%
                    </td>
                    <td
                      className="px-6 py-4 text-sm border"
                      style={{
                        borderColor: "#E2E8F0",
                        color: subject.is_passed ? studentTheme.accent : "#EF4444",
                      }}
                    >
                      <span className={`px-2 py-1 rounded-full text-xs ${subject.is_passed ? 'bg-green-100' : 'bg-red-100'}`}>
                        {subject.is_passed ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 text-sm border"
                      style={{
                        borderColor: "#E2E8F0",
                        color: studentTheme.light,
                      }}
                    >
                      {subject.exam_date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: studentTheme.primary + '20' }}>
                        <FiFilter size={24} style={{ color: studentTheme.primary }} />
                      </div>
                      <p className="text-lg font-medium mb-2" style={{ color: studentTheme.dark }}>
                        No marks found
                      </p>
                      <p className="text-sm" style={{ color: studentTheme.light }}>
                        Try changing your filters or check back later
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Exam Summary Cards */}
      {examsData.length > 0 && (
        <section className="mb-8">
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: studentTheme.dark }}
          >
            Exam Summaries
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examsData.map((exam) => (
              <div
                key={exam.exam_id}
                className="p-6 border shadow-sm rounded-lg hover:shadow-md transition-shadow duration-300"
                style={{
                  backgroundColor: studentTheme.white,
                  borderColor: "#E2E8F0",
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: studentTheme.dark }}
                    >
                      {exam.exam_name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="px-2 py-1 text-xs font-medium rounded"
                        style={{
                          backgroundColor: studentTheme.primary + '20',
                          color: studentTheme.primary
                        }}
                      >
                        {getExamTypeLabel(exam.exam_type)}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: studentTheme.light }}
                      >
                        {exam.academic_year}
                      </span>
                    </div>
                  </div>
                  <span
                    className="px-3 py-1 text-xs font-semibold rounded-full"
                    style={{
                      backgroundColor: exam.result_status === "pass" 
                        ? `${studentTheme.accent}20`
                        : "#EF444420",
                      color: exam.result_status === "pass" 
                        ? studentTheme.accent
                        : "#EF4444",
                    }}
                  >
                    {exam.result_status === "pass" ? "PASSED" : exam.result_status === "fail" ? "FAILED" : "PENDING"}
                  </span>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span style={{ color: studentTheme.dark, fontSize: '0.875rem' }}>Overall Score</span>
                    <div className="flex items-center gap-2">
                      <span style={{ color: studentTheme.dark, fontWeight: "bold", fontSize: '1.125rem' }}>
                        {exam.total_got_marks}/{exam.full_marks}
                      </span>
                      <span 
                        className="text-sm font-semibold px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: getGradeColor(exam.overall_grade) + '20',
                          color: getGradeColor(exam.overall_grade)
                        }}
                      >
                        {exam.overall_grade}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div 
                      className="h-2.5 rounded-full"
                      style={{ 
                        width: `${Math.min(100, exam.overall_percentage)}%`,
                        backgroundColor: getGradeColor(exam.overall_grade)
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs" style={{ color: studentTheme.light }}>
                      {exam.formatted_full_date}
                    </span>
                    <span className="text-xs font-medium" style={{ color: studentTheme.dark }}>
                      {exam.overall_percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div>
                  <h4
                    className="text-sm font-medium mb-3"
                    style={{ color: studentTheme.dark }}
                  >
                    Subject Breakdown
                  </h4>
                  <div className="space-y-3">
                    {exam.subjects.map((subject) => (
                      <div key={subject.id} className="flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium" style={{ color: studentTheme.dark }}>
                            {subject.subject_name}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs" style={{ color: studentTheme.light }}>
                              {subject.marks}/{subject.total}
                            </span>
                            <span className="text-xs" style={{ color: studentTheme.light }}>
                              ({subject.percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        <span 
                          className="text-xs font-semibold px-2 py-1 rounded"
                          style={{ 
                            backgroundColor: getGradeColor(subject.grade) + '20',
                            color: getGradeColor(subject.grade)
                          }}
                        >
                          {subject.grade}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Stats Summary */}
      {examsData.length > 0 && (
        <section className="mb-8">
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: studentTheme.dark }}
          >
            Performance Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div
              className="p-6 rounded-lg shadow-sm"
              style={{
                backgroundColor: studentTheme.white,
                border: `1px solid #E2E8F0`,
              }}
            >
              <div className="text-2xl font-bold mb-2" style={{ color: studentTheme.dark }}>
                {examsData.length}
              </div>
              <div className="text-sm" style={{ color: studentTheme.light }}>
                Total Exams
              </div>
            </div>
            <div
              className="p-6 rounded-lg shadow-sm"
              style={{
                backgroundColor: studentTheme.white,
                border: `1px solid #E2E8F0`,
              }}
            >
              <div className="text-2xl font-bold mb-2" style={{ color: studentTheme.accent }}>
                {flattenedSubjects.filter(s => s.is_passed).length}
              </div>
              <div className="text-sm" style={{ color: studentTheme.light }}>
                Passed Subjects
              </div>
            </div>
            <div
              className="p-6 rounded-lg shadow-sm"
              style={{
                backgroundColor: studentTheme.white,
                border: `1px solid #E2E8F0`,
              }}
            >
              <div className="text-2xl font-bold mb-2" style={{ color: studentTheme.primary }}>
                {flattenedSubjects.length}
              </div>
              <div className="text-sm" style={{ color: studentTheme.light }}>
                Total Subjects
              </div>
            </div>
            <div
              className="p-6 rounded-lg shadow-sm"
              style={{
                backgroundColor: studentTheme.white,
                border: `1px solid #E2E8F0`,
              }}
            >
              <div className="text-2xl font-bold mb-2" style={{ color: studentTheme.secondary }}>
                {examsData.filter(e => e.result_status === "pass").length}
              </div>
              <div className="text-sm" style={{ color: studentTheme.light }}>
                Passed Exams
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
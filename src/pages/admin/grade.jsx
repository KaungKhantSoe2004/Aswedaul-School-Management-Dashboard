"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  FiUsers,
  FiUser,
  FiAirplay as FiSubject,
  FiUserCheck,
  FiBook,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSave,
  FiX,
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiMessageSquare,
  FiTarget,
  FiAward,
  FiStar,
  FiClock,
  FiCheckCircle,
  FiCalendar,
  FiList,
  FiGrid,
  FiUpload,
  FiDownload,
  FiEye,
  FiEyeOff,
  FiBarChart2,
  FiBookOpen,
  FiCheckSquare,
  FiFileText,
  FiVideo,
  FiPaperclip,
  FiExternalLink,
  FiTrendingUp,
  FiPieChart,
  FiBell,
  FiBellOff,
  FiShare2,
  FiCopy,
  FiLink,
  FiPrinter,
  FiMail,
  FiPhone,
  FiMapPin,
  FiActivity,
  FiPackage as FiPercent,
  FiGlobe,
  FiDivide,
  FiZap,
  FiDroplet,
  FiEdit2,
  FiInfo,
  FiChevronsDown,
  FiFile,
  FiCheck,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function GradeDetailPage() {
  const admin_backend_domain_name = import.meta.env.VITE_ADMIN_BACKEND_DOMAIN_NAME;
  const user_backend_domain_name = import.meta.env.VITE_BACKEND_DOMAIN_NAME;
  const {id: gradeId} = useParams();
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
  const [activeSubject, setActiveSubject] = useState("all");
  const [grade, setGrade] = useState({
    id: 10,
    label: "Grade 10",
    ageStart: 15,
    ageEnd: 16,
    studentCount: 55,
    teacherCount: 6,
    section: "A, B, C",
    totalSubjects: 8,
    academicYear: "2024-2025",
  });
  const [activeTab, setActiveTab] = useState("materials");
  const [exams, setExams] = useState([]);
  const [newExam, setNewExam] = useState({
    title: "",
    subject: "",
    date: "",
    startTime: "09:00",
    endTime: "12:00",
    type: "quarterly",
    totalMarks: 100,
    syllabus: "",
    room: "Room 101",
  });
  const [editingExamId, setEditingExamId] = useState(null);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    subject: "",
    type: "pdf",
    url: "",
    description: "",
    uploadedBy: "Teacher",
  });
  const [materialFilter, setMaterialFilter] = useState("all");
  const [studentMarksData, setStudentMarksData] = useState([]);
  const [selectedSubjectForChart, setSelectedSubjectForChart] = useState("Mathematics");
  const [chartType, setChartType] = useState("line"); 
  const [gradeInfo, setGradeInfo] = useState({
    mission: "To provide comprehensive education that fosters intellectual curiosity, critical thinking, and personal growth, preparing students for success in higher education and beyond.",
    academicExcellence: "Our grade focuses on academic rigor combined with practical applications. We maintain a student-teacher ratio of 15:1 to ensure personalized attention.",
    advancedFacilities: "Smart classrooms, science labs, computer labs, library with 10,000+ books, sports facilities, and art studios.",
    academicPrerequisites: [
      "Basic Mathematics",
      "English Proficiency",
      "Science Fundamentals",
      "Social Studies",
    ],
    entranceExamSubjects: [],
  });
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentFilter, setStudentFilter] = useState("all");
  const [teachers, setTeachers] = useState([]);
  const [teacherSearch, setTeacherSearch] = useState("");
  const [guideTeachers, setGuideTeachers] = useState([]);
  const [gradeManagers, setGradeManagers] = useState([]);
  const navigate = useNavigate(); 
  const fetchData = async()=> {
 try{
    const response = await axios.get(`${admin_backend_domain_name}api/admin/getEachGrade/${gradeId}`, {
      withCredentials:true
    })
    setTeachers(response.data.data.teachers);
    setStudents(response.data.data.students);
    setSubjects(response.data.data.subjects);

    setGradeManagers(response.data.data.managers);
 }catch(err){
  console.log(err, 'is error bro');
  
  if(err.response.status == 401){
    navigate("/login")
  }
 }
  }
  
  useEffect(() => {
    fetchData();
  },[gradeId]);

  const filteredStudents = useMemo(() => {
    let filtered = students?.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.studentId.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.email.toLowerCase().includes(studentSearch.toLowerCase());
      const matchesFilter =
        studentFilter === "all" || student.class === studentFilter;
      return matchesSearch && matchesFilter;
    });
    return filtered;
  }, [students, studentSearch, studentFilter]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(teacherSearch.toLowerCase()) ||
        teacher.teacherId.toLowerCase().includes(teacherSearch.toLowerCase())
    );
  }, [teachers, teacherSearch]);

  const studentStats = useMemo(() => {
    const activeStudents = students.filter((s) => s.status === "active");
    const avgAttendance =
      activeStudents.reduce((sum, student) => sum + student.attendance, 0) /
      activeStudents.length;
    const avgScore =
      activeStudents.reduce((sum, student) => sum + student.avgScore, 0) /
      activeStudents.length;

    return {
      total: students.length,
      active: activeStudents.length,
      inactive: students.filter((s) => s.status === "inactive").length,
      avgAttendance: avgAttendance.toFixed(1),
      avgScore: avgScore.toFixed(1),
      bySection: {
        A: students.filter((s) => s.class === "A").length,
        B: students.filter((s) => s.class === "B").length,
        C: students.filter((s) => s.class === "C").length,
      },
    };
  }, [students]);

  const deleteStudent = (id) => {
    if (window.confirm("Are you sure you want to remove this student?")) {
      setStudents(students.filter((student) => student.id !== id));
    }
  };

  const toggleStudentStatus = (id) => {
    setStudents(
      students.map((student) =>
        student.id === id
          ? {
              ...student,
              status: student.status === "active" ? "inactive" : "active",
            }
          : student
      )
    );
  };

  const deleteTeacher = (id) => {
    if (window.confirm("Are you sure you want to remove this teacher?")) {
      setTeachers(teachers.filter((teacher) => teacher.id !== id));
    }
  };

  const addExam = () => {
    if (!newExam.title || !newExam.subject || !newExam.date) {
      alert("Please fill all required fields");
      return;
    }
    const exam = {
      id: Date.now(),
      ...newExam,
      notified: false,
    };
    setExams([exam, ...exams]);
    setNewExam({
      title: "",
      subject: "",
      date: "",
      startTime: "09:00",
      endTime: "12:00",
      type: "quarterly",
      totalMarks: 100,
      syllabus: "",
      room: "Room 101",
    });
  };

  const updateExam = () => {
    if (!newExam.title || !newExam.subject || !newExam.date) {
      alert("Please fill all required fields");
      return;
    }
    setExams(
      exams.map((exam) =>
        exam.id === editingExamId ? { ...exam, ...newExam } : exam
      )
    );
    setEditingExamId(null);
    setNewExam({
      title: "",
      subject: "",
      date: "",
      startTime: "09:00",
      endTime: "12:00",
      type: "quarterly",
      totalMarks: 100,
      syllabus: "",
      room: "Room 101",
    });
  };

  const deleteExam = (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      setExams(exams.filter((exam) => exam.id !== id));
    }
  };

  const toggleExamNotification = (id) => {
    setExams(
      exams.map((exam) =>
        exam.id === id ? { ...exam, notified: !exam.notified } : exam
      )
    );
  };

  const deleteStudyMaterial = (id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      setStudyMaterials(
        studyMaterials.filter((material) => material.id !== id)
      );
    }
  };

  const filteredMaterials = useMemo(() => {
    if (materialFilter === "all") return studyMaterials;
    return studyMaterials.filter(
      (material) => material.type === materialFilter
    );
  }, [studyMaterials, materialFilter]);

  const getMaterialTypeInfo = (type) => {
    switch (type) {
      case "pdf":
        return { icon: FiFileText, color: "#E74C3C", label: "PDF" };
      case "video":
        return { icon: FiVideo, color: "#3498DB", label: "Video" };
      case "document":
        return { icon: FiFileText, color: "#2ECC71", label: "Document" };
      case "link":
        return { icon: FiExternalLink, color: "#9B59B6", label: "Link" };
      default:
        return { icon: FiFileText, color: theme.light, label: "File" };
    }
  };

  const chartData = useMemo(() => {
    if (!studentMarksData.length) return { labels: [], data: [] };
    const labels = studentMarksData.map((student) => student.student);
    const data = studentMarksData.map((student) => {
      switch (selectedSubjectForChart.toLowerCase()) {
        case "mathematics":
          return student.math;
        case "science":
          return student.science;
        case "english":
          return student.english;
        case "history":
          return student.history;
        case "computer science":
          return student.cs;
        default:
          return student.avg;
      }
    });
    return { labels, data };
  }, [studentMarksData, selectedSubjectForChart]);

const StudentsListTab = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showMessenger, setShowMessenger] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const allClasses = [...new Set(students.map(student => student.class))].sort();
  
  const getGradeColor = (className) => {
    const gradeColors = {
      'A': theme.accent,
      'B': theme.warning,
      'C': '#9B59B6',
      'D': '#2ECC71',
      'E': '#E74C3C',
      'F': '#3498DB',
      'G': '#F39C12',
    };
    return gradeColors[className] || theme.light;
  };

  const handleMessengerClick = (student) => {
    setSelectedStudent(student);
    setMessageSubject('');
    setMessageContent('');
    setShowMessenger(true);
  };

  const closeMessenger = () => {
    setShowMessenger(false);
    setSelectedStudent(null);
    setMessageSubject('');
    setMessageContent('');
  };

  const handleSendMessage = () => {

    closeMessenger();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: theme.dark }}>
            Students Management
          </h2>
          <p className="text-sm mt-1" style={{ color: theme.light }}>
            Manage and communicate with students
          </p>
        </div>
        <button
          className="px-4 py-2.5 text-sm font-medium rounded-lg flex items-center gap-2 transition-all hover:opacity-90"
          style={{
            backgroundColor: theme.primary,
            color: theme.white,
            boxShadow: `0 4px 6px -1px ${theme.primary}30`,
          }}
          onClick={() => {}}
        >
          <FiDownload size={16} />
          Export Students
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="p-5 rounded-xl border"
          style={{ backgroundColor: theme.white, borderColor: theme.border }}
        >
          <label
            className="block text-sm font-medium mb-3"
            style={{ color: theme.dark }}
          >
            <FiSearch className="inline mr-2" />
            Search Students
          </label>
          <div className="relative">
            <input
              type="text"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              placeholder="Search by name, ID, email, or class..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-offset-1"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.dark,
                outlineColor: theme.primary
              }}
            />
            <FiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: theme.light }}
            />
          </div>
          <p className="text-xs mt-2" style={{ color: theme.light }}>
            {filteredStudents.length} students found
          </p>
        </div>

        <div
          className="p-5 rounded-xl border"
          style={{ backgroundColor: theme.white, borderColor: theme.border }}
        >
          <label
            className="block text-sm font-medium mb-3"
            style={{ color: theme.dark }}
          >
            <FiFilter className="inline mr-2" />
            Filter by Grade
          </label>
          <div className="space-y-2">
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setStudentFilter("all")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  studentFilter === "all" ? "ring-2 ring-offset-1" : ""
                }`}
                style={{
                  backgroundColor:
                    studentFilter === "all" ? theme.primary : theme.primaryBg,
                  color: studentFilter === "all" ? theme.white : theme.primary,
                  border: `1px solid ${theme.primary}30`,
                  ringColor: theme.primary
                }}
              >
                All Grades
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 gap-2">
              {allClasses.map((className) => (
                <button
                  key={className}
                  onClick={() => setStudentFilter(className)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    studentFilter === className ? "ring-2 ring-offset-1" : ""
                  }`}
                  style={{
                    backgroundColor:
                      studentFilter === className 
                        ? getGradeColor(className) 
                        : getGradeColor(className) + "15",
                    color:
                      studentFilter === className 
                        ? theme.white 
                        : getGradeColor(className),
                    border: `1px solid ${getGradeColor(className)}30`,
                    ringColor: getGradeColor(className)
                  }}
                >
                  Grade {className}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="p-5 rounded-xl border"
          style={{ 
            backgroundColor: theme.primary, 
            borderColor: theme.primary,
            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primary}80 100%)`
          }}
        >
          <label
            className="block text-sm font-medium mb-4 text-white"
          >
            <FiUsers className="inline mr-2" />
            Students Overview
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-white/20">
              <div className="text-2xl font-bold text-white">
                {students.length}
              </div>
              <div className="text-xs text-white/90 mt-1">
                Total Students
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/20">
              <div className="text-2xl font-bold text-white">
                {allClasses.length}
              </div>
              <div className="text-xs text-white/90 mt-1">
                Active Grades
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="text-xs text-white/90">
              <FiInfo className="inline mr-1" />
              Click on Message to contact any student
            </div>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl border overflow-hidden"
        style={{ 
          backgroundColor: theme.white, 
          borderColor: theme.border,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <div className="p-4 border-b" style={{ borderColor: theme.border }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg font-medium" style={{ color: theme.dark }}>
              Students List
            </h3>
            <div className="flex items-center gap-2 text-sm" style={{ color: theme.light }}>
              <FiClock size={14} />
              <span>Sorted by: Name</span>
              <button className="ml-2 p-1.5 rounded-lg border" style={{ borderColor: theme.border }}>
                <FiChevronsDown size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="hidden lg:block">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: theme.background }}>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.light }}>
                      Student Information
                    </th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.light }}>
                      Grade
                    </th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.light }}>
                      Attendance
                    </th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.light }}>
                      Performance
                    </th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.light }}>
                      Messenger
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                      style={{ borderColor: theme.border }}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-gray-200">
                            <img
                              src={`${user_backend_domain_name}uploads/${student.profile}`}
                              alt={student.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                            <div
                              className="w-full h-full rounded-full flex items-center justify-center text-white font-medium hidden"
                              style={{ 
                                backgroundColor: theme.primary,
                                fontSize: '16px'
                              }}
                            >
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className="font-semibold text-base truncate"
                              style={{ color: theme.dark }}
                            >
                              {student.name}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <div className="text-xs flex items-center gap-1" style={{ color: theme.light }}>
                                <FiMail size={10} />
                                <span className="truncate max-w-[150px]">{student.email}</span>
                              </div>
                              <div className="text-xs flex items-center gap-1" style={{ color: theme.light }}>
                                <FiUser size={10} />
                                <span>ID: {student.studentId}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getGradeColor(student.class) }}
                          />
                          <span
                            className="px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap"
                            style={{
                              backgroundColor: getGradeColor(student.class) + "15",
                              color: getGradeColor(student.class),
                            }}
                          >
                            Grade {student.class}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium" style={{ color: theme.dark }}>
                              {student.attendance}%
                            </div>
                            <div className="text-xs" style={{ color: theme.light }}>
                              Attendance
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${student.attendance}%`,
                                backgroundColor:
                                  student.attendance >= 90
                                    ? theme.accent
                                    : student.attendance >= 75
                                    ? theme.warning
                                    : theme.danger,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium" style={{ color: theme.dark }}>
                              {student.avgScore}%
                            </div>
                            <div className="text-xs" style={{ color: theme.light }}>
                              Average Score
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${student.avgScore}%`,
                                backgroundColor:
                                  student.avgScore >= 85
                                    ? theme.accent
                                    : student.avgScore >= 70
                                    ? theme.primary
                                    : theme.warning,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleMessengerClick(student)}
                          className="w-full px-4 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all hover:opacity-90 whitespace-nowrap"
                          style={{
                            backgroundColor: theme.accent,
                            color: theme.white,
                            boxShadow: `0 2px 4px ${theme.accent}30`,
                          }}
                        >
                          <FiMessageSquare size={14} />
                          Message
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden space-y-4 p-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-4 border rounded-lg"
                  style={{ 
                    backgroundColor: theme.white, 
                    borderColor: theme.border,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-gray-200">
                        <img
                          src={`${user_backend_domain_name}uploads/${student.profile}`}
                          alt={student.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div
                          className="w-full h-full rounded-full flex items-center justify-center text-white font-medium hidden"
                          style={{ backgroundColor: theme.primary }}
                        >
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-semibold text-sm truncate"
                          style={{ color: theme.dark }}
                        >
                          {student.name}
                        </div>
                        <div className="text-xs mt-1" style={{ color: theme.light }}>
                          ID: {student.studentId}
                        </div>
                      </div>
                    </div>
                    <span
                      className="px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ml-2"
                      style={{
                        backgroundColor: getGradeColor(student.class) + "15",
                        color: getGradeColor(student.class),
                      }}
                    >
                      G {student.class}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs mb-1" style={{ color: theme.light }}>
                        Attendance
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium" style={{ color: theme.dark }}>
                          {student.attendance}%
                        </div>
                        <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${student.attendance}%`,
                              backgroundColor:
                                student.attendance >= 90
                                  ? theme.accent
                                  : student.attendance >= 75
                                  ? theme.warning
                                  : theme.danger,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs mb-1" style={{ color: theme.light }}>
                        Performance
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium" style={{ color: theme.dark }}>
                          {student.avgScore}%
                        </div>
                        <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${student.avgScore}%`,
                              backgroundColor:
                                student.avgScore >= 85
                                  ? theme.accent
                                  : student.avgScore >= 70
                                  ? theme.primary
                                  : theme.warning,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.border }}>
                    <div className="flex items-center justify-between">
                      <div className="text-xs flex items-center gap-1" style={{ color: theme.light }}>
                        <FiMail size={10} />
                        <span className="truncate max-w-[120px]">{student.email}</span>
                      </div>
                      <button
                        onClick={() => handleMessengerClick(student)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1 transition-all hover:opacity-90"
                        style={{
                          backgroundColor: theme.accent,
                          color: theme.white,
                        }}
                      >
                        <FiMessageSquare size={12} />
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {filteredStudents.length > 0 && (
          <div className="p-4 border-t" style={{ borderColor: theme.border }}>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
              <div style={{ color: theme.light }}>
                Showing {filteredStudents.length} of {students.length} students
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg border disabled:opacity-50" style={{ borderColor: theme.border }}>
                  <FiChevronLeft />
                </button>
                <span className="px-3" style={{ color: theme.dark }}>1</span>
                <button className="p-2 rounded-lg border" style={{ borderColor: theme.border }}>
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TeachersListTab = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        className="p-4 rounded-lg border"
        style={{ backgroundColor: theme.white, borderColor: theme.border }}
      >
        <div className="text-center">
          <p
            className="text-2xl font-bold mb-1"
            style={{ color: theme.primary }}
          >
            {teachers.length}
          </p>
          <p className="text-xs" style={{ color: theme.light }}>
            Total Teachers
          </p>
        </div>
      </div>

      <div
        className="p-4 rounded-lg border"
        style={{ backgroundColor: theme.white, borderColor: theme.border }}
      >
        <div className="text-center">
          <p
            className="text-2xl font-bold mb-1"
            style={{ color: theme.primary }}
          >
            {subjects.length}
          </p>
          <p className="text-xs" style={{ color: theme.light }}>
            Subjects Covered
          </p>
        </div>
      </div>
    
    </div>



    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredTeachers.map((teacher) => (
        <div
          key={teacher.id}
          className="p-4 border rounded-lg"
          style={{
            backgroundColor: theme.white,
            borderColor: theme.border,
          }}
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-gray-200">
              <img
                src={`${user_backend_domain_name}uploads/${teacher.profile}`}
                alt={teacher.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div
                className="w-full h-full rounded-full flex items-center justify-center text-white font-medium hidden"
                style={{ backgroundColor: theme.primary }}
              >
                {teacher.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-medium" style={{ color: theme.dark }}>
                {teacher.name}
              </h4>
              <p className="text-xs" style={{ color: theme.light }}>
                {teacher.teacherId} • {teacher.subject}
              </p>
            </div>
            <span
              className="px-2 py-1 text-xs font-medium rounded-full"
              style={{
                backgroundColor:
                  teacher.status === "active"
                    ? theme.accent + "15"
                    : theme.danger + "15",
                color:
                  teacher.status === "active" ? theme.accent : theme.danger,
              }}
            >
              {teacher.status}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <FiMail size={12} style={{ color: theme.light }} />
              <span style={{ color: theme.dark }}>{teacher.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FiPhone size={12} style={{ color: theme.light }} />
              <span style={{ color: theme.dark }}>{teacher.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FiAward size={12} style={{ color: theme.light }} />
              <span style={{ color: theme.dark }}>
                {teacher.qualification}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FiClock size={12} style={{ color: theme.light }} />
              <span style={{ color: theme.dark }}>
                {teacher.experience} experience
              </span>
            </div>
          </div>

          <div className="mb-4">
            <p
              className="text-xs font-medium mb-1"
              style={{ color: theme.light }}
            >
              Classes:
            </p>
            <p className="text-sm" style={{ color: theme.dark }}>
              {teacher.classes}
            </p>
          </div>

          <div
            className="flex justify-between items-center pt-4 border-t"
            style={{ borderColor: theme.border }}
          >
            <div className="text-xs" style={{ color: theme.light }}>
              Joined: {teacher.joinDate}
            </div>
            <button
              className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm"
              style={{
                backgroundColor: theme.primary,
                color: theme.white,
                border: `1px solid ${theme.primary}`,
              }}
              title="Message Teacher"
              onClick={() => {
                console.log("messaing b")
              }}
            >
              <FiMessageSquare size={14} />
              Message
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

  const GuideTeachersTab = () => (
    <div className="space-y-6">
      <div
        className="p-6 border rounded-lg"
        style={{ backgroundColor: theme.white, borderColor: theme.border }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold mb-2" style={{ color: theme.dark }}>
              Guide Teachers Overview
            </h3>
            <p className="text-sm" style={{ color: theme.light }}>
              Guide teachers provide academic guidance, career counseling, and
              personal mentorship to students. Each section has one dedicated
              guide teacher.
            </p>
          </div>
          <button
            className="px-4 py-2 text-sm border rounded-lg flex items-center gap-2"
            style={{
              backgroundColor: theme.primary,
              color: theme.white,
              borderColor: theme.primary,
            }}
          >
            <FiPlus size={14} />
            Assign Guide Teacher
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <div
              className="text-3xl font-bold mb-2"
              style={{ color: theme.primary }}
            >
              {guideTeachers.length}
            </div>
            <div className="text-sm" style={{ color: theme.light }}>
              Guide Teachers
            </div>
          </div>
          <div className="text-center p-4">
            <div
              className="text-3xl font-bold mb-2"
              style={{ color: theme.primary }}
            >
              {studentStats.bySection.A +
                studentStats.bySection.B +
                studentStats.bySection.C}
            </div>
            <div className="text-sm" style={{ color: theme.light }}>
              Students Covered
            </div>
          </div>
  
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {guideTeachers.map((guide) => (
          <div
            key={guide.id}
            className="p-6 border rounded-lg"
            style={{
              backgroundColor: theme.white,
              borderColor: theme.border,
            }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-gray-200">
                <img
                  src={`${user_backend_domain_name}uploads/${guide.profile}`}
                  alt={guide.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div
                  className="w-full h-full rounded-full flex items-center justify-center text-white text-lg font-bold hidden"
                  style={{ backgroundColor: theme.primary }}
                >
                  {guide.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold" style={{ color: theme.dark }}>
                  {guide.name}
                </h4>
                <p className="text-sm" style={{ color: theme.light }}>
                  {guide.teacherId}
                </p>
                <span
                  className="inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor:
                      guide.class === "A"
                        ? theme.accent + "15"
                        : guide.class === "B"
                        ? theme.warning + "15"
                        : "#9B59B615",
                    color:
                      guide.class === "A"
                        ? theme.accent
                        : guide.class === "B"
                        ? theme.warning
                        : "#9B59B6",
                  }}
                >
                  class {guide.class} Guide
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: theme.light }}>
                  Students Assigned:
                </span>
                <span className="font-medium" style={{ color: theme.dark }}>
                  {guide.studentsCount} students
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: theme.light }}>
                  Experience:
                </span>
                <span className="font-medium" style={{ color: theme.dark }}>
                  {guide.experience}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: theme.light }}>
                  Specialization:
                </span>
                <span
                  className="font-medium text-right"
                  style={{ color: theme.dark }}
                >
                  {guide.specialization}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: theme.light }}>
                  Contact Hours:
                </span>
                <span className="font-medium" style={{ color: theme.dark }}>
                  {guide.contactHours}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="flex-1 px-4 py-2 text-sm border rounded-lg flex items-center justify-center gap-2"
                style={{
                  backgroundColor: theme.primaryBg,
                  borderColor: theme.primary,
                  color: theme.primary,
                }}
              >
                <FiMessageSquare size={14} />
                Message
              </button>
              <button
                className="px-4 py-2 text-sm border rounded-lg flex items-center gap-2"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
              >
                <FiEdit size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        className="p-6 border rounded-lg"
        style={{ backgroundColor: theme.white, borderColor: theme.border }}
      >
        <h4 className="font-semibold mb-4" style={{ color: theme.dark }}>
          Guide Teacher Responsibilities
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <FiCheckCircle
                size={16}
                style={{ color: theme.accent, marginTop: 2 }}
              />
              <span style={{ color: theme.dark }}>
                Academic guidance and progress monitoring
              </span>
            </div>
            <div className="flex items-start gap-2">
              <FiCheckCircle
                size={16}
                style={{ color: theme.accent, marginTop: 2 }}
              />
              <span style={{ color: theme.dark }}>
                Career counseling and college applications
              </span>
            </div>
            <div className="flex items-start gap-2">
              <FiCheckCircle
                size={16}
                style={{ color: theme.accent, marginTop: 2 }}
              />
              <span style={{ color: theme.dark }}>
                Personal mentorship and character development
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <FiCheckCircle
                size={16}
                style={{ color: theme.accent, marginTop: 2 }}
              />
              <span style={{ color: theme.dark }}>
                Parent-teacher communication and meetings
              </span>
            </div>
            <div className="flex items-start gap-2">
              <FiCheckCircle
                size={16}
                style={{ color: theme.accent, marginTop: 2 }}
              />
              <span style={{ color: theme.dark }}>
                Attendance and discipline monitoring
              </span>
            </div>
            <div className="flex items-start gap-2">
              <FiCheckCircle
                size={16}
                style={{ color: theme.accent, marginTop: 2 }}
              />
              <span style={{ color: theme.dark }}>
                Co-curricular activity guidance
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const GradeManagersTab = () => (
    <div className="space-y-6">
      <div
        className="p-6 border rounded-lg"
        style={{ backgroundColor: theme.white, borderColor: theme.border }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold mb-2" style={{ color: theme.dark }}>
              Grade Management Team
            </h3>
            <p className="text-sm" style={{ color: theme.light }}>
              The grade management team oversees academic planning, teacher
              supervision, student welfare, and overall grade administration.
            </p>
          </div>
  
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4">
            <div
              className="text-2xl font-bold mb-2"
              style={{ color: theme.primary }}
            >
              {gradeManagers.length}
            </div>
            <div className="text-sm" style={{ color: theme.light }}>
              Management Staff
            </div>
          </div>

          <div className="text-center p-4">
            <div
              className="text-2xl font-bold mb-2"
              style={{ color: theme.primary }}
            >
              {teachers.length + guideTeachers.length + gradeManagers.length}
            </div>
            <div className="text-sm" style={{ color: theme.light }}>
              Total Staff
            </div>
          </div>
          <div className="text-center p-4">
            <div
              className="text-2xl font-bold mb-2"
              style={{ color: theme.primary }}
            >
              24/7
            </div>
            <div className="text-sm" style={{ color: theme.light }}>
              Support Available
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {gradeManagers.map((manager) => (
          <div
            key={manager.id}
            className="p-6 border rounded-lg"
            style={{
              backgroundColor: theme.white,
              borderColor: theme.border,
            }}
          >
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-gray-200">
                  <img
                    src={`${user_backend_domain_name}uploads/${manager.profile}`}
                    alt={manager.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center text-white text-xl font-bold hidden"
                    style={{ backgroundColor: theme.primary }}
                  >
                    {manager.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                  <div>
                    <h4
                      className="font-semibold text-lg"
                      style={{ color: theme.dark }}
                    >
                      {manager.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className="px-3 py-1 text-sm font-medium rounded-full"
                        style={{
                          backgroundColor: theme.primary + "15",
                          color: theme.primary,
                        }}
                      >
                        {manager.role}
                      </span>
                      <span className="text-sm" style={{ color: theme.light }}>
                        {manager.experience} experience
                      </span>
                      <span
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor:
                            manager.status === "active"
                              ? theme.accent + "15"
                              : theme.danger + "15",
                          color:
                            manager.status === "active"
                              ? theme.accent
                              : theme.danger,
                        }}
                      >
                        {manager.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0 text-right">
                    <div className="text-sm" style={{ color: theme.light }}>
                      Joined: {manager.joinDate}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5
                      className="font-medium mb-2 text-sm"
                      style={{ color: theme.dark }}
                    >
                      Contact Information
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <FiMail size={14} style={{ color: theme.light }} />
                        <span style={{ color: theme.dark }}>
                          {manager.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FiPhone size={14} style={{ color: theme.light }} />
                        <span style={{ color: theme.dark }}>
                          {manager.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    className="flex-1 px-4 py-2 text-sm border rounded-lg flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: theme.primaryBg,
                      borderColor: theme.primary,
                      color: theme.primary,
                    }}
                  >
                    <FiMessageSquare size={14} />
                    Send Message
                  </button>
         
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
const ExamsTab = () => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form state - REMOVE is_marked from here
  const [examForm, setExamForm] = useState({
    id: null,
    exam_name: '',
    grade: gradeId || '',
    exam_type: 'midterm',
    exam_start_date: '',
    exam_end_date: '',
    status: 'scheduled',
    created_by: 1
  });
  
  const alertTimeoutRef = useRef(null);
  
  // Fetch exams on component mount
  useEffect(() => {
    fetchExams();
  }, [gradeId]);
  
  // Fetch exams function
  const fetchExams = async () => {
    try {
      setLoading(true);
  
      const response = await axios.get(`${admin_backend_domain_name}api/admin/getExamsByGrade/${gradeId}`, {
        withCredentials: true
      });
 
      setExams(response.data.data || []);
    } catch (error) {
      showAlert('error', 'Failed to load exams');
    } finally {
      setLoading(false);
    }
  };
  
  // Alert function
  const showAlert = (type, message) => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    setAlert({ show: true, type, message });
    alertTimeoutRef.current = setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 3000);
  };
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExamForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Validate form
  const validateForm = () => {
    if (!examForm.exam_name.trim()) {
      showAlert('error', 'Please enter exam name');
      return false;
    }
    if (!examForm.exam_start_date) {
      showAlert('error', 'Please select start date');
      return false;
    }
    if (!examForm.exam_end_date) {
      showAlert('error', 'Please select end date');
      return false;
    }
    // Check if end date is after start date
    if (new Date(examForm.exam_end_date) < new Date(examForm.exam_start_date)) {
      showAlert('error', 'End date must be after start date');
      return false;
    }
    return true;
  };
  
  // Handle form submission
  const examHandleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      const payload = {
        ...examForm,
        grade: gradeId,
        created_by: 2
      };
      
      // Check if editing a marked exam - check status instead of is_marked
      if (examForm.status === 'marked') {
        showAlert('error', 'Cannot edit marked exam');
        return;
      }
      
      if (isEditing) {
        const response = await axios.post(`${admin_backend_domain_name}api/admin/updateExam`, payload, {
          withCredentials:true
        });
        console.log(response, 'is response')
        if (response.status === 200) {
          fetchExams();
          showAlert('success', 'Exam updated successfully!');
        }
      } else {
        const response = await axios.post(`${admin_backend_domain_name}api/admin/createExam`, payload, {
          withCredentials:true
        });
        if (response.status === 200 || response.status === 201) {
          fetchExams()
          showAlert('success', 'Exam created successfully!');
        }
      }
      
      resetForm();
      setShowForm(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error:', error);
      showAlert('error', isEditing ? 'Failed to update exam' : 'Failed to create exam');
    }
  };
  
  // Handle edit - check if exam is marked by checking status
  const handleEdit = (exam) => {
    if (exam.status === 'marked') {
      showAlert('error', 'Cannot edit marked exam');
      return;
    }
    
    setExamForm({
      id: exam.id,
      exam_name: exam.exam_name,
      grade: exam.grade,
      exam_type: exam.exam_type,
      exam_start_date: exam.exam_start_date.split('T')[0], // Format date for input
      exam_end_date: exam.exam_end_date.split('T')[0], // Format date for input
      status: exam.status,
      created_by: exam.created_by
    });
    setIsEditing(true);
    setShowForm(true);
  };
  
  // Handle delete - check if exam is marked by checking status
  const handleDelete = async (id) => {
    const exam = exams.find(e => e.id === id);
    if (exam && exam.status === 'marked') {
      showAlert('error', 'Cannot delete marked exam');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this exam?')) return;
    
    try {
      const response = await axios.get(`${admin_backend_domain_name}api/admin/deleteExam/${id}`, {
        withCredentials:true
      });
      if (response.status === 200) {
        setExams(exams.filter(exam => exam.id !== id));
        showAlert('success', 'Exam deleted successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert('error', 'Failed to delete exam');
    }
  };

  // Handle "Give Marks" button click
  const handleGiveMarks = async (exam) => {
    try {
      const response = await axios.post(`${admin_backend_domain_name}api/admin/makeExamMarked`, {
        exam_id: exam.id,
        grade_id: exam.grade
      }, {
        withCredentials: true
      });
      
      console.log(response, 'is response');
      if (response.status === 200) {
        console.log("ok desu");
        // Update the exam status locally
        setExams(exams.map(e => 
          e.id === exam.id ? { ...e, status: 'marked' } : e
        ));
        showAlert('success', 'Exam marked successfully!');
      }
    } catch (error) {
      console.error('Error marking exam:', error);
      showAlert('error', 'Failed to mark exam');
    }
  };
  
  // Reset form
  const resetForm = () => {
    setExamForm({
      id: null,
      exam_name: '',
      grade: gradeId || '',
      exam_type: 'midterm',
      exam_start_date: '',
      exam_end_date: '',
      status: 'scheduled',
      created_by: 1
    });
  };
  
  // Filter exams based on search term
  const filteredExams = exams.filter(exam =>
    exam.exam_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.exam_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get status badge color - ADD 'marked' status
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return { bg: theme.primary + '15', text: theme.primary };
      case 'ongoing':
        return { bg: theme.warning + '15', text: theme.warning };
      case 'completed':
        return { bg: theme.accent + '15', text: theme.accent };
      case 'marked':
        return { bg: theme.success + '15', text: theme.success };
      default:
        return { bg: theme.light + '15', text: theme.light };
    }
  };
  
  // Get exam type badge color
  const getExamTypeColor = (type) => {
    switch (type) {
      case 'midterm':
        return { bg: theme.accent + '15', text: theme.accent };
      case 'final':
        return { bg: theme.danger + '15', text: theme.danger };
      case 'quiz':
        return { bg: theme.info + '15', text: theme.info };
      case 'unit_test':
        return { bg: theme.secondary + '15', text: theme.secondary };
      default:
        return { bg: theme.light + '15', text: theme.light };
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Marked badge component - only show for 'marked' status
  const MarkedBadge = () => (
    <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold"
          style={{ 
            backgroundColor: theme.success + '15',
            color: theme.success,
            border: `1px solid ${theme.success}30`
          }}>
      <FiCheck size={10} className="inline mr-1" />
      MARKED
    </span>
  );

  return (
    <div className="space-y-6 relative">
      {/* Alert Notification */}
      {alert.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-y-0 ${
            alert.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800'
              : alert.type === 'error'
              ? 'bg-red-50 border border-red-200 text-red-800'
              : 'bg-blue-50 border border-blue-200 text-blue-800'
          }`}
          style={{ zIndex: 100 }}
        >
          <div className="flex items-center justify-between min-w-[300px]">
            <div className="flex items-center">
              <span className="font-medium">{alert.message}</span>
            </div>
            <button
              onClick={() => setAlert({ show: false, type: '', message: '' })}
              className="ml-4 hover:opacity-70"
            >
              <FiX />
            </button>
          </div>
        </div>
      )}

      {/* Search and Add Button */}
      <div
        className="p-4 border rounded-lg"
        style={{ backgroundColor: theme.white, borderColor: theme.border }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="md:w-1/2">
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: theme.dark }}
            >
              Search Exams
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
                placeholder="Search by exam name, type, or status"
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
              />
            </div>
          </div>
          <div>
            <button
              onClick={() => {
                resetForm();
                setIsEditing(false);
                setShowForm(true);
              }}
              className="px-4 py-2 text-sm border rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: theme.primary,
                color: theme.white,
                borderColor: theme.primary,
              }}
            >
              <FiPlus size={14} />
              Create Exam
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12" style={{ color: theme.light }}>
          Loading exams...
        </div>
      ) : (
        /* Exams List Table */
        <div
          className="p-4 border rounded-lg overflow-hidden"
          style={{ backgroundColor: theme.white, borderColor: theme.border }}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr style={{ borderBottomColor: theme.border }}>
                  <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: theme.dark }}>ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: theme.dark }}>Exam Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: theme.dark }}>Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: theme.dark }}>Start Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: theme.dark }}>End Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: theme.dark }}>Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: theme.dark }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExams.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8" style={{ color: theme.light }}>
                      <div className="flex flex-col items-center gap-2">
                        <FiBookOpen size={24} />
                        <span>No exams found</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredExams.map((exam) => {
                    const statusColor = getStatusColor(exam.status);
                    const typeColor = getExamTypeColor(exam.exam_type);
                    const isMarked = exam.status === 'marked';
                    const isCompleted = exam.status === 'completed';
                    
                    return (
                      <tr 
                        key={exam.id} 
                        style={{ 
                          borderBottomColor: theme.border + '30',
                          backgroundColor: isMarked ? theme.success + '05' : 'transparent'
                        }}
                      >
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium" style={{ color: theme.primary }}>
                            {exam.id || 'N/A'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-sm font-medium flex items-center" style={{ color: theme.dark }}>
                              {exam.exam_name}
                              {isMarked && <MarkedBadge />}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor: typeColor.bg,
                              color: typeColor.text,
                            }}
                          >
                            {exam.exam_type.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm" style={{ color: theme.dark }}>
                            {formatDate(exam.exam_start_date)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm" style={{ color: theme.dark }}>
                            {formatDate(exam.exam_end_date)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor: statusColor.bg,
                              color: statusColor.text,
                            }}
                          >
                            {exam.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {/* Edit button - only show if not marked */}
                            {!isMarked && (
                              <button
                                onClick={() => handleEdit(exam)}
                                className="p-1.5 rounded-lg border flex items-center gap-1 text-xs hover:opacity-80 transition-opacity"
                                style={{
                                  backgroundColor: theme.white,
                                  borderColor: theme.border,
                                  color: theme.primary,
                                }}
                                title="Edit"
                              >
                                <FiEdit2 size={12} />
                                Edit
                              </button>
                            )}
                            
                            {/* Delete button - only show if not marked */}
                            {!isMarked && (
                              <button
                                onClick={() => handleDelete(exam.id)}
                                className="p-1.5 rounded-lg border flex items-center gap-1 text-xs hover:opacity-80 transition-opacity"
                                style={{
                                  backgroundColor: theme.white,
                                  borderColor: theme.border,
                                  color: theme.danger,
                                }}
                                title="Delete"
                              >
                                <FiTrash2 size={12} />
                                Delete
                              </button>
                            )}
                            
                            {/* Give Marks button - only show for completed exams that are not marked */}
                            {isCompleted && !isMarked && (
                              <button
                                onClick={() => handleGiveMarks(exam)}
                                className="p-1.5 rounded-lg border flex items-center gap-1 text-xs hover:opacity-80 transition-opacity"
                                style={{
                                  backgroundColor: theme.success + '10',
                                  borderColor: theme.success + '30',
                                  color: theme.success,
                                }}
                                title="Give Marks"
                              >
                                <FiFileText size={12} />
                                Give Marks
                              </button>
                            )}
                            
                            {/* Marks Given button - disabled state for marked exams */}
                            {isMarked && (
                              <button
                                disabled
                                className="p-1.5 rounded-lg border flex items-center gap-1 text-xs opacity-50 cursor-not-allowed"
                                style={{
                                  backgroundColor: theme.light + '10',
                                  borderColor: theme.light + '30',
                                  color: theme.light,
                                }}
                                title="Marks Already Given"
                              >
                                <FiCheck size={12} />
                                Marks Given
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

     
{showForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    
 <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-none" />

    {/* Modal Content */}
    <div
      className="relative w-full max-w-2xl p-6 rounded-xl shadow-2xl bg-white"
      style={{
        backgroundColor: theme.white,
        border: `1px solid ${theme.border}`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header */}
      <div
        className="flex justify-between items-center mb-6 border-b pb-4"
        style={{ borderColor: theme.border }}
      >
        <h2 className="text-xl font-semibold" style={{ color: theme.dark }}>
          <div className="flex items-center gap-2">
            <FiBookOpen />
            {isEditing ? "Edit Exam" : "Create New Exam"}
            {examForm.status === 'marked' && (
              <span className="ml-2 px-2 py-1 text-xs rounded-full" 
                    style={{ backgroundColor: theme.success + '15', color: theme.success }}>
                MARKED
              </span>
            )}
          </div>
        </h2>

        <button
          onClick={() => {
            setShowForm(false);
            resetForm();
            setIsEditing(false);
          }}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          style={{ color: theme.light }}
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={examHandleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        
        {/* Exam Name */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
            Exam Name <span style={{ color: theme.danger }}>*</span>
          </label>
          <div className="relative">
            <FiBookOpen
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: theme.light }}
            />
            <input
              type="text"
              name="exam_name"
              value={examForm.exam_name}
              onChange={handleInputChange}
              required
              placeholder="Enter exam name"
              className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:ring-2"
              style={{
                backgroundColor: examForm.status === 'marked' ? theme.light + '10' : theme.background,
                borderColor: theme.border,
                color: examForm.status === 'marked' ? theme.light : theme.dark,
                outlineColor: theme.primary,
                cursor: examForm.status === 'marked' ? 'not-allowed' : 'text',
              }}
              autoFocus
              disabled={examForm.status === 'marked'}
            />
          </div>
          {examForm.status === 'marked' && (
            <p className="text-xs text-amber-600 mt-1">
              This exam is marked. Editing is disabled.
            </p>
          )}
        </div>

        {/* Exam Type & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
              Exam Type <span style={{ color: theme.danger }}>*</span>
            </label>
            <select
              name="exam_type"
              value={examForm.exam_type}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border rounded-lg text-sm"
              style={{
                backgroundColor: examForm.status === 'marked' ? theme.light + '10' : theme.background,
                borderColor: theme.border,
                color: examForm.status === 'marked' ? theme.light : theme.dark,
                cursor: examForm.status === 'marked' ? 'not-allowed' : 'pointer',
              }}
              disabled={examForm.status === 'marked'}
            >
              <option value="midterm">Midterm</option>
              <option value="final">Final</option>
              <option value="quiz">Quiz</option>
              <option value="unit_test">Unit Test</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
              Status <span style={{ color: theme.danger }}>*</span>
            </label>
            <select
              name="status"
              value={examForm.status}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border rounded-lg text-sm"
              style={{
                backgroundColor: examForm.status === 'marked' ? theme.light + '10' : theme.background,
                borderColor: theme.border,
                color: examForm.status === 'marked' ? theme.light : theme.dark,
                cursor: examForm.status === 'marked' ? 'not-allowed' : 'pointer',
              }}
              disabled={examForm.status === 'marked'}
            >
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="marked">Marked</option>
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
              Start Date <span style={{ color: theme.danger }}>*</span>
            </label>
            <div className="relative">
              <FiCalendar
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: theme.light }}
                size={16}
              />
              <input
                type="text"
                placeholder="YYYY-MM-DD"
                value={examForm.exam_start_date}
                onChange={(e) => {
                  if (examForm.status === 'marked') return;
                  const value = e.target.value;
                  if (/^\d{0,4}-?\d{0,2}-?\d{0,2}$/.test(value)) {
                    setExamForm({
                      ...examForm,
                      exam_start_date: value,
                    });
                  }
                }}
                className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm transition focus:ring-2 focus:ring-offset-1"
                style={{
                  backgroundColor: examForm.status === 'marked' ? theme.light + '10' : theme.background,
                  borderColor: theme.border,
                  color: examForm.status === 'marked' ? theme.light : theme.dark,
                  outlineColor: theme.primary,
                  cursor: examForm.status === 'marked' ? 'not-allowed' : 'text',
                }}
                disabled={examForm.status === 'marked'}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Format: YYYY-MM-DD
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
              End Date <span style={{ color: theme.danger }}>*</span>
            </label>
            <div className="relative">
              <FiCalendar
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: theme.light }}
              />
              <input
                type="text"
                name="exam_end_date"
                placeholder="YYYY-MM-DD"
                value={examForm.exam_end_date}
                onChange={(e) => {
                  if (examForm.status === 'marked') return;
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length > 4) value = value.slice(0, 4) + "-" + value.slice(4);
                  if (value.length > 7) value = value.slice(0, 7) + "-" + value.slice(7, 10);
                  
                  if (examForm.exam_start_date && value.length === 10 && value < examForm.exam_start_date) {
                    return;
                  }
                  
                  setExamForm({
                    ...examForm,
                    exam_end_date: value,
                  });
                }}
                required
                className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm transition focus:ring-2 focus:ring-offset-1"
                style={{
                  backgroundColor: examForm.status === 'marked' ? theme.light + '10' : theme.background,
                  borderColor: theme.border,
                  color: examForm.status === 'marked' ? theme.light : theme.dark,
                  outlineColor: theme.primary,
                  cursor: examForm.status === 'marked' ? 'not-allowed' : 'text',
                }}
                disabled={examForm.status === 'marked'}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Format: YYYY-MM-DD
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="text-xs text-gray-500">
          <p>• Grade ID: {gradeId} (auto-filled)</p>
          <p>• Exam will be linked automatically</p>
          {examForm.status === 'marked' && (
            <p className="text-amber-600 mt-2">
              ⚠️ This exam is marked. Editing is disabled.
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex justify-end gap-3 pt-6 border-t"
          style={{ borderColor: theme.border }}
        >
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              resetForm();
              setIsEditing(false);
            }}
            className="px-5 py-2.5 text-sm rounded-lg border"
            style={{
              backgroundColor: theme.background,
              color: theme.dark,
              borderColor: theme.border,
            }}
          >
            Cancel
          </button>

          {examForm.status !== 'marked' && (
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-lg"
              style={{
                backgroundColor: theme.primary,
                color: theme.white,
              }}
            >
              <FiSave size={16} />
              {isEditing ? "Update Exam" : "Create Exam"}
            </button>
          )}
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};







const StudyMaterialsTab = () => {
  const [activeSubject, setActiveSubject] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [materialToEdit, setMaterialToEdit] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'links', 'videos', 'files'
  
  // New material form state
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    subject: '',
    type: 'link',
    url: '',
    description: '',
    fileType: 'web' // 'web', 'video', 'file'
  });
  
  const alertTimeoutRef = useRef(null);

  // Set first subject as active on component mount if available
  useEffect(() => {
    if (subjects?.length > 0 && !activeSubject) {
      setActiveSubject(subjects[0]);
    }
  }, [subjects, activeSubject]); // Add activeSubject to dependencies

  // Alert function
  const showAlert = (type, message) => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    setAlert({ show: true, type, message });
    alertTimeoutRef.current = setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 3000);
  };

  // Parse study materials from subject
  const parseStudyMaterials = (subject) => {
    const materials = [];
    
    // Parse web materials
    if (subject.study_material_web) {
      try {
        const webMaterials = JSON.parse(subject.study_material_web);
        if (Array.isArray(webMaterials)) {
          webMaterials.forEach(mat => {
            if (mat && typeof mat === 'object') {
              materials.push({
                ...mat,
                subjectId: subject.id,
                subjectName: subject.subject_name,
                type: 'link',
                fileType: 'web'
              });
            }
          });
        }
      } catch (error) {
        console.error('Error parsing web materials:', error);
   
      }
    } else {
      console.log('No study_material_web for subject:', subject.subject_name);
    }
    
    // Parse video materials
    if (subject.study_material_video) {
      try {
        const videoMaterials = JSON.parse(subject.study_material_video);
        if (Array.isArray(videoMaterials)) {
          videoMaterials.forEach(mat => {
            if (mat && typeof mat === 'object') {
              materials.push({
                ...mat,
                subjectId: subject.id,
                subjectName: subject.subject_name,
                type: 'video',
                fileType: 'video'
              });
            }
          });
        }
      } catch (error) {
        console.error('Error parsing video materials:', error);
    
      }
    } else {
      console.log('No study_material_video for subject:', subject.subject_name);
    }
    
    // Parse file materials
    if (subject.study_material_file) {
      try {
        const fileMaterials = JSON.parse(subject.study_material_file);
        if (Array.isArray(fileMaterials)) {
          fileMaterials.forEach(mat => {
            if (mat && typeof mat === 'object') {
              materials.push({
                ...mat,
                subjectId: subject.id,
                subjectName: subject.subject_name,
                type: mat.fileType || 'document',
                fileType: 'file'
              });
            }
          });
        }
      } catch (error) {
        console.error('Error parsing file materials:', error);
      
      }
    } else {
      console.log('No study_material_file for subject:', subject.subject_name);
    }
    
    // console.log(`Parsed ${materials.length} materials for ${subject.subject_name}`);
    return materials;
  };

  // Get all materials for active subject
  const getActiveSubjectMaterials = () => {
    if (!activeSubject) return [];
    return parseStudyMaterials(activeSubject);
  };

  // Filter materials based on active tab and search term
  const getFilteredMaterials = () => {
    const allMaterials = getActiveSubjectMaterials();
    
    // Filter by tab
    let filtered = allMaterials;
    if (activeTab === 'links') {
      filtered = allMaterials.filter(m => m.fileType === 'web');
    } else if (activeTab === 'videos') {
      filtered = allMaterials.filter(m => m.fileType === 'video');
    } else if (activeTab === 'files') {
      filtered = allMaterials.filter(m => m.fileType === 'file');
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(material =>
        material.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.url?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort materials
    return filtered.sort((a, b) => {
      // Priority: links → videos → files
      if (a.fileType === 'web' && b.fileType !== 'web') return -1;
      if (b.fileType === 'web' && a.fileType !== 'web') return 1;
      if (a.fileType === 'video' && b.fileType !== 'video') return -1;
      if (b.fileType === 'video' && a.fileType !== 'video') return 1;
      return a.title?.localeCompare(b.title) || 0;
    });
  };

  // Handle new material form changes
  const handleNewMaterialChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate new material form
  const validateForm = () => {
    if (!newMaterial.title.trim()) {
      showAlert('error', 'Please enter title');
      return false;
    }
    if (!newMaterial.url.trim()) {
      showAlert('error', 'Please enter URL');
      return false;
    }
    return true;
  };

  // Add new study material
  const addStudyMaterial = async () => {
    if (!validateForm()) return;

    try {
      console.log(newMaterial, 'is new Materials')
      const materialData = {
        subjectId: newMaterial.subject,
        type: newMaterial.fileType,
        title: newMaterial.title,
        url: newMaterial.url,
        description: newMaterial.description
      };
      // console.log(materialData, 'is material Data');

      const response = await axios.post(`${admin_backend_domain_name}api/admin/addStudyMaterial`, materialData , {
        withCredentials:true
      }
      );
      console.log(response, 'is response bro');
      // return;
      if(response.status == 200 || 201){
        showAlert('success', 'Study material added successfully!');
        resetForm();
        setShowFormModal(false);
        window.location.reload();
      }


      
      // TODO: Update the subjects array in parent component
      // You'll need to pass a callback function from parent or use context

    } catch (error) {
      console.error('Error:', error);
      showAlert('error', 'Failed to add study material');
    }
  };

  // Handle edit click
  const handleEditClick = (material) => {
    setMaterialToEdit({
      ...material,
      subject: material.subjectId,
      type: material.fileType === 'web' ? 'link' : 
             material.fileType === 'video' ? 'video' : 'document'
    });
    setEditModalOpen(true);
  };

  // Save edited material
  const handleSaveEdit = async () => {
    if (!materialToEdit?.title || !materialToEdit?.url) {
      showAlert('error', 'Title and URL are required');
      return;
    }

    try {
      const response = await axios.post(`${admin_backend_domain_name}api/admin/updateStudyMaterial`, {
        id: materialToEdit.id,
        subjectId: materialToEdit.subjectId,
        type: materialToEdit.fileType,
          title: materialToEdit.title,
          url: materialToEdit.url,
          description: materialToEdit.description
      }, {
        withCredentials: true
      });
      console.log(response, 'is response')
      if(response.status == 200 || 201){
       showAlert('success', 'Study material updated successfully!');
       setEditModalOpen(false);
       setMaterialToEdit(null);
       window.location.reload();
      }

      
      // TODO: Update the subjects array in parent component

    } catch (error) {
      console.error('Error:', error);
      showAlert('error', 'Failed to update study material');
    }
  };

  // Delete study material
  const deleteStudyMaterial = async (material) => {
    if (!window.confirm('Are you sure you want to delete this study material?')) return;

    try {
      console.log(material);
      const response = await axios.post(
        `${admin_backend_domain_name}api/admin/deleteStudyMaterial`, {
          id: material.id,
          type: material.fileType,
          subjectId: material.subjectId
        }, {
          withCredentials: true
        }
      );

      if(response.status == 200 || 201){
        showAlert('success', 'Study material deleted successfully!');
        window.location.reload();
      }

      
      // TODO: Update the subjects array in parent component

    } catch (error) {
      console.error('Error:', error);
      showAlert('error', 'Failed to delete study material');
    }
  };

  // Reset new material form
  const resetForm = () => {
    setNewMaterial({
      title: '',
      subject: activeSubject?.id || '',
      type: 'link',
      url: '',
      description: '',
      fileType: 'web'
    });
  };

  // Get material type information
  const getMaterialTypeInfo = (fileType) => {
    switch (fileType) {
      case 'web':
        return { 
          label: 'External Link', 
          icon: FiLink, 
          color: '#9B59B6',
          bgColor: '#9B59B620'
        };
      case 'video':
        return { 
          label: 'Video', 
          icon: FiVideo, 
          color: '#3498DB',
          bgColor: '#3498DB20'
        };
      case 'file':
        return { 
          label: 'File', 
          icon: FiFile, 
          color: '#2ECC71',
          bgColor: '#2ECC7120'
        };
      default:
        return { 
          label: 'Link', 
          icon: FiLink, 
          color: theme.primary,
          bgColor: theme.primary + '20'
        };
    }
  };

  // Get subject icon
  const getSubjectIcon = (subjectName) => {
    const name = subjectName.toLowerCase();
    if (name.includes('myanmar') || name.includes('burma')) return FiGlobe;
    if (name.includes('english')) return FiBookOpen;
    if (name.includes('math')) return FiDivide;
    if (name.includes('science')) return FiZap;
    if (name.includes('bio')) return FiDroplet;
    return FiBookOpen;
  };

  // Get filtered materials
  const filteredMaterials = getFilteredMaterials();
  const activeSubjectMaterials = getActiveSubjectMaterials();

  // Debug logging
  useEffect(() => {
  }, [subjects, activeSubject, activeSubjectMaterials]);

  return (
    <div className="space-y-6 relative">
      {/* Alert Notification */}
      {alert.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-y-0 ${
            alert.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
          style={{ zIndex: 100 }}
        >
          <div className="flex items-center justify-between min-w-[300px]">
            <div className="flex items-center">
              <span className="font-medium">{alert.message}</span>
            </div>
            <button
              onClick={() => setAlert({ show: false, type: '', message: '' })}
              className="ml-4 hover:opacity-70"
            >
              <FiX />
            </button>
          </div>
        </div>
      )}

      {/* Search and Add Button */}
      <div
        className="p-4 border rounded-lg"
        style={{ backgroundColor: theme.white, borderColor: theme.border }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="md:w-1/2">
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: theme.dark }}
            >
              Search Materials
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
                placeholder="Search materials by title, description, or URL"
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
              />
            </div>
          </div>
          <div>
            <button
              onClick={() => {
                resetForm();
                setShowFormModal(true);
              }}
              className="px-4 py-2 text-sm border rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: theme.primary,
                color: theme.white,
                borderColor: theme.primary,
              }}
            >
              <FiPlus size={14} />
              Add Study Material
            </button>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      {subjects && subjects.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {subjects.map((subject) => {
            const Icon = getSubjectIcon(subject.subject_name);
            const isActive = activeSubject?.id === subject.id;
            const materialsCount = parseStudyMaterials(subject).length;
            
            return (
              <button
                key={subject.id}
                onClick={() => setActiveSubject(subject)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all relative ${
                  isActive ? "ring-2 ring-offset-2" : "hover:scale-[1.02]"
                }`}
                style={{
                  backgroundColor: isActive ? theme.primary : theme.white,
                  color: isActive ? theme.white : theme.dark,
                  border: `1px solid ${theme.border}`,
                  boxShadow: isActive ? `0 0 0 2px ${theme.primary}20` : 'none',
                  ringColor: theme.primary,
                }}
              >
                <div className="flex flex-col items-center">
                  <Icon size={18} className="mb-1" />
                  <span className="truncate w-full text-center">
                    {subject.subject_name}
                  </span>
                  {materialsCount > 0 && (
                    <span className={`absolute -top-1 -right-1 text-xs px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white' : 'bg-primary text-white'
                    }`} style={{
                      color: isActive ? theme.primary : theme.white
                    }}>
                      {materialsCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg" style={{ 
          backgroundColor: theme.white, 
          borderColor: theme.border 
        }}>
          <p style={{ color: theme.light }}>No subjects available</p>
        </div>
      )}

      {/* Materials Tabs and Header */}
      {activeSubject && (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold" style={{ color: theme.dark }}>
                {activeSubject.subject_name} Study Materials
              </h3>
              <p className="text-sm" style={{ color: theme.light }}>
                {activeSubjectMaterials.length} total materials
                {searchTerm && ` • ${filteredMaterials.length} found`}
              </p>
            </div>
            
            {/* Material Type Tabs */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'all' 
                    ? 'bg-white shadow-sm' 
                    : 'hover:bg-gray-50'
                }`}
                style={{
                  color: activeTab === 'all' ? theme.primary : theme.light,
                }}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('links')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'links' 
                    ? 'bg-white shadow-sm' 
                    : 'hover:bg-gray-50'
                }`}
                style={{
                  color: activeTab === 'links' ? '#9B59B6' : theme.light,
                }}
              >
                Links
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'videos' 
                    ? 'bg-white shadow-sm' 
                    : 'hover:bg-gray-50'
                }`}
                style={{
                  color: activeTab === 'videos' ? '#3498DB' : theme.light,
                }}
              >
                Videos
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'files' 
                    ? 'bg-white shadow-sm' 
                    : 'hover:bg-gray-50'
                }`}
                style={{
                  color: activeTab === 'files' ? '#2ECC71' : theme.light,
                }}
              >
                Files
              </button>
            </div>
          </div>

          {/* Materials List */}
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg" style={{ 
              borderColor: theme.border, 
              backgroundColor: theme.background 
            }}>
              <div className="mb-3">
                <FiFileText size={48} style={{ color: theme.light + '30' }} />
              </div>
              <h4 className="font-medium mb-1" style={{ color: theme.dark }}>
                No materials found
              </h4>
              <p className="text-sm" style={{ color: theme.light }}>
                {searchTerm ? 'Try a different search term' : 'Add study materials using the "Add Study Material" button'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMaterials.map((material, index) => {
                const typeInfo = getMaterialTypeInfo(material.fileType);
                const Icon = typeInfo.icon;
                const isPriority = material.fileType === 'web' || material.fileType === 'video';

                return (
                  <div
                    key={`${material.subjectId}-${index}-${material.fileType}`}
                    className={`p-4 border rounded-lg transition-colors hover:shadow-sm ${
                      isPriority ? "border-l-4" : ""
                    }`}
                    style={{
                      backgroundColor: theme.white,
                      borderColor: theme.border,
                      borderLeftColor: typeInfo.color,
                      borderLeftWidth: isPriority ? "4px" : "1px",
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className="p-2 rounded-lg flex-shrink-0"
                          style={{ 
                            backgroundColor: typeInfo.bgColor,
                          }}
                        >
                          <Icon size={18} style={{ color: typeInfo.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate" style={{ color: theme.dark }}>
                              {material.title || 'Untitled Material'}
                            </h4>
                            <span
                              className="text-xs px-2 py-0.5 rounded flex-shrink-0"
                              style={{
                                backgroundColor: typeInfo.bgColor,
                                color: typeInfo.color,
                              }}
                            >
                              {typeInfo.label}
                            </span>
                          </div>
                          {material.description && (
                            <p className="text-xs mb-2 line-clamp-2" style={{ color: theme.light }}>
                              {material.description}
                            </p>
                          )}
                          <div className="mt-2">
                            <a
                              href={material.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs inline-flex items-center gap-1 hover:underline truncate max-w-full"
                              style={{ color: theme.primary }}
                            >
                              <FiExternalLink size={10} />
                              <span className="truncate">
                                {material.url || 'No URL'}
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-4 flex-shrink-0">
                        <button
                          onClick={() => handleEditClick(material)}
                          className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                          style={{ color: theme.primary }}
                          title="Edit"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteStudyMaterial(material)}
                          className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                          style={{ color: theme.danger }}
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Add Material Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {
              setShowFormModal(false);
              resetForm();
            }}
          />
          
          <div
            className="w-full max-w-2xl p-6 rounded-xl shadow-2xl relative transition-all duration-300 transform scale-100"
            style={{
              backgroundColor: theme.white,
              border: `1px solid ${theme.border}`,
              zIndex: 60,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 border-b pb-4" style={{borderColor: theme.border}}>
              <h2 className="text-xl font-semibold" style={{ color: theme.dark }}>
                <div className="flex items-center gap-2">
                  <FiUpload />
                  Add Study Material
                </div>
              </h2>
              <button
                onClick={() => {
                  setShowFormModal(false);
                  resetForm();
                }}
                className="p-2 rounded-full transition-all duration-200 hover:bg-gray-100"
                style={{ color: theme.light }}
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
                      Title <span style={{ color: theme.danger }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newMaterial.title}
                      onChange={handleNewMaterialChange}
                      placeholder="Enter material title"
                      className="w-full p-3 border rounded-lg text-sm"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.dark,
                        outlineColor: theme.primary
                      }}
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
                      Material Type <span style={{ color: theme.danger }}>*</span>
                    </label>
                    <select
                      name="fileType"
                      value={newMaterial.fileType}
                      onChange={handleNewMaterialChange}
                      className="w-full p-3 border rounded-lg text-sm"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.dark,
                        outlineColor: theme.primary
                      }}
                    >
                      <option value="web">Web Link</option>
                      <option value="video">Video Link</option>
                      <option value="file">File (PDF/Doc)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
                    URL <span style={{ color: theme.danger }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="url"
                    value={newMaterial.url}
                    onChange={handleNewMaterialChange}
                    placeholder={
                      newMaterial.fileType === 'web' ? 'https://example.com' :
                      newMaterial.fileType === 'video' ? 'https://youtube.com/watch?v=...' :
                      '/uploads/materials/filename.pdf'
                    }
                    className="w-full p-3 border rounded-lg text-sm"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.dark,
                      outlineColor: theme.primary
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newMaterial.description}
                    onChange={handleNewMaterialChange}
                    className="w-full p-3 border rounded-lg text-sm"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.dark,
                      outlineColor: theme.primary
                    }}
                    rows={3}
                    placeholder="Enter description (optional)"
                  />
                </div>
                
                <div className="text-xs text-gray-500">
                  <p>• This material will be added to: <strong>{activeSubject?.subject_name || 'Selected Subject'}</strong></p>
                  <p>• Make sure the URL is accessible to students</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 justify-end border-t mt-6" style={{borderColor: theme.border}}>
              <button
                onClick={() => {
                  setShowFormModal(false);
                  resetForm();
                }}
                className="px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: theme.background,
                  color: theme.dark,
                  border: `1px solid ${theme.border}`,
                }}
              >
                Cancel
              </button>
              <button
                onClick={addStudyMaterial}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: theme.primary,
                  color: theme.white,
                  boxShadow: `0 4px 6px -1px ${theme.primary}30`,
                }}
              >
                <FiUpload size={16} />
                Add Material
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Material Modal */}
      {editModalOpen && materialToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {
              setEditModalOpen(false);
              setMaterialToEdit(null);
            }}
          />
          
          <div
            className="w-full max-w-md p-6 rounded-xl shadow-2xl relative transition-all duration-300 transform scale-100"
            style={{
              backgroundColor: theme.white,
              border: `1px solid ${theme.border}`,
              zIndex: 60,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg" style={{ color: theme.dark }}>
                Edit Study Material
              </h3>
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setMaterialToEdit(null);
                }}
                className="p-2 rounded-full transition-all duration-200 hover:bg-gray-100"
                style={{ color: theme.light }}
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
                  Title <span style={{ color: theme.danger }}>*</span>
                </label>
                <input
                  type="text"
                  value={materialToEdit.title}
                  onChange={(e) => setMaterialToEdit({...materialToEdit, title: e.target.value})}
                  className="w-full p-3 border rounded-lg text-sm"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.dark,
                    outlineColor: theme.primary
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
                  URL <span style={{ color: theme.danger }}>*</span>
                </label>
                <input
                  type="text"
                  value={materialToEdit.url}
                  onChange={(e) => setMaterialToEdit({...materialToEdit, url: e.target.value})}
                  className="w-full p-3 border rounded-lg text-sm"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.dark,
                    outlineColor: theme.primary
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
                  Description
                </label>
                <textarea
                  value={materialToEdit.description || ''}
                  onChange={(e) => setMaterialToEdit({...materialToEdit, description: e.target.value})}
                  className="w-full p-3 border rounded-lg text-sm"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.dark,
                    outlineColor: theme.primary
                  }}
                  rows={3}
                />
              </div>

              <div className="text-xs text-gray-500">
                <p>Subject: <strong>{materialToEdit.subjectName}</strong></p>
                <p>Type: <strong>{materialToEdit.fileType === 'web' ? 'Web Link' : materialToEdit.fileType === 'video' ? 'Video' : 'File'}</strong></p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setEditModalOpen(false);
                    setMaterialToEdit(null);
                  }}
                  className="px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 hover:opacity-90"
                  style={{
                    backgroundColor: theme.background,
                    color: theme.dark,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 hover:opacity-90"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.white,
                    boxShadow: `0 4px 6px -1px ${theme.primary}30`,
                  }}
                >
                  <FiSave size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};








  // const ChartsTab = () => (
  //   <div className="space-y-6">
  //     <div
  //       className="p-4 border rounded-lg"
  //       style={{ backgroundColor: theme.white, borderColor: theme.border }}
  //     >
  //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //         <div>
  //           <label
  //             className="block text-sm font-medium mb-1"
  //             style={{ color: theme.dark }}
  //           >
  //             Select Subject
  //           </label>
  //           <select
  //             value={selectedSubjectForChart}
  //             onChange={(e) => setSelectedSubjectForChart(e.target.value)}
  //             className="w-full p-2 border rounded text-sm"
  //             style={{
  //               backgroundColor: theme.background,
  //               borderColor: theme.border,
  //               color: theme.dark,
  //             }}
  //           >
  //             <option value="Mathematics">Mathematics</option>
  //             <option value="Science">Science</option>
  //             <option value="English">English</option>
  //             <option value="History">History</option>
  //             <option value="Computer Science">Computer Science</option>
  //             <option value="Average">Overall Average</option>
  //           </select>
  //         </div>
  //         <div>
  //           <label
  //             className="block text-sm font-medium mb-1"
  //             style={{ color: theme.dark }}
  //           >
  //             Chart Type
  //           </label>
  //           <div className="flex gap-2">
  //             <button
  //               onClick={() => setChartType("line")}
  //               className={`flex-1 p-2 text-sm border rounded-lg ${
  //                 chartType === "line" ? "text-white" : ""
  //               }`}
  //               style={{
  //                 backgroundColor:
  //                   chartType === "line" ? theme.primary : theme.background,
  //                 color: chartType === "line" ? theme.white : theme.dark,
  //                 borderColor:
  //                   chartType === "line" ? theme.primary : theme.border,
  //               }}
  //             >
  //               Line
  //             </button>
  //             <button
  //               onClick={() => setChartType("bar")}
  //               className={`flex-1 p-2 text-sm border rounded-lg ${
  //                 chartType === "bar" ? "text-white" : ""
  //               }`}
  //               style={{
  //                 backgroundColor:
  //                   chartType === "bar" ? theme.primary : theme.background,
  //                 color: chartType === "bar" ? theme.white : theme.dark,
  //                 borderColor:
  //                   chartType === "bar" ? theme.primary : theme.border,
  //               }}
  //             >
  //               Bar
  //             </button>
  //             <button
  //               onClick={() => setChartType("pie")}
  //               className={`flex-1 p-2 text-sm border rounded-lg ${
  //                 chartType === "pie" ? "text-white" : ""
  //               }`}
  //               style={{
  //                 backgroundColor:
  //                   chartType === "pie" ? theme.primary : theme.background,
  //                 color: chartType === "pie" ? theme.white : theme.dark,
  //                 borderColor:
  //                   chartType === "pie" ? theme.primary : theme.border,
  //               }}
  //             >
  //               Pie
  //             </button>
  //           </div>
  //         </div>
  //         <div>
  //           <label
  //             className="block text-sm font-medium mb-1"
  //             style={{ color: theme.dark }}
  //           >
  //             Actions
  //           </label>
  //           <div className="flex gap-2">
  //             <button
  //               className="flex-1 p-2 text-sm border rounded-lg flex items-center justify-center gap-1"
  //               style={{
  //                 backgroundColor: theme.white,
  //                 borderColor: theme.border,
  //                 color: theme.dark,
  //               }}
  //             >
  //               <FiPrinter size={14} />
  //               Print
  //             </button>
  //             <button
  //               className="flex-1 p-2 text-sm border rounded-lg flex items-center justify-center gap-1"
  //               style={{
  //                 backgroundColor: theme.primary,
  //                 borderColor: theme.primary,
  //                 color: theme.white,
  //               }}
  //             >
  //               <FiDownload size={14} />
  //               Export
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     <div
  //       className="p-6 border rounded-lg"
  //       style={{ backgroundColor: theme.white, borderColor: theme.border }}
  //     >
  //       <div className="flex items-center justify-between mb-6">
  //         <h3 className="font-semibold" style={{ color: theme.dark }}>
  //           {selectedSubjectForChart} Performance Chart
  //         </h3>
  //         <div className="text-sm" style={{ color: theme.light }}>
  //           {studentMarksData.length} students
  //         </div>
  //       </div>

  //       <div className="h-80">
  //         {chartType === "line" ? (
  //           <div className="relative h-full">
  //             <div
  //               className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs"
  //               style={{ color: theme.light }}
  //             >
  //               <span>100%</span>
  //               <span>75%</span>
  //               <span>50%</span>
  //               <span>25%</span>
  //               <span>0%</span>
  //             </div>

  //             <div
  //               className="ml-12 h-full border-b border-l pl-4 pb-4"
  //               style={{ borderColor: theme.border }}
  //             >
  //               <div className="absolute inset-0 flex flex-col justify-between">
  //                 {[0, 25, 50, 75, 100].map((percent) => (
  //                   <div
  //                     key={percent}
  //                     className="border-t"
  //                     style={{ borderColor: theme.border + "30" }}
  //                   ></div>
  //                 ))}
  //               </div>

  //               <div className="relative h-full">
  //                 {chartData.data.map((value, index) => {
  //                   const x = (index / (chartData.data.length - 1 || 1)) * 100;
  //                   const y = 100 - value;

  //                   return (
  //                     <div
  //                       key={index}
  //                       className="absolute"
  //                       style={{
  //                         left: `${x}%`,
  //                         top: `${y}%`,
  //                         transform: "translate(-50%, -50%)",
  //                       }}
  //                     >
  //                       <div
  //                         className="w-3 h-3 rounded-full border-2"
  //                         style={{
  //                           backgroundColor: theme.white,
  //                           borderColor: theme.primary,
  //                         }}
  //                       ></div>
  //                       <div
  //                         className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap"
  //                         style={{ color: theme.dark }}
  //                       >
  //                         {value}%
  //                       </div>
  //                     </div>
  //                   );
  //                 })}

  //                 <svg className="absolute inset-0 w-full h-full">
  //                   <polyline
  //                     points={chartData.data
  //                       .map((value, index) => {
  //                         const x =
  //                           (index / (chartData.data.length - 1 || 1)) * 100;
  //                         const y = 100 - value;
  //                         return `${x},${y}`;
  //                       })
  //                       .join(" ")}
  //                     fill="none"
  //                     stroke={theme.primary}
  //                     strokeWidth="2"
  //                   />
  //                 </svg>
  //               </div>

  //               <div
  //                 className="flex justify-between mt-2 text-xs"
  //                 style={{ color: theme.light }}
  //               >
  //                 {chartData.labels.map((label, index) => (
  //                   <div key={index} className="w-16 text-center truncate">
  //                     {label.split(" ")[0]}
  //                   </div>
  //                 ))}
  //               </div>
  //             </div>
  //           </div>
  //         ) : chartType === "bar" ? (
  //           <div className="h-full">
  //             <div
  //               className="flex items-end h-64 gap-2 border-b border-l pl-4 pb-4"
  //               style={{ borderColor: theme.border }}
  //             >
  //               {chartData.data.map((value, index) => (
  //                 <div
  //                   key={index}
  //                   className="flex-1 flex flex-col items-center"
  //                 >
  //                   <div
  //                     className="w-3/4 rounded-t transition-all duration-300 hover:opacity-80"
  //                     style={{
  //                       backgroundColor: theme.primary,
  //                       height: `${(value / 100) * 80}%`,
  //                       minHeight: "4px",
  //                     }}
  //                     title={`${value}%`}
  //                   />
  //                   <div
  //                     className="text-xs mt-2 text-center truncate w-full"
  //                     style={{ color: theme.light }}
  //                   >
  //                     {chartData.labels[index].split(" ")[0]}
  //                   </div>
  //                 </div>
  //               ))}
  //             </div>
  //           </div>
  //         ) : (
  //           <div className="flex items-center justify-center h-64">
  //             <div className="relative w-48 h-48">
  //               <div
  //                 className="absolute inset-0 rounded-full border-8"
  //                 style={{ borderColor: theme.primary + "30" }}
  //               ></div>
  //               <div
  //                 className="absolute inset-8 rounded-full flex items-center justify-center"
  //                 style={{ backgroundColor: theme.primaryBg }}
  //               >
  //                 <div className="text-center">
  //                   <div
  //                     className="text-2xl font-bold"
  //                     style={{ color: theme.primary }}
  //                   >
  //                     {(
  //                       chartData.data.reduce((a, b) => a + b, 0) /
  //                       chartData.data.length
  //                     ).toFixed(1)}
  //                     %
  //                   </div>
  //                   <div className="text-xs" style={{ color: theme.light }}>
  //                     Average
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         )}
  //       </div>

  //       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
  //         <div
  //           className="text-center p-3 border rounded-lg"
  //           style={{
  //             backgroundColor: theme.background,
  //             borderColor: theme.border,
  //           }}
  //         >
  //           <div className="text-lg font-bold" style={{ color: theme.primary }}>
  //             {Math.max(...chartData.data)}%
  //           </div>
  //           <div className="text-xs" style={{ color: theme.light }}>
  //             Highest
  //           </div>
  //         </div>
  //         <div
  //           className="text-center p-3 border rounded-lg"
  //           style={{
  //             backgroundColor: theme.background,
  //             borderColor: theme.border,
  //           }}
  //         >
  //           <div className="text-lg font-bold" style={{ color: theme.primary }}>
  //             {Math.min(...chartData.data)}%
  //           </div>
  //           <div className="text-xs" style={{ color: theme.light }}>
  //             Lowest
  //           </div>
  //         </div>
  //         <div
  //           className="text-center p-3 border rounded-lg"
  //           style={{
  //             backgroundColor: theme.background,
  //             borderColor: theme.border,
  //           }}
  //         >
  //           <div className="text-lg font-bold" style={{ color: theme.primary }}>
  //             {(
  //               chartData.data.reduce((a, b) => a + b, 0) /
  //               chartData.data.length
  //             ).toFixed(1)}
  //             %
  //           </div>
  //           <div className="text-xs" style={{ color: theme.light }}>
  //             Average
  //           </div>
  //         </div>
  //         <div
  //           className="text-center p-3 border rounded-lg"
  //           style={{
  //             backgroundColor: theme.background,
  //             borderColor: theme.border,
  //           }}
  //         >
  //           <div className="text-lg font-bold" style={{ color: theme.primary }}>
  //             {chartData.data.filter((v) => v >= 70).length}/
  //             {chartData.data.length}
  //           </div>
  //           <div className="text-xs" style={{ color: theme.light }}>
  //             Passed (≥70%)
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     <div
  //       className="p-6 border rounded-lg"
  //       style={{ backgroundColor: theme.white, borderColor: theme.border }}
  //     >
  //       <h3 className="font-semibold mb-4" style={{ color: theme.dark }}>
  //         Student Ranking - {selectedSubjectForChart}
  //       </h3>
  //       <div className="overflow-x-auto">
  //         <table className="w-full">
  //           <thead>
  //             <tr style={{ backgroundColor: theme.background }}>
  //               <th
  //                 className="p-3 text-left text-xs font-medium"
  //                 style={{ color: theme.light, borderColor: theme.border }}
  //               >
  //                 Rank
  //               </th>
  //               <th
  //                 className="p-3 text-left text-xs font-medium"
  //                 style={{ color: theme.light, borderColor: theme.border }}
  //               >
  //                 Student
  //               </th>
  //               <th
  //                 className="p-3 text-left text-xs font-medium"
  //                 style={{ color: theme.light, borderColor: theme.border }}
  //               >
  //                 Marks
  //               </th>
  //               <th
  //                 className="p-3 text-left text-xs font-medium"
  //                 style={{ color: theme.light, borderColor: theme.border }}
  //               >
  //                 Percentage
  //               </th>
  //               <th
  //                 className="p-3 text-left text-xs font-medium"
  //                 style={{ color: theme.light, borderColor: theme.border }}
  //               >
  //                 Grade
  //               </th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {[...studentMarksData]
  //               .sort((a, b) => {
  //                 const aVal =
  //                   a[selectedSubjectForChart.toLowerCase().replace(" ", "")] ||
  //                   a.avg;
  //                 const bVal =
  //                   b[selectedSubjectForChart.toLowerCase().replace(" ", "")] ||
  //                   b.avg;
  //                 return bVal - aVal;
  //               })
  //               .map((student, index) => {
  //                 const value =
  //                   student[
  //                     selectedSubjectForChart.toLowerCase().replace(" ", "")
  //                   ] || student.avg;
  //                 const grade =
  //                   value >= 90
  //                     ? "A+"
  //                     : value >= 80
  //                     ? "A"
  //                     : value >= 70
  //                     ? "B"
  //                     : value >= 60
  //                     ? "C"
  //                     : "D";
  //                 const gradeColor =
  //                   value >= 90
  //                     ? theme.accent
  //                     : value >= 70
  //                     ? theme.primary
  //                     : value >= 60
  //                     ? theme.warning
  //                     : theme.danger;

  //                 return (
  //                   <tr
  //                     key={index}
  //                     className="border-t"
  //                     style={{ borderColor: theme.border }}
  //                   >
  //                     <td className="p-3">
  //                       <div
  //                         className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
  //                         style={{
  //                           backgroundColor:
  //                             index < 3
  //                               ? theme.primary + "15"
  //                               : theme.background,
  //                           color: index < 3 ? theme.primary : theme.dark,
  //                         }}
  //                       >
  //                         {index + 1}
  //                       </div>
  //                     </td>
  //                     <td className="p-3">
  //                       <div
  //                         className="font-medium text-sm"
  //                         style={{ color: theme.dark }}
  //                       >
  //                         {student.student}
  //                       </div>
  //                     </td>
  //                     <td className="p-3">
  //                       <div className="flex items-center">
  //                         <div className="w-24 bg-gray-200 h-2 rounded-full mr-2">
  //                           <div
  //                             className="h-2 rounded-full"
  //                             style={{
  //                               width: `${value}%`,
  //                               backgroundColor:
  //                                 value >= 70
  //                                   ? theme.accent
  //                                   : value >= 50
  //                                   ? theme.warning
  //                                   : theme.danger,
  //                             }}
  //                           />
  //                         </div>
  //                         <span
  //                           className="text-sm font-medium"
  //                           style={{ color: theme.dark }}
  //                         >
  //                           {value}%
  //                         </span>
  //                       </div>
  //                     </td>
  //                     <td
  //                       className="p-3 text-sm font-medium"
  //                       style={{ color: theme.dark }}
  //                     >
  //                       {value}%
  //                     </td>
  //                     <td className="p-3">
  //                       <span
  //                         className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full"
  //                         style={{
  //                           backgroundColor: gradeColor + "15",
  //                           color: gradeColor,
  //                         }}
  //                       >
  //                         {grade}
  //                       </span>
  //                     </td>
  //                   </tr>
  //                 );
  //               })}
  //           </tbody>
  //         </table>
  //       </div>
  //     </div>
  //   </div>
  // );

const SubjectsListTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [subjectForm, setSubjectForm] = useState({
    id: null,
    teacher_id: '',
    subject_name: '',
    schedule: '',
    academic_year: new Date().getFullYear().toString(),
    classA: '',
    classB: '',
    classC: '',
    classD: '',
    classE: '',
    classF: ''
  });
  const alertTimeoutRef = useRef(null);
  const currentYear = new Date().getFullYear();
  const academicYears = [
    `${currentYear-1}-${currentYear}`,
    `${currentYear}-${currentYear+1}`,
    `${currentYear+1}-${currentYear+2}`
  ];

  const showAlert = (type, message) => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    setAlert({ show: true, type, message });
    alertTimeoutRef.current = setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubjectForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!subjectForm.teacher_id) {
      showAlert('error', 'Please select a teacher');
      return false;
    }
    if (!subjectForm.subject_name.trim()) {
      showAlert('error', 'Please enter subject name');
      return false;
    }
    if (!subjectForm.academic_year) {
      showAlert('error', 'Please select academic year');
      return false;
    }
    const hasSchedule = 
      subjectForm.classA.trim() || 
      subjectForm.classB.trim() || 
      subjectForm.classC.trim() || 
      subjectForm.classD.trim() || 
      subjectForm.classE.trim() || 
      subjectForm.classF.trim();
    if (!hasSchedule) {
      showAlert('error', 'Please enter at least one class schedule');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const scheduleArray = [];
      if (subjectForm.classA.trim()) scheduleArray.push(subjectForm.classA.trim());
      if (subjectForm.classB.trim()) scheduleArray.push(subjectForm.classB.trim());
      if (subjectForm.classC.trim()) scheduleArray.push(subjectForm.classC.trim());
      if (subjectForm.classD.trim()) scheduleArray.push(subjectForm.classD.trim());
      if (subjectForm.classE.trim()) scheduleArray.push(subjectForm.classE.trim());
      if (subjectForm.classF.trim()) scheduleArray.push(subjectForm.classF.trim());
      const scheduleString = JSON.stringify(scheduleArray);
      const payload = {
        id: subjectForm.id,
        teacher_id: subjectForm.teacher_id,
        subject_name: subjectForm.subject_name,
        schedule: scheduleString,
        academic_year: subjectForm.academic_year,
        grade_id: gradeId
      };
      if (isEditing) {
        const response = await axios.post(`${admin_backend_domain_name}api/admin/updateSubject`, payload, {
          withCredentials:true
        });
        setSubjects(response.data.data)
        showAlert('success', 'Subject updated successfully!');
      } else {
        const response = await axios.post(`${admin_backend_domain_name}api/admin/createSubject`, payload, {
          withCredentials:true
        });
        if(response.status === 200 || response.status === 201){
          setSubjects(response.data.data);
          showAlert('success', 'Subject created successfully!');
        }
      }
      resetForm();
      setShowForm(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error:', error);
      showAlert('error', isEditing ? 'Failed to update subject' : 'Failed to create subject');
    }
  };

  const handleEdit = (subject) => {
    let classA = '', classB = '', classC = '', classD = '', classE = '', classF = '';
    try {
      if (subject.schedule) {
        const scheduleArray = JSON.parse(subject.schedule);
        if (Array.isArray(scheduleArray) && scheduleArray.length >= 6) {
          classA = scheduleArray[0] || '';
          classB = scheduleArray[1] || '';
          classC = scheduleArray[2] || '';
          classD = scheduleArray[3] || '';
          classE = scheduleArray[4] || '';
          classF = scheduleArray[5] || '';
        } else if (scheduleArray.length > 0) {
          [classA, classB, classC, classD, classE, classF] = [
            ...scheduleArray,
            ...Array(6 - scheduleArray.length).fill('')
          ];
        }
      }
    } catch (error) {
      console.error('Error parsing schedule:', error);
    }
    setSubjectForm({
      id: subject.id,
      teacher_id: subject.teacher_id,
      subject_name: subject.subject_name,
      schedule: subject.schedule,
      academic_year: subject.academic_year || currentYear.toString(),
      classA,
      classB,
      classC,
      classD,
      classE,
      classF
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    try {
      await axios.get(`${admin_backend_domain_name}api/admin/deleteSubject/${id}`, {
        withCredentials:true
      });
      setSubjects(subjects.filter(subject => subject.id !== id));
      showAlert('success', 'Subject deleted successfully!');
    } catch (error) {
      showAlert('error', 'Failed to delete subject');
    }
  };

  const resetForm = () => {
    setSubjectForm({
      id: null,
      teacher_id: '',
      subject_name: '',
      schedule: '',
      academic_year: `${currentYear}-${currentYear+1}`,
      classA: '',
      classB: '',
      classC: '',
      classD: '',
      classE: '',
      classF: ''
    });
  };

  const filteredSubjects = subjects ? subjects.filter(subject =>
    subject.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.id?.toString().includes(searchTerm)
  ) : [];

  return (
    <div className="space-y-6">
      {alert.show && (
        <div
          className={`p-4 rounded-lg mb-4 transition-all duration-300 ${
            alert.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-medium">{alert.message}</span>
            </div>
            <button
              onClick={() => setAlert({ show: false, type: '', message: '' })}
              className="ml-4"
            >
              <FiX />
            </button>
          </div>
        </div>
      )}

      <div
        className="p-4 border rounded-lg"
        style={{ backgroundColor: theme.white, borderColor: theme.border }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="md:w-1/2">
            <label
              className="block text-sm font-medium mb-1"
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
                placeholder="Search by subject name or code"
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
              />
            </div>
          </div>
          <div>
            <button
              onClick={() => {
                resetForm();
                setIsEditing(false);
                setShowForm(true);
              }}
              className="px-4 py-2 text-sm border rounded-lg flex items-center justify-center gap-2"
              style={{
                backgroundColor: theme.primary,
                color: theme.white,
                borderColor: theme.primary,
              }}
            >
              <FiPlus size={14} />
              Add Subject
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => {
              setShowForm(false);
              resetForm();
              setIsEditing(false);
            }}
          />
          <div
            className="w-full max-w-4xl p-6 rounded-xl shadow-2xl relative transition-transform duration-300 transform scale-100"
            style={{
              backgroundColor: theme.white,
              border: `1px solid ${theme.border}`,
              zIndex: 60,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 border-b pb-3" style={{borderColor: theme.border}}>
              <h2
                className="text-2xl font-semibold"
                style={{ color: theme.dark }}
              >
                {isEditing ? "Edit Subject" : "Add New Subject"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                  setIsEditing(false);
                }}
                className="p-2 rounded-full transition-all duration-200 hover:bg-gray-100"
                style={{
                  color: theme.light,
                }}
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
                      Teacher <span style={{ color: theme.danger }}>*</span>
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: theme.light }} />
                      <select
                        name="teacher_id"
                        value={subjectForm.teacher_id}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm appearance-none focus:ring-2 focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: theme.background,
                          borderColor: theme.border,
                          color: theme.dark,
                          outlineColor: theme.primary
                        }}
                      >
                        <option value="">Select a teacher</option>
                        {teachers.map(teacher => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
                      Subject Name <span style={{ color: theme.danger }}>*</span>
                    </label>
                    <div className="relative">
                      <FiBook className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: theme.light }} />
                      <input
                        type="text"
                        name="subject_name"
                        value={subjectForm.subject_name}
                        onChange={handleInputChange}
                        placeholder="Enter subject name"
                        required
                        className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: theme.background,
                          borderColor: theme.border,
                          color: theme.dark,
                          outlineColor: theme.primary
                        }}
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
                      Academic Year <span style={{ color: theme.danger }}>*</span>
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: theme.light }} />
                      <select
                        name="academic_year"
                        value={subjectForm.academic_year}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm appearance-none focus:ring-2 focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: theme.background,
                          borderColor: theme.border,
                          color: theme.dark,
                          outlineColor: theme.primary
                        }}
                      >
                        <option value="">Select academic year</option>
                        {academicYears.map(year => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
                      Schedule (For Classes A to F) <span style={{ color: theme.danger }}>*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setSubjectForm(prev => ({
                          ...prev,
                          classA: '',
                          classB: '',
                          classC: '',
                          classD: '',
                          classE: '',
                          classF: ''
                        }));
                      }}
                      className="text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 hover:bg-gray-50"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.light,
                      }}
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-2 uppercase" style={{ color: theme.dark }}>
                        Class A Schedule
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2" size={14} style={{ color: theme.light }} />
                        <input
                          type="text"
                          name="classA"
                          value={subjectForm.classA}
                          onChange={handleInputChange}
                          placeholder="e.g., Mon 9:00-10:00 AM"
                          className="w-full pl-10 pr-4 py-3 border rounded text-sm focus:ring-2 focus:ring-offset-1"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                            color: theme.dark,
                            outlineColor: theme.primary
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-2 uppercase" style={{ color: theme.dark }}>
                        Class B Schedule
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2" size={14} style={{ color: theme.light }} />
                        <input
                          type="text"
                          name="classB"
                          value={subjectForm.classB}
                          onChange={handleInputChange}
                          placeholder="e.g., Tue 10:00-11:00 AM"
                          className="w-full pl-10 pr-4 py-3 border rounded text-sm focus:ring-2 focus:ring-offset-1"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                            color: theme.dark,
                            outlineColor: theme.primary
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-2 uppercase" style={{ color: theme.dark }}>
                        Class C Schedule
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2" size={14} style={{ color: theme.light }} />
                        <input
                          type="text"
                          name="classC"
                          value={subjectForm.classC}
                          onChange={handleInputChange}
                          placeholder="e.g., Wed 1:00-2:00 PM"
                          className="w-full pl-10 pr-4 py-3 border rounded text-sm focus:ring-2 focus:ring-offset-1"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                            color: theme.dark,
                            outlineColor: theme.primary
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-2 uppercase" style={{ color: theme.dark }}>
                        Class D Schedule
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2" size={14} style={{ color: theme.light }} />
                        <input
                          type="text"
                          name="classD"
                          value={subjectForm.classD}
                          onChange={handleInputChange}
                          placeholder="e.g., Thu 2:00-3:00 PM"
                          className="w-full pl-10 pr-4 py-3 border rounded text-sm focus:ring-2 focus:ring-offset-1"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                            color: theme.dark,
                            outlineColor: theme.primary
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-2 uppercase" style={{ color: theme.dark }}>
                        Class E Schedule
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2" size={14} style={{ color: theme.light }} />
                        <input
                          type="text"
                          name="classE"
                          value={subjectForm.classE}
                          onChange={handleInputChange}
                          placeholder="e.g., Fri 3:00-4:00 PM"
                          className="w-full pl-10 pr-4 py-3 border rounded text-sm focus:ring-2 focus:ring-offset-1"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                            color: theme.dark,
                            outlineColor: theme.primary
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-2 uppercase" style={{ color: theme.dark }}>
                        Class F Schedule
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2" size={14} style={{ color: theme.light }} />
                        <input
                          type="text"
                          name="classF"
                          value={subjectForm.classF}
                          onChange={handleInputChange}
                          placeholder="e.g., Sat 4:00-5:00 PM"
                          className="w-full pl-10 pr-4 py-3 border rounded text-sm focus:ring-2 focus:ring-offset-1"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                            color: theme.dark,
                            outlineColor: theme.primary
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs mt-3 italic" style={{ color: theme.light }}>
                    Enter schedule for each class (e.g., Monday 9:00-10:00 AM)
                  </p>
                </div>
              </form>
            </div>

            <div className="flex gap-3 pt-6 justify-end border-t mt-6" style={{borderColor: theme.border}}>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                  setIsEditing(false);
                }}
                className="px-5 py-2.5 text-base font-medium rounded-lg transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: theme.background,
                  color: theme.dark,
                  border: `1px solid ${theme.border}`,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-2.5 text-base font-medium rounded-lg transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: theme.primary,
                  color: theme.white,
                  boxShadow: `0 4px 6px -1px ${theme.primary}30`,
                }}
              >
                <FiSave size={16} />
                {isEditing ? "Update Subject" : "Create Subject"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="p-4 border rounded-lg overflow-hidden"
        style={{ backgroundColor: theme.white, borderColor: theme.border }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottomColor: theme.border }}>
                <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: theme.dark }}>ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: theme.dark }}>Subject Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: theme.dark }}>Teacher</th>
                <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: theme.dark }}>Academic Year</th>
                <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: theme.dark }}>Schedule (Classes A-F)</th>
                <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: theme.dark }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8" style={{ color: theme.light }}>
                    No subjects found
                  </td>
                </tr>
              ) : (
                filteredSubjects.map((subject) => {
                  const teacher = teachers.find(t => t.id === subject.teacher_id);
                  let scheduleData = {
                    classA: '',
                    classB: '',
                    classC: '',
                    classD: '',
                    classE: '',
                    classF: ''
                  };
                  try {
                    if (subject.schedule) {
                      const scheduleArray = JSON.parse(subject.schedule);
                      if (Array.isArray(scheduleArray)) {
                        if (scheduleArray.length >= 6) {
                          scheduleData.classA = scheduleArray[0] || '';
                          scheduleData.classB = scheduleArray[1] || '';
                          scheduleData.classC = scheduleArray[2] || '';
                          scheduleData.classD = scheduleArray[3] || '';
                          scheduleData.classE = scheduleArray[4] || '';
                          scheduleData.classF = scheduleArray[5] || '';
                        } else {
                          ['classA', 'classB', 'classC', 'classD', 'classE', 'classF'].forEach((className, index) => {
                            scheduleData[className] = scheduleArray[index] || '';
                          });
                        }
                      }
                    }
                  } catch (error) {
                    console.error('Error parsing schedule:', error);
                  }
                  return (
                    <tr key={subject.id} style={{ borderBottomColor: theme.border + '30' }}>
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium" style={{ color: theme.primary }}>
                          {subject.id || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium" style={{ color: theme.dark }}>
                            {subject.subject_name}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-gray-200">
                            <img
                              src={`${user_backend_domain_name}uploads/${teacher?.profile}`}
                              alt={teacher?.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                            <div
                              className="w-full h-full rounded-full flex items-center justify-center text-xs text-white hidden"
                              style={{ backgroundColor: theme.primary }}
                            >
                              {teacher?.name?.split(' ').map(n => n[0]).join('') || 'T'}
                            </div>
                          </div>
                          <span className="text-sm" style={{ color: theme.dark }}>
                            {teacher?.name || 'Not Assigned'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm" style={{ color: theme.dark }}>
                          {subject.academic_year || `${currentYear}-${currentYear+1}`}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {scheduleData.classA && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium min-w-[50px]" style={{ color: theme.primary }}>
                                Class A:
                              </span>
                              <span className="text-xs" style={{ color: theme.dark }}>
                                {scheduleData.classA}
                              </span>
                            </div>
                          )}
                          {scheduleData.classB && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium min-w-[50px]" style={{ color: theme.primary }}>
                                Class B:
                              </span>
                              <span className="text-xs" style={{ color: theme.dark }}>
                                {scheduleData.classB}
                              </span>
                            </div>
                          )}
                          {scheduleData.classC && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium min-w-[50px]" style={{ color: theme.primary }}>
                                Class C:
                              </span>
                              <span className="text-xs" style={{ color: theme.dark }}>
                                {scheduleData.classC}
                              </span>
                            </div>
                          )}
                          {scheduleData.classD && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium min-w-[50px]" style={{ color: theme.primary }}>
                                Class D:
                              </span>
                              <span className="text-xs" style={{ color: theme.dark }}>
                                {scheduleData.classD}
                              </span>
                            </div>
                          )}
                          {scheduleData.classE && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium min-w-[50px]" style={{ color: theme.primary }}>
                                Class E:
                              </span>
                              <span className="text-xs" style={{ color: theme.dark }}>
                                {scheduleData.classE}
                              </span>
                            </div>
                          )}
                          {scheduleData.classF && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium min-w-[50px]" style={{ color: theme.primary }}>
                                Class F:
                              </span>
                              <span className="text-xs" style={{ color: theme.dark }}>
                                {scheduleData.classF}
                              </span>
                            </div>
                          )}
                          {!scheduleData.classA && !scheduleData.classB && !scheduleData.classC && 
                           !scheduleData.classD && !scheduleData.classE && !scheduleData.classF && (
                            <span className="text-xs" style={{ color: theme.light }}>
                              No schedule set
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(subject)}
                            className="p-1.5 rounded-lg border flex items-center gap-1 text-xs"
                            style={{
                              backgroundColor: theme.white,
                              borderColor: theme.border,
                              color: theme.primary,
                            }}
                            title="Edit"
                          >
                            <FiEdit2 size={12} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(subject.id)}
                            className="p-1.5 rounded-lg border flex items-center gap-1 text-xs"
                            style={{
                              backgroundColor: theme.white,
                              borderColor: theme.border,
                              color: theme.danger,
                            }}
                            title="Delete"
                          >
                            <FiTrash2 size={12} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

  const tabs = [
    {id: "materials", label: "Study Materials", icon: FiBook, component: StudyMaterialsTab},
    {id: "subjects", label: "Subjects", icon: FiSubject, component: SubjectsListTab},
    {id: "students", label: "Students List", icon: FiUsers, component: StudentsListTab},
    {id: "teachers", label: "Teachers List", icon: FiUser, component: TeachersListTab},
    {id: "guide-teachers", label: "Guide Teachers", icon: FiUserCheck, component: GuideTeachersTab},
    {id: "managers", label: "Grade Managers", icon: FiTarget, component: GradeManagersTab},
    {id: "exams", label: "Exams", icon: FiCalendar, component: ExamsTab},

    // {id: "charts", label: "Performance Charts", icon: FiTrendingUp, component: ChartsTab},
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || TeachersListTab;

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: theme.background }}
    >
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
                G{grade.id}
              </div>
              {grade.label} Management
            </h1>
            <div
              className="flex items-center gap-4 text-sm"
              style={{ color: theme.light }}
            >
              <span className="flex items-center gap-1">
                <FiUsers size={12} />
                {grade.studentCount} Students • {grade.class}
              </span>
              <span className="flex items-center gap-1">
                <FiCalendar size={12} />
                Academic Year: {grade.academicYear}
              </span>
              <span className="flex items-center gap-1">
                <FiClock size={12} />
                Age {grade.ageStart} - {grade.ageEnd} years
              </span>
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
              <FiPrinter size={14} />
              Print
            </button>
            <button
              className="px-4 py-2 text-sm border rounded-lg flex items-center gap-2"
              style={{
                backgroundColor: theme.primary,
                color: theme.white,
                borderColor: theme.primary,
              }}
            >
              <FiShare2 size={14} />
              Share
            </button>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div
            className="p-3 border rounded-lg text-center"
            style={{ backgroundColor: theme.white, borderColor: theme.border }}
          >
            <div className="text-lg font-bold" style={{ color: theme.primary }}>
              {students.length}
            </div>
            <div className="text-xs" style={{ color: theme.light }}>
              Total Students
            </div>
          </div>
          <div
            className="p-3 border rounded-lg text-center"
            style={{ backgroundColor: theme.white, borderColor: theme.border }}
          >
            <div className="text-lg font-bold" style={{ color: theme.primary }}>
              {teachers.length}
            </div>
            <div className="text-xs" style={{ color: theme.light }}>
              Teachers
            </div>
          </div>
          <div
            className="p-3 border rounded-lg text-center"
            style={{ backgroundColor: theme.white, borderColor: theme.border }}
          >
            <div className="text-lg font-bold" style={{ color: theme.primary }}>
              {subjects.length}
            </div>
            <div className="text-xs" style={{ color: theme.light }}>
              Subjects
            </div>
          </div>
          <div
            className="p-3 border rounded-lg text-center"
            style={{ backgroundColor: theme.white, borderColor: theme.border }}
          >
            <div className="text-lg font-bold" style={{ color: theme.primary }}>
              {guideTeachers.length}
            </div>
            <div className="text-xs" style={{ color: theme.light }}>
              Guide Teachers
            </div>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
            px-4 py-2.5 text-sm font-medium rounded-lg
            flex items-center gap-2
            transition-all duration-200
            ${isActive ? "shadow-sm" : "hover:bg-gray-50"}
          `}
                style={{
                  color: isActive ? theme.primary : theme.dark,
                  backgroundColor: isActive
                    ? theme.primaryBg
                    : theme.background,
                  border: `1px solid ${
                    isActive ? theme.primary + "30" : theme.border
                  }`,
                  flexShrink: 0,
                }}
              >
                <Icon
                  size={16}
                  style={{
                    color: isActive ? theme.primary : theme.light,
                  }}
                />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <ActiveComponent />
      </div>
    </div>
  );
}
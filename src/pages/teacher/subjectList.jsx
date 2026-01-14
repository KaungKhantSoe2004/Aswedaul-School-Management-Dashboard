"use client";

import axios from "axios";
import { useEffect, useState } from "react";

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
  FiCheckCircle,
  FiAlertCircle,
  FiBookOpen,
} from "react-icons/fi";
import { useSelector } from "react-redux";
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
  const profile = useSelector(store=> store.profile.profile);
  const [subjects, setSubjects] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [nearestExam, setNearestExam] = useState(null);
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const backend_domain_name = import.meta.env.VITE_BACKEND_DOMAIN_NAME;
  const admin_backend_domain_name = import.meta.env.VITE_ADMIN_BACKEND_DOMAIN_NAME;

  // Parse schedule from string to array
  const parseSchedule = (scheduleString) => {
    try {
      if (!scheduleString) return [];
      const parsed = JSON.parse(scheduleString);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error parsing schedule:", error);
      return [];
    }
  };

  // Parse study materials
  const parseStudyMaterials = (materialsString) => {
    try {
      if (!materialsString) return [];
      const parsed = JSON.parse(materialsString);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error parsing study materials:", error);
      return [];
    }
  };

  // Class rooms from A to F for Grade 2
  const classRooms = ['A', 'B', 'C', 'D', 'E', 'F'];
  
  // Get schedule summary for display
  const getScheduleSummary = (scheduleArray) => {
    if (!scheduleArray || scheduleArray.length === 0) return "No schedule";
    
    const uniqueSchedules = [...new Set(scheduleArray)];
    
    if (uniqueSchedules.length === 1) {
      return `All classes: ${uniqueSchedules[0]}`;
    }
    
    return `${scheduleArray.length} classes, various times`;
  };

  // Get color for subject
  const getSubjectColor = (subjectName) => {
    const colors = [
      "#3FA7A3", // Primary
      "#2ECC71", // Accent
      "#F39C12", // Warning
      "#E74C3C", // Danger
      "#9B59B6", // Purple
      "#1ABC9C", // Teal
      "#3498DB", // Blue
      "#E67E22", // Orange
    ];
    
    const index = subjectName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  // Filter subjects
  const filteredSubjects = subjects.filter((subject) => {
    const subjectName = subject.subject_name || subject.name || "";
    return subjectName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Navigate to subject details
  const navigateToSubject = (subjectId) => {
    navigate(`/teacher/subjectDetails/${subjectId}`);
  };

  const fetchData = async()=> {
    try {
      // Fetch students count
      const studentsCountResponse = await axios.get(
        `${backend_domain_name}api/user/getStudentsCountByTeacher/${profile.grade}`,
        { withCredentials: true }
      );
      
      if (studentsCountResponse.status === 200) {
        setStudentsCount(studentsCountResponse.data.data);
      }

      // Fetch subjects and exam data
      const response = await axios.get(
        `${admin_backend_domain_name}api/teacher/getSubjects/${profile.id}/${profile.grade}`, 
        { withCredentials: true }
      );
      
      if(response.status === 200){
        const subjectsData = response.data.data.subjects || [];
        const examData = response.data.data.upcomingExam[0] || null;
        console.log(examData, 'is examdata')  
      
        const transformedSubjects = subjectsData.map(subject => {
          const schedule = parseSchedule(subject.schedule);
          const studyMaterials = parseStudyMaterials(subject.study_material_web);
          const color = getSubjectColor(subject.subject_name);
          
          return {
            id: subject.id,
            name: subject.subject_name,
            code: subject.code || `SUB-${subject.id}`,
            class: `Grade ${subject.grade_id}`,
            section: "A-F", 
            students: 0,
            schedule: getScheduleSummary(schedule),
            scheduleArray: schedule,
            studyMaterials: studyMaterials,
            studyMaterialFile: subject.study_material_file,
            studyMaterialVideo: subject.study_material_video,
            materialsCount: studyMaterials.length,
            color: color,
            academicYear: subject.academic_year,
            teacherId: subject.teacher_id,
            lastUpdated: subject.updated_at || subject.created_at,
            notices: 0, // Will be updated if you have this data
            exams: 1, // Default 1 exam
            performance: 85, // Default performance, update with real data if available
          };
        });
        
        setSubjects(transformedSubjects);
        setNearestExam(examData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate days until exam
  const getDaysUntilExam = (examDate) => {
    if (!examDate) return 0;
    const today = new Date();
    const exam = new Date(examDate);
    const diffTime = exam - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Get exam status color
  const getExamStatusColor = (status) => {
    switch(status) {
      case 'scheduled': return theme.accent;
      case 'ongoing': return theme.warning;
      case 'completed': return theme.primary;
      case 'cancelled': return theme.danger;
      default: return theme.light;
    }
  };

  useEffect(()=> {
    fetchData();
  }, [])

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
              {profile.name}
            </span>
            <span
              className="px-2 py-1 rounded text-xs"
              style={{ backgroundColor: theme.primaryBg, color: theme.primary }}
            >
              Grade {profile.grade}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                {subjects.length}
              </p>
              <p className="text-xs mt-1" style={{ color: theme.lighter }}>
                Grade {profile.grade}
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
                {studentsCount}
              </p>
              <p className="text-xs mt-1" style={{ color: theme.lighter }}>
                Across all classes
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

        {/* Upcoming Exam */}
        <div
          className="p-4 border rounded-lg"
          style={{ backgroundColor: theme.white, borderColor: theme.border }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: theme.light }}>
                Upcoming Exam
              </p>
              {nearestExam ? (
                <>
                  <p
                    className="text-lg font-bold mt-1 truncate"
                    style={{ color: theme.dark }}
                  >
                    {nearestExam.exam_name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: getExamStatusColor(nearestExam.status) + "15",
                        color: getExamStatusColor(nearestExam.status),
                      }}
                    >
                      {nearestExam.status}
                    </span>
                    <span className="text-xs" style={{ color: theme.lighter }}>
                      {getDaysUntilExam(nearestExam.exam_start_date)} days
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-lg font-bold mt-1" style={{ color: theme.lighter }}>
                  No upcoming exams
                </p>
              )}
            </div>
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: theme.warning + "15" }}
            >
              <FiCalendar size={24} style={{ color: theme.warning }} />
            </div>
          </div>
        </div>
      </div>

      {/* Exam Details Card (if exists) */}
      {nearestExam && (
        <div
          className="mb-6 p-4 border rounded-lg"
          style={{ 
            backgroundColor: theme.primaryBg, 
            borderColor: theme.primaryLight,
            borderLeft: `4px solid ${getExamStatusColor(nearestExam.status)}`
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <FiAlertCircle size={20} style={{ color: getExamStatusColor(nearestExam.status) }} />
              <h3 className="font-semibold" style={{ color: theme.dark }}>
                {nearestExam.exam_name}
              </h3>
            </div>
            <span
              className="text-sm px-3 py-1 rounded"
              style={{
                backgroundColor: getExamStatusColor(nearestExam.status) + "20",
                color: getExamStatusColor(nearestExam.status),
              }}
            >
              {nearestExam.exam_type}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs" style={{ color: theme.light }}>Start Date</p>
              <div className="flex items-center gap-2 mt-1">
                <FiCalendar size={14} style={{ color: theme.primary }} />
                <p className="font-medium" style={{ color: theme.dark }}>
                  {formatDate(nearestExam.exam_start_date)}
                </p>
                <span className="text-xs" style={{ color: theme.light }}>
                  {formatTime(nearestExam.exam_start_date)}
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-xs" style={{ color: theme.light }}>End Date</p>
              <div className="flex items-center gap-2 mt-1">
                <FiCalendar size={14} style={{ color: theme.primary }} />
                <p className="font-medium" style={{ color: theme.dark }}>
                  {formatDate(nearestExam.exam_end_date)}
                </p>
                <span className="text-xs" style={{ color: theme.light }}>
                  {formatTime(nearestExam.exam_end_date)}
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-xs" style={{ color: theme.light }}>Time Remaining</p>
              <div className="flex items-center gap-2 mt-1">
                <FiClock size={14} style={{ color: theme.warning }} />
                <p className="font-medium" style={{ color: theme.dark }}>
                  {getDaysUntilExam(nearestExam.exam_start_date)} days
                </p>
                <span className="text-xs" style={{ color: theme.light }}>
                  until start
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t" style={{ borderColor: theme.primaryLight }}>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: theme.light }}>
                Grade: <span className="font-medium" style={{ color: theme.dark }}>{nearestExam.grade}</span>
              </span>
              <button
                className="text-sm px-3 py-1 rounded hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: theme.primary,
                  color: theme.white,
                }}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div
        className="mb-6 p-4 border rounded-lg"
        style={{ backgroundColor: theme.white, borderColor: theme.border }}
      >
        <div className="max-w-md">
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
              placeholder="Search by subject name..."
              className="w-full pl-10 pr-4 py-2 border rounded text-sm"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.dark,
              }}
            />
          </div>
        </div>
      </div>

      {/* Subjects List */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg" style={{ color: theme.dark }}>
            Assigned Subjects ({filteredSubjects.length})
          </h2>
          <div className="text-sm" style={{ color: theme.light }}>
            Grade {profile.grade}, Classes A-F
          </div>
        </div>

        {filteredSubjects.length === 0 ? (
          <div
            className="p-12 border rounded-lg text-center"
            style={{ backgroundColor: theme.white, borderColor: theme.border }}
          >
            <div className="text-6xl mb-4" style={{ color: theme.lighter }}>
              📚
            </div>
            <p className="text-lg mb-2" style={{ color: theme.dark }}>
              No subjects found
            </p>
            <p style={{ color: theme.light }}>
              {searchTerm ? "Try adjusting your search" : "No subjects assigned yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject) => {
              const materialsCount = subject.studyMaterials?.length || 0;
              return (
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
                              ID: {subject.id}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className="text-xs px-2 py-1 rounded"
                          style={{
                            backgroundColor: theme.primaryBg,
                            color: theme.primary,
                          }}
                        >
                          {subject.academicYear}
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
                        Classes A-F
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
                          {subject.students || 0}
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
                          {materialsCount}
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
                          {subject.exams || 1}
                        </div>
                        <div className="text-xs" style={{ color: theme.light }}>
                          Exams
                        </div>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div
                      className="flex items-start gap-2 text-sm mb-4"
                      style={{ color: theme.light }}
                    >
                      <FiCalendar size={14} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <div>{subject.schedule}</div>
                        {subject.scheduleArray?.length > 0 && (
                          <div className="text-xs mt-1" style={{ color: theme.lighter }}>
                            {subject.scheduleArray.length} class periods
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Study Materials Preview */}
                    {materialsCount > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FiBookOpen size={14} style={{ color: theme.accent }} />
                          <span className="text-xs font-medium" style={{ color: theme.dark }}>
                            Study Materials ({materialsCount})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {subject.studyMaterials.slice(0, 2).map((material, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 rounded truncate max-w-[120px]"
                              style={{
                                backgroundColor: theme.accent + "10",
                                color: theme.accent,
                                border: `1px solid ${theme.accent}20`,
                              }}
                              title={material.title}
                            >
                              {material.title}
                            </span>
                          ))}
                          {materialsCount > 2 && (
                            <span className="text-xs px-2 py-1" style={{ color: theme.light }}>
                              +{materialsCount - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Last Updated */}
                    <div className="text-xs flex items-center gap-2" style={{ color: theme.lighter }}>
                      <FiClock size={12} />
                      Updated: {formatDate(subject.lastUpdated)}
                    </div>
                  </div>

                  {/* Footer with Action Button */}
                  <div
                    className="px-6 py-4 border-t flex justify-between items-center group-hover:bg-gray-50 transition-colors"
                    style={{ borderColor: theme.border }}
                  >
                    <div className="text-sm flex items-center gap-2" style={{ color: theme.light }}>
                      <FiCheckCircle size={14} />
                      Active
                    </div>
                    <div
                      className="flex items-center gap-1 text-sm font-medium"
                      style={{ color: subject.color }}
                    >
                      <span>View Details</span>
                      <FiChevronRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import {
  FiBook,
  FiDollarSign,
  FiUser,
  FiCalendar,
  FiUsers,
  FiBell,
  FiBookOpen,
  FiMapPin,
  FiMail,
  FiPhone,
  FiHome,
  FiClock,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";

export default function TeacherDashboard() {
  const admin_backend_domain_name = import.meta.env.VITE_ADMIN_BACKEND_DOMAIN_NAME;
  const backend_domain_name = import.meta.env.VITE_BACKEND_DOMAIN_NAME;
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
  
  const profile = useSelector(store => store.profile.profile);
  const { userType, userData } = useOutletContext();
  const [subjects, setSubjects] = useState([]);
  const [notices, setNotices] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  
  // Class rooms from A to G for Grade 2
  const classRooms = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  
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

  // Group schedule by class room
  const getScheduleByClassRoom = (scheduleArray) => {
    const scheduleByClass = {};
    
    classRooms.forEach((room, index) => {
      if (scheduleArray[index]) {
        scheduleByClass[room] = scheduleArray[index];
      }
    });
    
    return scheduleByClass;
  };

  // Format schedule display for a subject
  const formatSubjectSchedule = (scheduleArray) => {
    if (!scheduleArray || scheduleArray.length === 0) return "No schedule";
    
    const scheduleByClass = getScheduleByClassRoom(scheduleArray);
    const classesWithSchedule = Object.keys(scheduleByClass);
    
    if (classesWithSchedule.length === 0) return "No schedule";
    
    if (classesWithSchedule.length === 1) {
      const room = classesWithSchedule[0];
      return `Class ${room}: ${scheduleByClass[room]}`;
    }
    
    return `${classesWithSchedule.length} classes (${classesWithSchedule.join(', ')})`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return theme.danger;
      case "medium": return theme.warning;
      case "low": return theme.accent;
      default: return theme.primary;
    }
  };

  const fetchData = async () => {
    try {
      // Fetch students count
      const studentsCountResponse = await axios.get(
        `${backend_domain_name}api/user/getStudentsCountByTeacher/${profile.grade}`,
        { withCredentials: true }
      );
      
      if (studentsCountResponse.status === 200) {
        setStudentsCount(studentsCountResponse.data.data);
      }

      // Fetch dashboard data
      const response = await axios.get(
        `${admin_backend_domain_name}api/teacher/getDashboard/${profile.id}/${profile.grade}`,
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        // Transform subjects data
        const transformedSubjects = (response.data.data.subjects || []).map(subject => ({
          id: subject.id,
          name: subject.subject_name,
          code: `SUB-${subject.id}`,
          grade: subject.grade_id,
          classRooms: classRooms.slice(0, 6), // A-F classes for Grade 2
          students: 0, // You might want to fetch actual student count per subject
          schedule: parseSchedule(subject.schedule),
          scheduleByClass: getScheduleByClassRoom(parseSchedule(subject.schedule)),
          studyMaterials: parseStudyMaterials(subject.study_material_web),
          academicYear: subject.academic_year,
          teacherId: subject.teacher_id
        }));
        
        // Transform notices data
        const transformedNotices = (response.data.data.notices || []).map(notice => ({
          id: notice.id,
          title: notice.message.substring(0, 30) + (notice.message.length > 30 ? "..." : ""),
          content: notice.message,
          date: new Date(notice.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          }),
          time: new Date(notice.created_at).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          priority: notice.user_role === "manager" ? "high" : "medium",
          author: notice.user_role,
          grade: notice.grade
        }));
        
        setNotices(transformedNotices);
        setSubjects(transformedSubjects);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: theme.background }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: theme.dark }}>
          Teacher Dashboard
        </h1>
        <p className="text-sm" style={{ color: theme.light }}>
          Welcome back, {profile.name}! Here's your overview.
        </p>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-2 text-sm" style={{ color: theme.primary }}>
            <FiHome />
            <span>Grade: {profile.grade}</span>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: theme.accent }}>
            <FiBook />
            <span>Subjects: {subjects.length}</span>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: theme.warning }}>
            <FiUsers />
            <span>Classes: A-G</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Subjects Count */}
        <div
          className="p-4 border rounded-lg"
          style={{ backgroundColor: theme.white, borderColor: theme.border }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: theme.light }}>
                Subjects
              </p>
              <p
                className="text-2xl font-bold mt-1"
                style={{ color: theme.dark }}
              >
                {subjects.length}
              </p>
              <p className="text-xs mt-1" style={{ color: theme.lighter }}>
                Across all classes
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

        {/* Students Count */}
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
                Grade {profile.grade} (7 Classes)
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

        {/* Monthly Salary */}
        <div
          className="p-4 border rounded-lg"
          style={{ backgroundColor: theme.white, borderColor: theme.border }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: theme.light }}>
                Monthly Salary
              </p>
              <p
                className="text-2xl font-bold mt-1"
                style={{ color: theme.dark }}
              >
                {parseFloat(profile.salary).toLocaleString()} Ks
              </p>
              <p className="text-xs mt-1" style={{ color: theme.accent }}>
                Per Month
              </p>
            </div>
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: theme.primaryBg }}
            >
              <FiDollarSign size={24} style={{ color: theme.primary }} />
            </div>
          </div>
        </div>

        {/* Teaching Hours */}
        <div
          className="p-4 border rounded-lg"
          style={{ backgroundColor: theme.white, borderColor: theme.border }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: theme.light }}>
                Weekly Schedule
              </p>
              <p
                className="text-2xl font-bold mt-1"
                style={{ color: theme.dark }}
              >
                7 Classes
              </p>
              <p className="text-xs mt-1" style={{ color: theme.lighter }}>
                A to G
              </p>
            </div>
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: theme.warning + "15" }}
            >
              <FiClock size={24} style={{ color: theme.warning }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Subjects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div
            className="p-6 border rounded-lg"
            style={{ backgroundColor: theme.white, borderColor: theme.border }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className="font-semibold flex items-center gap-2"
                style={{ color: theme.dark }}
              >
                <FiUser style={{ color: theme.primary }} />
                Teacher Profile
              </h2>
              <div className="flex flex-col items-end">
                <span
                  className="text-sm px-3 py-1 rounded mb-2"
                  style={{
                    backgroundColor: theme.primaryBg,
                    color: theme.primary,
                  }}
                >
                  ID: {profile.id}
                </span>
                <span
                  className="text-xs"
                  style={{ color: theme.light }}
                >
                  Grade {profile.grade} Teacher
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm mb-1" style={{ color: theme.light }}>
                    Full Name
                  </p>
                  <p className="font-medium" style={{ color: theme.dark }}>
                    {profile.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: theme.light }}>
                    Email
                  </p>
                  <div className="flex items-center gap-2">
                    <FiMail size={14} style={{ color: theme.light }} />
                    <p className="font-medium truncate" style={{ color: theme.dark }}>
                      {profile.email}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: theme.light }}>
                    Phone
                  </p>
                  <div className="flex items-center gap-2">
                    <FiPhone size={14} style={{ color: theme.light }} />
                    <p className="font-medium" style={{ color: theme.dark }}>
                      {profile.phone}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm mb-1" style={{ color: theme.light }}>
                    Location
                  </p>
                  <div className="flex items-center gap-2">
                    <FiMapPin size={14} style={{ color: theme.light }} />
                    <p className="font-medium" style={{ color: theme.dark }}>
                      {profile.city || "Not specified"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: theme.light }}>
                    Gender & Age
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="font-medium" style={{ color: theme.dark }}>
                      {profile.gender || "Not specified"}
                    </span>
                    <span className="font-medium" style={{ color: theme.dark }}>
                      {profile.age ? `${profile.age} years` : "Not specified"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: theme.light }}>
                    Assigned Classes
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {classRooms.slice(0, 6).map(room => (
                      <span
                        key={room}
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: theme.primaryLight + "20",
                          color: theme.primaryDark,
                          border: `1px solid ${theme.primaryLight}`,
                        }}
                      >
                        Class {room}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Subjects with Schedule */}
          <div
            className="p-6 border rounded-lg"
            style={{ backgroundColor: theme.white, borderColor: theme.border }}
          >
            <h2
              className="font-semibold mb-6 flex items-center gap-2"
              style={{ color: theme.dark }}
            >
              <FiBookOpen style={{ color: theme.primary }} />
              Assigned Subjects - Grade {profile.grade}
            </h2>

            <div className="space-y-6">
              {subjects.length > 0 ? (
                subjects.map((subject) => {
                  const studyMaterials = subject.studyMaterials || [];
                  const hasSchedule = subject.schedule && subject.schedule.length > 0;
                  const scheduleByClass = subject.scheduleByClass || {};
                  
                  return (
                    <div
                      key={subject.id}
                      className="p-5 border rounded-lg hover:shadow-sm transition-shadow"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        borderLeft: `4px solid ${theme.primary}`,
                      }}
                    >
                      {/* Subject Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3
                              className="font-semibold text-lg"
                              style={{ color: theme.dark }}
                            >
                              {subject.name}
                            </h3>
                            <span
                              className="text-xs px-2 py-1 rounded"
                              style={{
                                backgroundColor: theme.primaryBg,
                                color: theme.primary,
                              }}
                            >
                              Subject ID: {subject.id}
                            </span>
                            <span
                              className="text-xs px-2 py-1 rounded"
                              style={{
                                backgroundColor: theme.accent + "15",
                                color: theme.accent,
                              }}
                            >
                              Grade {subject.grade}
                            </span>
                          </div>
                          
                          {/* Quick Schedule Overview */}
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <FiClock size={14} style={{ color: theme.primary }} />
                              <span className="text-sm font-medium" style={{ color: theme.dark }}>
                                Schedule Overview:
                              </span>
                            </div>
                            <p className="text-sm" style={{ color: theme.light }}>
                              {formatSubjectSchedule(subject.schedule)}
                            </p>
                          </div>
                        </div>
                        <button
                          className="ml-4 px-4 py-2 text-sm rounded hover:opacity-90 transition-opacity"
                          style={{
                            backgroundColor: theme.primary,
                            color: theme.white,
                          }}
                        >
                          Manage Class
                        </button>
                      </div>
                      
                      {/* Detailed Class-wise Schedule */}
                      {hasSchedule && (
                        <div className="mb-5">
                          <h4 className="text-sm font-medium mb-3" style={{ color: theme.dark }}>
                            Class-wise Schedule:
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {classRooms.slice(0, 6).map(room => {
                              const classSchedule = scheduleByClass[room];
                              return (
                                <div
                                  key={room}
                                  className="p-3 border rounded text-center"
                                  style={{
                                    backgroundColor: classSchedule ? theme.primaryBg : theme.background,
                                    borderColor: theme.border,
                                  }}
                                >
                                  <div className="font-medium mb-1" style={{ color: theme.dark }}>
                                    Class {room}
                                  </div>
                                  {classSchedule ? (
                                    <div className="text-xs" style={{ color: theme.primaryDark }}>
                                      {classSchedule}
                                    </div>
                                  ) : (
                                    <div className="text-xs" style={{ color: theme.light }}>
                                      No schedule
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Study Materials */}
                      {studyMaterials.length > 0 && (
                        <div className="pt-4 border-t" style={{ borderColor: theme.border }}>
                          <h4 className="text-sm font-medium mb-2" style={{ color: theme.dark }}>
                            Study Materials ({studyMaterials.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {studyMaterials.slice(0, 3).map((material, index) => (
                              <a
                                key={index}
                                href={material.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs px-3 py-1 rounded flex items-center gap-1 hover:opacity-80 transition-opacity"
                                style={{
                                  backgroundColor: theme.accent + "15",
                                  color: theme.accent,
                                }}
                              >
                                <FiBook size={12} />
                                {material.title}
                              </a>
                            ))}
                            {studyMaterials.length > 3 && (
                              <span className="text-xs px-2 py-1" style={{ color: theme.light }}>
                                +{studyMaterials.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Academic Year */}
                      <div className="mt-4 pt-3 border-t" style={{ borderColor: theme.border }}>
                        <span className="text-xs" style={{ color: theme.light }}>
                          Academic Year: {subject.academicYear || "2024-2025"}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10" style={{ color: theme.light }}>
                  <FiBookOpen size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="mb-2">No subjects assigned yet</p>
                  <p className="text-sm">You will be assigned subjects soon</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Notices */}
        <div className="space-y-6">
          {/* Notice Board */}
          <div
            className="p-6 border rounded-lg"
            style={{ backgroundColor: theme.white, borderColor: theme.border }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className="font-semibold flex items-center gap-2"
                style={{ color: theme.dark }}
              >
                <FiBell style={{ color: theme.primary }} />
                Notice Board
              </h2>
              <span
                className="text-xs px-3 py-1 rounded"
                style={{
                  backgroundColor: theme.primaryBg,
                  color: theme.primary,
                }}
              >
                Grade {profile.grade}
              </span>
            </div>

            <div className="space-y-4">
              {notices.length > 0 ? (
                notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="p-4 border rounded-lg transition-all duration-200 hover:shadow-sm"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      borderLeft: `4px solid ${getPriorityColor(notice.priority)}`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: getPriorityColor(notice.priority) }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4
                            className="font-medium text-sm flex-1"
                            style={{ color: theme.dark }}
                          >
                            {notice.title}
                          </h4>
                          <div className="flex flex-col items-end ml-2">
                            <span
                              className="text-xs"
                              style={{ color: theme.light }}
                            >
                              {notice.date}
                            </span>
                            <span
                              className="text-xs"
                              style={{ color: theme.lighter }}
                            >
                              {notice.time}
                            </span>
                          </div>
                        </div>
                        <p
                          className="text-sm mt-2 mb-3 leading-relaxed"
                          style={{ color: theme.dark }}
                        >
                          {notice.content}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block px-2 py-1 text-xs rounded"
                              style={{
                                backgroundColor: getPriorityColor(notice.priority) + "20",
                                color: getPriorityColor(notice.priority),
                              }}
                            >
                              {notice.priority} priority
                            </span>
                            {notice.grade && (
                              <span
                                className="text-xs px-2 py-1 rounded"
                                style={{
                                  backgroundColor: theme.light + "15",
                                  color: theme.light,
                                }}
                              >
                                Grade {notice.grade}
                              </span>
                            )}
                          </div>
                          <span
                            className="text-xs"
                            style={{ color: theme.lighter }}
                          >
                            By: {notice.author}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8" style={{ color: theme.light }}>
                  <FiBell size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No notices available</p>
                  <p className="text-sm mt-1">Check back later for updates</p>
                </div>
              )}
            </div>
          </div>

          {/* Schedule Summary */}
          <div
            className="p-6 border rounded-lg"
            style={{ backgroundColor: theme.white, borderColor: theme.border }}
          >
            <h2
              className="font-semibold mb-4 flex items-center gap-2"
              style={{ color: theme.dark }}
            >
              <FiCalendar style={{ color: theme.primary }} />
              Schedule Summary
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span style={{ color: theme.light }}>Total Classes</span>
                <span className="font-medium" style={{ color: theme.dark }}>
                  7 Classes
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span style={{ color: theme.light }}>Grade Level</span>
                <span className="font-medium" style={{ color: theme.primaryDark }}>
                  Grade {profile.grade}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span style={{ color: theme.light }}>Class Rooms</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {classRooms.slice(0, 6).map(room => (
                    <span
                      key={room}
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: theme.primaryLight + "20",
                        color: theme.primaryDark,
                      }}
                    >
                      {room}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="pt-3 mt-3 border-t" style={{ borderColor: theme.border }}>
                <p className="text-sm mb-2" style={{ color: theme.light }}>
                  Current Schedule:
                </p>
                {subjects.length > 0 && subjects[0].schedule && subjects[0].schedule.length > 0 ? (
                  <div className="text-sm" style={{ color: theme.dark }}>
                    {formatSubjectSchedule(subjects[0].schedule)}
                  </div>
                ) : (
                  <div className="text-sm" style={{ color: theme.light }}>
                    Schedule not set
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
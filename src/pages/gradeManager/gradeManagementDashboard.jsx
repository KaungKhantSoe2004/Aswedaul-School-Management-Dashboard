"use client";

import axios from "axios";
import { useState, useMemo, useEffect } from "react";
import {
  FiAlertCircle,
  FiBarChart2,
  FiUsers,
  FiFileText,
  FiAlertTriangle,
  FiAward,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSave,
  FiCheck,
  FiX,
  FiClock,
} from "react-icons/fi";
import { useSelector } from "react-redux";

export default function GradeManagerDashboard() {
  const gradeTheme = {
    primary: "#3FA7A3",
    secondary: "#6C63FF",
    accent: "#2ECC71",
    warning: "#F39C12",
    danger: "#E74C3C",
    dark: "#1E293B",
    light: "#64748B",
    background: "#F8FAFC",
    white: "#FFFFFF",
  };


  const profile = useSelector(store => store.profile.profile);
  
  // Leave requests state
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loadingLeaveRequests, setLoadingLeaveRequests] = useState(true);
  const [issues, setIssues] = useState([]);
  const [admissionCount, setAdmissionCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const fetchData = async () => {
    try {
      
      setLoadingLeaveRequests(true);
      const admin_backend_domain_name = import.meta.env.VITE_ADMIN_BACKEND_DOMAIN_NAME;
      console.log('before fetching');
      const response = await axios.get(
        `${admin_backend_domain_name}api/gradeManager/dashboard/${profile?.grade}`,
        { withCredentials: true }
      );
      console.log(response,'is respomse')
      if (response.status === 200) {
        setNotices(response.data.notice || []);
        setLeaveRequests(response.data.dashboard.leaveRequests || []);
        setIssues(response.data.dashboard.issuesStudents || []);
        setStudentsCount(response.data.dashboard.studentCount || 0);
        setAdmissionCount(response.data.dashboard.admissionCount || 0);
      }
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      setLeaveRequests([]);
    } finally {
      setLoadingLeaveRequests(false);
    }
  };


  useEffect(() => {
    fetchData();
    console.log('fetched');
  }, []);
  

  
  // Notice board data
  const backend_domain_name = import.meta.env.VITE_BACKEND_DOMAIN_NAME;
  const [notices, setNotices] = useState([]);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [newNoticeText, setNewNoticeText] = useState("");
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [editingNoticeText, setEditingNoticeText] = useState("");

  // Notice CRUD functions
  const addNotice = async () => {
    console.log(profile, 'is user');
    const admin_backend_domain_name = import.meta.env.VITE_ADMIN_BACKEND_DOMAIN_NAME;
    const user_id = profile.id;
    const user_role = profile.role;
    const user_grade = profile.grade;
    const response = await axios.post(`${admin_backend_domain_name}api/admin/createNotice`, {
      user_id,
      user_role,
      message: newNoticeText,
      authorization: 'students',
      grade: String(user_grade)
    }, {
      withCredentials: true
    });
    if(response.status == 201){
      window.location.reload();
    }
  
   
  };

  const startEditNotice = (notice) => {
    if (notice.createdBy === gradeManagerId) {
      setEditingNoticeId(notice.id);
      setEditingNoticeText(notice.message);
    }
  };

  const saveEditNotice = () => {
    setNotices(
      notices.map((notice) =>
        notice.id === editingNoticeId
          ? { ...notice, text: editingNoticeText }
          : notice
      )
    );
    setEditingNoticeId(null);
    setEditingNoticeText("");
  };

  const deleteNotice = (id) => {
    const notice = notices.find((n) => n.id === id);
    if (notice && notice.createdBy === gradeManagerId) {
      setNotices(notices.filter((notice) => notice.id !== id));
    }
  };

  // Leave request functions
  const updateLeaveStatus = async (leaveId, status, note = "") => {
    try {
      const backend_domain_name = import.meta.env.VITE_BACKEND_DOMAIN_NAME;
      if(status == "approved"){

      
      // API call to update leave status
      const response = await axios.get(
        `${backend_domain_name}api/admissions/acceptRequest/${leaveId}`,
        { withCredentials: true }
      );
      // console.log(response, 'is response')
      // return
      if (response.status === 200) {
          window.location.reload();
      }
      }else{
          
      // API call to update leave status
      const response = await axios.get(
        `${backend_domain_name}api/admissions/rejectRequest/${leaveId}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
          window.location.reload();
      }
      }
      
} catch (error) {
      console.error("Error updating leave status:", error);
      
      // For demo purposes, update local state anyway
      setLeaveRequests(prev =>
        prev.map(request =>
          request.id === leaveId
            ? { ...request, status: status, note: note }
            : request
        )
      );
    }
  };

  const approveLeave = (leaveId) => {

    updateLeaveStatus(leaveId, "approved", "Leave approved by grade manager");
  };

  const rejectLeave = (leaveId) => {
    updateLeaveStatus(leaveId, "rejected", "Leave rejected by grade manager");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return gradeTheme.accent;
      case "rejected":
        return gradeTheme.danger;
      case "pending":
        return gradeTheme.warning;
      default:
        return gradeTheme.light;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <FiCheck className="inline mr-1" />;
      case "rejected":
        return <FiX className="inline mr-1" />;
      case "pending":
        return <FiClock className="inline mr-1" />;
      default:
        return null;
    }
  };

 
  const performanceBySubject = useMemo(
    () => [
      { subject: "Mathematics", average: 82 },
      { subject: "English", average: 78 },
      { subject: "Science", average: 85 },
      { subject: "Computer", average: 88 },
      { subject: "Myanmar", average: 75 },
    ],
    []
  );

  const classPerformance = useMemo(
    () => [
      { class: "A", average: 84 },
      { class: "B", average: 79 },
      { class: "C", average: 81 },
      { class: "D", average: 76 },
      { class: "E", average: 73 },
      { class: "F", average: 80 },
    ],
    []
  );

  // Top students data
  const topStudentsData = useMemo(
    () => ({
      A: {
        boys: [
          {
            rank: 1,
            name: "Kyaw Gyi",
            marks: 92,
            subject: "Math",
            subjectMark: 96,
          },
          {
            rank: 2,
            name: "Min Thu",
            marks: 90,
            subject: "English",
            subjectMark: 88,
          },
          {
            rank: 3,
            name: "Aung Soe",
            marks: 89,
            subject: "Science",
            subjectMark: 91,
          },
          {
            rank: 4,
            name: "Maung Lin",
            marks: 87,
            subject: "Computer",
            subjectMark: 89,
          },
          {
            rank: 5,
            name: "Thein Hlaing",
            marks: 86,
            subject: "Myanmar",
            subjectMark: 85,
          },
        ],
        girls: [
          {
            rank: 1,
            name: "Su Su",
            marks: 95,
            subject: "Science",
            subjectMark: 98,
          },
          {
            rank: 2,
            name: "Hnin Ei",
            marks: 93,
            subject: "English",
            subjectMark: 92,
          },
          {
            rank: 3,
            name: "Thazin",
            marks: 91,
            subject: "Math",
            subjectMark: 90,
          },
          {
            rank: 4,
            name: "Zar Zar",
            marks: 89,
            subject: "Computer",
            subjectMark: 88,
          },
          {
            rank: 5,
            name: "May Thazin",
            marks: 88,
            subject: "Myanmar",
            subjectMark: 87,
          },
        ],
      },
      B: {
        boys: [
          {
            rank: 1,
            name: "Zaw Lin",
            marks: 88,
            subject: "Math",
            subjectMark: 92,
          },
          {
            rank: 2,
            name: "Soe Soe",
            marks: 86,
            subject: "Science",
            subjectMark: 89,
          },
          {
            rank: 3,
            name: "Tun Tun",
            marks: 84,
            subject: "English",
            subjectMark: 83,
          },
          {
            rank: 4,
            name: "Hein Min",
            marks: 82,
            subject: "Computer",
            subjectMark: 85,
          },
          {
            rank: 5,
            name: "Pyae Soe",
            marks: 81,
            subject: "Myanmar",
            subjectMark: 82,
          },
        ],
        girls: [
          {
            rank: 1,
            name: "Khin Mar",
            marks: 91,
            subject: "English",
            subjectMark: 94,
          },
          {
            rank: 2,
            name: "Nu Nu",
            marks: 89,
            subject: "Math",
            subjectMark: 87,
          },
          {
            rank: 3,
            name: "May May",
            marks: 87,
            subject: "Science",
            subjectMark: 90,
          },
          {
            rank: 4,
            name: "Thanda",
            marks: 85,
            subject: "Computer",
            subjectMark: 86,
          },
          {
            rank: 5,
            name: "Yuki Hlaing",
            marks: 84,
            subject: "Myanmar",
            subjectMark: 83,
          },
        ],
      },
      C: {
        boys: [
          {
            rank: 1,
            name: "Win Kyaw",
            marks: 85,
            subject: "Science",
            subjectMark: 88,
          },
          {
            rank: 2,
            name: "Myat Thu",
            marks: 83,
            subject: "Math",
            subjectMark: 85,
          },
          {
            rank: 3,
            name: "Kyaw Kyaw",
            marks: 81,
            subject: "English",
            subjectMark: 79,
          },
          {
            rank: 4,
            name: "Lwin Aung",
            marks: 79,
            subject: "Computer",
            subjectMark: 81,
          },
          {
            rank: 5,
            name: "Myo Win",
            marks: 78,
            subject: "Myanmar",
            subjectMark: 80,
          },
        ],
        girls: [
          {
            rank: 1,
            name: "Myint Myint",
            marks: 88,
            subject: "English",
            subjectMark: 91,
          },
          {
            rank: 2,
            name: "Soe Soe",
            marks: 86,
            subject: "Science",
            subjectMark: 89,
          },
          {
            rank: 3,
            name: "Aung Aung",
            marks: 84,
            subject: "Math",
            subjectMark: 86,
          },
          {
            rank: 4,
            name: "Ei Ei",
            marks: 82,
            subject: "Computer",
            subjectMark: 84,
          },
          {
            rank: 5,
            name: "Hla Hla",
            marks: 81,
            subject: "Myanmar",
            subjectMark: 79,
          },
        ],
      },
      D: {
        boys: [
          {
            rank: 1,
            name: "Ko Ko",
            marks: 80,
            subject: "Math",
            subjectMark: 82,
          },
          {
            rank: 2,
            name: "Phyo Kyaw",
            marks: 78,
            subject: "Science",
            subjectMark: 80,
          },
          {
            rank: 3,
            name: "Thaw Zin",
            marks: 76,
            subject: "English",
            subjectMark: 74,
          },
          {
            rank: 4,
            name: "Min Soe",
            marks: 74,
            subject: "Computer",
            subjectMark: 76,
          },
          {
            rank: 5,
            name: "Nay Myo",
            marks: 73,
            subject: "Myanmar",
            subjectMark: 75,
          },
        ],
        girls: [
          {
            rank: 1,
            name: "Htin Htin",
            marks: 83,
            subject: "English",
            subjectMark: 85,
          },
          {
            rank: 2,
            name: "Thin Thin",
            marks: 81,
            subject: "Science",
            subjectMark: 83,
          },
          {
            rank: 3,
            name: "Nway Nway",
            marks: 79,
            subject: "Math",
            subjectMark: 81,
          },
          {
            rank: 4,
            name: "Pyi Pyi",
            marks: 77,
            subject: "Computer",
            subjectMark: 79,
          },
          {
            rank: 5,
            name: "Thida",
            marks: 76,
            subject: "Myanmar",
            subjectMark: 78,
          },
        ],
      },
      E: {
        boys: [
          {
            rank: 1,
            name: "Hein Hein",
            marks: 76,
            subject: "Science",
            subjectMark: 78,
          },
          {
            rank: 2,
            name: "Linn Aung",
            marks: 74,
            subject: "Math",
            subjectMark: 76,
          },
          {
            rank: 3,
            name: "Tay Tay",
            marks: 72,
            subject: "English",
            subjectMark: 70,
          },
          {
            rank: 4,
            name: "Sai Sai",
            marks: 70,
            subject: "Computer",
            subjectMark: 72,
          },
          {
            rank: 5,
            name: "Nay Nay",
            marks: 69,
            subject: "Myanmar",
            subjectMark: 71,
          },
        ],
        girls: [
          {
            rank: 1,
            name: "Yee Yee",
            marks: 79,
            subject: "English",
            subjectMark: 81,
          },
          {
            rank: 2,
            name: "Kyu Kyu",
            marks: 77,
            subject: "Science",
            subjectMark: 79,
          },
          {
            rank: 3,
            name: "Moe Moe",
            marks: 75,
            subject: "Math",
            subjectMark: 77,
          },
          {
            rank: 4,
            name: "Tin Tin",
            marks: 73,
            subject: "Computer",
            subjectMark: 75,
          },
          {
            rank: 5,
            name: "Poe Poe",
            marks: 72,
            subject: "Myanmar",
            subjectMark: 74,
          },
        ],
      },
      F: {
        boys: [
          {
            rank: 1,
            name: "Zaw Zaw",
            marks: 82,
            subject: "Math",
            subjectMark: 84,
          },
          {
            rank: 2,
            name: "Soe Soe",
            marks: 80,
            subject: "Science",
            subjectMark: 82,
          },
          {
            rank: 3,
            name: "Tun Tun",
            marks: 78,
            subject: "English",
            subjectMark: 76,
          },
          {
            rank: 4,
            name: "Min Min",
            marks: 76,
            subject: "Computer",
            subjectMark: 78,
          },
          {
            rank: 5,
            name: "Win Win",
            marks: 75,
            subject: "Myanmar",
            subjectMark: 77,
          },
        ],
        girls: [
          {
            rank: 1,
            name: "Zin Zin",
            marks: 85,
            subject: "English",
            subjectMark: 87,
          },
          {
            rank: 2,
            name: "Nay Nay",
            marks: 83,
            subject: "Science",
            subjectMark: 85,
          },
          {
            rank: 3,
            name: "Hlaing Hlaing",
            marks: 81,
            subject: "Math",
            subjectMark: 83,
          },
          {
            rank: 4,
            name: "Lay Lay",
            marks: 79,
            subject: "Computer",
            subjectMark: 81,
          },
          {
            rank: 5,
            name: "Kay Kay",
            marks: 78,
            subject: "Myanmar",
            subjectMark: 80,
          },
        ],
      },
    }),
    []
  );

  const [expandedHealthAlert, setExpandedHealthAlert] = useState(null);
  const [expandedClass, setExpandedClass] = useState(null);

  const getLevelColor = (level) => {
    switch (level) {
      case "High":
        return gradeTheme.danger;
      case "Medium":
        return gradeTheme.warning;
      case "Low":
        return gradeTheme.accent;
      default:
        return gradeTheme.light;
    }
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: gradeTheme.background }}
    >
      {/* Header Section */}
      <section className="mb-8">
        <h1
          className="text-4xl font-bold mb-2"
          style={{ color: gradeTheme.dark }}
        >
          Welcome, {profile.name}
        </h1>
        <h2
          className="text-2xl font-semibold mb-1"
          style={{ color: gradeTheme.primary }}
        >
          Grade Manager – Grade - {profile.grade}
        </h2>
        <p className="text-sm" style={{ color: gradeTheme.light }}>
          Here is the current status of Grade - {profile.grade}.
        </p>
      </section>

      {/* Statistics Cards */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

            <div
              className="p-6 border shadow-md hover:shadow-lg transition-shadow"
              style={{
                backgroundColor: gradeTheme.white,
                borderColor: "#E2E8F0",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-sm font-medium mb-2"
                    style={{ color: gradeTheme.light }}
                  >
                    Total Students
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: gradeTheme.dark }}
                  >
            {studentsCount}
                  </p>
                </div>
                <div
                  className="p-3"
                  style={{
                    backgroundColor: gradeTheme.primary + "15",
                    border: `1px solid ${gradeTheme.color}30`,
                  }}
                >
                  <FiUsers size={24} style={{ color: gradeTheme.primary }} />
                </div>
              </div>
            </div>

         <div
              className="p-6 border shadow-md hover:shadow-lg transition-shadow"
              style={{
                backgroundColor: gradeTheme.white,
                borderColor: "#E2E8F0",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-sm font-medium mb-2"
                    style={{ color: gradeTheme.light }}
                  >
                    Admissions
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: gradeTheme.dark }}
                  >
            {admissionCount}
                  </p>
                </div>
                <div
                  className="p-3"
                  style={{
                    backgroundColor: gradeTheme.accent+ "15",
                    border: `1px solid ${gradeTheme.accent}30`,
                  }}
                >
                  <FiUsers size={24} style={{ color: gradeTheme.warning }} />
                </div>
              </div>
            </div>
                     <div
              className="p-6 border shadow-md hover:shadow-lg transition-shadow"
              style={{
                backgroundColor: gradeTheme.white,
                borderColor: "#E2E8F0",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-sm font-medium mb-2"
                    style={{ color: gradeTheme.light }}
                  >
                  Leave Requests
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: gradeTheme.dark }}
                  >
            {leaveRequests.length}
                  </p>
                </div>
                <div
                  className="p-3"
                  style={{
                    backgroundColor: gradeTheme.primary + "15",
                    border: `1px solid ${gradeTheme.color}30`,
                  }}
                >
                  <FiUsers size={24} style={{ color: gradeTheme.accent }} />
                </div>
              </div>
            </div>
                     <div
              className="p-6 border shadow-md hover:shadow-lg transition-shadow"
              style={{
                backgroundColor: gradeTheme.white,
                borderColor: "#E2E8F0",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-sm font-medium mb-2"
                    style={{ color: gradeTheme.light }}
                  >
                    Notices
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: gradeTheme.dark }}
                  >
            {notices.length}
                  </p>
                </div>
                <div
                  className="p-3"
                  style={{
                    backgroundColor: gradeTheme.primary + "15",
                    border: `1px solid ${gradeTheme.color}30`,
                  }}
                >
                  <FiUsers size={24} style={{ color: gradeTheme.danger }} />
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Leave Requests Section */}
      <section className="mb-8">
        <div
          className="p-6 border shadow-md"
          style={{
            backgroundColor: gradeTheme.white,
            borderColor: "#E2E8F0",
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className="text-xl font-semibold flex items-center gap-2"
              style={{ color: gradeTheme.dark }}
            >
              <FiClock style={{ color: gradeTheme.accent }} />
              Leave Requests
            </h3>

          </div>

          {loadingLeaveRequests ? (
            <div className="text-center py-8" style={{ color: gradeTheme.light }}>
              Loading leave requests...
            </div>
          ) : leaveRequests.length === 0 ? (
            <div className="text-center py-8" style={{ color: gradeTheme.light }}>
              No leave requests found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: gradeTheme.background }}>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        color: gradeTheme.light,
                        borderBottom: `1px solid #E2E8F0`,
                      }}
                    >
                      Student
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        color: gradeTheme.light,
                        borderBottom: `1px solid #E2E8F0`,
                      }}
                    >
                      Duration
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        color: gradeTheme.light,
                        borderBottom: `1px solid #E2E8F0`,
                      }}
                    >
                      Description
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        color: gradeTheme.light,
                        borderBottom: `1px solid #E2E8F0`,
                      }}
                    >
                      Status
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        color: gradeTheme.light,
                        borderBottom: `1px solid #E2E8F0`,
                      }}
                    >
                      Submitted
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        color: gradeTheme.light,
                        borderBottom: `1px solid #E2E8F0`,
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td
                        className="px-4 py-4"
                        style={{
                          color: gradeTheme.dark,
                          borderBottom: `1px solid #E2E8F0`,
                        }}
                      >
                        <div className="font-medium">{request.student_name}</div>
                        <div className="text-xs" style={{ color: gradeTheme.light }}>
                           {request.name}
                        </div>
                      </td>
                      <td
                        className="px-4 py-4"
                        style={{
                          color: gradeTheme.dark,
                          borderBottom: `1px solid #E2E8F0`,
                        }}
                      >
                        <div className="font-semibold">{request.duration} day{request.duration !== 1 ? 's' : ''}</div>
                      </td>
                      <td
                        className="px-4 py-4"
                        style={{
                          color: gradeTheme.dark,
                          borderBottom: `1px solid #E2E8F0`,
                        }}
                      >
                        <div className="text-sm">{request.description}</div>
                        {request.note && (
                          <div className="text-xs mt-1" style={{ color: gradeTheme.light }}>
                            Note: {request.note}
                          </div>
                        )}
                      </td>
                      <td
                        className="px-4 py-4"
                        style={{
                          borderBottom: `1px solid #E2E8F0`,
                        }}
                      >
                        <span
                          className="inline-flex items-center px-3 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: getStatusColor(request.status) + '20',
                            color: getStatusColor(request.status),
                            border: `1px solid ${getStatusColor(request.status)}`,
                          }}
                        >
                          {getStatusIcon(request.status)}
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td
                        className="px-4 py-4 text-sm"
                        style={{
                          color: gradeTheme.light,
                          borderBottom: `1px solid #E2E8F0`,
                        }}
                      >
                        {formatDateTime(request.created_at)}
                      </td>
                      <td
                        className="px-4 py-4"
                        style={{
                          borderBottom: `1px solid #E2E8F0`,
                        }}
                      >
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => approveLeave(request.id)}
                              className="flex items-center gap-1 px-3 py-1 text-xs font-medium"
                              style={{
                                backgroundColor: gradeTheme.accent,
                                color: gradeTheme.white,
                                border: `1px solid ${gradeTheme.accent}`,
                              }}
                            >
                              <FiCheck size={12} />
                              Approve
                            </button>
                            <button
                              onClick={() => rejectLeave(request.id)}
                              className="flex items-center gap-1 px-3 py-1 text-xs font-medium"
                              style={{
                                backgroundColor: gradeTheme.danger,
                                color: gradeTheme.white,
                                border: `1px solid ${gradeTheme.danger}`,
                              }}
                            >
                              <FiX size={12} />
                              Reject
                            </button>
                          </div>
                        )}
                        {request.status !== 'pending' && (
                          <span className="text-xs" style={{ color: gradeTheme.light }}>
                            Processed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Notice Board Section */}
      <section className="mb-8">
        <div
          className="p-6 border shadow-md"
          style={{
            backgroundColor: gradeTheme.white,
            borderColor: "#E2E8F0",
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className="text-xl font-semibold"
              style={{ color: gradeTheme.dark }}
            >
              Notice Board
            </h3>
            <button
              onClick={() => setShowNoticeForm(!showNoticeForm)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
              style={{
                backgroundColor: gradeTheme.primary,
                color: gradeTheme.white,
                border: `1px solid ${gradeTheme.primary}`,
                boxShadow: "0 2px 4px rgba(63, 167, 163, 0.2)",
              }}
            >
              <FiPlus size={16} />
              Add Notice
            </button>
          </div>

          {/* Add Notice Form */}
          {showNoticeForm && (
            <div
              className="mb-6 p-4 border-l-4"
              style={{
                backgroundColor: gradeTheme.background,
                borderLeftColor: gradeTheme.primary,
              }}
            >
              <textarea
                value={newNoticeText}
                onChange={(e) => setNewNoticeText(e.target.value)}
                placeholder="Type your notice here..."
                className="w-full p-3 border mb-3"
                style={{
                  backgroundColor: gradeTheme.white,
                  borderColor: "#E2E8F0",
                  color: gradeTheme.dark,
                }}
                rows="3"
              />
              <div className="flex gap-2">
                <button
                  onClick={addNotice}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
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
                  onClick={() => {
                    setShowNoticeForm(false);
                    setNewNoticeText("");
                  }}
                  className="px-4 py-2 text-sm font-medium"
                  style={{
                    backgroundColor: "#E2E8F0",
                    color: gradeTheme.dark,
                    border: "1px solid #E2E8F0",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Notices List */}
          <div className="space-y-3">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="p-4 border-l-4 flex justify-between items-start"
                style={{
                  borderLeftColor: gradeTheme.primary,
                  backgroundColor: gradeTheme.background,
                }}
              >
                {editingNoticeId === notice.id ? (
                  <div className="flex-1">
                    <textarea
                      value={editingNoticeText}
                      onChange={(e) => setEditingNoticeText(e.target.value)}
                      className="w-full p-2 border mb-2"
                      style={{
                        backgroundColor: gradeTheme.white,
                        borderColor: "#E2E8F0",
                        color: gradeTheme.dark,
                      }}
                      rows="2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveEditNotice}
                        className="flex items-center gap-1 px-3 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: gradeTheme.primary,
                          color: gradeTheme.white,
                          border: `1px solid ${gradeTheme.primary}`,
                        }}
                      >
                        <FiSave size={12} />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingNoticeId(null)}
                        className="px-3 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: "#E2E8F0",
                          color: gradeTheme.dark,
                          border: "1px solid #E2E8F0",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <p style={{ color: gradeTheme.dark }}>{notice.message}</p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: gradeTheme.light }}
                      >
                        {notice.created_at}
                      </p>
                    </div>
                    {notice.createdBy === profile.user_id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditNotice(notice)}
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
                          onClick={() => deleteNotice(notice.id)}
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
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          <button
            className="mt-4 px-6 py-2 text-sm font-medium"
            style={{
              backgroundColor: gradeTheme.primary,
              color: gradeTheme.white,
              border: `1px solid ${gradeTheme.primary}`,
            }}
          >
            View All Notices
          </button>
        </div>
      </section>

      {/* Health & Problem Alerts Section */}
      <section className="mb-8">
        <div
          className="p-6 border shadow-md"
          style={{
            backgroundColor: gradeTheme.white,
            borderColor: "#E2E8F0",
          }}
        >
          <h3
            className="text-xl font-semibold mb-4 flex items-center gap-2"
            style={{ color: gradeTheme.dark }}
          >
            <FiAlertTriangle style={{ color: gradeTheme.danger }} />
            Students with Health or Personal Issues
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: gradeTheme.background }}>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{
                      color: gradeTheme.light,
                      borderBottom: `1px solid #E2E8F0`,
                    }}
                  >
                    Name
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{
                      color: gradeTheme.light,
                      borderBottom: `1px solid #E2E8F0`,
                    }}
                  >
                    Class
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{
                      color: gradeTheme.light,
                      borderBottom: `1px solid #E2E8F0`,
                    }}
                  >
                    Gender
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{
                      color: gradeTheme.light,
                      borderBottom: `1px solid #E2E8F0`,
                    }}
                  >
                    Condition / Issue
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{
                      color: gradeTheme.light,
                      borderBottom: `1px solid #E2E8F0`,
                    }}
                  >
                    Level
                  </th>
                </tr>
              </thead>
              <tbody>
                {issues.map((alert) => (
                  <tr
                    key={alert.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td
                      className="px-4 py-4 text-sm font-medium"
                      style={{
                        color: gradeTheme.dark,
                        borderBottom: `1px solid #E2E8F0`,
                      }}
                    >
                      {alert.name}
                    </td>
                    <td
                      className="px-4 py-4 text-sm"
                      style={{
                        color: gradeTheme.dark,
                        borderBottom: `1px solid #E2E8F0`,
                      }}
                    >
                      Class {alert.class}
                    </td>
                    <td
                      className="px-4 py-4 text-sm"
                      style={{
                        color: gradeTheme.dark,
                        borderBottom: `1px solid #E2E8F0`,
                      }}
                    >
                      {alert.gender}
                    </td>
                    <td
                      className="px-4 py-4 text-sm"
                      style={{
                        color: gradeTheme.dark,
                        borderBottom: `1px solid #E2E8F0`,
                      }}
                    >
                      {alert.issue}
                    </td>
                    <td
                      className="px-4 py-4 text-sm font-medium"
                      style={{
                        color: getLevelColor(alert.issue_level),
                        borderBottom: `1px solid #E2E8F0`,
                      }}
                    >
                      {alert.issue_level}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>



      {/* Top Students Section */}
      <section>
        <h2
          className="text-2xl font-semibold mb-8 flex items-center gap-2"
          style={{ color: gradeTheme.dark }}
        >
          <FiAward style={{ color: gradeTheme.primary }} />
          Top Students by Class
        </h2>

        <div className="space-y-8">
          {Object.entries(topStudentsData).map(([classLetter, classData]) => (
            <div key={classLetter}>
              <div
                className="mb-4 p-4 border"
                style={{
                  backgroundColor: gradeTheme.primary + "10",
                  borderColor: gradeTheme.primary,
                }}
              >
                <h3
                  className="text-xl font-bold"
                  style={{ color: gradeTheme.primary }}
                >
                  Class {classLetter}
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top 5 Boys */}
                <div
                  className="p-6 border shadow-md"
                  style={{
                    backgroundColor: gradeTheme.white,
                    borderColor: "#E2E8F0",
                  }}
                >
                  <h4
                    className="text-lg font-semibold mb-4 pb-3"
                    style={{
                      color: gradeTheme.dark,
                      borderBottom: `2px solid ${gradeTheme.primary}`,
                    }}
                  >
                    🏆 Top 5 Boys
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: gradeTheme.background }}>
                          <th
                            className="px-3 py-2 text-left font-medium"
                            style={{ color: gradeTheme.light }}
                          >
                            Rank
                          </th>
                          <th
                            className="px-3 py-2 text-left font-medium"
                            style={{ color: gradeTheme.light }}
                          >
                            Name
                          </th>
                          <th
                            className="px-3 py-2 text-left font-medium"
                            style={{ color: gradeTheme.light }}
                          >
                            Marks %
                          </th>
                          <th
                            className="px-3 py-2 text-left font-medium"
                            style={{ color: gradeTheme.light }}
                          >
                            Subject
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {classData.boys.map((student) => (
                          <tr
                            key={student.rank}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td
                              className="px-3 py-3 font-semibold"
                              style={{ color: gradeTheme.primary }}
                            >
                              {student.rank}
                            </td>
                            <td
                              className="px-3 py-3 font-medium"
                              style={{ color: gradeTheme.dark }}
                            >
                              {student.name}
                            </td>
                            <td
                              className="px-3 py-3 font-semibold"
                              style={{ color: gradeTheme.accent }}
                            >
                              {student.marks}%
                            </td>
                            <td
                              className="px-3 py-3 text-xs"
                              style={{ color: gradeTheme.light }}
                            >
                              {student.subject} {student.subjectMark}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Top 5 Girls */}
                <div
                  className="p-6 border shadow-md"
                  style={{
                    backgroundColor: gradeTheme.white,
                    borderColor: "#E2E8F0",
                  }}
                >
                  <h4
                    className="text-lg font-semibold mb-4 pb-3"
                    style={{
                      color: gradeTheme.dark,
                      borderBottom: `2px solid ${gradeTheme.secondary}`,
                    }}
                  >
                    🏆 Top 5 Girls
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: gradeTheme.background }}>
                          <th
                            className="px-3 py-2 text-left font-medium"
                            style={{ color: gradeTheme.light }}
                          >
                            Rank
                          </th>
                          <th
                            className="px-3 py-2 text-left font-medium"
                            style={{ color: gradeTheme.light }}
                          >
                            Name
                          </th>
                          <th
                            className="px-3 py-2 text-left font-medium"
                            style={{ color: gradeTheme.light }}
                          >
                            Marks %
                          </th>
                          <th
                            className="px-3 py-2 text-left font-medium"
                            style={{ color: gradeTheme.light }}
                          >
                            Subject
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {classData.girls.map((student) => (
                          <tr
                            key={student.rank}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td
                              className="px-3 py-3 font-semibold"
                              style={{ color: gradeTheme.secondary }}
                            >
                              {student.rank}
                            </td>
                            <td
                              className="px-3 py-3 font-medium"
                              style={{ color: gradeTheme.dark }}
                            >
                              {student.name}
                            </td>
                            <td
                              className="px-3 py-3 font-semibold"
                              style={{ color: gradeTheme.accent }}
                            >
                              {student.marks}%
                            </td>
                            <td
                              className="px-3 py-3 text-xs"
                              style={{ color: gradeTheme.light }}
                            >
                              {student.subject} {student.subjectMark}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
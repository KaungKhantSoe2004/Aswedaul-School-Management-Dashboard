"use client";
import axios from "axios";
import { useState, useMemo, useEffect } from "react";
import { AiFillMoneyCollect } from "react-icons/ai";
import { 
  FiTrendingUp, 
  FiCalendar, 
  FiBook, 
  FiAward, 
  FiBarChart2, 
  FiEye,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiSend
} from "react-icons/fi";
import { PiExamFill } from "react-icons/pi";
import { BsCalendarCheck, BsCalendarX } from "react-icons/bs";
import { useSelector } from "react-redux";

export default function StudentDashboard() {
  const studentTheme = {
    primary: "#3FA7A3",
    secondary: "#6C63FF",
    accent: "#2ECC71",
    warning: "#F39C12",
    danger: "#E74C3C",
    dark: "#1E293B",
    light: "#64748B",
    background: "#F8FAFC",
    white: "#FFFFFF",
    lightGray: "#F1F5F9"
  };
  
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [notices, setNotices] = useState([]);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    duration: "",
    description: ""
  });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const studentInfo = useSelector(store => store.profile.profile);
  
  const admin_backend_domain_name = import.meta.env.VITE_ADMIN_BACKEND_DOMAIN_NAME;
  const backend_domain_name = import.meta.env.VITE_BACKEND_DOMAIN_NAME;

  const LoadingIndicator = () => (
    <div className="flex items-center justify-center min-h-[100vh]">
      <div className="text-center p-6 rounded-lg" style={{backgroundColor: studentTheme.white}}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 mx-auto mb-4" 
             style={{ borderColor: studentTheme.light, borderTopColor: studentTheme.primary }}></div>
        <p className="text-lg font-medium" style={{ color: studentTheme.dark }}>Fetching Dashboard...</p>
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateDaysLeft = (futureDateString) => {
    const futureDate = new Date(futureDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    futureDate.setHours(0, 0, 0, 0);
    const timeDiff = futureDate.getTime() - today.getTime();
    const daysLeft = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
    return daysLeft;
  };

  const formatExamData = (exams) => {
    const now = new Date();
    return exams.map(exam => {
      const daysLeft = calculateDaysLeft(exam.exam_start_date);
      const startDate = new Date(exam.exam_start_date);
      const isUpcoming = startDate > now;
      
      return {
        ...exam,
        formattedDate: formatDate(exam.exam_start_date),
        formattedTime: formatTime(exam.exam_start_date),
        daysLeft: daysLeft,
        isUpcoming: isUpcoming
      };
    }).filter(exam => exam.isUpcoming)
      .sort((a, b) => {
        if (a.daysLeft !== b.daysLeft) {
          return a.daysLeft - b.daysLeft;
        }
        return new Date(a.exam_start_date) - new Date(b.exam_start_date);
      });
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${admin_backend_domain_name}api/student/getDashboard/${studentInfo.grade}`, 
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        const formattedExams = formatExamData(response.data.data.upcomingExams);
        setUpcomingExams(formattedExams);
        console.log(response.data, 'is dude')
        setNotices(response.data.data.notices);
      }
    } catch (err) {
      console.log(err, 'Error fetching dashboard data');
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get(
        `${backend_domain_name}api/leaveRequests/get/${studentInfo.id}`,
        { withCredentials: true }
      );
      console.log(response, 'is response')
      if (response.status === 200) {
        setLeaveRequests(response.data.data || []);
      }
    } catch (err) {
      console.log(err, 'Error fetching leave requests');
    }
  };

  const handleSubmitLeaveRequest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        `${backend_domain_name}api/leaveRequests/request`,
        {
          student_id: studentInfo.id,
          grade_id: studentInfo.grade,
          duration: leaveForm.duration,
          description: leaveForm.description
        },
        { withCredentials: true }
      );
      
      if (response.status === 200 || response.status === 201) {
        await fetchLeaveRequests();
        setShowLeaveModal(false);
        setLeaveForm({ duration: "", description: "" });
        alert("Leave request submitted successfully!");
      }
    } catch (err) {
      console.log(err, 'Error submitting leave request');
      alert("Failed to submit leave request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statsData = useMemo(
    () => [
      {
        id: 1,
        label: "Total Upcoming Exams",
        value: upcomingExams.length,
        icon: PiExamFill,
        color: studentTheme.primary,
      },
      {
        id: 2,
        label: "Grade",
        value: studentInfo.grade,
        icon: FiAward,
        color: studentTheme.accent,
      },
      {
        id: 3,
        label: "Academic Year",
        value: studentInfo.academic_year,
        icon: FiBook,
        color: studentTheme.secondary,
      },
      {
        id: 4,
        label: "Pending Leave Requests",
        value: leaveRequests.filter(req => req.status === "pending").length,
        icon: BsCalendarX,
        color: studentTheme.warning,
      }
    ],
    [studentTheme, upcomingExams.length, leaveRequests, studentInfo]
  );

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <FiCheckCircle className="text-green-500" size={16} />;
      case "rejected":
        return <FiXCircle className="text-red-500" size={16} />;
      case "pending":
        return <FiClock className="text-yellow-500" size={16} />;
      default:
        return <FiAlertCircle className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatNoticeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return formatDate(dateString);
    }
  };

  useEffect(() => {
    if (studentInfo) {
      fetchData();
      fetchLeaveRequests();
    }
  }, [studentInfo]);

  const nearestExam = upcomingExams.length > 0 ? upcomingExams[0] : null;

  return (studentInfo) ? (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: studentTheme.background }}>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: studentTheme.dark }}>
              Welcome, {studentInfo.name}
            </h1>
            <p className="text-lg" style={{ color: studentTheme.light }}>
              Grade {studentInfo.grade} • {studentInfo.academic_year} Academic Year
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowLeaveModal(true)}
              className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all hover:shadow-lg"
              style={{
                backgroundColor: studentTheme.white,
                color: studentTheme.primary,
                border: `2px solid ${studentTheme.primary}`,
              }}
            >
              <BsCalendarX size={18} />
              Request Leave
            </button>
          </div>
        </div>
      </div>

      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat) => (
            <div
              key={stat.id}
              className="p-6 rounded-xl shadow-sm border transition-transform hover:-translate-y-1"
              style={{
                backgroundColor: studentTheme.white,
                borderColor: "#E2E8F0",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-2" style={{ color: studentTheme.light }}>
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold" style={{ color: studentTheme.dark }}>
                    {stat.value}
                  </p>
                </div>
                <div
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: stat.color + "15",
                    border: `1px solid ${stat.color}30`,
                  }}
                >
                  <stat.icon size={24} style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {nearestExam && (
        <section className="mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <FiCalendar size={24} className="text-white" />
                  <h3 className="text-2xl font-bold">Nearest Exam Alert!</h3>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-xl font-semibold mb-2">{nearestExam.exam_name}</h4>
                  <p className="text-blue-100 mb-1">
                    <span className="font-medium">Subject:</span> {nearestExam.subject || "General"}
                  </p>
                  <p className="text-blue-100 mb-1">
                    <span className="font-medium">Date:</span> {nearestExam.formattedDate} at {nearestExam.formattedTime}
                  </p>
                  <p className="text-blue-100">
                    <span className="font-medium">Type:</span> {nearestExam.exam_type}
                  </p>
                </div>
              </div>
              
              <div className="text-center p-6 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <div className="text-5xl font-bold mb-2">{nearestExam.daysLeft}</div>
                <div className="text-lg font-medium">Days Left</div>
                <div className="text-sm text-blue-100 mt-2">Prepare Well!</div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="border rounded-xl shadow-sm overflow-hidden"
               style={{ backgroundColor: studentTheme.white, borderColor: "#E2E8F0" }}>
            <div className="p-6 border-b" style={{ borderColor: "#E2E8F0" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiCalendar style={{ color: studentTheme.primary }} size={20} />
                  <h3 className="text-xl font-semibold" style={{ color: studentTheme.dark }}>
                    Upcoming Exams
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ backgroundColor: studentTheme.primary + "20", color: studentTheme.primary }}>
                  {upcomingExams.length} Exams
                </span>
              </div>
            </div>
            
            <div className="p-6">
              {upcomingExams.length > 0 ? (
                <div className="space-y-4">
                  {upcomingExams.map((exam, index) => (
                    <div key={exam.id} 
                         className={`p-5 rounded-xl border transition-all hover:shadow-md ${index === 0 ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                         style={{ backgroundColor: studentTheme.lightGray, borderColor: "#E2E8F0" }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-lg" style={{ color: studentTheme.dark }}>
                              {exam.exam_name}
                            </h4>
                            {index === 0 && (
                              <span className="px-2 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800">
                                NEXT
                              </span>
                            )}
                          </div>
                          <p className="text-sm mb-1" style={{ color: studentTheme.light }}>
                            {exam.exam_type?.toUpperCase()} • Grade {exam.grade}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-1" style={{ color: studentTheme.primary }}>
                            {exam.daysLeft}
                          </div>
                          <div className="text-xs font-medium" style={{ color: studentTheme.light }}>
                            days left
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium" style={{ color: studentTheme.dark }}>
                            <FiClock className="inline mr-2" size={14} />
                            {exam.formattedDate} • {exam.formattedTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiCalendar size={48} className="mx-auto mb-4" style={{ color: studentTheme.light }} />
                  <p className="text-lg font-medium mb-2" style={{ color: studentTheme.dark }}>
                    No Upcoming Exams
                  </p>
                  <p className="text-sm" style={{ color: studentTheme.light }}>
                    Check back later for scheduled exams
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border rounded-xl shadow-sm overflow-hidden"
               style={{ backgroundColor: studentTheme.white, borderColor: "#E2E8F0" }}>
            <div className="p-6 border-b" style={{ borderColor: "#E2E8F0" }}>
              <div className="flex items-center gap-2">
                <BsCalendarCheck style={{ color: studentTheme.warning }} size={20} />
                <h3 className="text-xl font-semibold" style={{ color: studentTheme.dark }}>
                  My Leave Requests
                </h3>
              </div>
            </div>
            
            <div className="p-6">
              {leaveRequests.length > 0 ? (
                <div className="space-y-4">
                  {leaveRequests.map((request) => (
                    <div key={request.id} 
                         className="p-4 rounded-lg border transition-all hover:shadow-sm"
                         style={{ backgroundColor: studentTheme.lightGray, borderColor: "#E2E8F0" }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(request.status)}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                            {request.status || "Pending"}
                          </span>
                        </div>
                        <span className="text-sm font-medium" style={{ color: studentTheme.light }}>
                          {new Date(request.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="mb-2">
                        <p className="font-medium mb-1" style={{ color: studentTheme.dark }}>
                          Duration: {request.duration}
                        </p>
                        <p className="text-sm" style={{ color: studentTheme.light }}>
                          {request.description}
                        </p>
                      </div>
                      
                      {request.admin_comment && (
                        <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                          <p className="text-sm font-medium text-blue-800 mb-1">Admin Comment:</p>
                          <p className="text-sm text-blue-600">{request.admin_comment}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BsCalendarCheck size={48} className="mx-auto mb-4" style={{ color: studentTheme.light }} />
                  <p className="text-lg font-medium mb-2" style={{ color: studentTheme.dark }}>
                    No Leave Requests Yet
                  </p>
                  <p className="text-sm mb-4" style={{ color: studentTheme.light }}>
                    Submit your first leave request using the button above
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-xl shadow-sm overflow-hidden"
               style={{ backgroundColor: studentTheme.white, borderColor: "#E2E8F0" }}>
            <div className="p-6 border-b" style={{ borderColor: "#E2E8F0" }}>
              <div className="flex items-center gap-2">
                <FiBook style={{ color: studentTheme.accent }} size={20} />
                <h3 className="text-xl font-semibold" style={{ color: studentTheme.dark }}>
                  Notice Board
                </h3>
              </div>
            </div>
            
            <div className="p-6">
              {notices.length > 0 ? (
                <div className="space-y-4">
                  {notices.map((notice) => (
                    <div key={notice.id}
                         className="p-4 rounded-lg border-l-4 transition-all hover:shadow-sm"
                         style={{
                           backgroundColor: studentTheme.lightGray,
                           borderColor: studentTheme.primary,
                           borderLeftWidth: "4px",
                         }}>
                      <p className="font-medium mb-2" style={{ color: studentTheme.dark }}>
                        {notice.message}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-medium" style={{ color: studentTheme.primary }}>
                          {notice.author}
                        </span>
                        <span className="text-xs" style={{ color: studentTheme.light }}>
                          {formatNoticeDate(notice.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiBook size={48} className="mx-auto mb-4" style={{ color: studentTheme.light }} />
                  <p className="text-lg font-medium mb-2" style={{ color: studentTheme.dark }}>
                    No Notices
                  </p>
                  <p className="text-sm" style={{ color: studentTheme.light }}>
                    No announcements at the moment
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border rounded-xl shadow-sm p-6"
               style={{ backgroundColor: studentTheme.white, borderColor: "#E2E8F0" }}>
            <h4 className="font-bold text-lg mb-4" style={{ color: studentTheme.dark }}>
              Student Information
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: studentTheme.light }}>Student ID:</span>
                <span style={{ color: studentTheme.dark }}>{studentInfo.id}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: studentTheme.light }}>Email:</span>
                <span style={{ color: studentTheme.dark }}>{studentInfo.email}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: studentTheme.light }}>Guardian:</span>
                <span style={{ color: studentTheme.dark }}>{studentInfo.guardianName}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: studentTheme.light }}>Contact:</span>
                <span style={{ color: studentTheme.dark }}>{studentInfo.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showLeaveModal && (
        <div className="fixed inset-0 z-50">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLeaveModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
            <div 
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold" style={{ color: studentTheme.dark }}>
                    Request Leave of Absence
                  </h3>
                  <button
                    onClick={() => setShowLeaveModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiXCircle size={20} style={{ color: studentTheme.light }} />
                  </button>
                </div>

                <form onSubmit={handleSubmitLeaveRequest}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: studentTheme.dark }}>
                        Duration *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., 2 days, 1 week, etc."
                        value={leaveForm.duration}
                        onChange={(e) => setLeaveForm({...leaveForm, duration: e.target.value})}
                        className="w-full p-3 rounded-lg border focus:ring-2 focus:outline-none text-black transition-all"
                        style={{ 
                          borderColor: "#E2E8F0",
                          backgroundColor: studentTheme.background
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: studentTheme.dark }}>
                        Reason/Description *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Please provide detailed reason for your leave request..."
                        value={leaveForm.description}
                        onChange={(e) => setLeaveForm({...leaveForm, description: e.target.value})}
                        className="w-full p-3 text-black rounded-lg border focus:ring-2 focus:outline-none transition-all"
                        style={{ 
                          borderColor: "#E2E8F0",
                          backgroundColor: studentTheme.background,
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <div className="text-sm" style={{ color: studentTheme.light }}>
                      <p className="flex items-center gap-2">
                        <FiAlertCircle size={14} />
                        Your request will be reviewed by the administration
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      type="button"
                      onClick={() => setShowLeaveModal(false)}
                      className="flex-1 py-3 rounded-lg font-medium transition-colors"
                      style={{
                        backgroundColor: studentTheme.white,
                        color: studentTheme.dark,
                        border: `2px solid ${studentTheme.light}`
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                      style={{
                        backgroundColor: studentTheme.primary,
                        color: studentTheme.white
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FiSend size={18} />
                          Submit Request
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <LoadingIndicator />
  );
}
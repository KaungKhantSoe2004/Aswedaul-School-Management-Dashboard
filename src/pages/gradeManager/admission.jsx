"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { FiEye, FiCheck, FiX, FiAlertCircle, FiSave, FiFile, FiUser, FiPhone, FiMail, FiCalendar, FiMapPin, FiBook, FiCheckCircle, FiClock, FiDownload, FiSearch, FiUserCheck, FiLock, FiUnlock, FiRefreshCw } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

export default function AdmissionFormsReview() {
  const theme = {
    primary: "#3FA7A3",
    primaryLight: "#7EC4C1",
    primaryDark: "#2D8B87",
    primaryBg: "#E8F6F5",
    secondary: "#6C63FF",
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

  const dispatch = useDispatch();
  const backend_domain_name = import.meta.env.VITE_BACKEND_DOMAIN_NAME;
  const admin_backend_domain_name = import.meta.env.VITE_ADMIN_BACKEND_DOMAIN_NAME;
  const profile = useSelector(store => store.profile.profile);
  const [examResults, setExamResults] = useState();
  const [admissionForms, setAdmissionForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("pending");
  const [examMarks, setExamMarks] = useState({
    math: "",
    english: "",
    science: "",
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    accepted: 0,
    rejected: 0
  });
  
  const [isAdmissionOpened, setIsAdmissionOpened] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [updatingFormId, setUpdatingFormId] = useState(null);

  // Parse JSON string to array safely
  const parsePrevClassDocument = (docString) => {
    if (!docString) return [];
    try {
      if (Array.isArray(docString)) return docString;
      const parsed = JSON.parse(docString);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      return docString.split(',').map(doc => doc.trim()).filter(doc => doc);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return theme.warning;
      case "reviewing":
        return "#3498DB";
      case "accepted":
        return theme.accent;
      case "rejected":
        return theme.danger;
      default:
        return theme.light;
    }
  };

  const getGradeNumber = (gradeString) => {
    // Extract number from grade string like "grade-7"
    const match = gradeString?.match(/grade-(\d+)/i);
    return match ? match[1] : gradeString;
  };

  const openReview = (form) => {
    setSelectedForm(form);
    setStatusUpdate(form.status || "pending");
    setExamMarks({
      math: form.math_score || "",
      english: form.english_score || "",
      science: form.science_score || "",
    });
    setShowReviewModal(true);
  };

  // Check if status can be changed (not accepted or rejected)
  const canChangeStatus = (currentStatus) => {
    return currentStatus !== "accepted" && currentStatus !== "rejected";
  };

  const updateStatus = async (newStatus) => {
    if (!selectedForm) return;

    // Check if current status is already accepted or rejected
    if (!canChangeStatus(selectedForm.status || "pending")) {
      alert("This application has already been finalized (accepted or rejected) and cannot be changed.");
      return;
    }

    setUpdatingFormId(selectedForm.id);
    
    try {
      if (newStatus === "accepted") {
        const response = await axios.get(
          `${backend_domain_name}api/admissions/acceptAdmission/${selectedForm.id}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          // Update local state
          updateFormStatus(selectedForm.id, "accepted");
          setShowReviewModal(false);
          alert("Application accepted successfully!");
        }
      } else if (newStatus === "rejected") {
        const response = await axios.get(
          `${backend_domain_name}api/admissions/rejectAdmission/${selectedForm.id}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          // Update local state
          updateFormStatus(selectedForm.id, "rejected");
          setShowReviewModal(false);
          alert("Application rejected successfully!");
        }
      } else if (newStatus === "reviewing") {
        // Update to reviewing status
        const response = await axios.post(
          `${backend_domain_name}api/admissions/updateStatus/${selectedForm.id}`,
          { status: "reviewing" },
          { withCredentials: true }
        );
        if (response.status === 200) {
          // Update local state
          updateFormStatus(selectedForm.id, "reviewing");
          setShowReviewModal(false);
          alert("Application marked as reviewing!");
        }
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingFormId(null);
    }
  };

  // Helper function to update form status in local state
  const updateFormStatus = (formId, newStatus) => {
    setAdmissionForms(prevForms => 
      prevForms.map(form => 
        form.id === formId ? { ...form, status: newStatus } : form
      )
    );

    // Update stats
    setStats(prevStats => {
      const oldStatus = selectedForm?.status || "pending";
      const newStats = { ...prevStats };
      
      // Decrement old status count
      if (oldStatus === "pending") newStats.pending--;
      else if (oldStatus === "reviewing") newStats.reviewing--;
      else if (oldStatus === "accepted") newStats.accepted--;
      else if (oldStatus === "rejected") newStats.rejected--;
      
      // Increment new status count
      if (newStatus === "pending") newStats.pending++;
      else if (newStatus === "reviewing") newStats.reviewing++;
      else if (newStatus === "accepted") newStats.accepted++;
      else if (newStatus === "rejected") newStats.rejected++;
      
      return newStats;
    });
  };

  const fetchAdmissionStatus = async () => {
    try {
      const response = await axios.get(
        `${admin_backend_domain_name}api/gradeManager/getAdmissionStatus/${profile?.grade}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setIsAdmissionOpened(response.data.data === 'opened');
        console.log(response.data.data)
      }
    } catch (err) {
      console.error("Error fetching admission status:", err);
      setIsAdmissionOpened(false);
    }
  };

  const updateAdmissionStatus = async (action) => {
    setIsUpdatingStatus(true);
    try {
      const response = await axios.post(
        `${admin_backend_domain_name}api/gradeManager/updateAdmissionStatus`,
        {
          grade_id: profile?.grade,
          status: action === 'open' ? 'opened' : 'closed'
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setIsAdmissionOpened(action === 'open');
        alert(`Admissions ${action === 'open' ? 'opened' : 'closed'} successfully!`);
        // Refresh data
        fetchAdmissionStatus();
        fetchAdmissions();
      }
    } catch (err) {
      console.error(`Error ${action === 'open' ? 'opening' : 'closing'} admissions:`, err);
      alert(`Failed to ${action === 'open' ? 'open' : 'close'} admissions. Please try again.`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };
 

  const fetchAdmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${backend_domain_name}api/admissions/getAdmissions/${profile?.grade}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        const forms = response.data || [];
        setAdmissionForms(forms);
        
        // Calculate statistics
        const stats = {
          total: forms.length,
          pending: forms.filter(f => f.status === "pending").length,
          reviewing: forms.filter(f => f.status === "reviewing").length,
          accepted: forms.filter(f => f.status === "accepted").length,
          rejected: forms.filter(f => f.status === "rejected").length
        };
        setStats(stats);
      }
    } catch (err) {
      console.error("Error fetching admissions:", err);
      setError("Failed to fetch admission forms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchAdmissions();
    fetchAdmissionStatus();
  };

  useEffect(() => {
    if (profile?.grade) {
      refreshData();
    }
  }, [profile?.grade]);

  // Filter admission forms based on search
  const filteredForms = admissionForms.filter(form => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      form.name?.toLowerCase().includes(searchLower) ||
      form.email?.toLowerCase().includes(searchLower) ||
      form.guardianName?.toLowerCase().includes(searchLower) ||
      form.phone?.toLowerCase().includes(searchLower) ||
      form.grade?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: theme.primary }}></div>
          <p className="text-lg" style={{ color: theme.dark }}>Loading admission forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: theme.background }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: theme.dark }}>
              <FiBook className="inline-block mr-3" size={28} style={{ color: theme.primary }} />
              Admission Forms Review
            </h1>
            <p className="text-sm" style={{ color: theme.light }}>
              Review and process admission forms for Grade {profile?.grade}
            </p>
          </div>
          
          {/* Right side controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Refresh button */}
            <button
              onClick={refreshData}
              className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: theme.white,
                color: theme.primary,
                border: `1px solid ${theme.primary}`,
              }}
            >
              <FiRefreshCw size={16} />
              Refresh
            </button>
            
            {/* Admission Status Badge */}
            <div className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${isAdmissionOpened ? 'animate-pulse' : ''}`} 
              style={{ 
                backgroundColor: isAdmissionOpened ? theme.accent + '20' : theme.danger + '20', 
                color: isAdmissionOpened ? theme.accent : theme.danger,
                border: `1px solid ${isAdmissionOpened ? theme.accent + '40' : theme.danger + '40'}`
              }}>
              {isAdmissionOpened ? (
                <>
                  <FiUnlock size={14} />
                  Admissions Open
                </>
              ) : (
                <>
                  <FiLock size={14} />
                  Admissions Closed
                </>
              )}
            </div>
            
            <div className="text-sm font-medium px-4 py-2 rounded-lg" style={{ backgroundColor: theme.primary, color: theme.white }}>
              {stats.total} Applications
            </div>
          </div>
        </div>

        {/* Admission Control Panel */}
        <div className="mb-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm" style={{ borderColor: theme.border }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: theme.primary + '15' }}>
                    <FiCalendar size={20} style={{ color: theme.primary }} />
                  </div>
                  <h3 className="text-lg font-semibold" style={{ color: theme.dark }}>Admission Control Panel</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span style={{ color: theme.light }}>Status:</span>
                      <span className="font-medium" style={{ color: isAdmissionOpened ? theme.accent : theme.danger }}>
                        {isAdmissionOpened ? 'Open for Applications' : 'Closed'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span style={{ color: theme.light }}>Applications:</span>
                      <span className="font-medium" style={{ color: theme.dark }}>
                        {stats.total} received
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm" style={{ color: theme.light }}>
                    {isAdmissionOpened 
                      ? `Admissions are currently open. New applications can be submitted.`
                      : `Admissions are currently closed. No new applications will be accepted.`}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 min-w-[280px]">
                <button
                  onClick={() => updateAdmissionStatus('open')}
                  disabled={isAdmissionOpened || isUpdatingStatus}
                  className={`px-5 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                    isAdmissionOpened || isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: isAdmissionOpened ? theme.accent + '40' : theme.accent,
                    color: theme.white,
                    border: `1px solid ${theme.accent}`,
                  }}
                >
                  {isUpdatingStatus ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiUnlock size={16} />
                      Open Admissions
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => updateAdmissionStatus('close')}
                  disabled={!isAdmissionOpened || isUpdatingStatus}
                  className={`px-5 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                    !isAdmissionOpened || isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: !isAdmissionOpened ? theme.danger + '40' : theme.danger,
                    color: theme.white,
                    border: `1px solid ${theme.danger}`,
                  }}
                >
                  {isUpdatingStatus ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiLock size={16} />
                      Close Admissions
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border shadow-sm" style={{ borderColor: theme.border }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: theme.light }}>Total</p>
                <p className="text-2xl font-bold mt-1" style={{ color: theme.dark }}>{stats.total}</p>
              </div>
              <div className="p-2 rounded-lg" style={{ backgroundColor: theme.primary + "20" }}>
                <FiFile size={20} style={{ color: theme.primary }} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border shadow-sm" style={{ borderColor: theme.border }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: theme.light }}>Pending</p>
                <p className="text-2xl font-bold mt-1" style={{ color: theme.warning }}>{stats.pending}</p>
              </div>
              <div className="p-2 rounded-lg" style={{ backgroundColor: theme.warning + "20" }}>
                <FiClock size={20} style={{ color: theme.warning }} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border shadow-sm" style={{ borderColor: theme.border }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: theme.light }}>Reviewing</p>
                <p className="text-2xl font-bold mt-1" style={{ color: "#3498DB" }}>{stats.reviewing}</p>
              </div>
              <div className="p-2 rounded-lg" style={{ backgroundColor: "#3498DB" + "20" }}>
                <FiAlertCircle size={20} style={{ color: "#3498DB" }} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border shadow-sm" style={{ borderColor: theme.border }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: theme.light }}>Accepted</p>
                <p className="text-2xl font-bold mt-1" style={{ color: theme.accent }}>{stats.accepted}</p>
              </div>
              <div className="p-2 rounded-lg" style={{ backgroundColor: theme.accent + "20" }}>
                <FiCheckCircle size={20} style={{ color: theme.accent }} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border shadow-sm" style={{ borderColor: theme.border }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: theme.light }}>Rejected</p>
                <p className="text-2xl font-bold mt-1" style={{ color: theme.danger }}>{stats.rejected}</p>
              </div>
              <div className="p-2 rounded-lg" style={{ backgroundColor: theme.danger + "20" }}>
                <FiX size={20} style={{ color: theme.danger }} />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: theme.light }} size={18} />
            <input
              type="text"
              placeholder="Search by name, email, guardian, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 border rounded-lg w-full text-sm focus:outline-none focus:ring-2"
              style={{
                backgroundColor: theme.white,
                borderColor: theme.border,
                color: theme.dark,
                focusRingColor: theme.primary,
              }}
            />
          </div>
        </div>
      </div>

      {/* Admission Forms Table */}
      <div className="bg-white rounded-xl border overflow-hidden shadow-sm" style={{ backgroundColor: theme.white }}>
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border }}>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: theme.dark }}>
              Admission Applications
              <span className="ml-2 text-sm font-normal" style={{ color: theme.light }}>
                ({filteredForms.length} applications found)
              </span>
            </h3>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${isAdmissionOpened ? 'animate-pulse' : ''}`}
              style={{
                backgroundColor: isAdmissionOpened ? theme.accent + '15' : theme.danger + '15',
                color: isAdmissionOpened ? theme.accent : theme.danger
              }}>
              {isAdmissionOpened ? '✓ Accepting Applications' : '✗ Not Accepting Applications'}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: theme.background }}>
                <th className="p-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.light, borderColor: theme.border, borderBottom: `2px solid ${theme.primary}30` }}>
                  Applicant Details
                </th>
                <th className="p-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.light, borderColor: theme.border, borderBottom: `2px solid ${theme.primary}30` }}>
                  Applied Grade
                </th>
                <th className="p-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.light, borderColor: theme.border, borderBottom: `2px solid ${theme.primary}30` }}>
                  Status
                </th>
                <th className="p-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.light, borderColor: theme.border, borderBottom: `2px solid ${theme.primary}30` }}>
                  Exam Marks
                </th>
                <th className="p-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.light, borderColor: theme.border, borderBottom: `2px solid ${theme.primary}30` }}>
                  Submission Date
                </th>
                <th className="p-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.light, borderColor: theme.border, borderBottom: `2px solid ${theme.primary}30` }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredForms.length > 0 ? (
                filteredForms.map((form, index) => {
                  const hasExamMarks = form.math_score || form.english_score || form.science_score;
                  const totalMarks = (form.math_score || 0) + (form.english_score || 0) + (form.science_score || 0);
                  const isFinalized = form.status === "accepted" || form.status === "rejected";
                  
                  return (
                    <tr key={form.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: theme.border, backgroundColor: index % 2 === 0 ? theme.white : theme.background }}>
                      <td className="p-4" style={{ borderColor: theme.border }}>
                        <div className="flex items-center gap-3">
                          {form.profile ? (
                            <img
                              src={`${backend_domain_name}/uploads/${form.profile}`}
                              alt={form.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: theme.primary }}>
                              {form.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "AA"}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-sm" style={{ color: theme.dark }}>{form.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <FiMail size={10} style={{ color: theme.light }} />
                              <span className="text-xs" style={{ color: theme.light }}>{form.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4" style={{ borderColor: theme.border }}>
                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1 rounded-lg text-sm font-medium" style={{ backgroundColor: theme.primary + "20", color: theme.primary }}>
                            Grade {getGradeNumber(form.grade)}
                          </div>
                        </div>
                      </td>
                      <td className="p-4" style={{ borderColor: theme.border }}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor(form.status || "pending") }}></div>
                          <span className="text-sm font-medium capitalize" style={{ color: getStatusColor(form.status || "pending") }}>
                            {form.status || "pending"}
                          </span>
                          {isFinalized && (
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.light + '15', color: theme.light }}>
                              Final
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4" style={{ borderColor: theme.border }}>
                        {hasExamMarks ? (
                          <div>
                            <div className="text-sm font-medium" style={{ color: theme.dark }}>{totalMarks}/300</div>
                            <div className="text-xs flex gap-2 mt-1">
                              <span style={{ color: theme.light }}>M:{form.math_score || 0}</span>
                              <span style={{ color: theme.light }}>E:{form.english_score || 0}</span>
                              <span style={{ color: theme.light }}>S:{form.science_score || 0}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm" style={{ color: theme.lighter }}>Not Taken</span>
                        )}
                      </td>
                      <td className="p-4" style={{ borderColor: theme.border }}>
                        <div className="flex items-center gap-2">
                          <FiCalendar size={12} style={{ color: theme.light }} />
                          <span className="text-sm" style={{ color: theme.dark }}>
                            {formatDate(form.created_at)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4" style={{ borderColor: theme.border }}>
                        <button
                          onClick={() => openReview(form)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-sm ${isFinalized ? 'opacity-70' : ''}`}
                          style={{
                            backgroundColor: theme.primary,
                            color: theme.white,
                            border: `1px solid ${theme.primary}`,
                          }}
                          disabled={isFinalized}
                        >
                          <FiEye size={14} />
                          {isFinalized ? 'View Only' : 'Review'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <FiFile size={48} className="mx-auto mb-4" style={{ color: theme.lighter }} />
                    <p className="text-lg font-medium mb-2" style={{ color: theme.dark }}>
                      {searchTerm ? "No matching admission forms found" : "No admission forms to review"}
                    </p>
                    <p className="text-sm" style={{ color: theme.light }}>
                      {searchTerm ? "Try a different search term" : isAdmissionOpened ? "No applications received yet" : "Admissions are currently closed"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/20">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border-2" style={{ backgroundColor: theme.white, borderColor: theme.border }}>
            <div className="p-8 rounded-t-2xl border-b-2" style={{ backgroundImage: `linear-gradient(135deg, ${theme.primary}10 0%, ${theme.primary}05 100%)`, borderColor: theme.border }}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 rounded-2xl shadow-sm" style={{ backgroundColor: theme.primary + "25", border: `2px solid ${theme.primary}40` }}>
                      <FiFile size={24} style={{ color: theme.primary }} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold" style={{ color: theme.dark }}>Review Admission Form</h3>
                      <p className="text-sm font-medium mt-1" style={{ color: theme.light }}>{selectedForm.name}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowReviewModal(false)} className="p-3 rounded-xl hover:bg-white/50 transition-colors duration-200 hover:scale-110" style={{ color: theme.light }}>
                  <FiX size={24} />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Student Information */}
                <div className="space-y-6">
                  <div className="rounded-2xl p-6 border-2" style={{ backgroundColor: theme.primaryBg + "60", borderColor: theme.border }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: theme.primary + "30" }}>
                        <FiUser size={18} style={{ color: theme.primary }} />
                      </div>
                      <h4 className="font-bold text-base" style={{ color: theme.dark }}>Student Information</h4>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        {selectedForm.profile ? (
                          <img src={`${backend_domain_name}/uploads/${selectedForm.profile}`} alt={selectedForm.name} className="w-16 h-16 rounded-full object-cover border-2" style={{ borderColor: theme.primary + "40" }} />
                        ) : (
                          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: theme.primary }}>
                            {selectedForm.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "AA"}
                          </div>
                        )}
                        <div>
                          <h5 className="font-bold text-lg" style={{ color: theme.dark }}>{selectedForm.name}</h5>
                          <p className="text-sm" style={{ color: theme.light }}>Grade {getGradeNumber(selectedForm.grade)} Applicant</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: theme.light }}>Age</label>
                          <p className="text-sm font-medium" style={{ color: theme.dark }}>{selectedForm.age || "N/A"}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: theme.light }}>Gender</label>
                          <p className="text-sm font-medium" style={{ color: theme.dark }}>{selectedForm.gender || "N/A"}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: theme.light }}>Phone</label>
                          <div className="flex items-center gap-1">
                            <FiPhone size={12} style={{ color: theme.light }} />
                            <p className="text-sm font-medium" style={{ color: theme.dark }}>{selectedForm.phone || "N/A"}</p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: theme.light }}>Email</label>
                          <div className="flex items-center gap-1">
                            <FiMail size={12} style={{ color: theme.light }} />
                            <p className="text-sm font-medium truncate" style={{ color: theme.dark }}>{selectedForm.email || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl p-6 border-2" style={{ backgroundColor: theme.primaryBg + "60", borderColor: theme.border }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: theme.primary + "30" }}>
                        <FiUserCheck size={18} style={{ color: theme.primary }} />
                      </div>
                      <h4 className="font-bold text-base" style={{ color: theme.dark }}>Guardian Information</h4>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.light }}>Guardian Name</label>
                        <p className="text-sm font-medium" style={{ color: theme.dark }}>{selectedForm.guardianName || "N/A"}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.light }}>Guardian Phone</label>
                        <div className="flex items-center gap-1">
                          <FiPhone size={12} style={{ color: theme.light }} />
                          <p className="text-sm font-medium" style={{ color: theme.dark }}>{selectedForm.guardianPhone || "N/A"}</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.light }}>Guardian Email</label>
                        <div className="flex items-center gap-1">
                          <FiMail size={12} style={{ color: theme.light }} />
                          <p className="text-sm font-medium" style={{ color: theme.dark }}>{selectedForm.guardianEmail || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl p-6 border-2" style={{ backgroundColor: theme.primaryBg + "60", borderColor: theme.border }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: theme.primary + "30" }}>
                        <FiFile size={18} style={{ color: theme.primary }} />
                      </div>
                      <h4 className="font-bold text-base" style={{ color: theme.dark }}>Supporting Documents</h4>
                    </div>

                    <div className="space-y-4">
                      <div className="text-sm" style={{ color: theme.dark }}>
                        <p className="mb-2">Previous School Documents:</p>
                        {parsePrevClassDocument(selectedForm.prevSchool_doc).length > 0 ? (
                          <div className="space-y-2">
                            {parsePrevClassDocument(selectedForm.prevSchool_doc).map((doc, index) => (
                              <div key={index} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: theme.white, borderColor: theme.border }}>
                                <span className="text-sm truncate" style={{ color: theme.dark }}>{doc}</span>
                                <a href={`${backend_domain_name}/uploads/${doc}`} target="_blank" rel="noopener noreferrer" className="px-2 py-1 text-xs rounded hover:bg-gray-100 transition-colors" style={{ color: theme.primary, border: `1px solid ${theme.primary}` }}>
                                  <FiDownload size={12} />
                                </a>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm" style={{ color: theme.light }}>No documents uploaded</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Actions & Exam Marks */}
                <div className="space-y-6">
                  <div className="rounded-2xl p-6 border-2" style={{ backgroundColor: theme.primaryBg + "60", borderColor: theme.border }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: theme.accent + "30" }}>
                        <FiCheckCircle size={18} style={{ color: theme.accent }} />
                      </div>
                      <h4 className="font-bold text-base" style={{ color: theme.dark }}>Application Status</h4>
                    </div>

                    <div className="space-y-4">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium" style={{ color: theme.dark }}>Current Status:</span>
                          <span className="px-3 py-1 rounded-full text-sm font-medium capitalize" style={{ 
                            backgroundColor: getStatusColor(selectedForm.status || "pending") + "20", 
                            color: getStatusColor(selectedForm.status || "pending") 
                          }}>
                            {selectedForm.status || "pending"}
                          </span>
                        </div>
                        
                        {!canChangeStatus(selectedForm.status || "pending") && (
                          <div className="p-3 rounded-lg mb-3" style={{ backgroundColor: theme.warning + "15", border: `1px solid ${theme.warning}30` }}>
                            <p className="text-sm flex items-center gap-2" style={{ color: theme.warning }}>
                              <FiAlertCircle size={16} />
                              This application has been finalized and cannot be changed.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => updateStatus("reviewing")} 
                          disabled={!canChangeStatus(selectedForm.status || "pending") || updatingFormId === selectedForm.id}
                          className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold border-2 rounded-xl transition-all duration-200 ${!canChangeStatus(selectedForm.status || "pending") ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                          style={{ 
                            backgroundColor: statusUpdate === "reviewing" ? "#3498DB" : theme.white, 
                            color: statusUpdate === "reviewing" ? theme.white : "#3498DB", 
                            borderColor: "#3498DB" 
                          }}
                        >
                          {updatingFormId === selectedForm.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: statusUpdate === "reviewing" ? theme.white : "#3498DB" }}></div>
                              Updating...
                            </>
                          ) : (
                            <>
                              <FiAlertCircle size={16} />
                              Under Review
                            </>
                          )}
                        </button>
                        
                        <button 
                          onClick={() => updateStatus("accepted")} 
                          disabled={!canChangeStatus(selectedForm.status || "pending") || updatingFormId === selectedForm.id}
                          className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold border-2 rounded-xl transition-all duration-200 ${!canChangeStatus(selectedForm.status || "pending") ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                          style={{ 
                            backgroundColor: statusUpdate === "accepted" ? theme.accent : theme.white, 
                            color: statusUpdate === "accepted" ? theme.white : theme.accent, 
                            borderColor: theme.accent 
                          }}
                        >
                          {updatingFormId === selectedForm.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: statusUpdate === "accepted" ? theme.white : theme.accent }}></div>
                              Updating...
                            </>
                          ) : (
                            <>
                              <FiCheck size={16} />
                              Accept
                            </>
                          )}
                        </button>
                        
                        <button 
                          onClick={() => updateStatus("rejected")} 
                          disabled={!canChangeStatus(selectedForm.status || "pending") || updatingFormId === selectedForm.id}
                          className={`col-span-2 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold border-2 rounded-xl transition-all duration-200 ${!canChangeStatus(selectedForm.status || "pending") ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                          style={{ 
                            backgroundColor: statusUpdate === "rejected" ? theme.danger : theme.white, 
                            color: statusUpdate === "rejected" ? theme.white : theme.danger, 
                            borderColor: theme.danger 
                          }}
                        >
                          {updatingFormId === selectedForm.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: statusUpdate === "rejected" ? theme.white : theme.danger }}></div>
                              Updating...
                            </>
                          ) : (
                            <>
                              <FiX size={16} />
                              Reject Application
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl p-6 border-2" style={{ backgroundColor: theme.primaryBg + "60", borderColor: theme.border }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: theme.warning + "30" }}>
                        <FiCalendar size={18} style={{ color: theme.warning }} />
                      </div>
                      <h4 className="font-bold text-base" style={{ color: theme.dark }}>Timeline</h4>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: theme.light }}>Submitted:</span>
                        <span className="text-sm font-medium" style={{ color: theme.dark }}>{formatDate(selectedForm.created_at)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: theme.light }}>Last Updated:</span>
                        <span className="text-sm font-medium" style={{ color: theme.dark }}>{formatDate(selectedForm.updated_at)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: theme.light }}>Current Status:</span>
                        <span className="text-sm font-medium capitalize" style={{ color: getStatusColor(selectedForm.status || "pending") }}>
                          {selectedForm.status || "pending"}
                          {!canChangeStatus(selectedForm.status || "pending") && " (Final)"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-10 pt-8 border-t-2" style={{ borderColor: theme.border }}>
                <button onClick={() => setShowReviewModal(false)} className="px-7 py-3 border-2 rounded-xl text-sm font-bold transition-all duration-200 hover:bg-gray-50 hover:scale-105 shadow-sm" style={{ backgroundColor: theme.white, borderColor: theme.border, color: theme.dark }}>
                  Close Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
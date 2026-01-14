"use client";

import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import {
  FiUser,
  FiUserPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiMail,
  FiPhone,
  FiBook,
  FiSave,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiMapPin,
  FiUserCheck,
  FiCheckCircle,
  FiAlertCircle,
  FiImage,
  FiFile,
  FiDollarSign,
  FiFileText,
  FiEye,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function StudentsManagementPage() {
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
  
  const profile = useSelector(store => store.profile.profile);

  const gradeOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const classOptions = ["A", "B", "C", "D", "E"];
  const genderOptions = [
    { id: "male", label: "Male" },
    { id: "female", label: "Female" },
    { id: "other", label: "Other" },
  ];

  const backend_domain_name = import.meta.env.VITE_BACKEND_DOMAIN_NAME;
  const [students, setStudents] = useState([]); // Currently displayed students
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10, // Number of items per page
    totalStudents: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [profilePreview, setProfilePreview] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [prevClassDocFiles, setPrevClassDocFiles] = useState([]);
  const [prevClassDocPreviews, setPrevClassDocPreviews] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);

  const [alertModal, setAlertModal] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    age: "",
    guardianPhone: "",
    guardianName: "",
    father_name: "",
    profile: "",
    class: "",
    grade: "",
    gender: "male",
    city: "",
    academic_year: new Date().getFullYear().toString(),
    prevClassDocument: "",
    annual_fee: "",
    remaining_fee: "",
  });

  const navigate = useNavigate();

  const showAlert = (type, title, message) => {
    setAlertModal({
      show: true,
      type,
      title,
      message,
    });

    setTimeout(() => {
      setAlertModal((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

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

  const fetchData = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    setError(null);
    try {
      // Calculate offset based on page number
      const offset = (page - 1) * pagination.limit;
      
      let url = `${backend_domain_name}api/user/getStudents/${profile.grade}`;
      // Add pagination and search parameters to the URL
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: offset.toString(),
      });
      
      if (search.trim()) {
        params.append('search', search.trim());
      }
      
      url += `?${params.toString()}`;
      
      console.log('Fetching from URL:', url); // Debug log

      const response = await axios.get(url, {
        withCredentials: true,
      });

      if (response.status === 200) {
        const responseData = response.data;
        console.log('API Response:', responseData); // Debug log
        
        // Assuming your API returns data in this structure
        // Adjust according to your actual API response structure
        const studentsData = responseData.data || responseData.students || [];
        const totalCount = responseData.total || responseData.count || studentsData.length;
        
        setStudents(studentsData);
        setPagination(prev => ({
          ...prev,
          currentPage: page,
          totalStudents: totalCount,
          totalPages: Math.ceil(totalCount / pagination.limit),
        }));
        
        console.log('Pagination state:', {
          currentPage: page,
          totalStudents: totalCount,
          totalPages: Math.ceil(totalCount / pagination.limit),
          limit: pagination.limit
        });
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to fetch students. Please try again.");
        setStudents([]);
      }
    } finally {
      setLoading(false);
    }
  }, [backend_domain_name, profile.grade, pagination.limit, navigate]);

  // Fetch data when component mounts or when search term changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(1, searchTerm);
    }, 500); // Debounce search by 500ms

    return () => clearTimeout(timer);
  }, [searchTerm, fetchData]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchData(page, searchTerm);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      age: "",
      guardianPhone: "",
      guardianName: "",
      father_name: "",
      profile: "",
      class: "",
      grade: "",
      gender: "male",
      city: "",
      academic_year: new Date().getFullYear().toString(),
      prevClassDocument: "",
      annual_fee: "",
      remaining_fee: "",
    });
    setProfilePreview("");
    setProfileImageFile(null);

    prevClassDocPreviews.forEach((preview) => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    });

    setPrevClassDocFiles([]);
    setPrevClassDocPreviews([]);
    setExistingDocuments([]);

    setIsCreating(false);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);

      const previewUrl = URL.createObjectURL(file);
      setProfilePreview(previewUrl);

      setFormData((prev) => ({
        ...prev,
        profile: file.name,
      }));
    }
  };

  const removeProfileImage = () => {
    if (profilePreview) {
      URL.revokeObjectURL(profilePreview);
    }
    setProfileImageFile(null);
    setProfilePreview("");
    setFormData((prev) => ({
      ...prev,
      profile: "",
    }));
  };

  const handlePrevClassDocChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setPrevClassDocFiles((prev) => [...prev, ...files]);

      const newPreviewUrls = files.map((file) => {
        if (file.type.startsWith("image/")) {
          return URL.createObjectURL(file);
        } else {
          return null;
        }
      });

      setPrevClassDocPreviews((prev) => [...prev, ...newPreviewUrls]);
      
      const allNewFiles = [...prevClassDocFiles, ...files];
      const fileNames = allNewFiles.map(file => file.name);
      
      const existingDocNames = existingDocuments.map(doc => 
        typeof doc === 'string' ? doc.split('/').pop() : doc
      );
      const allDocNames = [...existingDocNames, ...fileNames];
      
      setFormData((prev) => ({
        ...prev,
        prevClassDocument: JSON.stringify(allDocNames),
      }));
    }
  };

  const removePrevClassDoc = (index) => {
    if (prevClassDocPreviews[index]) {
      URL.revokeObjectURL(prevClassDocPreviews[index]);
    }

    setPrevClassDocFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });

    setPrevClassDocPreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    const remainingFiles = prevClassDocFiles.filter((_, i) => i !== index);
    const existingDocNames = existingDocuments.map(doc => 
      typeof doc === 'string' ? doc.split('/').pop() : doc
    );
    const allDocNames = [...existingDocNames, ...remainingFiles.map(file => file.name)];
    
    setFormData((prev) => ({
      ...prev,
      prevClassDocument: JSON.stringify(allDocNames),
    }));
  };

  const removeExistingDocument = (index) => {
    setExistingDocuments(prev => {
      const newDocs = [...prev];
      newDocs.splice(index, 1);
      return newDocs;
    });

    const remainingExistingDocs = existingDocuments.filter((_, i) => i !== index);
    const existingDocNames = remainingExistingDocs.map(doc => 
      typeof doc === 'string' ? doc.split('/').pop() : doc
    );
    const newFileNames = prevClassDocFiles.map(file => file.name);
    const allDocNames = [...existingDocNames, ...newFileNames];
    
    setFormData((prev) => ({
      ...prev,
      prevClassDocument: JSON.stringify(allDocNames),
    }));
  };

  const removeAllPrevClassDocs = () => {
    prevClassDocPreviews.forEach((preview) => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    });

    setPrevClassDocFiles([]);
    setPrevClassDocPreviews([]);
    
    const existingDocNames = existingDocuments.map(doc => 
      typeof doc === 'string' ? doc.split('/').pop() : doc
    );
    
    setFormData((prev) => ({
      ...prev,
      prevClassDocument: existingDocNames.length > 0 ? JSON.stringify(existingDocNames) : "",
    }));
  };

  const startEditStudent = (student) => {
    setFormData({
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      password: "",
      age: student.age || "",
      guardianPhone: student.guardianPhone || "",
      guardianName: student.guardianName || "",
      father_name: student.father_name || "",
      profile: student.profile || "",
      class: student.class || "",
      grade: student.grade || "",
      gender: student.gender || "male",
      city: student.city || "",
      academic_year: student.academic_year || new Date().getFullYear().toString(),
      prevClassDocument: student.prevClassDocument || "",
      annual_fee: student.annual_fee || "",
      remaining_fee: student.remaining_fee || "",
    });

    if (student.profile) {
      setProfilePreview(`${backend_domain_name}/uploads/${student.profile}`);
    }

    const parsedDocs = parsePrevClassDocument(student.prevClassDocument);
    const fullDocUrls = parsedDocs.map(doc => `${backend_domain_name}/uploads/${doc}`);
    setExistingDocuments(fullDocUrls);
    
    setPrevClassDocFiles([]);
    setPrevClassDocPreviews([]);

    setEditingId(student.id);
    setIsCreating(true);
  };

  const saveStudent = async () => {
    if (!formData.name || !formData.email || (!editingId && !formData.password)) {
      showAlert("error", "Validation Error", "Please fill in required fields (Name, Email, and Password)");
      return;
    }

    const formDataToSend = new FormData();

    const dataToSend = {
      ...formData,
      role: "student",
      id: editingId || undefined,
    };

    let finalDocNames = [];
    
    if (existingDocuments.length > 0) {
      const existingNames = existingDocuments.map(doc => 
        typeof doc === 'string' ? doc.split('/').pop() : doc
      );
      finalDocNames.push(...existingNames);
    }
    
    if (prevClassDocFiles.length > 0) {
      const newFileNames = prevClassDocFiles.map(file => file.name);
      finalDocNames.push(...newFileNames);
    }
    
    if (finalDocNames.length > 0) {
      dataToSend.prevClassDocument = JSON.stringify(finalDocNames);
    }

    Object.keys(dataToSend).forEach((key) => {
      if (dataToSend[key] !== "" && dataToSend[key] !== null && dataToSend[key] !== undefined) {
        formDataToSend.append(key, dataToSend[key]);
      }
    });

    if (profileImageFile) {
      formDataToSend.append("profile", profileImageFile);
    }

    prevClassDocFiles.forEach((file) => {
      formDataToSend.append("prevClassDocument", file);
    });

    try {
      let response;
      if (editingId) {
        response = await axios.post(`${backend_domain_name}api/user/updateUser`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
      } else {
        response = await axios.post(`${backend_domain_name}api/user/createUser`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
      }

      if (response.status === 200) {
        showAlert(
          "success",
          editingId ? "Student Updated" : "Student Created",
          editingId ? "Student has been updated successfully!" : "New student has been created successfully!"
        );
        // Refresh current page after save
        fetchData(pagination.currentPage, searchTerm);
        resetForm();
      } else {
        alert(response.data.message);
        throw new Error(response.data?.message || "Operation failed");
      }
    } catch (err) {
      if (err.response?.status === 400) {
        const errors = err.response.data.errors;
        let message = "";
        for (const key in errors) {
          message += `${key}: ${errors[key]}\n`;
        }
        alert(message);
      }

      console.error("Error saving student:", err);
      showAlert("error", "Operation Failed", err.response?.data?.message || "Failed to save student. Please try again.");
    }
  };

  const deleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await axios.get(`${backend_domain_name}api/user/deleteUser/${id}`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          showAlert("success", "Student Deleted", "Student has been deleted successfully!");
          // Refresh current page after deletion
          fetchData(pagination.currentPage, searchTerm);
        }
      } catch (err) {
        console.error("Error deleting student:", err);
        showAlert("error", "Delete Failed", "Failed to delete student. Please try again.");
      }
    }
  };

  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData((prev) => ({ ...prev, password }));
  };

  const toggleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((student) => student.id));
    }
  };

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents((prev) => (prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]));
  };

  const deleteSelectedStudents = async () => {
    if (selectedStudents.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedStudents.length} selected students?`)) {
      try {
        const deletePromises = selectedStudents.map((id) => axios.get(`${backend_domain_name}api/user/deleteStudent/${id}`));

        const results = await Promise.allSettled(deletePromises);
        const successfulDeletes = results.filter((result) => result.status === "fulfilled" && result.value.status === 200).length;

        const failedDeletes = results.length - successfulDeletes;

        if (successfulDeletes > 0) {
          showAlert("success", "Students Deleted", `${successfulDeletes} student${successfulDeletes > 1 ? "s" : ""} deleted successfully!`);
        }

        if (failedDeletes > 0) {
          showAlert("warning", "Partial Success", `${successfulDeletes} deleted, ${failedDeletes} failed. Please try again.`);
        }

        // Refresh current page after deletion
        fetchData(pagination.currentPage, searchTerm);
        setSelectedStudents([]);
      } catch (err) {
        console.error("Error deleting selected students:", err);
        showAlert("error", "Delete Failed", "Failed to delete selected students. Please try again.");
      }
    }
  };

  // View existing document
  const viewDocument = (docUrl) => {
    window.open(docUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.background }}>
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: theme.primary }}
          ></div>
          <p className="text-lg" style={{ color: theme.dark }}>
            Loading students...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.background }}>
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={() => fetchData(1, searchTerm)}
            className="px-6 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 border rounded-lg shadow-sm"
            style={{
              backgroundColor: theme.primary,
              color: theme.white,
              borderColor: theme.primary,
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: theme.background }}>
      {alertModal.show && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div
            className="rounded-xl border-2 shadow-2xl p-6 max-w-sm"
            style={{
              backgroundColor: theme.white,
              borderColor: alertModal.type === "success" ? theme.accent : theme.danger,
              borderLeftWidth: "6px",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-full ${alertModal.type === "success" ? "bg-green-100" : "bg-red-100"}`}
              >
                {alertModal.type === "success" ? (
                  <FiCheckCircle size={24} className="text-green-600" />
                ) : (
                  <FiAlertCircle size={24} className="text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-1" style={{ color: theme.dark }}>
                  {alertModal.title}
                </h4>
                <p className="text-sm" style={{ color: theme.light }}>
                  {alertModal.message}
                </p>
              </div>
              <button
                onClick={() => setAlertModal((prev) => ({ ...prev, show: false }))}
                className="p-1 hover:bg-gray-100 rounded"
                style={{ color: theme.light }}
              >
                <FiX size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: theme.dark }}>
              <FiBook className="inline-block mr-3" size={28} style={{ color: theme.primary }} />
              Students Management - Grade {profile.grade}
            </h1>
            <p className="text-sm" style={{ color: theme.light }}>
              Manage students for Grade {profile.grade}
            </p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="px-6 py-3 text-sm font-medium transition-all duration-200 hover:scale-105 border rounded-lg flex items-center gap-2 shadow-sm"
            style={{
              backgroundColor: theme.primary,
              color: theme.white,
              borderColor: theme.primary,
            }}
          >
            <FiUserPlus size={18} />
            Create New Student
          </button>
        </div>

        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex-1">
              <div className="relative">
                <FiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: theme.light }}
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search students by name, email, grade, class, city, or guardian..."
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

            {selectedStudents.length > 0 && (
              <button
                onClick={deleteSelectedStudents}
                className="px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-105 border rounded-lg flex items-center gap-2 shadow-sm"
                style={{
                  backgroundColor: theme.danger,
                  color: theme.white,
                  borderColor: theme.danger,
                }}
              >
                <FiTrash2 size={14} />
                Delete ({selectedStudents.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Rest of your JSX remains the same (the form modal and table) */}
      {/* The form modal code stays exactly the same */}

      {(isCreating || editingId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/20">
          {/* ... (Form modal JSX remains exactly the same) ... */}
        </div>
      )}

      <div className="bg-white rounded-xl border overflow-hidden shadow-sm" style={{ backgroundColor: theme.white }}>
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border }}>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: theme.dark }}>
              Students List - Grade {profile.grade}
              <span className="ml-2 text-sm font-normal" style={{ color: theme.light }}>
                ({pagination.totalStudents} students total)
              </span>
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: theme.light }}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: theme.background }}>
                <th className="p-4" style={{ width: "50px" }}>
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === students.length && students.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded"
                    style={{ accentColor: theme.primary }}
                  />
                </th>
                {[
                  { key: "name", label: "Student Name", width: "w-1/6" },
                  { key: "age", label: "Age", width: "w-1/12" },
                  { key: "grade", label: "Grade", width: "w-1/12" },
                  { key: "class", label: "Class", width: "w-1/12" },
                  { key: "guardianName", label: "Guardian", width: "w-1/6" },
                  { key: "email", label: "Email", width: "w-1/5" },
                  { key: "city", label: "City", width: "w-1/12" },
                  { key: "actions", label: "Actions", width: "w-1/6" },
                ].map((column) => (
                  <th
                    key={column.key}
                    className={`p-4 text-left text-xs font-medium uppercase tracking-wider ${column.width}`}
                    style={{
                      color: theme.light,
                      borderColor: theme.border,
                      borderBottom: `2px solid ${theme.primary}30`,
                    }}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student, index) => {
                  const prevDocs = parsePrevClassDocument(student.prevClassDocument);
                  const hasDocs = prevDocs.length > 0;
                  
                  return (
                    <tr
                      key={student.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                      style={{
                        borderColor: theme.border,
                        backgroundColor: index % 2 === 0 ? theme.white : theme.background,
                      }}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => toggleStudentSelection(student.id)}
                          className="rounded"
                          style={{ accentColor: theme.primary }}
                        />
                      </td>
                      <td className="p-4" style={{ borderColor: theme.border }}>
                        <div className="flex items-center gap-3">
                          {student.profile ? (
                            <img
                              src={`${backend_domain_name}/uploads/${student.profile}`}
                              alt={student.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                              style={{ backgroundColor: theme.primary }}
                            >
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-sm" style={{ color: theme.dark }}>
                              {student.name}
                            </div>
                            <div className="text-xs" style={{ color: theme.light }}>
                              Student
                              {hasDocs && (
                                <span className="ml-2 px-1.5 py-0.5 rounded text-xs" 
                                      style={{ backgroundColor: theme.primary + "20", color: theme.primary }}>
                                  {prevDocs.length} doc{prevDocs.length !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4" style={{ borderColor: theme.border }}>
                        <span className="text-sm font-medium" style={{ color: theme.dark }}>
                          {student.age || "-"}
                        </span>
                      </td>
                      <td className="p-4" style={{ borderColor: theme.border }}>
                        <span className="text-sm" style={{ color: theme.dark }}>
                          {student.grade || "-"}
                        </span>
                      </td>
                      <td className="p-4" style={{ borderColor: theme.border }}>
                        <span className="text-sm" style={{ color: theme.dark }}>
                          {student.class || "-"}
                        </span>
                      </td>
                      <td className="p-4" style={{ borderColor: theme.border }}>
                        <span className="text-sm" style={{ color: theme.dark }}>
                          {student.guardianName || "-"}
                        </span>
                      </td>
                      <td className="p-4" style={{ borderColor: theme.border }}>
                        <div className="flex items-center gap-2">
                          <FiMail size={12} style={{ color: theme.light }} />
                          <span className="text-sm truncate" style={{ color: theme.dark }}>
                            {student.email}
                          </span>
                        </div>
                      </td>
                      <td className="p-4" style={{ borderColor: theme.border }}>
                        <div className="flex items-center gap-2">
                          <FiMapPin size={12} style={{ color: theme.light }} />
                          <span className="text-sm" style={{ color: theme.dark }}>
                            {student.city || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4" style={{ borderColor: theme.border }}>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditStudent(student)}
                            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                            title="Edit"
                            style={{ color: theme.primary }}
                          >
                            <FiEdit size={14} />
                          </button>
                          <button
                            onClick={() => deleteStudent(student.id)}
                            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                            title="Delete"
                            style={{ color: theme.danger }}
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center">
                    <FiBook size={48} className="mx-auto mb-4" style={{ color: theme.lighter }} />
                    <p className="text-lg font-medium mb-2" style={{ color: theme.dark }}>
                      No students found
                    </p>
                    <p className="text-sm mb-4" style={{ color: theme.light }}>
                      {searchTerm ? "Try a different search term" : "Create your first student to get started"}
                    </p>
                    <button
                      onClick={() => setIsCreating(true)}
                      className="px-6 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-105 border rounded-lg shadow-sm"
                      style={{
                        backgroundColor: theme.primary,
                        color: theme.white,
                        borderColor: theme.primary,
                      }}
                    >
                      <FiUserPlus className="inline-block mr-2" />
                      Create New Student
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalStudents > 0 && (
          <div
            className="p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4"
            style={{ borderColor: theme.border }}
          >
            <div className="text-sm" style={{ color: theme.light }}>
              Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalStudents)} of {pagination.totalStudents}{" "}
              entries
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-100"
                style={{
                  backgroundColor: theme.white,
                  border: `1px solid ${theme.border}`,
                  color: theme.dark,
                }}
              >
                <FiChevronLeft size={16} />
              </button>

              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                      pagination.currentPage === pageNum ? "text-white shadow-sm" : "hover:bg-gray-100"
                    }`}
                    style={{
                      backgroundColor: pagination.currentPage === pageNum ? theme.primary : theme.white,
                      color: pagination.currentPage === pageNum ? theme.white : theme.dark,
                      border: `1px solid ${pagination.currentPage === pageNum ? theme.primary : theme.border}`,
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-100"
                style={{
                  backgroundColor: theme.white,
                  border: `1px solid ${theme.border}`,
                  color: theme.dark,
                }}
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
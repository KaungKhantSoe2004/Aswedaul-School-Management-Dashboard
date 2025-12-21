"use client"

import axios from "axios"
import { useState, useEffect, useMemo, useCallback } from "react"
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
  FiKey,
  FiActivity as FiUserCog,
  FiAward,
  FiUsers,
  FiBriefcase,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiMapPin,
  FiUserCheck,
  FiCheckCircle,
  FiAlertCircle,
  FiImage,
  FiUpload,
  FiFile,
  FiDollarSign,
  FiFileText,
} from "react-icons/fi"
import { useNavigate } from "react-router-dom"

export default function UsersCRUDPage() {
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
  }

  const userTypes = [
    {
      id: "student",
      label: "Student",
      icon: FiBook,
      description: "Enrolled students of the school",
      columns: [
        { key: "name", label: "Student Name", width: "w-1/6" },
        { key: "age", label: "Age", width: "w-1/12" },
        { key: "grade", label: "Grade", width: "w-1/12" },
        { key: "class", label: "Class", width: "w-1/12" },
        { key: "guardianName", label: "Guardian", width: "w-1/6" },
        { key: "email", label: "Email", width: "w-1/5" },
        { key: "city", label: "City", width: "w-1/12" },
        { key: "actions", label: "Actions", width: "w-1/6" },
      ],
    },
    {
      id: "teacher",
      label: "Teacher",
      icon: FiUserCog,
      description: "Teaching faculty members",
      columns: [
        { key: "name", label: "Teacher Name", width: "w-1/5" },
        { key: "subject", label: "Subject", width: "w-1/4" },
        { key: "classAssigned", label: "Classes", width: "w-1/6" },
        { key: "email", label: "Email", width: "w-1/5" },
        { key: "phone", label: "Phone", width: "w-1/6" },
        { key: "city", label: "City", width: "w-1/6" },
        { key: "actions", label: "Actions", width: "w-1/6" },
      ],
    },
    {
      id: "guideTeacher",
      label: "Guide Teacher",
      icon: FiAward,
      description: "Mentors for specific grades",
      columns: [
        { key: "name", label: "Guide Teacher", width: "w-1/5" },
        { key: "guidedGrade", label: "Guided Grade", width: "w-1/6" },
        { key: "studentsCount", label: "Students", width: "w-1/12" },
        { key: "email", label: "Email", width: "w-1/4" },
        { key: "phone", label: "Phone", width: "w-1/6" },
        { key: "city", label: "City", width: "w-1/6" },
        { key: "actions", label: "Actions", width: "w-1/6" },
      ],
    },
    {
      id: "manager",
      label: "Manager",
      icon: FiBriefcase,
      description: "Administrative managers",
      columns: [
        { key: "name", label: "Manager Name", width: "w-1/5" },
        { key: "department", label: "Department", width: "w-1/4" },
        { key: "reportsTo", label: "Reports To", width: "w-1/6" },
        { key: "email", label: "Email", width: "w-1/5" },
        { key: "phone", label: "Phone", width: "w-1/6" },
        { key: "city", label: "City", width: "w-1/6" },
        { key: "actions", label: "Actions", width: "w-1/6" },
      ],
    },
    {
      id: "admin",
      label: "Administrator",
      icon: FiKey,
      description: "System administrators",
      columns: [
        { key: "name", label: "Admin Name", width: "w-1/5" },
        { key: "permissions", label: "Permissions", width: "w-1/4" },
        { key: "accessLevel", label: "Access Level", width: "w-1/6" },
        { key: "email", label: "Email", width: "w-1/5" },
        { key: "phone", label: "Phone", width: "w-1/6" },
        { key: "city", label: "City", width: "w-1/6" },
        { key: "actions", label: "Actions", width: "w-1/6" },
      ],
    },
  ]

  const genderOptions = [
    { id: "male", label: "Male" },
    { id: "female", label: "Female" },
    { id: "other", label: "Other" },
  ]

  const gradeOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
  const classOptions = ["A", "B", "C", "D", "E"]

  const backend_domain_name = import.meta.env.VITE_BACKEND_DOMAIN_NAME
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 20,
    totalUsers: 0,
  })
  const [isEdit, setIsEdit] = useState(false)
  const [filteredType, setFilteredType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([])
  
  const [profilePreview, setProfilePreview] = useState("")
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [prevClassDocFiles, setPrevClassDocFiles] = useState([])
  const [prevClassDocPreviews, setPrevClassDocPreviews] = useState([])
  
  const [alertModal, setAlertModal] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "student",
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
    subject: "",
    classAssigned: "",
    guidedGrade: "",
    studentsCount: "",
    department: "",
    reportsTo: "",
    permissions: "",
    accessLevel: "",
    monthly_salary: "", // Added monthly salary field
  })
  const navigate = useNavigate();
  const showAlert = (type, title, message) => {
    setAlertModal({
      show: true,
      type,
      title,
      message,
    })

    setTimeout(() => {
      setAlertModal(prev => ({ ...prev, show: false }))
    }, 3000)
  }

  const fetchData = useCallback(
    async (page = 1, limit = 20, search = "") => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get(
          `${backend_domain_name}api/user/getUsers?page=${page}&limit=${limit}&search=${search}`,{
            withCredentials:true
          }
        )

        if (response.data && response.data.users) {
          setUsers(response.data.users)
          setPagination({
            currentPage: response.data.page || 1,
            totalPages:
              response.data.totalPages || Math.ceil((response.data.total || response.data.users.length) / limit),
            limit: response.data.limit || limit,
            totalUsers: response.data.total || response.data.users.length,
          })
        }
      } catch (err) {
        if(err.response.status == 401){
          navigate('/login')
        }
        console.error("Error fetching users:", err)
        setError("Failed to fetch users. Please try again.")
        setUsers([])
      } finally {
        setLoading(false)
      }
    },
    [backend_domain_name],
  )

  useEffect(() => {
    fetchData(pagination.currentPage, pagination.limit, searchTerm)
  }, [pagination.currentPage, fetchData])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== "") {
        fetchData(1, pagination.limit, searchTerm)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const filteredUsers = useMemo(() => {
    if (filteredType === "all") return users
    return users.filter((user) => user.role === filteredType)
  }, [users, filteredType])

  const getUserTypeDetails = (typeId) => {
    return userTypes.find((t) => t.id === typeId) || userTypes[0]
  }

  const getCurrentColumns = () => {
    if (filteredType === "all") {
      return [
        { key: "name", label: "Name", width: "w-1/5" },
        { key: "role", label: "Role", width: "w-1/6" },
        { key: "email", label: "Email", width: "w-1/4" },
        { key: "phone", label: "Phone", width: "w-1/6" },
        { key: "city", label: "City", width: "w-1/6" },
        { key: "actions", label: "Actions", width: "w-1/6" },
      ]
    }
    return getUserTypeDetails(filteredType).columns
  }

  const getCellContent = (user, columnKey) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-3">
            {user.profile ? (
              <img
                src={`${backend_domain_name}/uploads/${user.profile}`}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: theme.primary }}
              >
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            )}
            <div>
              <div className="font-medium text-sm" style={{ color: theme.dark }}>
                {user.name}
              </div>
              <div className="text-xs" style={{ color: theme.light }}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </div>
            </div>
          </div>
        )

      case "role":
      case "type":
        const typeDetails = getUserTypeDetails(user.role)
        const IconComponent = typeDetails.icon
        return (
          <div className="flex items-center gap-2">
            <IconComponent size={14} style={{ color: theme.primary }} />
            <span className="text-sm" style={{ color: theme.primary }}>
              {typeDetails.label}
            </span>
          </div>
        )

      case "email":
        return (
          <div className="flex items-center gap-2">
            <FiMail size={12} style={{ color: theme.light }} />
            <span className="text-sm truncate" style={{ color: theme.dark }}>
              {user.email}
            </span>
          </div>
        )

      case "phone":
        return user.phone ? (
          <div className="flex items-center gap-2">
            <FiPhone size={12} style={{ color: theme.light }} />
            <span className="text-sm" style={{ color: theme.dark }}>
              {user.phone || "-"}
            </span>
          </div>
        ) : (
          <span className="text-sm" style={{ color: theme.lighter }}>
            -
          </span>
        )

      case "age":
        return (
          <span className="text-sm font-medium" style={{ color: theme.dark }}>
            {user.age || "-"}
          </span>
        )

      case "grade":
        return (
          <span className="text-sm" style={{ color: theme.dark }}>
            {user.grade || "-"}
          </span>
        )

      case "class":
        return (
          <span className="text-sm" style={{ color: theme.dark }}>
            {user.class || "-"}
          </span>
        )

      case "guardianName":
        return (
          <span className="text-sm" style={{ color: theme.dark }}>
            {user.guardianName || "-"}
          </span>
        )

      case "city":
        return (
          <div className="flex items-center gap-2">
            <FiMapPin size={12} style={{ color: theme.light }} />
            <span className="text-sm" style={{ color: theme.dark }}>
              {user.city || "-"}
            </span>
          </div>
        )

      case "actions":
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => startEditUser(user)}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              title="Edit"
              style={{ color: theme.primary }}
            >
              <FiEdit size={14} />
            </button>
            <button
              onClick={() => deleteUser(user.id)}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              title="Delete"
              style={{ color: theme.danger }}
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        )

      default:
        const value = user[columnKey]
        return value ? (
          <span className="text-sm" style={{ color: theme.dark }}>
            {value}
          </span>
        ) : (
          <span className="text-sm" style={{ color: theme.lighter }}>
            -
          </span>
        )
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "student",
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
      subject: "",
      classAssigned: "",
      guidedGrade: "",
      studentsCount: "",
      department: "",
      reportsTo: "",
      permissions: "",
      accessLevel: "",
      monthly_salary: "",
    })
    setProfilePreview("")
    setProfileImageFile(null)
    
    prevClassDocPreviews.forEach(preview => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    })
    
    setPrevClassDocFiles([])
    setPrevClassDocPreviews([])
    
    setIsCreating(false)
    setEditingId(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRoleChange = (role) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        role,
        guardianName: role === "student" ? prev.guardianName : "",
        guardianPhone: role === "student" ? prev.guardianPhone : "",
        father_name: role === "student" ? prev.father_name : "",
        prevClassDocument: role === "student" ? prev.prevClassDocument : "",
        annual_fee: role === "student" ? prev.annual_fee : "",
        remaining_fee: role === "student" ? prev.remaining_fee : "",
        subject: role === "teacher" ? prev.subject : "",
        classAssigned: role === "teacher" ? prev.classAssigned : "",
        guidedGrade: role === "guideTeacher" ? prev.guidedGrade : "",
        studentsCount: role === "guideTeacher" ? prev.studentsCount : "",
        department: role === "manager" ? prev.department : "",
        reportsTo: role === "manager" ? prev.reportsTo : "",
        permissions: role === "admin" ? prev.permissions : "",
        accessLevel: role === "admin" ? prev.accessLevel : "",
        monthly_salary: role !== "student" ? prev.monthly_salary : "",
      }
      
      if (prev.role === "student" && role !== "student") {
        if (profilePreview) {
          URL.revokeObjectURL(profilePreview)
        }
        prevClassDocPreviews.forEach(preview => {
          if (preview) {
            URL.revokeObjectURL(preview)
          }
        })
        
        setProfilePreview("")
        setProfileImageFile(null)
        setPrevClassDocFiles([])
        setPrevClassDocPreviews([])
      }
      
      return newData
    })
  }

  const startCreateUser = () => {
    resetForm()
    setIsCreating(true)
  }

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImageFile(file)
      
      const previewUrl = URL.createObjectURL(file)
      setProfilePreview(previewUrl)
      
      setFormData((prev) => ({
        ...prev,
        profile: file.name,
      }))
    }
  }

  const removeProfileImage = () => {
    if (profilePreview) {
      URL.revokeObjectURL(profilePreview)
    }
    setProfileImageFile(null)
    setProfilePreview("")
    setFormData((prev) => ({
      ...prev,
      profile: "",
    }))
  }

  const handlePrevClassDocChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setPrevClassDocFiles(prev => [...prev, ...files])
      
      const newPreviewUrls = files.map(file => {
        if (file.type.startsWith('image/')) {
          return URL.createObjectURL(file)
        } else {
          return null
        }
      })
      
      setPrevClassDocPreviews(prev => [...prev, ...newPreviewUrls])
      
      const allFiles = [...prevClassDocFiles, ...files]
      const fileNames = allFiles.map(file => file.name).join(', ')
      setFormData((prev) => ({
        ...prev,
        prevClassDocument: fileNames,
      }))
    }
  }

  const removePrevClassDoc = (index) => {
    if (prevClassDocPreviews[index]) {
      URL.revokeObjectURL(prevClassDocPreviews[index])
    }
    
    setPrevClassDocFiles(prev => {
      const newFiles = [...prev]
      newFiles.splice(index, 1)
      return newFiles
    })
    
    setPrevClassDocPreviews(prev => {
      const newPreviews = [...prev]
      newPreviews.splice(index, 1)
      return newPreviews
    })
    
    const remainingFileNames = prevClassDocFiles
      .filter((_, i) => i !== index)
      .map(file => file.name)
      .join(', ')
      
    setFormData((prev) => ({
      ...prev,
      prevClassDocument: remainingFileNames,
    }))
  }

  const removeAllPrevClassDocs = () => {
    prevClassDocPreviews.forEach(preview => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    })
    
    setPrevClassDocFiles([])
    setPrevClassDocPreviews([])
    
    setFormData((prev) => ({
      ...prev,
      prevClassDocument: "",
    }))
  }

  const startEditUser = (user) => {
    console.log(user)
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "student",
      password: "",
      age: user.age || "",
      guardianPhone: user.guardianPhone || "",
      guardianName: user.guardianName || "",
      father_name: user.father_name || "",
      profile: user.profile || "",
      class: user.class || "",
      grade: user.grade || "",
      gender: user.gender || "male",
      city: user.city || "",
      academic_year: user.academic_year || new Date().getFullYear().toString(),
      prevClassDocument: user.prevClassDocument || "",
      annual_fee: user.annual_fee || "",
      remaining_fee: user.remaining_fee || "",
      subject: user.subject || "",
      classAssigned: user.classAssigned || "",
      guidedGrade: user.guidedGrade || "",
      studentsCount: user.studentsCount || "",
      department: user.department || "",
      reportsTo: user.reportsTo || "",
      permissions: user.permissions || "",
      accessLevel: user.accessLevel || "",
      monthly_salary: user.monthly_salary || "",
    })

    if (user.profile) {
      setProfilePreview(`${backend_domain_name}/uploads/${user.profile}`)
    }
    
    if (user.prevClassDocument) {
      setPrevClassDocFiles([])
      setPrevClassDocPreviews([])
    }
    
    setEditingId(user.id)
    setIsCreating(true)
  }

  const saveUser = async () => {
    console.log(formData)
    if (!formData.name || !formData.email || (!editingId && !formData.password)) {
      showAlert("error", "Validation Error", "Please fill in required fields (Name, Email, and Password)")
      return
    }

    // Check monthly salary for non-student roles
    if (formData.role !== "student" && !formData.monthly_salary) {
      showAlert("error", "Validation Error", "Monthly salary is required for this role")
      return
    }
    console.log("formdata is bro")

    const formDataToSend = new FormData()
    
    Object.keys(formData).forEach(key => {
      if (formData[key] !== "" && formData[key] !== null && formData[key] !== undefined) {
        formDataToSend.append(key, formData[key])
      }
    })
    formDataToSend.append("id", editingId)
    if (profileImageFile) {
      formDataToSend.append("profile", profileImageFile)
    }
    
    if (formData.role === "student") {
      prevClassDocFiles.forEach((file, index) => {
        formDataToSend.append(`prevClassDocument`, file)
      })
    }

    if (formData.role !== "student") {
      formDataToSend.delete("guardianName")
      formDataToSend.delete("guardianPhone")
      formDataToSend.delete("father_name")
      formDataToSend.delete("annual_fee")
      formDataToSend.delete("remaining_fee")
      formDataToSend.delete("prevClassDocument")
    }

    try {
      let response
      if (editingId) {
        response = await axios.post(
          `${backend_domain_name}api/user/updateUser`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
      } else {
        response = await axios.post(
          `${backend_domain_name}api/user/createUser`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials:true
          }
        )
        console.log(response,'is response bro')
      }
      
      if (response.status === 200) {
        showAlert(
          "success", 
          editingId ? "User Updated" : "User Created", 
          editingId ? "User has been updated successfully!" : "New user has been created successfully!"
        )
        fetchData(pagination.currentPage, pagination.limit, searchTerm)
        resetForm()
      } else {
        alert(response.data.message)
        throw new Error(response.data?.message || "Operation failed")
      }
    } catch (err) {
    if (err.response.status === 400) {
    const errors = err.response.data.errors;

    // Convert { field: message } into readable string
    let message = "";
    for (const key in errors) {
        message += `${key}: ${errors[key]}\n`;
    }

    alert(message);
     }

      console.error("Error saving user dude:", err);
      showAlert(
        "error", 
        "Operation Failed", 
        err.response?.data?.message || "Failed to save user. Please try again."
      )
      console.log("error showed")
    }
  }

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await axios.get(`${backend_domain_name}api/user/deleteUser/${id}`, {
        withCredentials:true
        })
        if (response.status === 200) {
          showAlert("success", "User Deleted", "User has been deleted successfully!")
          fetchData(pagination.currentPage, pagination.limit, searchTerm)
        }
      } catch (err) {
        console.error("Error deleting user:", err)
        showAlert("error", "Delete Failed", "Failed to delete user. Please try again.")
      }
    }
  }

  const generatePassword = () => {
    const length = 12
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setFormData((prev) => ({ ...prev, password }))
  }

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    }
  }

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const deleteSelectedUsers = async () => {
    if (selectedUsers.length === 0) return

    if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} selected users?`)) {
      try {
        const deletePromises = selectedUsers.map((id) => 
          axios.delete(`${backend_domain_name}api/user/deleteUser/${id}`)
        )
        
        const results = await Promise.allSettled(deletePromises)
        const successfulDeletes = results.filter(result => 
          result.status === 'fulfilled' && result.value.status === 200
        ).length
        
        const failedDeletes = results.length - successfulDeletes
        
        if (successfulDeletes > 0) {
          showAlert(
            "success", 
            "Users Deleted", 
            `${successfulDeletes} user${successfulDeletes > 1 ? 's' : ''} deleted successfully!`
          )
        }
        
        if (failedDeletes > 0) {
          showAlert(
            "warning", 
            "Partial Success", 
            `${successfulDeletes} deleted, ${failedDeletes} failed. Please try again.`
          )
        }
        
        fetchData(pagination.currentPage, pagination.limit, searchTerm)
        setSelectedUsers([])
      } catch (err) {
        console.error("Error deleting selected users:", err)
        showAlert("error", "Delete Failed", "Failed to delete selected users. Please try again.")
      }
    }
  }

  const userCounts = useMemo(() => {
    const counts = {}
    userTypes.forEach((type) => {
      counts[type.id] = users.filter((u) => u.role === type.id).length
    })
    counts.all = users.length
    return counts
  }, [users])

  const getTypeSpecificFields = () => {
    switch (formData.role) {
      case "student":
        return (
          <>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                  Age <span style={{ color: theme.danger }}>*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                  style={{
                    backgroundColor: theme.white,
                    borderColor: theme.border,
                    color: theme.dark,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.primary
                    e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.border
                    e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                  }}
                  placeholder="e.g., 15"
                  min="5"
                  max="25"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                  Grade <span style={{ color: theme.danger }}>*</span>
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                  style={{
                    backgroundColor: theme.white,
                    borderColor: theme.border,
                    color: theme.dark,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.primary
                    e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.border
                    e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                  }}
                  required
                >
                  <option value="">Select Grade</option>
                  {gradeOptions.map((grade) => (
                    <option key={grade} value={grade}>
                      Grade {grade}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                  Class
                </label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                  style={{
                    backgroundColor: theme.white,
                    borderColor: theme.border,
                    color: theme.dark,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.primary
                    e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.border
                    e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                  }}
                >
                  <option value="">Select Class</option>
                  {classOptions.map((classChar) => (
                    <option key={classChar} value={classChar}>
                      Class {classChar}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                  Gender <span style={{ color: theme.danger }}>*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                  style={{
                    backgroundColor: theme.white,
                    borderColor: theme.border,
                    color: theme.dark,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.primary
                    e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.border
                    e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                  }}
                  required
                >
                  {genderOptions.map((gender) => (
                    <option key={gender.id} value={gender.id}>
                      {gender.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t-2" style={{ borderColor: theme.border }}>
              <h5 className="font-bold text-sm mb-5 flex items-center gap-3" style={{ color: theme.dark }}>
                <div className="p-2.5 rounded-lg" style={{ backgroundColor: theme.primary + "20" }}>
                  <FiDollarSign size={16} style={{ color: theme.primary }} />
                </div>
                Fee Information
              </h5>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                    Annual Fee
                  </label>
                  <input
                    type="number"
                    name="annual_fee"
                    value={formData.annual_fee}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                    style={{
                      backgroundColor: theme.white,
                      borderColor: theme.border,
                      color: theme.dark,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.primary
                      e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.border
                      e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                    }}
                    placeholder="e.g., 50000"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                    Remaining Fee
                  </label>
                  <input
                    type="number"
                    name="remaining_fee"
                    value={formData.remaining_fee}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                    style={{
                      backgroundColor: theme.white,
                      borderColor: theme.border,
                      color: theme.dark,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.primary
                      e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.border
                      e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                    }}
                    placeholder="e.g., 25000"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t-2" style={{ borderColor: theme.border }}>
              <h5 className="font-bold text-sm mb-5 flex items-center gap-3" style={{ color: theme.dark }}>
                <div className="p-2.5 rounded-lg" style={{ backgroundColor: theme.primary + "20" }}>
                  <FiFile size={16} style={{ color: theme.primary }} />
                </div>
                Previous Class Documents
              </h5>

              <div className="space-y-4">
                {prevClassDocPreviews.length > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm font-medium" style={{ color: theme.dark }}>
                        Selected Documents ({prevClassDocPreviews.length})
                      </p>
                      <button
                        type="button"
                        onClick={removeAllPrevClassDocs}
                        className="text-xs px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                        style={{ color: theme.danger }}
                      >
                        Remove All
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {prevClassDocPreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <div 
                            className="border-2 rounded-lg p-2 hover:border-blue-300 transition-colors cursor-pointer"
                            style={{ 
                              borderColor: theme.border,
                              backgroundColor: theme.white 
                            }}
                            onClick={() => {
                              if (preview) {
                                window.open(preview, '_blank')
                              }
                            }}
                          >
                            {preview ? (
                              <div className="relative">
                                <img
                                  src={preview}
                                  alt={`Document ${index + 1}`}
                                  className="w-full h-20 object-cover rounded"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b">
                                  Image
                                </div>
                              </div>
                            ) : (
                              <div 
                                className="w-full h-20 rounded flex flex-col items-center justify-center"
                                style={{ backgroundColor: theme.primary + "10" }}
                              >
                                <FiFileText size={24} style={{ color: theme.primary }} />
                                <div className="text-xs mt-1 text-center" style={{ color: theme.dark }}>
                                  {prevClassDocFiles[index]?.name?.split('.').pop()?.toUpperCase() || 'DOC'}
                                </div>
                              </div>
                            )}
                            <div className="text-xs mt-1 truncate text-center" style={{ color: theme.dark }}>
                              {prevClassDocFiles[index]?.name || `Document ${index + 1}`}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              removePrevClassDoc(index)
                            }}
                            className="absolute -top-2 -right-2 p-1 rounded-full shadow-lg hover:scale-110 transition-transform"
                            style={{
                              backgroundColor: theme.danger,
                              color: theme.white,
                            }}
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <label className="block">
                  <div
                    className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{
                      borderColor: prevClassDocPreviews.length > 0 ? theme.primary : theme.border,
                      backgroundColor: prevClassDocPreviews.length > 0 ? theme.primary + "05" : theme.white,
                    }}
                  >
                    <FiFile
                      size={28}
                      className="mx-auto mb-3"
                      style={{ color: prevClassDocPreviews.length > 0 ? theme.primary : theme.light }}
                    />
                    <p className="text-sm font-medium mb-1" style={{ color: theme.dark }}>
                      {prevClassDocPreviews.length > 0 ? `Add More Documents` : "Upload Previous Class Documents"}
                    </p>
                    <p className="text-xs" style={{ color: theme.light }}>
                      Click to browse or drag & drop multiple files
                    </p>
                    <p className="text-xs mt-2" style={{ color: theme.lighter }}>
                      PDF, JPG, PNG, DOC, DOCX up to 10MB each
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handlePrevClassDocChange}
                    multiple
                    className="hidden"
                  />
                </label>
                
                {prevClassDocPreviews.length > 0 && (
                  <p className="text-xs text-center" style={{ color: theme.light }}>
                    You can select multiple files at once or add more files later
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t-2" style={{ borderColor: theme.border }}>
              <h5 className="font-bold text-sm mb-5 flex items-center gap-3" style={{ color: theme.dark }}>
                <div className="p-2.5 rounded-lg" style={{ backgroundColor: theme.primary + "20" }}>
                  <FiUserCheck size={16} style={{ color: theme.primary }} />
                </div>
                Guardian Information
              </h5>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                    Guardian Name
                  </label>
                  <input
                    type="text"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                    style={{
                      backgroundColor: theme.white,
                      borderColor: theme.border,
                      color: theme.dark,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.primary
                      e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.border
                      e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                    }}
                    placeholder="Guardian name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                    Guardian Phone
                  </label>
                  <input
                    type="tel"
                    name="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                    style={{
                      backgroundColor: theme.white,
                      borderColor: theme.border,
                      color: theme.dark,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.primary
                      e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.border
                      e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                    }}
                    placeholder="Guardian phone number"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                    Father's Name
                  </label>
                  <input
                    type="text"
                    name="father_name"
                    value={formData.father_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                    style={{
                      backgroundColor: theme.white,
                      borderColor: theme.border,
                      color: theme.dark,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.primary
                      e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.border
                      e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                    }}
                    placeholder="Father's name"
                  />
                </div>
              </div>
            </div>
          </>
        )

      case "teacher":
        return (
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
                placeholder="e.g., 30"
                min="18"
                max="70"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Grade
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
              >
                <option value="">Select Grade</option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>
                    Grade {grade}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
              >
                {genderOptions.map((gender) => (
                  <option key={gender.id} value={gender.id}>
                    {gender.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
                placeholder="e.g., Mathematics"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Classes Assigned
              </label>
              <input
                type="text"
                name="classAssigned"
                value={formData.classAssigned}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
                placeholder="e.g., 10A, 11B"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Monthly Salary <span style={{ color: theme.danger }}>*</span>
              </label>
              <input
                type="number"
                name="monthly_salary"
                value={formData.monthly_salary}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
                placeholder="e.g., 50000"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
        )

      case "guideTeacher":
        return (
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
                placeholder="e.g., 35"
                min="18"
                max="70"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Grade
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
              >
                <option value="">Select Grade</option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>
                    Grade {grade}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
              >
                {genderOptions.map((gender) => (
                  <option key={gender.id} value={gender.id}>
                    {gender.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Guided Grade
              </label>
              <input
                type="text"
                name="guidedGrade"
                value={formData.guidedGrade}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
                placeholder="e.g., Grade 10"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Number of Students
              </label>
              <input
                type="number"
                name="studentsCount"
                value={formData.studentsCount}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
                placeholder="e.g., 45"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Monthly Salary <span style={{ color: theme.danger }}>*</span>
              </label>
              <input
                type="number"
                name="monthly_salary"
                value={formData.monthly_salary}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
                placeholder="e.g., 55000"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
        )

      case "manager":
        return (
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
                placeholder="e.g., 40"
                min="18"
                max="70"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Grade
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
              >
                <option value="">Select Grade</option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>
                    Grade {grade}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
              >
                {genderOptions.map((gender) => (
                  <option key={gender.id} value={gender.id}>
                    {gender.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
                placeholder="e.g., Administration"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Reports To
              </label>
              <input
                type="text"
                name="reportsTo"
                value={formData.reportsTo}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
                placeholder="e.g., Principal"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Monthly Salary <span style={{ color: theme.danger }}>*</span>
              </label>
              <input
                type="number"
                name="monthly_salary"
                value={formData.monthly_salary}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
                placeholder="e.g., 75000"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
        )

      case "admin":
        return (
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
                placeholder="e.g., 35"
                min="18"
                max="70"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Grade
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
              >
                <option value="">Select Grade</option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>
                    Grade {grade}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
              >
                {genderOptions.map((gender) => (
                  <option key={gender.id} value={gender.id}>
                    {gender.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Permissions
              </label>
              <select
                name="permissions"
                value={formData.permissions}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
              >
                <option value="">Select Permissions</option>
                <option value="Read Only">Read Only</option>
                <option value="Standard">Standard</option>
                <option value="Full Access">Full Access</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Access Level
              </label>
              <select
                name="accessLevel"
                value={formData.accessLevel}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
              >
                <option value="">Select Access Level</option>
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                Monthly Salary <span style={{ color: theme.danger }}>*</span>
              </label>
              <input
                type="number"
                name="monthly_salary"
                value={formData.monthly_salary}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.primary
                  e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                }}
                placeholder="e.g., 80000"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.background }}>
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: theme.primary }}
          ></div>
          <p className="text-lg" style={{ color: theme.dark }}>
            Loading users...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.background }}>
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={() => fetchData(pagination.currentPage, pagination.limit, searchTerm)}
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
    )
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
                className={`p-3 rounded-full ${
                  alertModal.type === "success" ? "bg-green-100" : "bg-red-100"
                }`}
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
                onClick={() => setAlertModal(prev => ({ ...prev, show: false }))}
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
              <FiUsers className="inline-block mr-3" size={28} style={{ color: theme.primary }} />
              Users Management
            </h1>
            <p className="text-sm" style={{ color: theme.light }}>
              Create, Read, Update, and Delete user accounts
            </p>
          </div>
          <button
            onClick={startCreateUser}
            className="px-6 py-3 text-sm font-medium transition-all duration-200 hover:scale-105 border rounded-lg flex items-center gap-2 shadow-sm"
            style={{
              backgroundColor: theme.primary,
              color: theme.white,
              borderColor: theme.primary,
            }}
          >
            <FiUserPlus size={18} />
            Create New User
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          <div
            className="p-4 rounded-lg border text-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm"
            style={{
              backgroundColor: theme.white,
              borderColor: theme.border,
              borderTop: `4px solid ${theme.primary}`,
            }}
            onClick={() => setFilteredType("all")}
          >
            <FiUsers
              size={20}
              className="mx-auto mb-2"
              style={{
                color: filteredType === "all" ? theme.primary : theme.light,
              }}
            />
            <p className="text-lg font-bold mb-1" style={{ color: theme.dark }}>
              {pagination.totalUsers}
            </p>
            <p
              className="text-xs font-medium"
              style={{
                color: filteredType === "all" ? theme.primary : theme.light,
              }}
            >
              All Users
            </p>
          </div>
          {userTypes.map((type) => {
            const TypeIcon = type.icon
            const count = users.filter((u) => u.role === type.id).length
            return (
              <div
                key={type.id}
                className="p-4 rounded-lg border text-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  borderTop: `4px solid ${theme.primary}`,
                }}
                onClick={() => setFilteredType(type.id)}
              >
                <TypeIcon
                  size={20}
                  className="mx-auto mb-2"
                  style={{
                    color: filteredType === type.id ? theme.primary : theme.light,
                  }}
                />
                <p className="text-lg font-bold mb-1" style={{ color: theme.dark }}>
                  {count}
                </p>
                <p
                  className="text-xs font-medium"
                  style={{
                    color: filteredType === type.id ? theme.primary : theme.light,
                  }}
                >
                  {type.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilteredType("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filteredType === "all" ? "text-white shadow-sm" : ""
              }`}
              style={{
                backgroundColor: filteredType === "all" ? theme.primary : theme.primaryBg,
                color: filteredType === "all" ? theme.white : theme.primary,
                border: `1px solid ${filteredType === "all" ? theme.primary : theme.primary}30`,
              }}
            >
              All Users ({pagination.totalUsers})
            </button>
            {userTypes.map((type) => {
              const count = users.filter((u) => u.role === type.id).length
              return (
                <button
                  key={type.id}
                  onClick={() => setFilteredType(type.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filteredType === type.id ? "text-white shadow-sm" : ""
                  }`}
                  style={{
                    backgroundColor: filteredType === type.id ? theme.primary : theme.primaryBg,
                    color: filteredType === type.id ? theme.white : theme.primary,
                    border: `1px solid ${filteredType === type.id ? theme.primary : theme.primary}30`,
                  }}
                >
                  {type.label} ({count})
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: theme.light }}
                size={18}
              />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 border rounded-lg w-full md:w-64 text-sm focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                  focusRingColor: theme.primary,
                }}
              />
            </div>

            {selectedUsers.length > 0 && (
              <button
                onClick={deleteSelectedUsers}
                className="px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-105 border rounded-lg flex items-center gap-2 shadow-sm"
                style={{
                  backgroundColor: theme.danger,
                  color: theme.white,
                  borderColor: theme.danger,
                }}
              >
                <FiTrash2 size={14} />
                Delete ({selectedUsers.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {(isCreating || editingId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/20">
          <div
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border-2"
            style={{
              backgroundColor: theme.white,
              borderColor: theme.border,
            }}
          >
            <div
              className="p-8 rounded-t-2xl border-b-2"
              style={{
                backgroundImage: `linear-gradient(135deg, ${theme.primary}10 0%, ${theme.primary}05 100%)`,
                borderColor: theme.border,
              }}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <div
                      className="p-3 rounded-2xl shadow-sm"
                      style={{
                        backgroundColor: theme.primary + "25",
                        border: `2px solid ${theme.primary}40`,
                      }}
                    >
                      <FiUserPlus size={24} style={{ color: theme.primary }} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold" style={{ color: theme.dark }}>
                        {editingId ? "Edit User Profile" : "Create New User"}
                      </h3>
                      <p className="text-sm font-medium mt-1" style={{ color: theme.light }}>
                        {editingId ? "Update user information and settings" : "Add a new user to the system"}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="p-3 rounded-xl hover:bg-white/50 transition-colors duration-200 hover:scale-110"
                  style={{ color: theme.light }}
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div
                    className="rounded-2xl p-6 border-2"
                    style={{
                      backgroundColor: theme.primaryBg + "60",
                      borderColor: theme.border,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: theme.primary + "30" }}>
                        <FiUser size={18} style={{ color: theme.primary }} />
                      </div>
                      <h4 className="font-bold text-base" style={{ color: theme.dark }}>
                        Basic Information
                      </h4>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                          Full Name <span style={{ color: theme.danger }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                          style={{
                            backgroundColor: theme.white,
                            borderColor: theme.border,
                            color: theme.dark,
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = theme.primary
                            e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = theme.border
                            e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                          }}
                          placeholder="Enter full name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                          Email Address <span style={{ color: theme.danger }}>*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                          style={{
                            backgroundColor: theme.white,
                            borderColor: theme.border,
                            color: theme.dark,
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = theme.primary
                            e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = theme.border
                            e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                          }}
                          placeholder="Enter email address"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                          Phone Number <span style={{ color: theme.danger }}>*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                          style={{
                            backgroundColor: theme.white,
                            borderColor: theme.border,
                            color: theme.dark,
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = theme.primary
                            e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = theme.border
                            e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                          }}
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    className="rounded-2xl p-6 border-2"
                    style={{
                      backgroundColor: theme.primaryBg + "60",
                      borderColor: theme.border,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: theme.primary + "30" }}>
                        <FiMapPin size={18} style={{ color: theme.primary }} />
                      </div>
                      <h4 className="font-bold text-base" style={{ color: theme.dark }}>
                        Location Information
                      </h4>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                          style={{
                            backgroundColor: theme.white,
                            borderColor: theme.border,
                            color: theme.dark,
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = theme.primary
                            e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = theme.border
                            e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                          }}
                          placeholder="Enter city"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                          Academic Year <span style={{ color: theme.danger }}>*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <FiCalendar size={16} style={{ color: theme.light }} />
                          <input
                            type="text"
                            name="academic_year"
                            value={formData.academic_year}
                            onChange={handleInputChange}
                            className="flex-1 px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                            style={{
                              backgroundColor: theme.white,
                              borderColor: theme.border,
                              color: theme.dark,
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = theme.primary
                              e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = theme.border
                              e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                            }}
                            placeholder="e.g., 2024"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div
                    className="rounded-2xl p-6 border-2"
                    style={{
                      backgroundColor: theme.primaryBg + "60",
                      borderColor: theme.border,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: theme.primary + "30" }}>
                        <FiKey size={18} style={{ color: theme.primary }} />
                      </div>
                      <h4 className="font-bold text-base" style={{ color: theme.dark }}>
                        Account Settings
                      </h4>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                          User Role <span style={{ color: theme.danger }}>*</span>
                        </label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={(e) => handleRoleChange(e.target.value)}
                          className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 shadow-sm"
                          style={{
                            backgroundColor: theme.white,
                            borderColor: theme.border,
                            color: theme.dark,
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = theme.primary
                            e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = theme.border
                            e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                          }}
                          disabled={editingId ? true : false}
                          required
                        >
                          {userTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                          Profile Image
                        </label>
                        <div className="space-y-4">
                          {profilePreview && (
                            <div className="flex flex-col items-center gap-3">
                              <div className="relative">
                                <img
                                  src={profilePreview}
                                  alt="Profile preview"
                                  className="w-24 h-24 rounded-full object-cover border-4"
                                  style={{ borderColor: theme.primary + "40" }}
                                />
                                <button
                                  type="button"
                                  onClick={removeProfileImage}
                                  className="absolute -top-2 -right-2 p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform"
                                  style={{
                                    backgroundColor: theme.danger,
                                    color: theme.white,
                                  }}
                                >
                                  <FiX size={14} />
                                </button>
                              </div>
                              <p className="text-xs text-center" style={{ color: theme.light }}>
                                Click image to change
                              </p>
                            </div>
                          )}

                          <label className="block">
                            <div
                              className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                              style={{
                                borderColor: profilePreview ? theme.primary : theme.border,
                                backgroundColor: profilePreview ? theme.primary + "05" : theme.white,
                              }}
                            >
                              <FiImage
                                size={28}
                                className="mx-auto mb-3"
                                style={{ color: profilePreview ? theme.primary : theme.light }}
                              />
                              <p className="text-sm font-medium mb-1" style={{ color: theme.dark }}>
                                {profilePreview ? "Change Profile Image" : "Upload Profile Image"}
                              </p>
                              <p className="text-xs" style={{ color: theme.light }}>
                                Click to browse or drag & drop
                              </p>
                              <p className="text-xs mt-2" style={{ color: theme.lighter }}>
                                JPG, PNG, GIF up to 5MB
                              </p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleProfileImageChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold mb-2.5" style={{ color: theme.dark }}>
                          Password {!editingId && <span style={{ color: theme.danger }}>*</span>}
                        </label>
                        <div className="space-y-3.5">
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 rounded-xl text-sm pr-20 focus:outline-none transition-all duration-300 shadow-sm"
                              style={{
                                backgroundColor: theme.white,
                                borderColor: theme.border,
                                color: theme.dark,
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = theme.primary
                                e.target.style.boxShadow = `0 0 0 3px ${theme.primary}20`
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = theme.border
                                e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
                              }}
                              placeholder={editingId ? "Leave blank to keep current" : "Enter secure password"}
                              required={!editingId}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 hover:scale-110 shadow-sm"
                              style={{
                                backgroundColor: theme.primary,
                                color: theme.white,
                              }}
                            >
                              {showPassword ? "Hide" : "Show"}
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={generatePassword}
                            className="w-full px-4 py-3 text-sm font-bold rounded-xl border-2 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2.5 shadow-sm"
                            style={{
                              backgroundColor: theme.white,
                              borderColor: theme.primary,
                              color: theme.primary,
                            }}
                          >
                            <FiKey size={16} />
                            Generate Secure Password
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="rounded-2xl p-6 border-2"
                    style={{
                      backgroundColor: theme.primaryBg + "60",
                      borderColor: theme.border,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      {(() => {
                        const typeDetails = getUserTypeDetails(formData.role)
                        const IconComponent = typeDetails.icon
                        return (
                          <>
                            <div className="p-3 rounded-xl" style={{ backgroundColor: theme.primary + "30" }}>
                              <IconComponent size={18} style={{ color: theme.primary }} />
                            </div>
                            <div>
                              <h4 className="font-bold text-base" style={{ color: theme.dark }}>
                                {typeDetails.label} Information
                              </h4>
                              <p className="text-xs mt-0.5 font-medium" style={{ color: theme.light }}>
                                {typeDetails.description}
                              </p>
                            </div>
                          </>
                        )
                      })()}
                    </div>

                    <div>{getTypeSpecificFields()}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-10 pt-8 border-t-2" style={{ borderColor: theme.border }}>
                <button
                  onClick={resetForm}
                  className="px-7 py-3 border-2 rounded-xl text-sm font-bold transition-all duration-200 hover:bg-gray-50 hover:scale-105 shadow-sm"
                  style={{
                    backgroundColor: theme.white,
                    borderColor: theme.border,
                    color: theme.dark,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={saveUser}
                  className="px-7 py-3 text-sm font-bold transition-all duration-200 hover:scale-105 border-2 rounded-xl flex items-center justify-center gap-2.5 shadow-md"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.white,
                    borderColor: theme.primary,
                  }}
                >
                  <FiSave size={18} />
                  {editingId ? "Update User" : "Create User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border overflow-hidden shadow-sm" style={{ backgroundColor: theme.white }}>
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border }}>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: theme.dark }}>
              {filteredType === "all" ? "All Users" : getUserTypeDetails(filteredType)?.label || "Users"}
              <span className="ml-2 text-sm font-normal" style={{ color: theme.light }}>
                ({filteredUsers.length} users found)
              </span>
            </h3>
            {filteredType !== "all" && (
              <p className="text-xs mt-1" style={{ color: theme.light }}>
                {getUserTypeDetails(filteredType).description}
              </p>
            )}
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
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded"
                    style={{ accentColor: theme.primary }}
                  />
                </th>
                {getCurrentColumns().map((column) => (
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                    style={{
                      borderColor: theme.border,
                      backgroundColor: index % 2 === 0 ? theme.white : theme.background,
                    }}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="rounded"
                        style={{ accentColor: theme.primary }}
                      />
                    </td>
                    {getCurrentColumns().map((column) => (
                      <td key={`${user.id}-${column.key}`} className="p-4" style={{ borderColor: theme.border }}>
                        {getCellContent(user, column.key)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={getCurrentColumns().length + 1} className="p-8 text-center">
                    <FiUsers size={48} className="mx-auto mb-4" style={{ color: theme.lighter }} />
                    <p className="text-lg font-medium mb-2" style={{ color: theme.dark }}>
                      No users found
                    </p>
                    <p className="text-sm mb-4" style={{ color: theme.light }}>
                      {searchTerm ? "Try a different search term" : "Create your first user to get started"}
                    </p>
                    <button
                      onClick={startCreateUser}
                      className="px-6 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-105 border rounded-lg shadow-sm"
                      style={{
                        backgroundColor: theme.primary,
                        color: theme.white,
                        borderColor: theme.primary,
                      }}
                    >
                      <FiUserPlus className="inline-block mr-2" />
                      Create New User
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalUsers > 0 && (
          <div
            className="p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4"
            style={{ borderColor: theme.border }}
          >
            <div className="text-sm" style={{ color: theme.light }}>
              Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalUsers)} of {pagination.totalUsers}{" "}
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
                let pageNum
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i
                } else {
                  pageNum = pagination.currentPage - 2 + i
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
                )
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
  )
}
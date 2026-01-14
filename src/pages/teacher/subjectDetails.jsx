"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FiBook,
  FiUpload,
  FiVideo,
  FiLink,
  FiFileText,
  FiBell,
  FiUsers,
  FiEdit,
  FiTrash2,
  FiSave,
  FiX,
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiBookOpen,
  FiCalendar,
  FiExternalLink,
  FiClock,
  FiMessageSquare,
  FiCheckCircle,
  FiAlertTriangle,
  FiBarChart2,
  FiTrendingUp,
  FiPlus,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";

// === MaterialsTab Component ===
const MaterialsTab = ({ subject, theme, formatDate, setMaterials, materials }) => {
  const admin_backend_domain_name = import.meta.env.VITE_ADMIN_BACKEND_DOMAIN_NAME;
  const { id: subject_id } = useParams();
 
  

  const [newMaterial, setNewMaterial] = useState({
   "subjectId" :  subject_id,
    title: "",
    type: "video",
    url: "",
    description: "",
  });
  const [editingMaterialId, setEditingMaterialId] = useState(null);
  const [materialsFilter, setMaterialsFilter] = useState('all');
  
  // Filter materials based on type
  const filteredMaterials = materialsFilter === 'all' 
    ? materials 
    : materials.filter(mat => mat.type === materialsFilter);
    
  const getMaterialTypeInfo = (type) => {
    switch (type) {
      case "video":
        return { 
          icon: FiVideo, 
          color: "#DC2626", 
          label: "Video Lesson",
          bgColor: "#FEF2F2",
          badgeBg: "bg-red-100",
          badgeText: "text-red-800"
        };
      case "file":
        return { 
          icon: FiFileText, 
          color: "#2563EB", 
          label: "Document",
          bgColor: "#EFF6FF",
          badgeBg: "bg-blue-100",
          badgeText: "text-blue-800"
        };
      case "web":
        return { 
          icon: FiLink, 
          color: "#059669", 
          label: "Web Resource",
          bgColor: "#F0FDF4",
          badgeBg: "bg-green-100",
          badgeText: "text-green-800"
        };
      default:
        return { 
          icon: FiFileText, 
          color: theme.light, 
          label: "File",
          bgColor: "#F8FAFC",
          badgeBg: "bg-gray-100",
          badgeText: "text-gray-800"
        };
    }
  };
  
  const handleInputChange = useCallback((field, value) => {
    setNewMaterial(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleTypeChange = useCallback((type) => {
    setNewMaterial(prev => ({
      ...prev,
      type
    }));
  }, []);

  const handleAddMaterial = async () => {
    if (!newMaterial.title || !newMaterial.url || !newMaterial.description) return;
    console.log(newMaterial, 'is new material')
    try {
      const newMaterialData = {
        id: Date.now().toString(),
        ...newMaterial,
        uploadedDate: new Date().toISOString(),
        downloads: 0,
        clicks: 0,
      };

      const updatedMaterials = [newMaterialData, ...materials];
      
      const response = await axios.post(`${admin_backend_domain_name}api/admin/addStudyMaterial`, newMaterial , {
        withCredentials:true
      }
      );
      console.log(response, 'is response bro');

      if (response.status === 200) {
        setMaterials(updatedMaterials);
        setNewMaterial({ title: "", type: "video", url: "", description: "" });
      }
    } catch (error) {
      console.error("Error adding material:", error);
      alert("Error adding material");
    }
  };

  const handleUpdateMaterial = async () => {
    if (!newMaterial.title || !newMaterial.url || !editingMaterialId || !newMaterial.description) return;
    try {
      const updatedMaterials = materials.map(mat =>
        mat.id === editingMaterialId ? { ...mat, ...newMaterial } : mat
      );
 
      const response = await axios.post(
        `${admin_backend_domain_name}api/admin/updateStudyMaterial`,
        {
        id: editingMaterialId, 
        subjectId: subject_id,
        ...newMaterial
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log('updated it')
        setMaterials(updatedMaterials);
        setEditingMaterialId(null);
        setNewMaterial({ title: "", type: "video", url: "", description: "" });
      }
    } catch (error) {
      console.error("Error updating material:", error);
      alert("Error updating material");
    }
  };

  const handleDeleteMaterial = async (id, type) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      
      try {
        const updatedMaterials = materials.filter(mat => mat.id !== id);
        const response = await axios.post(`${admin_backend_domain_name}api/admin/deleteStudyMaterial`, {
          id, type, subjectId: subject_id
        } , {
         withCredentials:true
        }
        );
      console.log(response, 'is response bro');

        if (response.status === 200) {
          setMaterials(updatedMaterials);
        }
      } catch (error) {
        console.error("Error deleting material:", error);
        alert("Error deleting material");
      }
    }
  };

  const handleEditMaterial = useCallback((material) => {
    setNewMaterial(material);
    setEditingMaterialId(material.id);
  }, []);

  // Memoized form inputs
  const TitleInput = React.memo(({ value, onChange }) => (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
        Material Title *
      </label>
      <div className="relative">
        <FiBook className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: theme.light }} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter a descriptive title..."
          className="w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-offset-1 transition-all"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.dark,
            outlineColor: theme.primary
          }}
        />
      </div>
    </div>
  ));

  const UrlInput = React.memo(({ value, onChange, type }) => (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
        Resource URL *
      </label>
      <div className="relative">
        <FiLink className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: theme.light }} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            type === 'video' 
              ? 'https://youtube.com/watch?v=...'
              : type === 'file'
              ? 'https://drive.google.com/file/...'
              : 'https://example.com/learning-resource'
          }
          className="w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-offset-1 transition-all"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.dark,
            outlineColor: theme.primary
          }}
        />
      </div>
    </div>
  ));

  const DescriptionInput = React.memo(({ value, onChange }) => (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
        Description
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Provide a brief description of this material..."
        rows="5"
        className="w-full p-4 border rounded-xl text-sm focus:ring-2 focus:ring-offset-1 transition-all"
        style={{
          backgroundColor: theme.background,
          borderColor: theme.border,
          color: theme.dark,
          outlineColor: theme.primary
        }}
      />
    </div>
  ));

  const TypeButton = React.memo(({ type, label, icon: Icon, color, isActive, onClick }) => (
    <button
      type="button"
      onClick={() => onClick(type)}
      className={`p-4 border rounded-xl flex flex-col items-center gap-3 transition-all duration-200 ${isActive ? 'ring-2 ring-offset-2' : 'hover:border-blue-300'}`}
      style={{
        backgroundColor: isActive ? color + '10' : theme.white,
        borderColor: isActive ? color : theme.border,
        color: isActive ? color : theme.dark,
        ringColor: color
      }}
    >
      <Icon size={20} />
      <span className="text-xs font-medium">{label}</span>
    </button>
  ));

  return (
    <div className="space-y-8">
      {/* Materials Stats & Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-l-4" 
            style={{ 
              backgroundColor: theme.white, 
              borderColor: theme.border,
              borderLeftColor: theme.primary
            }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: theme.light }}>Total Materials</p>
              <p className="text-3xl font-bold mt-1" style={{ color: theme.dark }}>{materials.length}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: theme.primaryBg }}>
              <FiBook size={24} style={{ color: theme.primary }} />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-l-4" 
            style={{ 
              backgroundColor: theme.white, 
              borderColor: theme.border,
              borderLeftColor: "#059669"
            }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: theme.light }}>Last Updated</p>
              <p className="text-lg font-bold mt-1" style={{ color: "#059669" }}>
                  {formatDate(subject.updated_at)}
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: "#F0FDF4" }}>
              <FiClock size={24} style={{ color: "#059669" }} />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-l-4" 
            style={{ 
              backgroundColor: theme.white, 
              borderColor: theme.border,
              borderLeftColor: "#2563EB"
            }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: theme.light }}>Academic Year</p>
              <p className="text-lg font-bold mt-1" style={{ color: "#2563EB" }}>
                {subject.academic_year || "N/A"}
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: "#EFF6FF" }}>
              <FiCalendar size={24} style={{ color: "#2563EB" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Material Form */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border p-6" 
          style={{ borderColor: theme.border }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold" style={{ color: theme.dark }}>
              {editingMaterialId ? "📝 Edit Material" : "➕ Add New Learning Material"}
            </h3>
            <p className="text-sm mt-1" style={{ color: theme.light }}>
              {editingMaterialId 
                ? "Update your material information" 
                : "Share educational resources with your students"}
            </p>
          </div>
          {editingMaterialId && (
            <button
              onClick={() => {
                setEditingMaterialId(null);
                setNewMaterial({
                  title: "",
                  type: "video",
                  url: "",
                  description: "",
                });
              }}
              className="px-4 py-2 text-sm font-medium rounded-lg border flex items-center gap-2 hover:scale-105 transition-transform"
              style={{
                backgroundColor: theme.white,
                borderColor: theme.border,
                color: theme.dark,
              }}
            >
              <FiX size={14} />
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            {/* Material Type Selection */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: theme.dark }}>
                Material Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: 'video', label: 'Video', icon: FiVideo, color: '#DC2626' },
                  { type: 'file', label: 'Document', icon: FiFileText, color: '#2563EB' },
                  { type: 'web', label: 'Web Link', icon: FiLink, color: '#059669' }
                ].map((item) => (
                  <TypeButton
                    key={item.type}
                    type={item.type}
                    label={item.label}
                    icon={item.icon}
                    color={item.color}
                    isActive={newMaterial.type === item.type}
                    onClick={handleTypeChange}
                  />
                ))}
              </div>
            </div>

            {/* Title Input */}
            <TitleInput 
              value={newMaterial.title}
              onChange={(value) => handleInputChange('title', value)}
            />

            {/* URL Input */}
            <UrlInput 
              value={newMaterial.url}
              onChange={(value) => handleInputChange('url', value)}
              type={newMaterial.type}
            />
          </div>

          <div className="space-y-5">
            {/* Description */}
            <DescriptionInput 
              value={newMaterial.description}
              onChange={(value) => handleInputChange('description', value)}
            />

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={editingMaterialId ? handleUpdateMaterial : handleAddMaterial}
                disabled={!newMaterial.title || !newMaterial.url}
                className="w-full py-3 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  backgroundColor: theme.primary,
                  color: theme.white,
                  boxShadow: `0 4px 12px ${theme.primary}30`,
                }}
              >
                {editingMaterialId ? (
                  <>
                    <FiSave size={16} />
                    Update Material
                  </>
                ) : (
                  <>
                    <FiUpload size={16} />
                    Publish Material
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Materials Filter & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: theme.dark }}>
            Your Learning Materials
          </h3>
          <p className="text-sm mt-1" style={{ color: theme.light }}>
            {filteredMaterials.length} materials available • Sorted by latest
          </p>
        </div>
        
        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setMaterialsFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${materialsFilter === 'all' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
            style={{
              color: materialsFilter === 'all' ? theme.primary : theme.light,
            }}
          >
            All
          </button>
          <button
            onClick={() => setMaterialsFilter('video')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${materialsFilter === 'video' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
            style={{
              color: materialsFilter === 'video' ? '#DC2626' : theme.light,
            }}
          >
            <FiVideo className="inline mr-1" size={12} />
            Videos
          </button>
          <button
            onClick={() => setMaterialsFilter('file')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${materialsFilter === 'file' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
            style={{
              color: materialsFilter === 'file' ? '#2563EB' : theme.light,
            }}
          >
            <FiFileText className="inline mr-1" size={12} />
            Files
          </button>
          <button
            onClick={() => setMaterialsFilter('web')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${materialsFilter === 'web' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
            style={{
              color: materialsFilter === 'web' ? '#059669' : theme.light,
            }}
          >
            <FiLink className="inline mr-1" size={12} />
            Links
          </button>
        </div>
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-2xl" 
            style={{ borderColor: theme.border, backgroundColor: theme.background }}>
          <div className="mb-4">
            <FiBookOpen size={48} style={{ color: theme.light + '40' }} />
          </div>
          <h4 className="font-medium text-lg mb-2" style={{ color: theme.dark }}>
            No materials found
          </h4>
          <p className="text-sm mb-4" style={{ color: theme.light }}>
            {materialsFilter === 'all' 
              ? 'Start by adding your first learning material above'
              : `No ${materialsFilter} materials available`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMaterials?.map((material) => {
            const typeInfo = getMaterialTypeInfo(material.type);
            const Icon = typeInfo.icon;
            
            return (
              <div
                key={`${material.id}.${material.type}`}
                className="group relative p-5 border rounded-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                {/* Top Section with Type Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg" style={{ backgroundColor: typeInfo.bgColor }}>
                      <Icon size={18} style={{ color: typeInfo.color }} />
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${typeInfo.badgeBg} ${typeInfo.badgeText}`}>
                      {typeInfo.label}
                    </span>
                  </div>
                  <div className="text-xs font-medium" style={{ color: theme.lighter }}>
                    {formatDate(material.uploadedDate)}
                  </div>
                </div>

                {/* Material Title */}
                <h4
                  className="font-semibold text-base mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors"
                  style={{ color: theme.dark }}
                >
                  {material.title}
                </h4>
                
                {/* Description */}
                {material.description && (
                  <p className="text-sm mb-4 line-clamp-3" style={{ color: theme.light }}>
                    {material.description}
                  </p>
                )}

                {/* Stats & Actions */}
                <div className="mt-6 pt-4 border-t" style={{ borderColor: theme.border }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1" style={{ color: theme.lighter }}>
                        <FiEye size={12} />
                        <span>{material.downloads || material.clicks || 0} views</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(material.url, '_blank');
                        }}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1 transition-all hover:opacity-80"
                        style={{
                          backgroundColor: theme.primary,
                          color: theme.white,
                        }}
                        title="Open Resource"
                      >
                        <FiExternalLink size={12} />
                        Open
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditMaterial(material);
                        }}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1 transition-all hover:opacity-80"
                        style={{
                          backgroundColor: theme.background,
                          color: theme.primary,
                          border: `1px solid ${theme.border}`,
                        }}
                        title="Edit Material"
                      >
                        <FiEdit size={12} />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMaterial(material.id, material.type);
                        }}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1 transition-all hover:opacity-80"
                        style={{
                          backgroundColor: '#FEF2F2',
                          color: '#DC2626',
                          border: '1px solid #FECACA',
                        }}
                        title="Delete Material"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Stats Footer */}
      {materials.length > 0 && (
        <div className="p-4 border rounded-xl" 
            style={{ backgroundColor: theme.white, borderColor: theme.border }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: theme.primary }}>
                {materials.filter(m => m.type === 'video').length}
              </div>
              <div className="text-xs" style={{ color: theme.light }}>Video Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#2563EB' }}>
                {materials.filter(m => m.type === 'file').length}
              </div>
              <div className="text-xs" style={{ color: theme.light }}>Documents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#059669' }}>
                {materials.filter(m => m.type === 'web').length}
              </div>
              <div className="text-xs" style={{ color: theme.light }}>Web Resources</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: theme.warning }}>
                {materials.reduce((sum, mat) => sum + (mat.downloads || mat.clicks || 0), 0)}
              </div>
              <div className="text-xs" style={{ color: theme.light }}>Total Views</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// === NoticesTab Component ===
const NoticesTab = ({ profile, theme }) => {
  const admin_backend_domain_name = import.meta.env.VITE_ADMIN_BACKEND_DOMAIN_NAME;
  
  // State
  const [notices, setNotices] = useState([]);
  const [teacherNotices, setTeacherNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNotice, setNewNotice] = useState({
    message: ""
  });
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [showNoticeForm, setShowNoticeForm] = useState(false);

  // Fetch notices
  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${admin_backend_domain_name}api/gradeManager/dashboard/${profile?.grade}`,
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        const fetchedNotices = response.data.notice || [];
        setNotices(fetchedNotices);
        const teacherOwnedNotices = fetchedNotices.filter(notice => 
          notice.user_id === String(profile?.id)
        );
        setTeacherNotices(teacherOwnedNotices);
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
      setNotices([]);
      setTeacherNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Create new notice
  const createNotice = async () => {
    try {
      if (!newNotice.message.trim()) return;
      
      const response = await axios.post(
        `${admin_backend_domain_name}api/admin/createNotice`,
        {
          user_id: profile.id,
          user_role: profile.role,
          message: newNotice.message,
          authorization: 'students',
          grade: String(profile.grade)
        },
        { withCredentials: true }
      );
      
      if (response.status === 201) {
        // Refresh notices
        fetchNotices();
        // Reset form
        setNewNotice({ message: "" });
        setShowNoticeForm(false);
        // You might want to add a success toast here
      }
    } catch (error) {
      console.error("Error creating notice:", error);
      // Add error toast here
    }
  };

  // Update existing notice
  const updateNotice = async () => {
    try {
      if (!newNotice.message.trim() || !editingNoticeId) return;
      
      // Note: You'll need to create an update endpoint in your backend
      const response = await axios.post(
        `${admin_backend_domain_name}api/admin/updateNotice/${editingNoticeId}`,
        {
          message: newNotice.message
        },
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        
        fetchNotices();
        setNewNotice({ message: "" });
        setEditingNoticeId(null);
        // Success toast
      }
    } catch (error) {
      console.error("Error updating notice:", error);
      // Error toast
    }
  };

  // Delete notice
  const deleteNotice = async (noticeId) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    
    try {
      // Note: You'll need to create a delete endpoint in your backend
      const response = await axios.get(
        `${admin_backend_domain_name}api/admin/deleteNotice/${noticeId}`,
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        fetchNotices();
        // Success toast
      }
    } catch (error) {
      console.error("Error deleting notice:", error);
      // Error toast
    }
  };

  // Format date like your dashboard
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

  // Check if teacher can edit notice
  const canEditNotice = (notice) => {
    return notice.user_id === String(profile?.id);
  };

  return (
    <div className="space-y-6">
      {/* Notice Board Header with Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h3
          className="text-xl font-semibold"
          style={{ color: theme.dark }}
        >
          Notice Board
        </h3>
        {!editingNoticeId && (
          <button
            onClick={() => setShowNoticeForm(!showNoticeForm)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all hover:shadow-md"
            style={{
              backgroundColor: theme.primary,
              color: theme.white,
              border: `1px solid ${theme.primary}`,
              boxShadow: "0 2px 4px rgba(63, 167, 163, 0.2)",
            }}
          >
            <FiPlus size={16} />
            Add Notice
          </button>
        )}
      </div>

      {/* Add Notice Form */}
      {showNoticeForm && !editingNoticeId && (
        <div
          className="p-6 border shadow-md mb-6"
          style={{
            backgroundColor: theme.white,
            borderColor: "#E2E8F0",
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className="text-lg font-semibold"
              style={{ color: theme.dark }}
            >
              Create New Notice
            </h3>
            <button
              onClick={() => setShowNoticeForm(false)}
              className="p-1 hover:opacity-80"
              style={{ color: theme.light }}
            >
              <FiX size={18} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.dark }}
              >
                Message *
              </label>
              <textarea
                value={newNotice.message}
                onChange={(e) =>
                  setNewNotice((prev) => ({ ...prev, message: e.target.value }))
                }
                rows="3"
                placeholder="Type your notice here..."
                className="w-full p-3 border focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{
                  backgroundColor: theme.white,
                  borderColor: "#E2E8F0",
                  color: theme.dark,
                }}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: "#E2E8F0" }}>
            <button
              onClick={() => {
                setShowNoticeForm(false);
                setNewNotice({ message: "" });
              }}
              className="px-4 py-2 text-sm font-medium transition-all hover:opacity-80"
              style={{
                backgroundColor: "#E2E8F0",
                color: theme.dark,
                border: "1px solid #E2E8F0",
              }}
            >
              Cancel
            </button>
            <button
              onClick={createNotice}
              disabled={!newNotice.message.trim()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: theme.primary,
                color: theme.white,
                border: `1px solid ${theme.primary}`,
              }}
            >
              <FiSave size={14} />
              Save Notice
            </button>
          </div>
        </div>
      )}

      {/* Edit Notice Form */}
      {editingNoticeId && (
        <div
          className="p-6 border shadow-md mb-6"
          style={{
            backgroundColor: theme.white,
            borderColor: "#E2E8F0",
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className="text-lg font-semibold"
              style={{ color: theme.dark }}
            >
              Edit Notice
            </h3>
            <button
              onClick={() => {
                setEditingNoticeId(null);
                setNewNotice({ message: "" });
              }}
              className="p-1 hover:opacity-80"
              style={{ color: theme.light }}
            >
              <FiX size={18} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.dark }}
              >
                Message *
              </label>
              <textarea
                value={newNotice.message}
                onChange={(e) =>
                  setNewNotice((prev) => ({ ...prev, message: e.target.value }))
                }
                rows="3"
                placeholder="Type your notice here..."
                className="w-full p-3 border focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{
                  backgroundColor: theme.white,
                  borderColor: "#E2E8F0",
                  color: theme.dark,
                }}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: "#E2E8F0" }}>
            <button
              onClick={() => {
                setEditingNoticeId(null);
                setNewNotice({ message: "" });
              }}
              className="px-4 py-2 text-sm font-medium transition-all hover:opacity-80"
              style={{
                backgroundColor: "#E2E8F0",
                color: theme.dark,
                border: "1px solid #E2E8F0",
              }}
            >
              Cancel
            </button>
            <button
              onClick={updateNotice}
              disabled={!newNotice.message.trim()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: theme.primary,
                color: theme.white,
                border: `1px solid ${theme.primary}`,
              }}
            >
              <FiSave size={14} />
              Update Notice
            </button>
          </div>
        </div>
      )}

      {/* Statistics Cards - Matching your dashboard design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div
          className="p-6 border shadow-md hover:shadow-lg transition-shadow"
          style={{
            backgroundColor: theme.white,
            borderColor: "#E2E8F0",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm font-medium mb-2"
                style={{ color: theme.light }}
              >
                Your Notices
              </p>
              <p
                className="text-3xl font-bold"
                style={{ color: theme.dark }}
              >
                {teacherNotices.length}
              </p>
            </div>
            <div
              className="p-3"
              style={{
                backgroundColor: theme.primary + "15",
                border: `1px solid ${theme.primary}30`,
              }}
            >
              <FiBell size={24} style={{ color: theme.primary }} />
            </div>
          </div>
        </div>

        <div
          className="p-6 border shadow-md hover:shadow-lg transition-shadow"
          style={{
            backgroundColor: theme.white,
            borderColor: "#E2E8F0",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm font-medium mb-2"
                style={{ color: theme.light }}
              >
                Total Notices
              </p>
              <p
                className="text-3xl font-bold"
                style={{ color: theme.dark }}
              >
                {notices.length}
              </p>
            </div>
            <div
              className="p-3"
              style={{
                backgroundColor: "#EFF6FF",
                border: `1px solid #2563EB30`,
              }}
            >
              <FiMessageSquare size={24} style={{ color: "#2563EB" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-8" style={{ color: theme.light }}>
          Loading notices...
        </div>
      ) : (
        <>
          {/* Your Notices List */}
          <div
            className="p-6 border shadow-md mb-8"
            style={{
              backgroundColor: theme.white,
              borderColor: "#E2E8F0",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className="text-lg font-semibold"
                style={{ color: theme.dark }}
              >
                Your Notices ({teacherNotices.length})
              </h3>
              <div className="text-sm" style={{ color: theme.light }}>
                You can only edit or delete notices you created
              </div>
            </div>
            
            {teacherNotices.length === 0 ? (
              <div 
                className="text-center py-12 border-2 border-dashed"
                style={{ 
                  borderColor: "#E2E8F0", 
                  backgroundColor: theme.background 
                }}
              >
                <div className="mb-4">
                  <FiBell size={48} style={{ color: theme.light + '40' }} />
                </div>
                <h4 className="font-medium text-lg mb-2" style={{ color: theme.dark }}>
                  No notices found
                </h4>
                <p className="text-sm mb-4" style={{ color: theme.light }}>
                  You haven't published any notices yet for this grade
                </p>
                <button
                  onClick={() => setShowNoticeForm(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium mx-auto"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.white,
                    border: `1px solid ${theme.primary}`,
                  }}
                >
                  <FiPlus size={14} />
                  Create Your First Notice
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {teacherNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="p-4 border-l-4 flex justify-between items-start hover:shadow-sm transition-shadow"
                    style={{
                      borderLeftColor: theme.primary,
                      backgroundColor: theme.background,
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs px-2 py-1 rounded"
                          style={{
                            backgroundColor: theme.primary + "15",
                            color: theme.primary,
                          }}
                        >
                          Grade {notice.grade}
                        </span>
                      </div>
                      <p className="text-sm mb-2" style={{ color: theme.dark }}>
                        {notice.message}
                      </p>
                      <div className="flex items-center gap-4">
                        <p
                          className="text-xs"
                          style={{ color: theme.light }}
                        >
                          {formatDateTime(notice.created_at)}
                        </p>
                        <p className="text-xs" style={{ color: theme.light }}>
                          ID: {notice.id}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setNewNotice({
                            message: notice.message
                          });
                          setEditingNoticeId(notice.id);
                          setShowNoticeForm(false);
                        }}
                        className="p-2 hover:opacity-80 transition-opacity"
                        style={{
                          color: theme.primary,
                          backgroundColor: theme.background,
                          border: `1px solid ${theme.primary}`,
                        }}
                        title="Edit Notice"
                      >
                        <FiEdit size={14} />
                      </button>
                      <button
                        onClick={() => deleteNotice(notice.id)}
                        className="p-2 hover:opacity-80 transition-opacity"
                        style={{
                          color: "#E74C3C",
                          backgroundColor: "#FEF2F2",
                          border: "1px solid #E74C3C",
                        }}
                        title="Delete Notice"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All Notices (Read-only) */}
          {notices.length > teacherNotices.length && (
            <div
              className="p-6 border shadow-md"
              style={{
                backgroundColor: theme.white,
                borderColor: "#E2E8F0",
              }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: theme.dark }}
              >
                All Notices ({notices.length})
              </h3>
              <div className="space-y-3">
                {notices.filter(notice => !canEditNotice(notice)).map((notice) => (
                  <div
                    key={notice.id}
                    className="p-4 border-l-4 opacity-75 hover:opacity-100 transition-opacity"
                    style={{
                      borderLeftColor: theme.primary,
                      backgroundColor: theme.background,
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-xs px-2 py-1 rounded"
                            style={{
                              backgroundColor: theme.primary + "15",
                              color: theme.primary,
                            }}
                          >
                            Grade {notice.grade}
                          </span>
                        </div>
                        <h4 className="font-medium text-sm mb-1" style={{ color: theme.dark }}>
                          {notice.message.substring(0, 80)}
                          {notice.message.length > 80 ? "..." : ""}
                        </h4>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs" style={{ color: theme.light }}>
                            By: {notice.user_role || "Admin"}
                          </span>
                          <span className="text-xs" style={{ color: theme.light }}>
                            {formatDate(notice.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// === StudentsTab Component ===
const StudentsTab = ({ students, theme, formatDate }) => {
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // Filter students based on search and section
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.roll_no?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.id?.toString().includes(studentSearch);
    const matchesSection =
      selectedSection === "all" || student.section === selectedSection;
    return matchesSearch && matchesSection;
  });

  // Pagination for students
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div
        className="p-4 border rounded-lg"
        style={{ backgroundColor: theme.white, borderColor: theme.border }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: theme.dark }}
            >
              Search Students
            </label>
            <div className="relative">
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: theme.light }}
              />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search by name or roll number"
                className="w-full pl-10 pr-4 py-2 border rounded text-sm"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
              />
            </div>
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: theme.dark }}
            >
              Filter by Class
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full p-2 border rounded text-sm"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.dark,
              }}
            >
              <option value="all">All Classes</option>
              <option value="A">Class A</option>
              <option value="B">Class B</option>
              <option value="C">Class C</option>
              <option value="D">Class D</option>
              <option value="E">Class E</option>
              <option value="F">Class F</option>
            </select>
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: theme.dark }}
            >
              Actions
            </label>
            <button
              className="w-full p-2 text-sm border rounded flex items-center justify-center gap-2"
              style={{
                backgroundColor: theme.primary,
                color: theme.white,
                borderColor: theme.primary,
              }}
            >
              <FiUsers size={14} />
              Export List
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div
        className="border rounded-lg overflow-hidden"
        style={{ backgroundColor: theme.white, borderColor: theme.border }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: theme.background }}>
                <th
                  className="p-3 text-left text-xs font-medium"
                  style={{ color: theme.light }}
                >
                  #
                </th>
                <th
                  className="p-3 text-left text-xs font-medium"
                  style={{ color: theme.light }}
                >
                  Student
                </th>
                <th
                  className="p-3 text-left text-xs font-medium"
                  style={{ color: theme.light }}
                >
                  Class
                </th>
                <th
                  className="p-3 text-left text-xs font-medium"
                  style={{ color: theme.light }}
                >
                  Roll No
                </th>
                <th
                  className="p-3 text-left text-xs font-medium"
                  style={{ color: theme.light }}
                >
                  Gender
                </th>
                <th
                  className="p-3 text-left text-xs font-medium"
                  style={{ color: theme.light }}
                >
                  Phone
                </th>
                <th
                  className="p-3 text-left text-xs font-medium"
                  style={{ color: theme.light }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student, index) => (
                <tr
                  key={student.id}
                  className="border-t"
                  style={{ borderColor: theme.border }}
                >
                  <td className="p-3">
                    <div className="text-sm" style={{ color: theme.dark }}>
                      {indexOfFirstStudent + index + 1}
                    </div>
                  </td>
                  <td className="p-3">
                    <div
                      className="font-medium text-sm"
                      style={{ color: theme.dark }}
                    >
                      {student.name}
                    </div>
                    <div className="text-xs" style={{ color: theme.light }}>
                      ID: {student.id}
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className="px-2 py-1 text-xs rounded"
                      style={{
                        backgroundColor: theme.primaryBg,
                        color: theme.primary,
                      }}
                    >
                      Class {student.section || "A"}
                    </span>
                  </td>
                  <td className="p-3 text-sm" style={{ color: theme.dark }}>
                    {student.roll_no || "-"}
                  </td>
                  <td className="p-3 text-sm" style={{ color: theme.dark }}>
                    {student.gender || "-"}
                  </td>
                  <td className="p-3 text-sm" style={{ color: theme.dark }}>
                    {student.phone || "-"}
                  </td>
                  <td className="p-3">
                    <span
                      className="px-2 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: theme.accent + "15",
                        color: theme.accent,
                      }}
                    >
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="p-4 border-t flex justify-between items-center"
            style={{ borderColor: theme.border }}
          >
            <div className="text-sm" style={{ color: theme.light }}>
              Showing {indexOfFirstStudent + 1} to{" "}
              {Math.min(indexOfLastStudent, filteredStudents.length)} of{" "}
              {filteredStudents.length} students
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: currentPage === 1 ? theme.lighter : theme.dark,
                }}
              >
                <FiChevronLeft size={16} />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 text-sm border rounded ${
                      currentPage === pageNum ? "font-medium" : ""
                    }`}
                    style={{
                      backgroundColor:
                        currentPage === pageNum ? theme.primary : theme.white,
                      borderColor:
                        currentPage === pageNum ? theme.primary : theme.border,
                      color: currentPage === pageNum ? theme.white : theme.dark,
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 border rounded"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color:
                    currentPage === totalPages ? theme.lighter : theme.dark,
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
};

const ExamsTab = ({ exams, students, subject, subject_id, theme, formatDate, formatTime }) => {
  const admin_backend_domain_name = import.meta.env.VITE_ADMIN_BACKEND_DOMAIN_NAME;
  const profile = useSelector(store=> store.profile.profile);
  const [marksEntryMode, setMarksEntryMode] = useState(false);
  const [currentExamId, setCurrentExamId] = useState(null);
  const [examMarks, setExamMarks] = useState({});
  const [saveConfirmModal, setSaveConfirmModal] = useState(false);
  const [markEditModal, setMarkEditModal] = useState({
    open: false,
    student: null,
    marks: "",
    note: "",
  });

  // Get exam status color
  const getExamStatusColor = (status) => {
    switch(status) {
      case 'completed': return theme.accent;
      case 'ongoing': return theme.warning;
      case 'scheduled': return theme.primary;
      case 'cancelled': return theme.danger;
      default: return theme.light;
    }
  };

  // Initialize marks for an exam
  const initializeMarksForExam = (examId) => {
    const marksData = {};
    students.forEach(student => {
      marksData[student.id] = {
        studentId: student.id,
        name: student.name,
        section: student.section || "A",
        rollNo: student.roll_no || student.id,
        marks: "",
        note: "",
        attendance: student.attendance || 0,
        max_mark: 100,
        min_mark: 40,
        is_passed: 0,
        status: "pending"
      };
    });
    setExamMarks(marksData);
    setCurrentExamId(examId);
    setMarksEntryMode(true);
  };

  // Check if all marks are filled
  const allMarksFilled = () => {
    return Object.values(examMarks).every(mark => mark.marks !== "");
  };

  // Handle mark change
  const handleMarkChange = (studentId, value) => {
    setExamMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marks: value,
        is_passed: value ? (parseFloat(value) >= (prev[studentId]?.min_mark || 40) ? 1 : 0) : 0
      }
    }));
  };

  // Load existing marks for an exam
  const loadExistingMarks = async (examId) => {
    try {
      const response = await axios.get(
        `${admin_backend_domain_name}api/teacher/getMarks/${examId}/${subject_id}`,
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        const marksArray = response.data.data || [];
        const marksData = {};
        if(marksArray == []){
          initializeMarksForExam(examId);
        }
        marksArray.forEach(mark => {
          marksData[mark.student_id] = {
            studentId: mark.student_id,
            name: mark.student_name,
            section: mark.class_name || "A",
            rollNo: mark.roll_no || mark.student_id,
            marks: mark.get_mark?.toString() || "",
            note: mark.note || "",
            attendance: mark.attendance || 0,
            max_mark: mark.max_mark || 100,
            min_mark: mark.min_mark || 40,
            is_passed: mark.is_passed || 0,
            status: mark.status || "marked"
          };
        });
        
       
        students.forEach(student => {
          if (!marksData[student.id]) {
            marksData[student.id] = {
              studentId: student.id,
              name: student.name,
              section: student.section || "A",
              rollNo: student.roll_no || student.id,
              marks: "",
              note: "",
              attendance: student.attendance || 0,
              max_mark: 100,
              min_mark: 40,
              is_passed: 0,
              status: "pending"
            };
          }
        });
        
        setExamMarks(marksData);
        setCurrentExamId(examId);
        setMarksEntryMode(true);
      }
    } catch (error) {
      console.error("Error loading marks:", error);
      initializeMarksForExam(examId); // Initialize if no marks exist
    }
  };

  // Save marks to backend
  const saveMarks = async () => {
    try {
      const marksArray = Object.values(examMarks)
        .filter(mark => mark.marks !== "")
        .map(mark => ({
          student_id: mark.studentId,
          exam_id: currentExamId,
          subject_id: subject_id,
          get_mark: parseFloat(mark.marks),
          note: mark.note || "",
          teacher_id: profile.id,
          grade_id: profile.grade,
          max_mark: mark.max_mark || 100,
          min_mark: mark.min_mark || 40,
          is_passed: mark.is_passed || 0,
          status: "marked"
        }));
      
      console.log('Saving marks:', marksArray);
      
      const response = await axios.post(
        `${admin_backend_domain_name}api/teacher/saveMarks`,
        { 
          teacher_id: profile.id, 
          grade_id: profile.grade, 
          marks: marksArray 
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("Marks saved successfully!");
        setMarksEntryMode(false);
        setSaveConfirmModal(false);
        setCurrentExamId(null);
        setExamMarks({});
      }
    } catch (error) {
      console.error("Error saving marks:", error);
      alert("Error saving marks");
    }
  };

  // Mark Edit Modal Component
  const MarkEditModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={() => setMarkEditModal({ open: false, student: null, marks: "", note: "" })} 
      ></div>

      <div
        className="w-full max-w-md p-6 rounded-xl shadow-2xl relative"
        style={{
          backgroundColor: theme.white,
          border: `1px solid ${theme.border}`,
          zIndex: 60,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 border-b pb-3" style={{borderColor: theme.border}}>
          <h2 className="text-xl font-semibold" style={{ color: theme.dark }}>
            Update Marks & Notes
          </h2>
          <button
            onClick={() => setMarkEditModal({ open: false, student: null, marks: "", note: "" })}
            className="p-2 rounded-full transition-all duration-200 hover:bg-gray-100"
            style={{ color: theme.light }}
          >
            <FiX size={20} />
          </button>
        </div>

        {markEditModal.student && (
          <div className="space-y-4">
            {/* Student Info */}
            <div className="p-3 border rounded-lg" style={{backgroundColor: theme.background, borderColor: theme.border}}>
              <h3 className="font-medium mb-1" style={{color: theme.dark}}>
                {markEditModal.student.name}
              </h3>
              <div className="flex gap-4 text-sm">
                <span style={{color: theme.light}}>Class {markEditModal.student.section}</span>
                <span style={{color: theme.light}}>Roll No: {markEditModal.student.rollNo}</span>
              </div>
            </div>

            {/* Marks Input */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: theme.dark}}>
                Marks (Out of 100)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={markEditModal.marks}
                  onChange={(e) => setMarkEditModal(prev => ({...prev, marks: e.target.value}))}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-32 p-3 border rounded-lg focus:ring-2 focus:ring-offset-1"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.dark,
                    outlineColor: theme.primary
                  }}
                />
                <span className="text-sm" style={{color: theme.light}}>/ 100</span>
              </div>
              <div className="mt-2 text-sm">
                <span style={{color: theme.light}}>Passing Marks: </span>
                <span style={{color: theme.dark}}>{markEditModal.student.min_mark || 40}</span>
              </div>
            </div>

            {/* Notes Input */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: theme.dark}}>
                Teacher's Notes
              </label>
              <textarea
                value={markEditModal.note}
                onChange={(e) => setMarkEditModal(prev => ({...prev, note: e.target.value}))}
                placeholder="Enter any notes or comments about this student's performance..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-offset-1 min-h-[100px]"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.dark,
                  outlineColor: theme.primary
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 justify-end">
              <button
                onClick={() => setMarkEditModal({ open: false, student: null, marks: "", note: "" })}
                className="px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100"
                style={{
                  backgroundColor: theme.background,
                  color: theme.dark,
                  borderColor: theme.border,
                  borderWidth: '1px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleMarkChange(markEditModal.student.studentId, markEditModal.marks);
                  // Update note in exam marks
                  setExamMarks(prev => ({
                    ...prev,
                    [markEditModal.student.studentId]: {
                      ...prev[markEditModal.student.studentId],
                      marks: markEditModal.marks,
                      note: markEditModal.note,
                      is_passed: markEditModal.marks ? 
                        (parseFloat(markEditModal.marks) >= (prev[markEditModal.student.studentId]?.min_mark || 40) ? 1 : 0) : 0
                    }
                  }));
                  setMarkEditModal({ open: false, student: null, marks: "", note: "" });
                }}
                disabled={!markEditModal.marks.trim()}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: theme.accent,
                  color: theme.white,
                  boxShadow: `0 4px 6px -1px ${theme.accent}30`,
                }}
              >
                <FiSave size={14} />
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Save Confirmation Modal
  const SaveConfirmationModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={() => setSaveConfirmModal(false)} 
      ></div>

      <div
        className="w-full max-w-md p-6 rounded-xl shadow-2xl relative"
        style={{
          backgroundColor: theme.white,
          border: `1px solid ${theme.border}`,
          zIndex: 60,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
            <FiAlertTriangle size={24} style={{ color: theme.warning }} />
          </div>
          <h2 className="text-xl font-semibold text-center mb-3" style={{ color: theme.dark }}>
            Confirm Save Marks
          </h2>
          <p className="text-center text-sm mb-4" style={{ color: theme.light }}>
            Are you sure you want to save the marks for all students? 
            This action cannot be undone.
          </p>
          
          <div className="p-3 border rounded-lg mb-4" style={{backgroundColor: theme.background, borderColor: theme.border}}>
            <div className="flex justify-between mb-2">
              <span style={{color: theme.light}}>Exam:</span>
              <span className="font-medium" style={{color: theme.dark}}>
                {exams.find(e => e.id === currentExamId)?.exam_name || "Current Exam"}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span style={{color: theme.light}}>Subject:</span>
              <span className="font-medium" style={{color: theme.dark}}>{subject.subject_name}</span>
            </div>
            <div className="flex justify-between">
              <span style={{color: theme.light}}>Students Marked:</span>
              <span className="font-medium" style={{color: theme.dark}}>
                {Object.values(examMarks).filter(m => m.marks !== "").length} / {students.length}
              </span>
            </div>
            <div className="flex justify-between mt-2">
              <span style={{color: theme.light}}>Passing Criteria:</span>
              <span className="font-medium" style={{color: theme.dark}}>
                {Object.values(examMarks)[0]?.min_mark || 40} out of {Object.values(examMarks)[0]?.max_mark || 100}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setSaveConfirmModal(false)}
            className="px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100"
            style={{
              backgroundColor: theme.background,
              color: theme.dark,
              borderColor: theme.border,
              borderWidth: '1px'
            }}
          >
            Cancel
          </button>
          <button
            onClick={saveMarks}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:opacity-90"
            style={{
              backgroundColor: theme.accent,
              color: theme.white,
              boxShadow: `0 4px 6px -1px ${theme.accent}30`,
            }}
          >
            <FiSave size={14} />
            Yes, Save Marks
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Exams List */}
      <div
        className="p-6 border rounded-lg"
        style={{ backgroundColor: theme.white, borderColor: theme.border }}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold" style={{ color: theme.dark }}>
              Available Exams
            </h3>
            <p className="text-sm" style={{ color: theme.light }}>
              Select an exam to enter marks
            </p>
          </div>
        </div>

        {exams?.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg" style={{borderColor: theme.border}}>
            <FiCalendar size={48} className="mx-auto mb-4" style={{color: theme.light + '40'}} />
            <p className="text-sm" style={{color: theme.light}}>No exams scheduled yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="p-4 border rounded-lg"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  borderLeft: `4px solid ${getExamStatusColor(exam.status)}`,
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium" style={{ color: theme.dark }}>
                      {exam.exam_name}
                    </h4>
                    <span
                      className="text-xs px-2 py-1 rounded-full mt-1"
                      style={{
                        backgroundColor: getExamStatusColor(exam.status) + '15',
                        color: getExamStatusColor(exam.status),
                      }}
                    >
                      {exam.status}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded" style={{
                    backgroundColor: theme.primaryBg,
                    color: theme.primary,
                  }}>
                    {exam.exam_type}
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span style={{ color: theme.light }}>Start:</span>
                    <span style={{ color: theme.dark }}>{formatDate(exam.exam_start_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.light }}>End:</span>
                    <span style={{ color: theme.dark }}>{formatDate(exam.exam_end_date)}</span>
                  </div>
                </div>

                {exam.status === 'completed' ? (
                  <button
                    onClick={() => loadExistingMarks(exam.id)}
                    className="w-full py-2 text-sm font-medium rounded flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: theme.primary,
                      color: theme.white,
                    }}
                  >
                    <FiEye size={14} />
                    View/Update Marks
                  </button>
                ) : (
                  <button
                    onClick={() => initializeMarksForExam(exam.id)}
                    disabled={exam.status !== 'completed'}
                    className="w-full py-2 text-sm font-medium rounded flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: exam.status === 'completed' ? theme.accent : theme.light,
                      color: theme.white,
                    }}
                  >
                    <FiEdit size={14} />
                    {exam.status === 'completed' ? 'Enter Marks' : 'Marks Not Available'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Marks Entry Table (only shown when marksEntryMode is true) */}
      {marksEntryMode && (
        <div
          className="border rounded-lg overflow-hidden"
          style={{ backgroundColor: theme.white, borderColor: theme.border }}
        >
          <div className="p-4 border-b flex justify-between items-center" style={{borderColor: theme.border}}>
            <div>
              <h3 className="font-semibold" style={{ color: theme.dark }}>
                Enter Marks - {exams.find(e => e.id === currentExamId)?.exam_name}
              </h3>
              <p className="text-sm" style={{ color: theme.light }}>
                Fill marks for all students. Save button will be enabled when all marks are filled.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setMarksEntryMode(false);
                  setCurrentExamId(null);
                  setExamMarks({});
                }}
                className="px-4 py-2 text-sm border rounded"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.border,
                  color: theme.dark,
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setSaveConfirmModal(true)}
                disabled={!allMarksFilled()}
                className="px-4 py-2 text-sm font-medium rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: allMarksFilled() ? theme.accent : theme.light,
                  color: theme.white,
                }}
              >
                <FiSave size={14} />
                Save All Marks
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: theme.background }}>
                  <th className="p-3 text-left text-xs font-medium" style={{ color: theme.light }}>
                    Student
                  </th>
                  <th className="p-3 text-left text-xs font-medium" style={{ color: theme.light }}>
                    Class
                  </th>
                  <th className="p-3 text-left text-xs font-medium" style={{ color: theme.light }}>
                    Roll No
                  </th>
                  <th className="p-3 text-left text-xs font-medium" style={{ color: theme.light }}>
                    Marks (Out of 100)
                  </th>
                  <th className="p-3 text-left text-xs font-medium" style={{ color: theme.light }}>
                    Status
                  </th>
                  <th className="p-3 text-left text-xs font-medium" style={{ color: theme.light }}>
                    Notes
                  </th>
                  <th className="p-3 text-left text-xs font-medium" style={{ color: theme.light }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.values(examMarks).map((mark) => (
                  <tr
                    key={mark.studentId}
                    className="border-t hover:bg-gray-50"
                    style={{ borderColor: theme.border }}
                  >
                    <td className="p-3">
                      <div className="font-medium text-sm" style={{ color: theme.dark }}>
                        {mark.name}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-sm" style={{ color: theme.dark }}>
                        Class {mark.section}
                      </span>
                    </td>
                    <td className="p-3 text-sm" style={{ color: theme.dark }}>
                      {mark.rollNo}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={mark.marks}
                          onChange={(e) => handleMarkChange(mark.studentId, e.target.value)}
                          min="0"
                          max="100"
                          step="0.01"
                          className="w-24 p-2 border rounded text-sm"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                            color: theme.dark,
                          }}
                        />
                        <span className="text-xs" style={{ color: theme.light }}>
                          /100
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          mark.marks ? (
                            parseFloat(mark.marks) >= (mark.min_mark || 40) 
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          ) : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {mark.marks ? (
                          parseFloat(mark.marks) >= (mark.min_mark || 40) ? "Passed" : "Failed"
                        ) : "Not Marked"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="max-w-[200px]">
                        {mark.note ? (
                          <div className="group relative">
                            <span className="text-xs text-gray-500 truncate block">
                              {mark.note.length > 30 ? `${mark.note.substring(0, 30)}...` : mark.note}
                            </span>
                            <div className="hidden group-hover:block absolute z-10 p-2 bg-white border rounded shadow-lg max-w-xs text-xs text-gray-600">
                              {mark.note}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No notes</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setMarkEditModal({
                          open: true,
                          student: mark,
                          marks: mark.marks,
                          note: mark.note || ""
                        })}
                        className="px-3 py-1 text-xs rounded flex items-center gap-1"
                        style={{
                          backgroundColor: theme.primaryBg,
                          color: theme.primary,
                        }}
                      >
                        <FiEdit size={10} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Show Modals */}
      {markEditModal.open && <MarkEditModal />}
      {saveConfirmModal && <SaveConfirmationModal />}
    </div>
  );
};

// === Main SubjectDetails Component ===
export default function SubjectDetails() {
  const backend_domain_name = import.meta.env.VITE_BACKEND_DOMAIN_NAME;
  const admin_backend_domain_name = import.meta.env.VITE_ADMIN_BACKEND_DOMAIN_NAME;
  const [materials, setMaterials] = useState([]);
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
  
  const profile = useSelector(store=> store.profile.profile);
  const [subject, setSubject] =useState({});

  // Tab state
  const [activeTab, setActiveTab] = useState("materials");
  const {id: subject_id} = useParams();

  // Notice Board State
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState({
    message: "",
    priority: "medium",
  });
  const [editingNoticeId, setEditingNoticeId] = useState(null);

  // Students List State
  const [students, setStudents] = useState([]);

  // Exams & Marks State
  const [exams, setExams] = useState([]);

  const fetchData = async () => {
   try {
    const getSubjectResponse = await axios.get(`${admin_backend_domain_name}api/teacher/getSubject/${subject_id}`, {
      withCredentials: true
    });
    const data = getSubjectResponse.data.data;
    console.log(subject, 'is subjectS')
    const study_material_video = getSubjectResponse.data.data.study_material_video ?  JSON.parse(getSubjectResponse.data.data.study_material_video) : [];
    const study_material_web = getSubjectResponse.data.data.study_material_web ? JSON.parse(getSubjectResponse.data.data.study_material_web): [];
    const study_material_file = getSubjectResponse.data.data.study_material_file ? JSON.parse(getSubjectResponse.data.data.study_material_file): [];
    console.log(study_material_file, study_material_video, study_material_web, 'is studyMaterials')
    setMaterials([...study_material_file, ...study_material_video, ...study_material_web]);
    console.log(materials)

    const studentsResponse = await axios.get(
      `${backend_domain_name}api/user/getStudentsByTeacher/${profile.grade}`,
      { withCredentials: true }
    );
    
    if (studentsResponse.status === 200) {
      setStudents(studentsResponse.data.data);
    }
    
    const response = await axios.get(`${admin_backend_domain_name}api/teacher/getEachSubject/${profile.grade}/${subject_id}`, {
      withCredentials: true
    });
    
    if(response.status == 200){
      setNotices(response.data.notices);
      setExams(response.data.allExams || []);
      console.log(response.data.allExams)
    }
   } catch (err) {
     console.log("not ok dude", err);
   }
  };

  // Parse study materials from JSON string
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update notice
  const updateNotice = async () => {
    if (!newNotice.message.trim()) return;

    try {
      const response = await axios.put(
        `${admin_backend_domain_name}api/teacher/updateNotice/${editingNoticeId}`,
        {
          message: newNotice.message,
          priority: newNotice.priority,
          grade: profile.grade,
          user_id: profile.id
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setNotices(notices.map(notice => 
          notice.id === editingNoticeId 
            ? { 
                ...notice, 
                message: newNotice.message,
                priority: newNotice.priority,
                updated_at: new Date().toISOString()
              } 
            : notice
        ));
        
        setEditingNoticeId(null);
        setNewNotice({ message: "", priority: "medium" });
        alert("Notice updated successfully!");
      }
    } catch (error) {
      console.error("Error updating notice:", error);
      alert("Error updating notice");
    }
  };

  // Delete notice
  const deleteNotice = async (id) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        const response = await axios.delete(
          `${admin_backend_domain_name}api/teacher/deleteNotice/${id}`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          setNotices(notices.filter(notice => notice.id !== id));
          alert("Notice deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting notice:", error);
        alert("Error deleting notice");
      }
    }
  };

  // Tab configuration
  const tabs = [
    { 
      id: "materials", 
      label: "Learning Materials", 
      component: () => <MaterialsTab subject={subject} theme={theme} formatDate={formatDate} setMaterials={setMaterials} materials={materials} />
    },
    { 
      id: "notices", 
      label: "Notice Board", 
      component: () => <NoticesTab profile={profile} theme={theme} />
    },
    { 
      id: "students", 
      label: "Students List", 
      component: () => <StudentsTab students={students} theme={theme} formatDate={formatDate} />
    },
    { 
      id: "exams", 
      label: "Exams", 
      component: () => <ExamsTab 
        exams={exams} 
        students={students} 
        subject={subject} 
        subject_id={subject_id}
        theme={theme} 
        formatDate={formatDate}
        formatTime={formatTime}
      />
    },
  ];

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || tabs[0].component;

  return (
<>

  
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: theme.background }}
    >
      {/* Header */}
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
                {subject.subject_name?.charAt(0) || "S"}
              </div>
              {subject.subject_name} (ID: {subject.id})
            </h1>
            <div
              className="flex items-center gap-4 text-sm"
              style={{ color: theme.light }}
            >
              <span>Grade: {subject.grade_id}</span>
              <span>Section: {subject.section}</span>
              <span>Students: {subject.totalStudents}</span>
              <span>Schedule: {subject.schedule}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div
          className="flex flex-wrap gap-2 border-b"
          style={{ borderColor: theme.border }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-primary"
                  : "border-transparent hover:border-gray-300"
              }`}
              style={{
                color: activeTab === tab.id ? theme.primary : theme.light,
                borderColor:
                  activeTab === tab.id ? theme.primary : "transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Tab Content */}
      <div>
        <ActiveComponent />
      </div>
    </div>
</>

  );
}
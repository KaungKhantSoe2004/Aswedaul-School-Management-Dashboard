// use client
import axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSave,
  FiX,
  FiCalendar,
  FiImage,
  FiLoader,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const transformApiData = (apiData) => {
  if (!apiData || typeof apiData !== 'object') return [];

  const activitiesArray = Array.isArray(apiData) ? apiData : Object.values(apiData);

  return activitiesArray.map(item => ({
    id: item.id,
    activityName: item.activityName || 'Unnamed Activity',
    image: item.image,
    created_at: item.created_at,
  }));
};

export default function Activities() {
  const [activities, setActivities] = useState([]);

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // 🛑 REFACTORED: Separate State Variables for Form Fields
  const [activityName, setActivityName] = useState("");
  const [imagePath, setImagePath] = useState(""); // Holds relative path or base64 data URL

  // 🛑 REFACTORED: Ref for the actual file object
  const imageFileRef = useRef(null);

  // --- Constants ---
  const backend_domain_name = import.meta.env.VITE_BACKEND_DOMAIN_NAME;
  const DEFAULT_PLACEHOLDER = "/art-gallery-exhibition.png"; // Added default placeholder

  // Theme colors (Matching Gallery component)
  const theme = {
    primary: "#3FA7A3",
    secondary: "#6C63FF",
    accent: "#2ECC71",
    dark: "#1E293B",
    light: "#64748B",
    background: "#F8FAFC",
    white: "#FFFFFF",
    lightGray: "#E2E8F0",
    red: "#E74C3C",
  };

  // --- Utility Functions ---

  const formatDateTime = (isoString) => {
    try {
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        });
    } catch (e) {
        return "Invalid Date";
    }
  };

  // 🆕 ADDED: Image URL handler like gallery
  const getImageUrl = (imagePath) => {
    if (!imagePath) return DEFAULT_PLACEHOLDER;

    // If it's already a data URL (base64), return as is
    if (imagePath.startsWith("data:image")) {
      return imagePath;
    }

    // Otherwise, prepend backend domain
    return `${backend_domain_name}${imagePath}`;
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      imageFileRef.current = file; // Store file in ref

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePath(e.target.result); // Set base64 URL for preview state
      };
      reader.readAsDataURL(file);
    } else {
        // If file input is cleared
        imageFileRef.current = null;
        // Keep existing imagePath if in edit mode, clear it if in add mode
        if (!editingId) {
            setImagePath("");
        }
    }
  };
  
  /**
   * Helper: Creates FormData object for API (uses separate state/ref)
   */
  const createFormData = () => {
    const form = new FormData();
    form.append("activityName", activityName);

    if (imageFileRef.current) {
      form.append("image", imageFileRef.current);
    }

    return form;
  };
  const navigate = useNavigate()
  // --- Data Fetching Logic ---
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${backend_domain_name}api/activity/getActivities`);
      const transformedData = transformApiData(response.data);
      setActivities(transformedData);
    } catch (err) {
      if(err.response.status == 401){
        Navigate("/login")
      }
      console.error("Error fetching activities:", err);
      setError("Failed to load activities. Check API and network.");
    } finally {
      setIsLoading(false);
    }
  }, [backend_domain_name]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Modal Handlers ---

  const handleAddClick = () => {
    setActivityName("");
    setImagePath("");
    imageFileRef.current = null;
    setEditingId(null);
    setShowModal(true);
  };

  const handleEditClick = (activity) => {
    setActivityName(activity.activityName);
    setImagePath(activity.image); // Load existing image path
    imageFileRef.current = null; // Clear ref, assume no new image unless uploaded
    setEditingId(activity.id);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingId(null);
    setActivityName("");
    setImagePath("");
    imageFileRef.current = null;
  };

  // --- CRUD Handlers ---

  const handleCreate = async () => {
    setIsSaving(true);
    try {
        const dataToSubmit = createFormData();
        
        const response = await axios.post(
          `${backend_domain_name}api/activity/createActivity`, 
          dataToSubmit, 
          { headers: { 'Content-Type': 'multipart/form-data' } ,
            withCredentials:true
        }
        );

        if (response.data && response.data.id) {
          // If API returns the created item, use it
          const newActivity = {
            id: response.data.id,
            activityName: activityName,
            image: response.data.image || imagePath,
            created_at: response.data.created_at || new Date().toISOString(),
          };
          setActivities(prev => [newActivity, ...prev]);
        } else {
          // Fallback to mock data
          const mockNewActivity = {
            id: Date.now(),
            activityName: activityName,
            image: imagePath || DEFAULT_PLACEHOLDER,
            created_at: new Date().toISOString(),
          };
          setActivities(prev => [mockNewActivity, ...prev]);
        }

        handleCancel();
    } catch (error) {
        console.error("Error creating activity:", error);
        setError("Failed to create activity.");
    } finally {
        setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
        const dataToSubmit = createFormData();
        dataToSubmit.append('id', editingId);
        
        const response = await axios.post(
          `${backend_domain_name}api/activity/updateActivity`, 
          dataToSubmit, 
          { headers: { 'Content-Type': 'multipart/form-data' } ,
        withCredentials:true}
        );

        if (response.data) {
          // Refresh data from API to get updated image path
          await fetchData();
        } else {
          // Fallback to local update
          setActivities(
            activities.map((activity) =>
                activity.id === editingId
                    ? {
                        ...activity,
                        activityName: activityName,
                        image: imageFileRef.current ? imagePath : activity.image,
                      }
                    : activity
            )
          );
        }

        handleCancel();
    } catch (error) {
        console.error("Error updating activity:", error);
        setError("Failed to update activity.");
    } finally {
        setIsSaving(false);
    }
  };

  const handleSave = () => {
    if (!activityName.trim()) {
        alert("Activity name is required.");
        return;
    }

    if (editingId) {
        handleUpdate();
    } else {
        handleCreate();
    }
  };

  const handleDelete = async(id) => {
    if (!window.confirm("Are you sure you want to delete this activity item?")) {
        return;
    }

    try {
      await axios.get(`${backend_domain_name}api/activity/deleteActivity/${id}` ,{
        withCredentials:true
      });
      setActivities(activities.filter((activity) => activity.id !== id));
    } catch (error) {
      console.error("Error deleting activity:", error);
      alert("Failed to delete activity. Check console for details.");
    }
  };

  // --- MODAL COMPONENT ---
  const ModalForm = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={handleCancel} 
      ></div>

      {/* Modal Content */}
      <div
        className="w-full max-w-xl p-6 rounded-xl shadow-2xl relative"
        style={{
          backgroundColor: theme.white,
          border: `1px solid ${theme.lightGray}`,
          zIndex: 60,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 border-b pb-3" style={{borderColor: theme.lightGray}}>
          <h2 className="text-2xl font-semibold" style={{ color: theme.dark }}>
            {editingId ? "Edit Activity Item" : "Add New Activity"}
          </h2>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="p-2 rounded-full transition-all duration-200 hover:bg-red-50 disabled:opacity-50"
            style={{ color: theme.light }}
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Activity Name Input */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
              Activity Name
            </label>
            <input
              type="text"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              disabled={isSaving}
              placeholder="Enter activity name"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.lightGray,
                color: theme.dark,
                outlineColor: theme.primary
              }}
              autoFocus
            />
          </div>

          {/* Image Upload and Preview - Updated to match gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image Preview */}
            <div className="md:col-span-1">
                <p className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>Image Preview</p>
                <div className="w-full aspect-video overflow-hidden rounded-lg border shadow-sm" style={{borderColor: theme.lightGray}}>
                    <img
                        src={getImageUrl(imagePath)} // 🆕 Using getImageUrl function
                        alt="Activity Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = DEFAULT_PLACEHOLDER }}
                    />
                </div>
            </div>

            {/* Upload Area */}
            <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
                    {editingId ? "Select New Image" : "Upload Image"}
                </label>
                <label
                    className={`block h-full p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-200 flex items-center justify-center ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    style={{
                        borderColor: theme.primary,
                        color: theme.primary,
                        fontWeight: "500",
                    }}
                >
                    <div className="flex items-center gap-2">
                        <FiImage size={20} />
                        Click to upload
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isSaving}
                        className="hidden"
                    />
                </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 justify-end">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-5 py-2 text-base font-medium rounded-lg transition-all duration-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: theme.lightGray,
                color: theme.dark,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!activityName.trim() || isSaving}
              className="flex items-center gap-2 px-5 py-2 text-base font-medium rounded-lg transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: theme.accent,
                color: theme.white,
                boxShadow: `0 4px 6px -1px ${theme.accent}30`,
              }}
            >
              {isSaving ? (
                <FiLoader size={16} className="animate-spin" />
              ) : (
                <FiSave size={16} />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Status Components ---

  const LoadingIndicator = () => (
    <div className="flex items-center justify-center min-h-[100vh]">
        <div className="text-center p-6 rounded-lg" style={{backgroundColor: theme.white}}>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 mx-auto mb-4" style={{ borderColor: theme.lightGray, borderTopColor: theme.primary }}></div>
            <p className="text-lg font-medium" style={{ color: theme.dark }}>Fetching activities...</p>
        </div>
    </div>
  );

  const EmptyState = () => (
    <div
      className="p-12 border rounded-xl text-center shadow-inner"
      style={{
          backgroundColor: theme.white,
          borderColor: theme.lightGray,
      }}
    >
      <div className="mx-auto mb-4 p-3 rounded-full inline-block" style={{backgroundColor: theme.primary + '10'}}>
          <FiImage size={32} style={{ color: theme.primary }} />
      </div>
      <h3 className="text-xl font-semibold mb-2" style={{ color: theme.dark }}>No Activities Yet</h3>
      <p style={{ color: theme.light }}>
        Start by clicking **'Add Activity Item'** to manage your school activities.
      </p>
    </div>
  );

  // --- MAIN COMPONENT RENDER ---

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: theme.background }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold mb-1" style={{ color: theme.dark }}>
              School Activities Manager 🏃
            </h1>
            <p className="text-sm" style={{ color: theme.light }}>
              Manage activity names and their corresponding visual assets.
            </p>
          </div>
          {/* Add button */}
          {!isLoading && (
            <button
              onClick={handleAddClick}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: theme.primary,
                color: theme.white,
                boxShadow: `0 4px 6px -1px ${theme.primary}30`,
              }}
            >
              <FiPlus size={18} />
              Add Activity Item
            </button>
          )}
        </div>
      </div>

      <hr style={{borderColor: theme.lightGray}}/>

      {/* Conditional Rendering */}
      {isLoading ? (
        <LoadingIndicator />
      ) : error ? (
        <div className="p-8 border text-center rounded-lg mt-8" style={{ backgroundColor: theme.red + '10', borderColor: theme.red }}>
            <p className="font-medium" style={{ color: theme.red }}>🚨 Error: {error}</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="mt-8">
            <EmptyState />
        </div>
      ) : (
        /* Activities Grid (Gallery Style) */
        <section className="mt-6">
            <h2 className="text-2xl font-semibold mb-6" style={{color: theme.dark}}>All Activities ({activities.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl relative group"
                style={{ backgroundColor: theme.white }}
              >
                {/* Image Area (Maximised) */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={getImageUrl(activity.image)} // 🆕 Using getImageUrl function
                    alt={activity.activityName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => { e.target.src = DEFAULT_PLACEHOLDER }}
                  />
                </div>

                {/* Content Footer */}
                <div className="p-4">
                  <h3 className="text-lg font-bold truncate mb-2" style={{ color: theme.dark }}>
                    {activity.activityName}
                  </h3>
                  {activity.created_at && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: theme.light }}>
                        <FiCalendar size={14} />
                        <span>Created: {formatDateTime(activity.created_at)}</span>
                    </div>
                  )}
                </div>

                {/* Floating Action Buttons (Hidden until hover) */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleEditClick(activity)}
                    className="p-3 rounded-full transition-all duration-200 hover:scale-105 shadow-md"
                    title="Edit Activity"
                    style={{ backgroundColor: theme.secondary, color: theme.white }}
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(activity.id)}
                    className="p-3 rounded-full transition-all duration-200 hover:scale-105 shadow-md"
                    title="Delete Activity"
                    style={{ backgroundColor: theme.red, color: theme.white }}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Modal Render */}
      {showModal && <ModalForm key={editingId || "create"} />}
    </div>
  );
}
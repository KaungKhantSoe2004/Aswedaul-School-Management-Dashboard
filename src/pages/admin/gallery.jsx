// use client
import axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import { FiEdit, FiTrash2, FiPlus, FiSave, FiX, FiLoader, FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Gallery() {
  const backend_domain_name = import.meta.env.VITE_BACKEND_DOMAIN_NAME;

  // State for gallery data
  const [galleryItems, setGalleryItems] = useState([]);

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // 🛑 REFACTORED: Separate State Variables for Form Fields 🛑
  const [galleryName, setGalleryName] = useState("");
  const [imagePath, setImagePath] = useState(""); // Holds relative path or base64 data URL
  const navigate = useNavigate()
  // Ref for the actual file object
  const imageFileRef = useRef(null);

  // Gallery theme colors (unchanged)
  const galleryTheme = {
    primary: "#3FA7A3", // Teal
    secondary: "#6C63FF", // Violet
    accent: "#2ECC71", // Green
    dark: "#1E293B",
    light: "#64748B",
    background: "#F8FAFC",
    white: "#FFFFFF",
    lightGray: "#E2E8F0",
    red: "#E74C3C",
  };

  const DEFAULT_PLACEHOLDER = "/art-gallery-exhibition.png";


  /**
   * API Call: Fetch all gallery items (unchanged)
   */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${backend_domain_name}api/gallery/getGalleries`, {
          withCredentials:true
        }
      );
      setGalleryItems(response.data);
    } catch (error) {
      if(error.response.status == 401){
        navigate('/login')
      }
      console.error("Error fetching gallery data:", error);
      setGalleryItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [backend_domain_name]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  /**
   * UI Handler: Setup for Add action (updated state setters)
   */
  const handleAddClick = () => {
    setGalleryName(""); // Set individual state
    setImagePath(""); // Set individual state
    imageFileRef.current = null;
    setEditingId(null);
    setShowModal(true);
  };


  /**
   * UI Handler: Setup for Edit action (updated state setters)
   */
  const handleEditClick = (item) => {
    setGalleryName(item.galleryName); // Set individual state
    setImagePath(item.image); // Set individual state
    imageFileRef.current = null;
    setEditingId(item.id);
    setShowModal(true);
  };


  /**
   * UI Handler: Close Modal/Cancel action (updated state setters)
   */
  const handleCancel = () => {
    setShowModal(false);
    setEditingId(null);
    setGalleryName("");
    setImagePath("");
    imageFileRef.current = null;
  };

  /**
   * Helper: Creates FormData object for API (uses separate state)
   * NOTE: This logic handles name-only updates by only appending the 'image' 
   * if imageFileRef.current is a new file.
   */
  const createFormData = () => {
    const form = new FormData();
    form.append("galleryName", galleryName); // Use separate state

    if (imageFileRef.current) {
      form.append("image", imageFileRef.current);
    }

    return form;
  };

  /**
   * API Call: Create new gallery item (unchanged logic, uses `galleryName`)
   */
  const handleCreate = async () => {
    setIsSaving(true);
    try {
      const form = createFormData();
      const response = await axios.post(`${backend_domain_name}api/gallery/createGallery`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials:true
      });
      console.log(response, 'is response')
      await fetchData();
      handleCancel();
    } catch (error) {
      console.error("Error creating gallery item:", error);
      alert("Failed to create item. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    console.log('in updating ')
    setIsSaving(true);
    try {
      const form = createFormData();
      form.append('id', editingId);
      const response = await axios.post(`${backend_domain_name}api/gallery/updateGallery`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials:true
      });
      console.log(response)

      await fetchData();
      handleCancel();
    } catch (error) {
      console.error("Error updating gallery item:", error);
      alert("Failed to update item. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };


  const handleSave = () => {
    if (!galleryName.trim()) { // Use separate state
      alert("Gallery title is required.");
      return;
    }

    if (editingId) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const handleDelete = async(id) => {
    if (!window.confirm("Are you sure you want to delete this gallery item?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${backend_domain_name}api/gallery/deleteGallery/${id}`, {
        withCredentials:true
      });
      console.log(response, 'is response bro hehe')
      await fetchData();

    } catch (error) {
      console.error("Error deleting gallery item:", error);
      alert("Failed to delete item. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      imageFileRef.current = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePath(e.target.result); // Set individual state
      };
      reader.readAsDataURL(file);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return DEFAULT_PLACEHOLDER;

    if (imagePath.startsWith("data:image")) {
      return imagePath;
    }

    return `${backend_domain_name}${imagePath}`;
  };

  const ModalForm = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Modal Backdrop (unchanged) */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleCancel}
      ></div>

      {/* Modal Content */}
      <div
        className="w-full max-w-xl p-6 rounded-xl shadow-2xl relative transition-transform duration-300 transform scale-100"
        style={{
          backgroundColor: galleryTheme.white,
          border: `1px solid ${galleryTheme.lightGray}`,
          zIndex: 60,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 border-b pb-3" style={{borderColor: galleryTheme.lightGray}}>
          <h2
            className="text-2xl font-semibold"
            style={{ color: galleryTheme.dark }}
          >
            {editingId ? "Edit Gallery Item" : "Add New Gallery Item"}
          </h2>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="p-2 rounded-full transition-all duration-200 hover:bg-red-50 disabled:opacity-50"
            style={{
              color: galleryTheme.light,
            }}
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-6">

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: galleryTheme.dark }}
            >
              Title
            </label>
            <input
              type="text"
              value={galleryName} // Use separate state value
              onChange={(e) => setGalleryName(e.target.value)} // Direct, simple setter call
              onKeyDown={(e) => e.stopPropagation()}
              disabled={isSaving}
              placeholder="Enter gallery title (e.g., Spring Exhibit)"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                backgroundColor: galleryTheme.background,
                borderColor: galleryTheme.lightGray,
                color: galleryTheme.dark,
                outlineColor: galleryTheme.primary
              }}
              autoFocus
            />
          </div>

          {/* Image Upload and Preview (Using separate state value: imagePath) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image Preview */}
            <div className="md:col-span-1">
                <p className="block text-sm font-medium mb-2" style={{ color: galleryTheme.dark }}>Image Preview</p>
                <div className="w-full aspect-video overflow-hidden rounded-lg border shadow-sm" style={{borderColor: galleryTheme.lightGray}}>
                    <img
                        src={getImageUrl(imagePath)} // Use separate state value
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = DEFAULT_PLACEHOLDER }}
                    />
                </div>
            </div>

            {/* Upload Area */}
            <div className="md:col-span-1">
                <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: galleryTheme.dark }}
                >
                    Upload New Image
                </label>
                <label
                    className={`block h-full p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-200 flex items-center justify-center ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    style={{
                        borderColor: galleryTheme.primary,
                        color: galleryTheme.primary,
                        fontWeight: "500",
                    }}
                >
                    <div className="flex items-center gap-2">
                        <FiImage size={20} />
                        Click or drag to upload
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
                backgroundColor: galleryTheme.lightGray,
                color: galleryTheme.dark,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!galleryName.trim() || isSaving} // Use separate state value
              className="flex items-center gap-2 px-5 py-2 text-base font-medium rounded-lg transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: galleryTheme.accent,
                color: galleryTheme.white,
                boxShadow: `0 4px 6px -1px ${galleryTheme.accent}30`,
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

  const LoadingIndicator = () => (
    <div className="flex items-center justify-center min-h-[100vh]">
        <div className="text-center p-6 rounded-lg" style={{backgroundColor: galleryTheme.white}}>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 mx-auto mb-4" style={{ borderColor: galleryTheme.lightGray, borderTopColor: galleryTheme.primary }}></div>
            <p className="text-lg font-medium" style={{ color: galleryTheme.dark }}>Loading gallery items...</p>
        </div>
      </div>
  );

  const EmptyState = () => (
    <div
      className="p-12 border rounded-xl text-center shadow-inner"
      style={{
          backgroundColor: galleryTheme.white,
          borderColor: galleryTheme.lightGray,
      }}
    >
      <div className="mx-auto mb-4 p-3 rounded-full inline-block" style={{backgroundColor: galleryTheme.primary + '10'}}>
          <FiImage size={32} style={{ color: galleryTheme.primary }} />
      </div>
      <h3 className="text-xl font-semibold mb-2" style={{ color: galleryTheme.dark }}>Gallery is Empty</h3>
      <p style={{ color: galleryTheme.light }}>
        No gallery items found. Click **'Add Gallery'** to upload your first image and title.
      </p>
    </div>
  );

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: galleryTheme.background,
      }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1
              className="text-4xl font-extrabold mb-1"
              style={{ color: galleryTheme.dark }}
            >
              Image Gallery Dashboard 🖼️
            </h1>
            <p className="text-sm" style={{ color: galleryTheme.light }}>
              Create, edit, and manage your visual assets efficiently.
            </p>
          </div>
          {/* Add button */}
          {!isLoading && (
            <button
              onClick={handleAddClick}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: galleryTheme.primary,
                color: galleryTheme.white,
                boxShadow: `0 4px 6px -1px ${galleryTheme.primary}30`,
              }}
            >
              <FiPlus size={18} />
              Add Gallery Item
            </button>
          )}
        </div>
      </div>

      {/* Conditional Rendering */}
      {isLoading ? (
        <LoadingIndicator />
      ) : galleryItems.length === 0 ? (
        <EmptyState />
      ) : (
        /* Gallery Grid */
        <section>
            <h2 className="text-2xl font-semibold mb-6" style={{color: galleryTheme.dark}}>All Items ({galleryItems.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl relative group"
                style={{ backgroundColor: galleryTheme.white }}
              >
                {/* Image Area (Maximised) */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.galleryName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => { e.target.src = DEFAULT_PLACEHOLDER }}
                  />
                </div>

                {/* Content Footer */}
                <div className="p-4">
                  <h3
                    className="text-lg font-bold truncate"
                    style={{ color: galleryTheme.dark }}
                  >
                    {item.galleryName}
                  </h3>
                </div>

                {/* Floating Action Buttons (Hidden until hover) */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="p-3 rounded-full transition-all duration-200 hover:scale-105 shadow-md"
                    title="Edit Item"
                    style={{ backgroundColor: galleryTheme.secondary, color: galleryTheme.white }}
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-3 rounded-full transition-all duration-200 hover:scale-105 shadow-md"
                    title="Delete Item"
                    style={{ backgroundColor: galleryTheme.red, color: galleryTheme.white }}
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
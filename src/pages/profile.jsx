"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, 
  FiLock, FiEye, FiEyeOff, FiSave, FiEdit2,
  FiShield, FiCheck, FiX, FiKey, FiUserCheck
} from "react-icons/fi";
import { TbAlertHexagon, TbPasswordUser } from "react-icons/tb";
import axios from "axios";

export default function Profile() {
  const profile = useSelector(store => store.profile.profile);
  const backend_domain_name = import.meta.env.VITE_BACKEND_DOMAIN_NAME;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  
  // Password states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const theme = {
    primary: "#3FA7A3",
    secondary: "#6C63FF",
    accent: "#2ECC71",
    dark: "#1E293B",
    light: "#64748B",
    background: "#F8FAFC",
    white: "#FFFFFF",
    gradient: "linear-gradient(135deg, #3FA7A3 0%, #6C63FF 100%)",
    cardBg: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Validate password
  const validatePassword = () => {
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
    let isValid = true;

    if (!passwordData.currentPassword.trim()) {
      errors.currentPassword = "Current password is required";
      isValid = false;
    }

    if (!passwordData.newPassword.trim()) {
      errors.newPassword = "New password is required";
      isValid = false;
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!passwordData.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your new password";
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${backend_domain_name}api/user/updatePassword`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          user_id: profile.id
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setSuccess("Password updated successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        // setEditMode(false);
      }
    } catch (err) {
      console.error("Error changing password:", err);
      if (err.response) {
        if (err.response.status === 401) {
          setError("Current password is incorrect");
        } else if (err.response.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to update password. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Profile Avatar Component
  const ProfileAvatar = ({ user, size = "xl" }) => {
    const sizeClasses = {
      sm: "w-20 h-20",
      md: "w-28 h-28",
      lg: "w-36 h-36",
      xl: "w-44 h-44"
    };

    const getInitials = (name) => {
      if (!name) return "?";
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    const getAvatarColor = (name) => {
      if (!name) return theme.primary;
      const colors = [
        "#3FA7A3", // primary
        "#6C63FF", // secondary
        "#2ECC71", // accent
        "#FF6B6B", // red
        "#FFA726", // orange
        "#9C27B0", // purple
        "#2196F3", // blue
      ];
      const index = name.length % colors.length;
      return colors[index];
    };

    if (user.profile && user.profile !== "null" && user.profile !== "undefined") {
      return (
        <div className={`${sizeClasses[size]} relative overflow-hidden rounded-full mx-auto border-4 shadow-lg`} 
             style={{ 
               borderColor: 'rgba(255, 255, 255, 0.3)',
               backgroundColor: theme.white,
               boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
             }}>
          <img 
            src={`${backend_domain_name}uploads/${user.profile}`}
            alt={user.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div 
            className="absolute inset-0 hidden items-center justify-center font-bold text-white text-3xl"
            style={{ 
              background: `linear-gradient(135deg, ${getAvatarColor(user.name)} 0%, ${getAvatarColor(user.name)}80 100%)`
            }}
          >
            {getInitials(user.name)}
          </div>
        </div>
      );
    }

    return (
      <div 
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white text-3xl mx-auto shadow-lg`}
        style={{ 
          background: `linear-gradient(135deg, ${getAvatarColor(user.name)} 0%, ${getAvatarColor(user.name)}80 100%)`,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
        }}
      >
        {getInitials(user.name)}
      </div>
    );
  };

  // Info Card Component
  const InfoCard = ({ icon: Icon, label, value, color = theme.dark }) => {
    return (
      <div className="flex items-center p-4 rounded-xl border border-transparent hover:border-gray-200 transition-all duration-300 hover:shadow-sm bg-white/50 backdrop-blur-sm">
        <div className="mr-4 p-3 rounded-xl shadow-sm" style={{ 
          background: theme.gradient,
          color: theme.white 
        }}>
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: theme.light }}>
            {label}
          </p>
          <p className="font-semibold text-lg" style={{ color: color }}>{value || "Not provided"}</p>
        </div>
      </div>
    );
  };

  // Password Strength Indicator
  const PasswordStrength = ({ password }) => {
    if (!password) return null;
    
    const getStrength = (pass) => {
      let strength = 0;
      if (pass.length >= 6) strength++;
      if (/[A-Z]/.test(pass)) strength++;
      if (/[0-9]/.test(pass)) strength++;
      if (/[^A-Za-z0-9]/.test(pass)) strength++;
      return strength;
    };

    const strength = getStrength(password);
    const strengthText = ["Very Weak", "Weak", "Fair", "Good", "Strong"][strength];
    const strengthColor = ["#EF4444", "#F59E0B", "#3B82F6", "#10B981", "#059669"][strength];

    return (
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium" style={{ color: theme.light }}>
            Password Strength
          </span>
          <span className="text-xs font-semibold" style={{ color: strengthColor }}>
            {strengthText}
          </span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-300"
            style={{ 
              width: `${(strength / 4) * 100}%`,
              backgroundColor: strengthColor
            }}
          ></div>
        </div>
      </div>
    );
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ 
        background: theme.gradient 
      }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: theme.white }}></div>
          <p className="text-white font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ 
      background: `linear-gradient(135deg, ${theme.background} 0%, #e0f2fe 100%)`
    }}>
      <div className="max-w-7xl mx-auto">
        {/* Header with gradient background */}
        <div className="relative rounded-2xl mb-8 overflow-hidden" style={{ 
          background: theme.gradient 
        }}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                  My Profile
                </h1>
                <p className="text-white/80">
                  Manage your account and security settings
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <FiUserCheck className="text-white" />
                <span className="text-white font-medium">
                  {profile.role?.charAt(0).toUpperCase() + profile.role?.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-2">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
              <div className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="relative">
                    <ProfileAvatar user={profile} size="lg" />
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ 
                        background: theme.gradient,
                        color: theme.white 
                      }}>
                        <FiUser size={16} />
                      </div>
                    </div>
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: theme.dark }}>
                      {profile.name}
                    </h2>
                    <p className="text-lg mb-4" style={{ color: theme.light }}>
                      {profile.email}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <span className="px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                            style={{ 
                              backgroundColor: theme.primary + '10',
                              color: theme.primary,
                              border: `1px solid ${theme.primary}20`
                            }}>
                        Grade {profile.grade}
                      </span>
                      <span className="px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                            style={{ 
                              backgroundColor: theme.secondary + '10',
                              color: theme.secondary,
                              border: `1px solid ${theme.secondary}20`
                            }}>
                        {profile.gender}
                      </span>
                      <span className="px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                            style={{ 
                              backgroundColor: theme.accent + '10',
                              color: theme.accent,
                              border: `1px solid ${theme.accent}20`
                            }}>
                        Academic Year {profile.academic_year}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: theme.dark }}>
                  <div className="p-2 rounded-lg" style={{ 
                    background: `linear-gradient(135deg, ${theme.primary}20 0%, ${theme.secondary}20 100%)`,
                    color: theme.primary 
                  }}>
                    <FiUser size={18} />
                  </div>
                  Personal Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide mb-1" style={{ color: theme.light }}>
                      Father's Name
                    </p>
                    <p className="font-medium" style={{ color: theme.dark }}>
                      {profile.father_name || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide mb-1" style={{ color: theme.light }}>
                      Guardian Phone
                    </p>
                    <p className="font-medium" style={{ color: theme.dark }}>
                      {profile.guardianPhone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide mb-1" style={{ color: theme.light }}>
                      Age
                    </p>
                    <p className="font-medium" style={{ color: theme.dark }}>
                      {profile.age || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: theme.dark }}>
                  <div className="p-2 rounded-lg" style={{ 
                    background: `linear-gradient(135deg, ${theme.secondary}20 0%, ${theme.accent}20 100%)`,
                    color: theme.secondary 
                  }}>
                    <FiPhone size={18} />
                  </div>
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide mb-1" style={{ color: theme.light }}>
                      Phone Number
                    </p>
                    <p className="font-medium" style={{ color: theme.dark }}>
                      {profile.phone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide mb-1" style={{ color: theme.light }}>
                      City
                    </p>
                    <p className="font-medium" style={{ color: theme.dark }}>
                      {profile.city || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide mb-1" style={{ color: theme.light }}>
                      Account Status
                    </p>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
                          style={{ 
                            backgroundColor: theme.accent + '10',
                            color: theme.accent 
                          }}>
                      <FiCheck size={14} />
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Timeline */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: theme.dark }}>
                <div className="p-2 rounded-lg" style={{ 
                  background: `linear-gradient(135deg, ${theme.accent}20 0%, ${theme.primary}20 100%)`,
                  color: theme.accent 
                }}>
                  <FiCalendar size={18} />
                </div>
                Account Timeline
              </h3>
              <div className="relative pl-8">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ backgroundColor: theme.light + '30' }}></div>
                
                {/* Created at */}
                <div className="relative mb-8">
                  <div className="absolute left-[-22px] top-1 w-3 h-3 rounded-full" style={{ backgroundColor: theme.primary }}></div>
                  <div>
                    <p className="text-xs uppercase tracking-wide mb-1" style={{ color: theme.light }}>
                      Account Created
                    </p>
                    <p className="font-medium text-lg" style={{ color: theme.dark }}>
                      {formatDate(profile.created_at)}
                    </p>
                  </div>
                </div>

                {/* Updated at */}
                <div className="relative">
                  <div className="absolute left-[-22px] top-1 w-3 h-3 rounded-full" style={{ backgroundColor: theme.secondary }}></div>
                  <div>
                    <p className="text-xs uppercase tracking-wide mb-1" style={{ color: theme.light }}>
                      Last Updated
                    </p>
                    <p className="font-medium text-lg" style={{ color: theme.dark }}>
                      {formatDate(profile.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Password Update */}
          <div className="lg:col-span-1">
            {/* Security Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
              <div className="relative p-6" style={{ 
                background: `linear-gradient(135deg, ${theme.dark} 0%, ${theme.light} 100%)`
              }}>
                <div className="absolute top-4 right-4">
                  <TbPasswordUser className="text-white/20" size={40} />
                </div>
                <div className="relative">
                  <h3 className="text-xl font-bold mb-2 text-white">Security Center</h3>
                  <p className="text-white/80 text-sm">Manage your password and account security</p>
                </div>
              </div>
              
              <div className="p-6">
                {editMode ? (
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    {/* Error/Success Messages */}
                    {error && (
                      <div className="p-4 rounded-xl flex items-start gap-3 animate-fadeIn" 
                           style={{ 
                             backgroundColor: '#FEE2E2',
                             border: '1px solid #FECACA'
                           }}>
                        <TbAlertHexagon size={20} className="text-red-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-700">Error</p>
                          <p className="text-sm text-red-600 mt-1">{error}</p>
                        </div>
                      </div>
                    )}

                    {success && (
                      <div className="p-4 rounded-xl flex items-start gap-3 animate-fadeIn" 
                           style={{ 
                             backgroundColor: '#D1FAE5',
                             border: '1px solid #A7F3D0'
                           }}>
                        <FiCheck size={20} className="text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-700">Success!</p>
                          <p className="text-sm text-green-600 mt-1">{success}</p>
                        </div>
                      </div>
                    )}

                    {/* Current Password */}
                    <div>
                      <label className="block text-sm text-black font-medium mb-3 flex items-center gap-2" style={{ color: theme.dark }}>
                        <FiKey size={14} />
                        Current Password
                      </label>
                      <div className="relative group">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => {
                            setPasswordData({...passwordData, currentPassword: e.target.value});
                            setPasswordErrors({...passwordErrors, currentPassword: ""});
                          }}
                          className="w-full p-4 pr-12 rounded-xl  text-black transition-all duration-200 group-hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2"
                          style={{ 
                            borderColor: passwordErrors.currentPassword ? "#EF4444" : "#E2E8F0",
                            backgroundColor: passwordErrors.currentPassword ? "#FEF2F2" : "#F8FAFC",
                            boxShadow: passwordErrors.currentPassword ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : 'none'
                          }}
                          placeholder="Enter your current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: theme.light }}
                        >
                          {showCurrentPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="text-sm mt-2 flex items-center gap-1" style={{ color: "#EF4444" }}>
                          <FiX size={14} />
                          {passwordErrors.currentPassword}
                        </p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium mb-3 flex items-center gap-2" style={{ color: theme.dark }}>
                        <FiLock size={14} />
                        New Password
                      </label>
                      <div className="relative group">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => {
                            setPasswordData({...passwordData, newPassword: e.target.value});
                            setPasswordErrors({...passwordErrors, newPassword: ""});
                          }}
                          className="w-full p-4 pr-12 rounded-xl border transition-all text-black duration-200 group-hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2"
                          style={{ 
                            borderColor: passwordErrors.newPassword ? "#EF4444" : "#E2E8F0",
                            backgroundColor: passwordErrors.newPassword ? "#FEF2F2" : "#F8FAFC",
                            boxShadow: passwordErrors.newPassword ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : 'none'
                          }}
                          placeholder="Create a new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: theme.light }}
                        >
                          {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="text-sm mt-2 flex items-center gap-1" style={{ color: "#EF4444" }}>
                          <FiX size={14} />
                          {passwordErrors.newPassword}
                        </p>
                      )}
                      {passwordData.newPassword && (
                        <PasswordStrength password={passwordData.newPassword} />
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium mb-3 flex items-center gap-2" style={{ color: theme.dark }}>
                        <FiShield size={14} />
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => {
                            setPasswordData({...passwordData, confirmPassword: e.target.value});
                            setPasswordErrors({...passwordErrors, confirmPassword: ""});
                          }}
                          className="w-full p-4 pr-12 rounded-xl border text-black transition-all duration-200 group-hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2"
                          style={{ 
                            borderColor: passwordErrors.confirmPassword ? "#EF4444" : "#E2E8F0",
                            backgroundColor: passwordErrors.confirmPassword ? "#FEF2F2" : "#F8FAFC",
                            boxShadow: passwordErrors.confirmPassword ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : 'none'
                          }}
                          placeholder="Confirm your new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: theme.light }}
                        >
                          {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="text-sm mt-2 flex items-center gap-1" style={{ color: "#EF4444" }}>
                          <FiX size={14} />
                          {passwordErrors.confirmPassword}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: ""
                          });
                          setPasswordErrors({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: ""
                          });
                          setError("");
                          setSuccess("");
                        }}
                        className="flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-md"
                        style={{ 
                          backgroundColor: theme.light + '10',
                          color: theme.light,
                          border: `1px solid ${theme.light}20`
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{ 
                          background: theme.gradient,
                          color: theme.white
                        }}
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{ borderColor: theme.white }}></div>
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <FiSave size={18} />
                            <span>Update</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="mb-6 p-4 rounded-2xl inline-flex" style={{ 
                      background: `linear-gradient(135deg, ${theme.primary}20 0%, ${theme.secondary}20 100%)`
                    }}>
                      <FiLock size={40} style={{ color: theme.primary }} />
                    </div>
                    <h4 className="font-bold text-xl mb-3" style={{ color: theme.dark }}>
                      Password Security
                    </h4>
                    <p className="text-sm mb-6" style={{ color: theme.light }}>
                      Your password hasn't been changed recently. It's recommended to update it periodically.
                    </p>
                    <button
                      onClick={() => setEditMode(true)}
                      className="w-full py-4 rounded-xl font-medium transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
                      style={{ 
                        background: theme.gradient,
                        color: theme.white
                      }}
                    >
                      <FiEdit2 size={18} />
                      <span>Change Password</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Security Tips */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.dark }}>
                <FiShield style={{ color: theme.primary }} />
                Security Tips
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: theme.primary + '10' }}>
                    <span className="text-xs font-bold" style={{ color: theme.primary }}>1</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1" style={{ color: theme.dark }}>Use Strong Passwords</p>
                    <p className="text-xs" style={{ color: theme.light }}>Mix letters, numbers, and symbols</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: theme.secondary + '10' }}>
                    <span className="text-xs font-bold" style={{ color: theme.secondary }}>2</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1" style={{ color: theme.dark }}>Never Share Credentials</p>
                    <p className="text-xs" style={{ color: theme.light }}>Keep your login details private</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: theme.accent + '10' }}>
                    <span className="text-xs font-bold" style={{ color: theme.accent }}>3</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1" style={{ color: theme.dark }}>Log Out on Shared Devices</p>
                    <p className="text-xs" style={{ color: theme.light }}>Always sign out from public computers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add some custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease;
        }
      `}</style>
    </div>
  );
}
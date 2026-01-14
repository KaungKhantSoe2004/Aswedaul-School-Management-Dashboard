"use client";
import { useEffect, useState } from "react";
import { 
  FiBook, FiUsers, FiMail, FiPhone, FiUser, FiVideo, 
  FiGlobe, FiFileText, FiAward, FiChevronRight, FiStar,
  FiCalendar, FiClock, FiTrendingUp, FiBookOpen
} from "react-icons/fi";
import { TbAlertHexagon, TbCertificate } from "react-icons/tb";
import { PiChalkboardTeacherFill, PiStudentFill } from "react-icons/pi";
import { MdWorkspacePremium, MdGroups } from "react-icons/md";
import { useSelector } from "react-redux";
import axios from "axios";

export default function GradeEnvironment() {
  const studentTheme = {
    primary: "#2563EB",      // Professional blue
    secondary: "#7C3AED",   // Elegant purple
    accent: "#059669",      // Success green
    warning: "#D97706",     // Amber
    dark: "#1F2937",        // Dark gray
    light: "#6B7280",       // Light gray
    background: "#F9FAFB",  // Light background
    cardBg: "#FFFFFF",      // White for cards
    border: "#E5E7EB",      // Border color
  };
  
  const profile = useSelector(store => store.profile.profile);
  const backend_domain_name = import.meta.env.VITE_BACKEND_DOMAIN_NAME;
  const admin_backend_domain_name = import.meta.env.VITE_ADMIN_BACKEND_DOMAIN_NAME;

  const [selectedSubjectTab, setSelectedSubjectTab] = useState("");
  const [selectedExamTab, setSelectedExamTab] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for backend data
  const [teachers, setTeachers] = useState([]);
  const [gradeManagers, setGradeManagers] = useState([]);
  const [classStudents, setClassStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [examResults, setExamResults] = useState({});
  const [studyMaterials, setStudyMaterials] = useState({});
  const [subjects, setSubjects] = useState([]);

  // Profile Avatar Component
  const ProfileAvatar = ({ user, size = "medium", showBadge = false, badgeContent = null }) => {
    const sizeClasses = {
      small: "w-8 h-8 text-xs",
      medium: "w-10 h-10 text-sm",
      large: "w-12 h-12 text-base"
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
      if (!name) return studentTheme.primary;
      const colors = [
        "#2563EB", // primary blue
        "#7C3AED", // secondary purple
        "#059669", // accent green
        "#DC2626", // red
        "#D97706", // amber
        "#9333EA", // violet
        "#0284C7", // sky blue
      ];
      const index = name.length % colors.length;
      return colors[index];
    };

    const avatarContent = (
      <div className="relative">
        {user.profile && user.profile !== "null" && user.profile !== "undefined" ? (
          <div className={`${sizeClasses[size]} relative overflow-hidden rounded-full border-2`} 
               style={{ borderColor: studentTheme.border }}>
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
              className="absolute inset-0 hidden items-center justify-center font-semibold text-white"
              style={{ backgroundColor: getAvatarColor(user.name) }}
            >
              {getInitials(user.name)}
            </div>
          </div>
        ) : (
          <div 
            className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold text-white border-2`}
            style={{ 
              backgroundColor: getAvatarColor(user.name),
              borderColor: studentTheme.border
            }}
          >
            {getInitials(user.name)}
          </div>
        )}
        
        {showBadge && badgeContent && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-white border">
            {badgeContent}
          </div>
        )}
      </div>
    );

    return avatarContent;
  };

  // User Profile Card Component
  const UserProfileCard = ({ user, role, showContact = true, compact = false }) => {
    const roleIcons = {
      teacher: <PiChalkboardTeacherFill className="text-blue-500" />,
      manager: <MdWorkspacePremium className="text-purple-500" />,
      student: <PiStudentFill className="text-green-500" />
    };

    const roleColors = {
      teacher: "bg-blue-50 text-blue-700 border-blue-200",
      manager: "bg-purple-50 text-purple-700 border-purple-200",
      student: "bg-green-50 text-green-700 border-green-200"
    };

    return (
      <div className={`flex items-center ${compact ? 'p-2' : 'p-3'} rounded-xl border transition-all duration-200 hover:shadow-md`}
           style={{ 
             backgroundColor: studentTheme.cardBg,
             borderColor: studentTheme.border
           }}>
        <div className="relative">
          <ProfileAvatar user={user} size={compact ? "small" : "medium"} />
          <div className={`absolute bottom-0 right-0 p-0.5 rounded-full border ${compact ? 'scale-75' : ''}`}
               style={{ backgroundColor: studentTheme.cardBg }}>
            {roleIcons[role]}
          </div>
        </div>
        
        <div className="ml-3 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold truncate text-sm" style={{ color: studentTheme.dark }}>
                {user.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${roleColors[role]}`}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
                {user.subject_name && !compact && (
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {user.subject_name}
                  </span>
                )}
              </div>
            </div>
            
            {showContact && user.email && !compact && (
              <div className="hidden md:flex items-center gap-2">
                <a 
                  href={`mailto:${user.email}`}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                  style={{ color: studentTheme.light }}
                >
                  <FiMail size={16} />
                </a>
                {user.phone && (
                  <a 
                    href={`tel:${user.phone}`}
                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                    style={{ color: studentTheme.light }}
                  >
                    <FiPhone size={16} />
                  </a>
                )}
              </div>
            )}
          </div>
          
          {!compact && (
            <>
              {showContact && (
                <div className="mt-2 flex flex-col gap-1">
                  {user.email && (
                    <div className="flex items-center gap-2 text-xs" style={{ color: studentTheme.light }}>
                      <FiMail size={12} />
                      <span className="truncate">{user.email}</span>
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center gap-2 text-xs" style={{ color: studentTheme.light }}>
                      <FiPhone size={12} />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
              )}

              {(user.grade || user.gender) && !compact && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {user.grade && (
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100" style={{ color: studentTheme.dark }}>
                      Grade {user.grade}
                    </span>
                  )}
                  {user.gender && (
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100" style={{ color: studentTheme.dark }}>
                      {user.gender}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        
        {!compact && (
          <FiChevronRight className="text-gray-400 ml-2" size={18} />
        )}
      </div>
    );
  };

  // Stats Card Component
  const StatsCard = ({ icon: Icon, title, value, color, subtext }) => {
    return (
      <div className="bg-white rounded-xl p-4 border shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg" style={{ backgroundColor: color + '20' }}>
            <Icon size={20} style={{ color }} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold" style={{ color: studentTheme.dark }}>{value}</p>
            {subtext && (
              <p className="text-xs text-gray-500 mt-1">{subtext}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Transform study materials from backend format to frontend format
  const transformStudyMaterials = (subjectData) => {
    const materials = [];
    let materialId = 1;

    const parseMaterials = (materialString) => {
      if (!materialString) return [];
      
      try {
        if (Array.isArray(materialString)) return materialString;
        const parsed = JSON.parse(materialString);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error("Error parsing materials:", e);
        return [];
      }
    };

    const fileMaterials = parseMaterials(subjectData.study_material_file);
    fileMaterials.forEach(file => {
      materials.push({
        id: materialId++,
        name: file.title || file.name || "Study Material File",
        type: "file",
        icon: <FiFileText />,
        url: file.url || file.path,
        description: file.description
      });
    });

    const videoMaterials = parseMaterials(subjectData.study_material_video);
    videoMaterials.forEach(video => {
      materials.push({
        id: materialId++,
        name: video.title || video.name || "Video Material",
        type: "video",
        icon: <FiVideo />,
        url: video.url,
        description: video.description
      });
    });

    const webMaterials = parseMaterials(subjectData.study_material_web);
    webMaterials.forEach(web => {
      materials.push({
        id: materialId++,
        name: web.title || web.name || "Web Resource",
        type: "website",
        icon: <FiGlobe />,
        url: web.url,
        description: web.description
      });
    });

    return materials;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(
        `${admin_backend_domain_name}api/student/gradeGradeEnv/${profile.grade}`,
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        const data = response.data.data;

        if (data.subjects && Array.isArray(data.subjects)) {
          const subjectsList = data.subjects.map(subject => subject.subject_name);
          setSubjects(subjectsList);
          
          if (subjectsList.length > 0) {
            setSelectedSubjectTab(subjectsList[0]);
          }

          const materialsBySubject = {};
          data.subjects.forEach(subject => {
            materialsBySubject[subject.subject_name] = transformStudyMaterials(subject);
          });
          setStudyMaterials(materialsBySubject);
        }

        if (data.teachers && Array.isArray(data.teachers)) {
          const transformedTeachers = data.teachers.map((teacher, index) => ({
            id: teacher.id || index + 1,
            name: teacher.name,
            subject: teacher.subject_name,
            email: teacher.email,
            phone: teacher.phone,
            profile: teacher.profile,
            gender: teacher.gender,
            subject_name: teacher.subject_name,
            role: 'teacher'
          }));
          setTeachers(transformedTeachers);
        }

        if (data.managers && Array.isArray(data.managers)) {
          const transformedManagers = data.managers.map((manager, index) => ({
            id: manager.id || index + 1,
            name: manager.name,
            email: manager.email,
            phone: manager.phone,
            profile: manager.profile,
            gender: manager.gender,
            role: 'manager'
          }));
          setGradeManagers(transformedManagers);
        }

        if (data.students && Array.isArray(data.students)) {
          const transformedStudents = data.students.map((student, index) => ({
            id: student.id || index + 1,
            name: student.name,
            rollNumber: student.roll || student.rollNumber || index + 1,
            profile: student.profile,
            email: student.email,
            phone: student.phone,
            gender: student.gender,
            grade: student.grade,
            role: 'student'
          }));
          setClassStudents(transformedStudents);
        }
      }
    } catch (error) {
      console.error("Error fetching grade environment data:", error);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchExams = async() => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${admin_backend_domain_name}api/student/marks/${profile.grade}/${profile.id}`, 
        { withCredentials: true }
      );
      
      if (response.status === 200 && Array.isArray(response.data?.data)) {
        const examsData = response.data.data;
        setExams(examsData);
        
        if (examsData.length > 0) {
          setSelectedExamTab(examsData[0].exam_name);
        }
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  // Process exam results and combine with student data
  const processExamResults = () => {
    if (!exams.length || !classStudents.length) return {};

    const processedResults = {};
    
    exams.forEach(exam => {
      if (exam.result && Array.isArray(exam.result)) {
        const sortedResults = [...exam.result].sort((a, b) => 
          parseFloat(b.total_got_marks) - parseFloat(a.total_got_marks)
        );
        
        const top10Results = sortedResults.slice(0, 10);
        
        const combinedResults = top10Results.map((result, index) => {
          const student = classStudents.find(s => s.id === result.student_id);
          return {
            rank: index + 1,
            resultData: result,
            studentData: student || {
              id: result.student_id,
              name: `Student ${result.student_id}`,
              marks: `${parseFloat(result.total_got_marks)}/${parseFloat(result.full_marks)} (${((parseFloat(result.total_got_marks) / parseFloat(result.full_marks)) * 100).toFixed(1)}%)`,
              percentage: ((parseFloat(result.total_got_marks) / parseFloat(result.full_marks)) * 100).toFixed(1),
              result_status: result.result_status,
              profile: null,
              gender: "Unknown"
            }
          };
        });
        
        processedResults[exam.exam_name] = combinedResults;
      }
    });
    
    return processedResults;
  };

  const handleMaterialAction = (material) => {
    if (material.url) {
      if (material.type === 'website' || material.type === 'video') {
        window.open(material.url, '_blank', 'noopener,noreferrer');
      } else if (material.type === 'file') {
        if (material.url.startsWith('http')) {
          window.open(material.url, '_blank', 'noopener,noreferrer');
        } else {
          window.open(`${backend_domain_name}uploads/${material.url}`, '_blank', 'noopener,noreferrer');
        }
      }
    } else {
      alert(`No URL available for ${material.name}`);
    }
  };

  useEffect(() => {
    if (profile && profile.grade) {
      fetchData();
      fetchExams();
    }
  }, [profile]);

  useEffect(() => {
    const results = processExamResults();
    setExamResults(results);
  }, [exams, classStudents]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: studentTheme.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto" 
               style={{ borderColor: studentTheme.primary, borderTopColor: 'transparent' }}></div>
          <p className="mt-4 font-medium" style={{ color: studentTheme.dark }}>Loading Grade Environment...</p>
          <p className="text-sm mt-1" style={{ color: studentTheme.light }}>Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: studentTheme.background }}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
               style={{ backgroundColor: '#FEF2F2' }}>
            <TbAlertHexagon size={32} className="text-red-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: studentTheme.dark }}>Unable to Load Data</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-3 rounded-xl font-medium transition hover:shadow-lg"
            style={{ 
              backgroundColor: studentTheme.primary, 
              color: 'white'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: studentTheme.background }}>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
                   style={{ backgroundColor: studentTheme.primary + '20' }}>
                <FiBookOpen size={18} style={{ color: studentTheme.primary }} />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: studentTheme.dark }}>
                Grade {profile?.grade} Dashboard
              </h1>
            </div>
            <p className="text-gray-600">Welcome to your academic environment</p>
          </div>
          
          {profile && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border shadow-sm">
              <ProfileAvatar user={profile} size="medium" showBadge={true} badgeContent="✓" />
              <div>
                <h3 className="font-semibold text-sm" style={{ color: studentTheme.dark }}>{profile.name}</h3>
                <p className="text-xs text-gray-500">Grade {profile.grade} Student</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            icon={PiChalkboardTeacherFill}
            title="Teachers"
            value={teachers.length}
            color={studentTheme.primary}
          />
          <StatsCard 
            icon={MdGroups}
            title="Classmates"
            value={classStudents.length}
            color={studentTheme.secondary}
          />
          <StatsCard 
            icon={FiBook}
            title="Subjects"
            value={subjects.length}
            color={studentTheme.accent}
          />
          <StatsCard 
            icon={TbCertificate}
            title="Exams"
            value={exams.length}
            color={studentTheme.warning}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Teachers Section */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-5 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <PiChalkboardTeacherFill size={20} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: studentTheme.dark }}>
                    Your Teachers
                  </h3>
                  <p className="text-sm text-gray-500">{teachers.length} educators</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 max-h-80 overflow-y-auto">
            {teachers.length > 0 ? (
              <div className="space-y-3">
                {teachers.map((teacher) => (
                  <UserProfileCard key={teacher.id} user={teacher} role="teacher" />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <PiChalkboardTeacherFill className="mx-auto mb-3 text-gray-400" size={32} />
                <p className="text-gray-500">No teachers assigned</p>
              </div>
            )}
          </div>
        </div>

        {/* Grade Managers Section */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-5 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50">
                  <MdWorkspacePremium size={20} className="text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: studentTheme.dark }}>
                    Grade Managers
                  </h3>
                  <p className="text-sm text-gray-500">{gradeManagers.length} administrative staff</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 max-h-80 overflow-y-auto">
            {gradeManagers.length > 0 ? (
              <div className="space-y-3">
                {gradeManagers.map((manager) => (
                  <UserProfileCard key={manager.id} user={manager} role="manager" />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MdWorkspacePremium className="mx-auto mb-3 text-gray-400" size={32} />
                <p className="text-gray-500">No managers assigned</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exam Rankings Section */}
      {exams.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50">
                <FiTrendingUp size={24} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: studentTheme.dark }}>
                  Exam Rankings
                </h2>
                <p className="text-sm text-gray-500">Top performers across examinations</p>
              </div>
            </div>
          </div>

          {/* Exam Tabs */}
          <div className="flex gap-1 mb-6 p-1 bg-gray-100 rounded-xl">
            {exams.map((exam) => (
              <button
                key={exam.id}
                onClick={() => setSelectedExamTab(exam.exam_name)}
                className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  selectedExamTab === exam.exam_name 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {exam.exam_name}
              </button>
            ))}
          </div>

          {/* Exam Ranking Table */}
          {selectedExamTab && examResults[selectedExamTab] && (
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="font-semibold text-lg" style={{ color: studentTheme.dark }}>
                      {selectedExamTab} Results
                    </h4>
                    <p className="text-sm text-gray-500">Top 10 ranked students</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3].map((rank) => (
                      <div key={rank} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
                        <div className={`w-2 h-2 rounded-full ${
                          rank === 1 ? 'bg-yellow-500' : 
                          rank === 2 ? 'bg-gray-400' : 
                          'bg-amber-700'
                        }`}></div>
                        <span className="text-xs font-medium">{rank}{rank === 1 ? 'st' : rank === 2 ? 'nd' : 'rd'}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  {examResults[selectedExamTab].map((item) => (
                    <div
                      key={`${item.studentData.id}-${item.rank}`}
                      className="flex items-center p-3 rounded-lg border hover:shadow-sm transition"
                    >
                      <div className="w-8 flex-shrink-0 text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          item.rank === 1 ? 'bg-yellow-50 text-yellow-700' :
                          item.rank === 2 ? 'bg-gray-50 text-gray-700' :
                          item.rank === 3 ? 'bg-amber-50 text-amber-700' :
                          'bg-blue-50 text-blue-700'
                        }`}>
                          {item.rank}
                        </div>
                      </div>
                      
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <ProfileAvatar user={item.studentData} size="small" />
                            <div>
                              <h5 className="font-medium text-sm" style={{ color: studentTheme.dark }}>
                                {item.studentData.name}
                              </h5>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">ID: {item.studentData.id}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  item.resultData.result_status === 'pass' 
                                    ? 'bg-green-50 text-green-700' 
                                    : 'bg-red-50 text-red-700'
                                }`}>
                                  {item.resultData.result_status.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold" style={{ color: studentTheme.dark }}>
                                {item.studentData.percentage || 
                                 ((parseFloat(item.resultData.total_got_marks) / parseFloat(item.resultData.full_marks)) * 100).toFixed(1)}%
                              </span>
                              <FiStar className="text-yellow-500" size={16} />
                            </div>
                            <p className="text-sm text-gray-500">
                              {item.resultData.total_got_marks}/{item.resultData.full_marks}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Study Materials Section */}
      {subjects.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-50 to-blue-50">
                <FiBook size={24} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: studentTheme.dark }}>
                  Study Materials
                </h2>
                <p className="text-sm text-gray-500">Resources organized by subject</p>
              </div>
            </div>
          </div>

          {/* Subject Tabs */}
          <div className="flex gap-1 mb-6 p-1 bg-gray-100 rounded-xl">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubjectTab(subject)}
                className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  selectedSubjectTab === subject 
                    ? 'bg-white shadow-sm text-green-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>

          {/* Materials Grid */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-lg" style={{ color: studentTheme.dark }}>
                  {selectedSubjectTab} Resources
                </h4>
                {selectedSubjectTab && studyMaterials[selectedSubjectTab]?.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {studyMaterials[selectedSubjectTab].length} materials available
                  </span>
                )}
              </div>
              
              {selectedSubjectTab && studyMaterials[selectedSubjectTab]?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studyMaterials[selectedSubjectTab].map((material) => {
                    const typeColors = {
                      video: 'bg-red-50 text-red-700 border-red-200',
                      website: 'bg-blue-50 text-blue-700 border-blue-200',
                      file: 'bg-green-50 text-green-700 border-green-200'
                    };
                    
                    const typeIcons = {
                      video: <FiVideo className="text-red-500" />,
                      website: <FiGlobe className="text-blue-500" />,
                      file: <FiFileText className="text-green-500" />
                    };

                    return (
                      <div
                        key={material.id}
                        className="p-4 border rounded-xl hover:shadow-md transition"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-white border">
                            {typeIcons[material.type]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium mb-1" style={{ color: studentTheme.dark }}>
                              {material.name}
                            </h5>
                            {material.description && (
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {material.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <span className={`text-xs px-2 py-1 rounded-full border ${typeColors[material.type]}`}>
                                {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
                              </span>
                              <button
                                onClick={() => handleMaterialAction(material)}
                                className="text-sm font-medium px-3 py-1.5 rounded-lg hover:shadow-sm transition"
                                style={{ 
                                  backgroundColor: material.type === 'video' ? '#EF4444' : 
                                               material.type === 'website' ? '#3B82F6' : 
                                               studentTheme.accent,
                                  color: 'white'
                                }}
                              >
                                {material.type === 'video' ? 'Watch' : 
                                 material.type === 'website' ? 'Visit' : 'Download'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiBook className="mx-auto mb-3 text-gray-400" size={32} />
                  <p className="text-gray-500">No study materials available for {selectedSubjectTab}</p>
                  <p className="text-sm text-gray-400 mt-1">Materials will be added by your teachers</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Classmates Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
              <PiStudentFill size={24} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: studentTheme.dark }}>
                Classmates
              </h2>
              <p className="text-sm text-gray-500">All students in Grade {profile?.grade}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {classStudents.length > 0 ? (
                classStudents.map((student) => (
                  <div key={student.id}>
                    <UserProfileCard user={student} role="student" compact={true} />
                    <div className="ml-12 mt-1">
                      <span className="text-xs text-gray-500">Roll: {student.rollNumber}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <PiStudentFill className="mx-auto mb-3 text-gray-400" size={32} />
                  <p className="text-gray-500">No classmates found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
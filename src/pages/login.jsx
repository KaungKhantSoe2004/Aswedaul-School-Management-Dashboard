"use client"

import axios from "axios"
import { useState, useEffect, useRef } from "react"
import { FiMail, FiLock, FiEye, FiEyeOff, FiBookOpen, FiChevronRight, FiShield, FiTrendingUp, FiUsers, FiCheck } from "react-icons/fi"
import { useNavigate } from "react-router-dom";
import { routeProtector } from "../assets/middleware";
import { useDispatch } from "react-redux";
import { setProfile } from "../store/reducers/profileReducer";

export default function LoginPage() {
  const navigate = useNavigate();
  const backend_domain_name = import.meta.env.VITE_BACKEND_DOMAIN_NAME;
  const admin_backend_domain_name = import.meta.env.VITE_ADMIN_BACKEND_DOMAIN_NAME;
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false);
  const dispatch = useDispatch();
  const fetchData = async()=>{
   const response = await axios.get(`${admin_backend_domain_name}api/me`, {
    withCredentials:true
   });
   if(response.status == 200){
      navigate('/');
      console.log(response.data, 'is response')
   }else{
     return
   }
    
  }
  const featureInterval = useRef(null)

  const schoolTheme = {
    primary: "#3FA7A3",
    secondary: "#6C63FF",
    accent: "#2ECC71",
    dark: "#1E293B",
    light: "#64748B",
    background: "#F8FAFC",
    white: "#FFFFFF",
    gradient: "linear-gradient(135deg, #3FA7A3 0%, #6C63FF 100%)",
    lightGradient: "linear-gradient(135deg, rgba(63, 167, 163, 0.1) 0%, rgba(108, 99, 255, 0.1) 100%)"
  }

  const features = [
    {
      icon: FiUsers,
      title: "Student Management",
      description: "Track student progress, attendance, and academic performance across all grades.",
      color: schoolTheme.primary
    },
    {
      icon: FiTrendingUp,
      title: "Analytics Dashboard",
      description: "Real-time insights with comprehensive reports and data visualizations.",
      color: schoolTheme.secondary
    },
    {
      icon: FiShield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security protecting sensitive student and school data.",
      color: schoolTheme.accent
    }
  ]

  useEffect(() => {
    fetchData();
    featureInterval.current = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 4000)
    return () => clearInterval(featureInterval.current)
  }, [])

  const handleSubmit = async (e) => {
   try{
    e.preventDefault()
    setLoginError("")
    
    console.log(email, password, 'is email and password')
    if (!email || !password) {
      
      setLoginError("Please fill in all fields")
      return
    }else{
      setIsLoading(true)
      const response = await axios.post(`${backend_domain_name}api/user/login`, {email, password}, {
        withCredentials:true
      });
      console.log(response);
      if(response.status == 200){
          const data = await routeProtector();
          if(data.status ==true){ 
           console.log(data.data,'is profile') 
           dispatch(setProfile(data.data));
           navigate("/")
            setIsLoading(false)  
          }
   
      }else{
        console.log(response, 'is resp dudde')
        setLoginError(response.data.message)
        setIsLoading(false)
      }

    }
    

    setIsLoading(false) 
   }catch(err){
    console.log(err, 'is error bro');
    setIsLoading(false) ;
    console.log(err.response.data.message)
      if(err.response.data.message){
        setLoginError(err.response.data.message)
      }
   }
  
  }

  const handleFeatureClick = (index) => {
    setActiveFeature(index)
    clearInterval(featureInterval.current)
    featureInterval.current = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 4000)
  }

  return (
    <div className="min-h-screen flex animate-fadeIn" style={{ backgroundColor: schoolTheme.background }}>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
        .animate-bounceIn {
          animation: bounceIn 0.6s ease-out;
        }
        
        .input-focus-glow:focus-within {
          box-shadow: 0 0 0 3px ${schoolTheme.primary}20;
          border-color: ${schoolTheme.primary}60;
        }
        
        .button-hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px ${schoolTheme.primary}40;
        }
        
        .feature-transition {
          transition: all 0.4s ease-in-out;
        }
      `}</style>

      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden animate-slideInLeft">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-5 animate-float" 
               style={{ background: schoolTheme.gradient, filter: 'blur(40px)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 animate-float" 
               style={{ animationDelay: '1s', background: schoolTheme.gradient, filter: 'blur(40px)' }} />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo and Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative group">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 group-hover:shadow-xl"
                     style={{ background: schoolTheme.gradient }}>
                  <FiBookOpen className="w-7 h-7" style={{ color: schoolTheme.white }} />
                </div>
                <div className="absolute -inset-2 rounded-xl opacity-0 group-hover:opacity-20 blur-sm transition-all duration-300" 
                     style={{ background: schoolTheme.gradient }} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r" 
                    style={{ 
                      backgroundImage: `linear-gradient(135deg, ${schoolTheme.dark} 0%, ${schoolTheme.primary} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                  Aswedaul Ed
                </h1>
                <p className="text-sm font-medium mt-1 transition-all duration-300 hover:opacity-80" style={{ color: schoolTheme.light }}>
                  Private High School • Admin Portal
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r" 
                  style={{ 
                    backgroundImage: `linear-gradient(135deg, ${schoolTheme.dark} 0%, ${schoolTheme.primary} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                Welcome Back
              </h2>
              <p className="text-lg transition-all duration-300 hover:opacity-80" style={{ color: schoolTheme.light }}>
                Sign in to access your school's admin dashboard
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold transition-all duration-300 hover:opacity-80" style={{ color: schoolTheme.dark }}>
                Email Address
              </label>
              <div className={`relative group input-focus-glow transition-all duration-300 ${isInputFocused ? 'scale-[1.01]' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 transition-all duration-300 group-hover:scale-110" style={{ color: schoolTheme.light }} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  className="block w-full pl-12 pr-4 py-4 border rounded-xl placeholder-gray-400 focus:outline-none transition-all duration-200 hover:shadow-md"
                  style={{
                    backgroundColor: schoolTheme.white,
                    borderColor: "#E2E8F0",
                    color: schoolTheme.dark,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                  }}
                  placeholder="admin@aswedauled.edu"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold transition-all duration-300 hover:opacity-80" style={{ color: schoolTheme.dark }}>
                  Password
                </label>
                <a href="#" className="text-sm font-medium transition-all duration-200 hover:opacity-80 hover:underline" 
                   style={{ color: schoolTheme.primary }}>
                  Forgot password?
                </a>
              </div>
              <div className={`relative group input-focus-glow transition-all duration-300 ${isInputFocused ? 'scale-[1.01]' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 transition-all duration-300 group-hover:scale-110" style={{ color: schoolTheme.light }} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  className="block w-full pl-12 pr-12 py-4 border rounded-xl placeholder-gray-400 focus:outline-none transition-all duration-200 hover:shadow-md"
                  style={{
                    backgroundColor: schoolTheme.white,
                    borderColor: "#E2E8F0",
                    color: schoolTheme.dark,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                  }}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center transition-all duration-200 hover:scale-110"
                  style={{ color: schoolTheme.light }}
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="animate-bounceIn">
                <div className="flex items-center gap-2 p-3 rounded-lg border" 
                     style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA', color: '#DC2626' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">{loginError}</span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {showSuccess && (
              <div className="animate-bounceIn">
                <div className="flex items-center gap-2 p-3 rounded-lg border" 
                     style={{ backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', color: schoolTheme.accent }}>
                  <FiCheck className="w-5 h-5" />
                  <span className="text-sm font-medium">Login successful! Redirecting...</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`w-full py-4 px-4 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden button-hover-effect ${isLoading ? 'cursor-wait' : ''}`}
              style={{
                background: schoolTheme.gradient,
                color: schoolTheme.white,
                boxShadow: `0 4px 20px ${schoolTheme.primary}40`,
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
              }}
            >
              {/* Button shine effect */}
              {isHovered && !isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />
              )}
              
              <span className="relative flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to Dashboard
                    <FiChevronRight className="h-5 w-5 transition-all duration-200" 
                      style={{ transform: isHovered ? 'translateX(5px)' : 'translateX(0)' }} />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Security Info */}
          <div className="mt-12 pt-6 border-t transition-all duration-300 hover:opacity-80"
               style={{ borderColor: `${schoolTheme.light}20` }}>
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center animate-pulse-slow"
                   style={{ backgroundColor: `${schoolTheme.primary}10` }}>
                <FiShield className="w-4 h-4" style={{ color: schoolTheme.primary }} />
              </div>
              <p className="text-sm text-center" style={{ color: schoolTheme.light }}>
                Secure login • Grades 1-12 Management • Protected by AES-256 encryption
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Features Showcase */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center p-12 relative overflow-hidden animate-slideInRight"
        style={{
          background: `linear-gradient(135deg, ${schoolTheme.primary}05 0%, ${schoolTheme.secondary}05 100%)`,
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                width: `${Math.random() * 150 + 50}px`,
                height: `${Math.random() * 150 + 50}px`,
                background: `radial-gradient(circle, ${schoolTheme.primary}02 0%, transparent 70%)`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${8 + Math.random() * 8}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-lg relative z-10">
          <div className="space-y-10">
            {/* Title Section */}
            <div className="space-y-6 transition-all duration-300 hover:opacity-95">
              <h2 className="text-5xl font-bold" style={{ color: schoolTheme.dark }}>
                <span className="block transition-all duration-300 hover:opacity-80">Empowering</span>
                <span className="block transition-all duration-300 hover:opacity-90" style={{ color: schoolTheme.primary }}>
                  Modern Education
                </span>
              </h2>
              <p className="text-xl leading-relaxed transition-all duration-300 hover:opacity-80" style={{ color: schoolTheme.light }}>
                Streamline school administration with our comprehensive suite of tools designed for academic excellence.
              </p>
            </div>

            {/* Features Carousel */}
            <div className="space-y-6 pt-8">
              <div className="feature-transition">
                <div className="space-y-4">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 transition-all duration-300 hover:scale-110 hover:rotate-3 hover:shadow-xl"
                         style={{
                           backgroundColor: `${features[activeFeature].color}15`,
                           border: `2px solid ${features[activeFeature].color}30`
                         }}>
          
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3 transition-all duration-300 hover:opacity-80" style={{ color: schoolTheme.dark }}>
                        {features[activeFeature].title}
                      </h3>
                      <p className="text-lg leading-relaxed transition-all duration-300 hover:opacity-80" style={{ color: schoolTheme.light }}>
                        {features[activeFeature].description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Dots Indicator */}
              <div className="flex gap-3 pt-6">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleFeatureClick(index)}
                    className="transition-all duration-300 focus:outline-none hover:scale-110"
                  >
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${index === activeFeature ? 'scale-125' : ''}`}
                      style={{
                        backgroundColor: index === activeFeature 
                          ? schoolTheme.primary 
                          : `${schoolTheme.light}40`,
                        width: index === activeFeature ? '24px' : '8px'
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t transition-all duration-300 hover:opacity-90"
                 style={{ borderColor: `${schoolTheme.light}20` }}>
              {[
                { label: "Grades", value: "1-12", icon: "📚" },
                { label: "Active Users", value: "850+", icon: "👥" },
                { label: "Uptime", value: "99.9%", icon: "⚡" }
              ].map((stat, index) => (
                <div key={index} className="text-center group transition-all duration-300 hover:scale-105">
                  <div className="text-2xl mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold mb-1 transition-all duration-300 group-hover:opacity-80" style={{ color: schoolTheme.dark }}>
                    {stat.value}
                  </div>
                  <div className="text-sm transition-all duration-300 group-hover:opacity-80" style={{ color: schoolTheme.light }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Demo Credentials */}
            <div className="mt-8 p-4 rounded-lg border transition-all duration-300 hover:shadow-md"
                 style={{ 
                   backgroundColor: `${schoolTheme.background}`,
                   borderColor: `${schoolTheme.light}20`
                 }}>
              <p className="text-sm text-center" style={{ color: schoolTheme.light }}>
                <span className="font-semibold" style={{ color: schoolTheme.dark }}>Demo:</span> Use admin@aswedauled.edu • password: demo123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
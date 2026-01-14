import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./pages/navBar";
import { useEffect, useState } from "react";
import AdminDashboard from "./pages/admin/dashboard";
import UsersManagement from "./pages/admin/users";
import FAQ from "./pages/admin/faq";
import Gallery from "./pages/admin/gallery";
import SalaryManagement from "./pages/admin/components/SalaryManagement";
import GradesManagementPage from "./pages/admin/grade";
import Activities from "./pages/admin/activities";
import TeacherDashboard from "./pages/teacher/teacherDashboard";
import SubjectDetails from "./pages/teacher/subjectDetails";
import TeacherSubjectsList from "./pages/teacher/subjectList";
import GradeManagerDashboard from "./pages/gradeManager/gradeManagementDashboard";
import StudentsManagement from "./pages/gradeManager/studentsManagement";
import AdmissionFormsReview from "./pages/gradeManager/admission";
import StudentDashboard from "./pages/student/dashboard";
import GradeEnvironment from "./pages/student/gradeEnv";
import MyMarks from "./pages/student/student-marks";
import LoginPage from "./pages/login";
import { routeProtector } from "./assets/middleware";
import { useDispatch } from "react-redux";
import { setProfile } from "./store/reducers/profileReducer";
import Profile from "./pages/profile";

 function App() {
  const [userType, setUserType] = useState();
  const dispatch = useDispatch();
  const types = ["admin", "teacher", "student", "guideTeacher", "manager"];
  useEffect(()=> {
    const fetchUserType = async()=> {
      const data = await routeProtector();
      if(data.status ==true){
        setUserType(data.data.role);
        dispatch(setProfile(data.data));
      }
    }
    fetchUserType();
  })
  return (
    <div
      style={{ width: "100vw" }}
      className=" m-0 p-0 object-fill w-full h-full"
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<NavBar  />}>
          <Route path="/profile" element={<Profile />} />
            {userType == "admin" && (
              <>
                <Route index element={<AdminDashboard />} />
                <Route path="admin/users" element={<UsersManagement />} />
                <Route path="admin/faq" element={<FAQ />} />
                <Route path="admin/gallery" element={<Gallery />} />
                <Route path="admin/financial" element={<SalaryManagement />} />
                <Route path="admin/activities" element={<Activities />} />
                {/* <Route path="admin/messenger" element={<ChatSystem />} /> */}
                <Route
                  path="admin/grade/:id"
                  element={<GradesManagementPage />}
                />
              </>
            )}
            {userType == "teacher" && (
              <>
                <Route index element={<TeacherDashboard />} />
                <Route
                  path="teacher/subjectDetails/:id"
                  element={<SubjectDetails />}
                />
                <Route
                  path="teacher/subjectList"
                  element={<TeacherSubjectsList />}
                />
              </>
            )}
            {userType == "manager" && (
              <>
                <Route index element={<GradeManagerDashboard />} />
                <Route path="gradeManager/exam" element={<div>Hello</div>} />
                <Route
                  path="gradeManager/studentManagement"
                  element={<StudentsManagement />}
                />
                <Route
                  path="gradeManager/admissions"
                  element={<AdmissionFormsReview />}
                />
              </>
            )}
            {userType == "student" && (
              <>
                <Route index element={<StudentDashboard />} />
                <Route path="student/gradeEnv" element={<GradeEnvironment />} />
                <Route path="student/marks" element={<MyMarks />} />
              </>
            )}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

// and below will have gallery CRUD with image and title for each and then under that we will have activities CRUD withh image and title for each , and then the next dropdown item wil be for each grades grade 1 dropdown item to dropdown grade 12 item and in each there we will have students list listed with their marks CRUD available with paginations and then we will have teachers list and then we will have guide teachers list and we will have manager list for it and under these we will have each grade's notice board CRUD and we will have each grades's mission (update feature), academic excellence (update feature), advanced facilities(update feature) , age start to end update feature, academic prequisites which will be entered to database as arrays, entrance exam subjects with each subject and description (CRUD feature) and next item would be financial item which is like list of paying the teachers, guide teachers and others-- that is it Please it is important just use plain react with tailwind css with react icons fi and fa and no typescript, no next js, no react ui components and no lucide react and no emojis

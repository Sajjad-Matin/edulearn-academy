import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import CoursesCategoriesPage from "./Pages/CoursesCategoriesPage";
import CourseSectionsPage from "./Pages/CourseSectionsPage";
import CourseDetailsPage from "./Pages/CourseDetailsPage";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import StudentDashboardPage from "./Pages/StudentDashboardPage";
import TeacherDashboardPage from "./Pages/TeacherDashboardPage";
import AdminDashboardPage from "./Pages/AdmindDashboardPage";
import useAuth from "./Hooks/useAuth";
import ProtectedRoute from "./Components/ProtectedRoute";

const App = () => {
  const { data } = useAuth();
  console.log(data);
  return (
    <Box bg="white" minH="100vh" position="relative" overflow="hidden">
      {/* ===== GLOBAL DECORATIVE ELEMENTS ===== */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        w="40%"
        h="40%"
        bg="brand.50"
        borderRadius="full"
        filter="blur(120px)"
        opacity="0.6"
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="-10%"
        left="-5%"
        w="30%"
        h="30%"
        bg="accent.50"
        borderRadius="full"
        filter="blur(100px)"
        opacity="0.4"
        zIndex={0}
      />

      {/* ===== PAGE CONTENT ===== */}
      <Box
        position="relative"
        zIndex={1}
        minH="100vh"
        display="flex"
        flexDirection="column"
      >
        <Navbar />
        <Box flex="1" pt={20}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/categories" element={<CoursesCategoriesPage />} />
            <Route path="/courses/:category" element={<CourseSectionsPage />} />
            <Route path="/course/:courseId" element={<CourseDetailsPage />} />

            <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route
                path="/dashboard/student"
                element={<StudentDashboardPage />}
              />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
              <Route
                path="/dashboard/teacher"
                element={<TeacherDashboardPage />}
              />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
            </Route>
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default App;

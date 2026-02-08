// src/routes/AppRoutes.jsx 

import { lazy, Suspense } from "react";

import { Routes, Route } from "react-router-dom";
import FormPage from "../pages/form/formpage";



// ==================== PUBLIC PAGES ====================
import SkilledUpHome from "../pages/Home";

import Login from "../pages/Login";

// ================= for internship ===============
// ================= for internship ===============
import InternshipProgram from "../pages/Internship";
import StudentLayout from "../components/Student/StudentLayout";
import StudentDashboard from "../pages/Dashboard/StudentDashboard";
import MyTasks from "../pages/Dashboard/MyTasks";
import StudentViewTask from "../pages/Dashboard/StudentViewTask";
import OfferLetter from "../pages/Dashboard/OfferLetter";
import Certificate from "../pages/Dashboard/Certificate";
import Community from "../pages/Dashboard/Community";
import ExitLetter from "../pages/Dashboard/ExitLetter";
import LetterOfRecommendation from "../pages/Dashboard/LetterOfRecommendation";
import StudentSupport from "../pages/Dashboard/StudentSupport";
import MyOrders from "../pages/Dashboard/MyOrders";


import FreeCourses from "../pages/FreeCourses";
import B2BCollaboration from "../pages/B2BCollaboration";


// ==================== NEW CATEGORY PAGES ====================
import DataAnalyticsPage from "../pages/Courses/DataAnalyticsPage";
import DataScienceAIPage from "../pages/Courses/DataScienceAIPage";
import CourseDetailWrapper from "../pages/Courses/CourseDetailWrapper";

// ==================== COURSE DETAIL PAGES ====================

// ============= for CareerX ==========================
// import CareerX from "../pages/Courses/CareerX";
// import CareerAccDataScience from "../pages/Courses/CareerAccDataScience";
import CareerAccDataAnalysts from "../pages/Courses/CareerAccDataAnalysts";
import CareerBoost from "../pages/Courses/CareerBoost";


// ==================== RESOURCES PAGES ====================
import AboutUs from "../pages/resources/About";
import Blogs from "../pages/resources/Blogs";
import FAQs from "../pages/resources/FAQs";
import TermsConditions from "../pages/resources/TermsConditions";
import PrivacyPolicy from "../pages/resources/PrivacyPolicy";
import ContactUs from "../pages/resources/ContactUs";

// ==================== CAREER PAGES ====================
import Career from "../pages/Careers/Career";
import Apply from "../pages/Careers/Apply";
import JD from "../pages/Careers/JD";

// ==================== AUTH PROTECTED PAGES ====================
import Profile from "../pages/profile/Profile";
import Cart from "../pages/Cart/Cart";
import WalletPage from "../pages/wallets/WalletPage";
import Refer from "../pages/referrals/Refer";

// ==================== ORDERS PAGES ====================
import OrdersPage from "../pages/Orders/OrdersPage"
import CourseDashboard from "../pages/CourseDashboard/CourseDashboard";

// ==================== AUTH COMPONENT ====================
import AuthRoute from "../components/AuthRoute";

// ==================== Masterclass ====================
import MasterclassCategory from "../pages/Masterclass/MasterclassCategory";
import SqlMasterclassPage from "../pages/Masterclass/SQl_MasterclassPage";
import PowerBiMasterclassPage from "../pages/Masterclass/PowerBi_MasterclassPage";

// ========================= layout =======================================
import Layout from "../components/layout/Layout";


// ======================== Certificates =================================
import Certificates from "../pages/Certificates/Certificates";



// =======================================================================
import AllCoursesPage from "../pages/Courses";


// =======================================================================

// for lady
const CareerX = lazy(() => import("../pages/Courses/CareerX"));
const CareerAccDataScience = lazy(() =>
  import("../pages/Courses/CareerAccDataScience")
);
// =============================================================================

export default function AppRoutes() {
  return (
    <Layout>
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center text-gray-600 text-lg">
            Loading course details...
          </div>
        }
      >
        <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route path="/" element={<SkilledUpHome />} />
          <Route path="/login" element={<Login />} />

          {/* Main Pages */}
          <Route path="/courses" element={<AllCoursesPage />} />
          <Route path="/courses/all" element={<AllCoursesPage />} />


          <Route path="/internships" element={<InternshipProgram />} />

          <Route path="/free-courses" element={<FreeCourses />} />
          <Route path="/b2b" element={<B2BCollaboration />} />


          {/* ========== CATEGORY ROUTES ========== */}
          <Route path="/courses/data-analytics" element={<DataAnalyticsPage />} />
          <Route path="/courses/data-science-ai" element={<DataScienceAIPage />} />
          <Route path="/courses/:category/:courseId" element={<CourseDetailWrapper />} />

          {/* ========== FORM PAGES ========== */}
          <Route path="/form/formpage" element={<FormPage />} />

          {/* ========== MASTERCLASS PAGES ========== */}
          <Route path="/masterclass" element={<MasterclassCategory />} />
          <Route path="/masterclass/mysql-genai" element={<SqlMasterclassPage />} />
          <Route path="/masterclass/powerbi-advanced" element={<PowerBiMasterclassPage />} />

          {/* ========== INDIVIDUAL COURSE ROUTES ========== */}

          {/* ==================== for careerx ======================= */}
          <Route path="/courses/careerx-data-science-genai" element={<CareerX />} />

          <Route
            path="/courses/career-accelerator-data-science-genai"
            element={<CareerAccDataScience />}
          />


          <Route
            path="/courses/career-accelerator-data-analytics-genai"
            element={<CareerAccDataAnalysts />}
          />

          <Route
            path="/courses/career-boost-data-analytics-genai"
            element={<CareerBoost />}
          />




          {/* =================================== Certificates =================================*/}
          <Route path="/certificates" element={<Certificates />} />

          {/* Career Routes */}
          <Route path="/careers" element={<Career />} />
          <Route path="/careers/apply/:jobId" element={<Apply />} />
          <Route path="/careers/jd/:jobId" element={<JD />} />


          {/* <Route path="/careers/apply/:jobId" element={<Apply />} /> */}

          {/* Resources Routes */}
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* ========== PROTECTED ROUTES ========== */}
          {/* If you want ALL these routes protected */}
          <Route
            path="/profile"
            element={
              <AuthRoute>
                <Profile />
              </AuthRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <AuthRoute>
                <Cart />
              </AuthRoute>
            }
          />

          <Route
            path="/wallet"
            element={
              <AuthRoute>
                <WalletPage />
              </AuthRoute>
            }
          />

          <Route
            path="/refer"
            element={
              <AuthRoute>
                <Refer />
              </AuthRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <AuthRoute>
                <OrdersPage />
              </AuthRoute>
            }
          />

          <Route
            path="/course-dashboard/:courseId"
            element={
              <AuthRoute>
                <CourseDashboard />
              </AuthRoute>
            }
          />

          {/* ========== STUDENT DASHBOARD ROUTES (Nested) ========== */}
          <Route
            path="/dashboard"
            element={
              <AuthRoute>
                <StudentLayout />
              </AuthRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="tasks" element={<MyTasks />} />
            <Route path="tasks/:taskId" element={<StudentViewTask />} />
            <Route path="offer-letter" element={<OfferLetter />} />
            <Route path="lor" element={<LetterOfRecommendation />} />
            <Route path="certificate" element={<Certificate />} />
            <Route path="community" element={<Community />} />
            <Route path="exit-letter" element={<ExitLetter />} />
            <Route path="profile" element={<Profile />} />
            <Route path="my-orders" element={<MyOrders />} />
            <Route path="support" element={<StudentSupport />} />
          </Route>


          {/* ========== 404 PAGE ========== */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
              <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Oops! Page not found</p>
              <a
                href="/"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Go to Homepage
              </a>
            </div>
          } />
        </Routes>
      </Suspense>
    </Layout>
  );
}

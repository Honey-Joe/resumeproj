// src/App.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { CookiesProvider } from 'react-cookie';
import AuthPage from './components/AuthPage';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Examples from './components/Examples';
import ResumeBuilder from './components/ResumeBuilder';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import '@fortawesome/fontawesome-free/css/all.min.css';

// ✅ Gradient Wrapper
const GradientLayout = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-800">
    {children}
  </div>
);

// ✅ User Private Route
const UserPrivateRoute = ({ children }) => {
  const [cookies] = useCookies(['userToken']);
  return cookies.userToken ? children : <Navigate to="/AuthPage" />;
};

const AdminPrivateRoute = ({ children }) => {
  const [cookies] = useCookies(['adminToken']);
  return cookies.adminToken ? children : <Navigate to="/AuthPage" />;
};

// ✅ Landing Page with navigation to builder
function LandingPage() {
  const navigate = useNavigate();

  const handleStartBuilding = () => {
    navigate('/builder');
  };

  return (
    <GradientLayout>
      <Header />
      <AnimatePresence mode="wait">
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Hero onStartBuilding={handleStartBuilding} />
          <Features />
          <Examples />
          <Footer />
        </motion.div>
      </AnimatePresence>
    </GradientLayout>
  );
}

// ✅ Main App
function App() {
  const [cookies] = useCookies(['user']);
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/AuthPage" element={<AuthPage />} />

      <Route
        path="/builder"
        element={
            <UserPrivateRoute>
            <GradientLayout>
              <Header />
              <ResumeBuilder user={cookies.user} resumeData={cookies.resumeData} />
              <Footer />
            </GradientLayout>
            </UserPrivateRoute>
        }
      />

      <Route
        path="/adminpanel"
        element={
          <AdminPrivateRoute>
            <GradientLayout>
              <AdminPanel />
            </GradientLayout>
          </AdminPrivateRoute>
        }
      />
    </Routes>
  );
}

// ✅ App with Router
export default function WrappedApp() {
  return (
    <CookiesProvider>
      <Router>
        <App />
      </Router>
    </CookiesProvider>
  );
}

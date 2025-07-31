// App.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Examples from './components/Examples';
import ResumeBuilder from './components/ResumeBuilder';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import '@fortawesome/fontawesome-free/css/all.min.css';

// ✅ User Private Route
const UserPrivateRoute = ({ children }) => {
  const token = localStorage.getItem('userToken');
  return token ? children : <Navigate to="/AuthPage" />;
};

// ✅ Admin Private Route
const AdminPrivateRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/AuthPage" />;
};

// ✅ Landing Page
function LandingPage({ onStartBuilding, showBuilder }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header onExport={onStartBuilding} />
      <AnimatePresence mode="wait">
        {!showBuilder ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero onStartBuilding={onStartBuilding} />
            <Features />
            <Examples />
            <Footer />
          </motion.div>
        ) : (
          <motion.div
            key="builder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResumeBuilder />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ✅ Main App Component
function App() {
  const [showBuilder, setShowBuilder] = useState(false);

  const handleStartBuilding = () => {
    setShowBuilder(true);
    window.scrollTo(0, 0);
  };


  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              onStartBuilding={handleStartBuilding}
              showBuilder={showBuilder}
            />
          }
        />
        <Route path="/AuthPage" element={<AuthPage />} />

        <Route
          path="/builder"
          element={
            <UserPrivateRoute>
              <ResumeBuilder />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/adminpanel"
          element={
            <AdminPrivateRoute>
              <AdminPanel />
            </AdminPrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

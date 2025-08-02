import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ onExport }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    const adminToken = localStorage.getItem('adminToken');
    const storedUser = sessionStorage.getItem('user');

    if (userToken || adminToken) {
      setIsAuthenticated(true);
      try {
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (error) {
        console.error('Invalid JSON in user:', error);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('user');
    localStorage.removeItem('userToken');
    localStorage.removeItem('adminToken');
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail");
    localStorage.removeItem("resumedata");
    setIsAuthenticated(false);
    setUser(null);
    closeMobileMenu();
    window.location.href = '/';
  };

  const UserDropdown = () => (
    <AnimatePresence>
      {isDropdownOpen && (
        <motion.div
          className="absolute right-0 top-14 mt-2 w-48 bg-gradient-to-b from-slate-800 to-blue-900 rounded-xl shadow-2xl border border-blue-500/30 overflow-hidden z-60"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-4 border-b border-blue-700">
            <p className="text-cyan-100 font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-blue-300 text-sm truncate">{user?.email || 'user@example.com'}</p>
          </div>

          <motion.div
            whileHover={{ backgroundColor: 'rgba(255, 165, 0, 0.15)' }}
            className="px-4 py-3 text-blue-100 cursor-pointer"
          >
            <i className="fas fa-user mr-3 text-amber-400"></i> Profile
          </motion.div>

          <motion.div
            whileHover={{ backgroundColor: 'rgba(255, 165, 0, 0.15)' }}
            className="px-4 py-3 text-blue-100 cursor-pointer"
          >
            <i className="fas fa-cog mr-3 text-amber-400"></i> Settings
          </motion.div>

          <motion.div
            whileHover={{ backgroundColor: 'rgba(255, 165, 0, 0.15)' }}
            className="px-4 py-3 text-blue-100 cursor-pointer border-t border-blue-700"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt mr-3 text-amber-400"></i> Logout
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.header
      className="bg-gradient-to-b from-slate-900 to-blue-900 shadow-lg py-3 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 15, stiffness: 120 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <motion.div
            className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-amber-500"
            whileHover={{ rotate: 360, scale: 1.1, transition: { duration: 0.6 } }}
          >
            <img
              src="https://ik.imagekit.io/HoneyJoe/freewill%20technologies%20assetss/logo.jpg?updatedAt=1745004056813"
              alt="FWT Logo"
              className="w-full h-full object-contain bg-white p-1"
            />
          </motion.div>
          <motion.h1
            className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: 1,
              x: 0,
              textShadow: '0 0 10px rgba(255, 140, 0, 0.7)',
            }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            FWT Resume Builder
          </motion.h1>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={onExport}
                className="bg-gradient-to-r from-amber-500 to-amber-400 text-blue-950 px-3 py-1.5 rounded-lg font-bold shadow-lg flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-download"></i>
              </motion.button>

              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="relative"
              >
                <div className="w-8 h-8 rounded-full bg-blue-800 border border-amber-500 overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-400">
                      <span className="text-blue-950 font-bold text-sm">{user?.name?.charAt(0) || 'U'}</span>
                    </div>
                  )}
                </div>
                <UserDropdown />
              </button>
            </div>
          ) : (
            <button
              className="text-amber-400 text-2xl focus:outline-none"
              onClick={() => setMobileMenuOpen(true)}
            >
              <i className="fas fa-bars"></i>
            </button>
          )}
        </div>

        {/* Desktop */}
        {!isAuthenticated ? (
          <nav className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-3">
              <motion.div whileHover={{ y: -2, backgroundColor: '#1e3a8a' }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/AuthPage"
                  className="block px-4 py-2 rounded-lg text-cyan-100 font-medium bg-blue-800/70 hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 15px rgba(251, 191, 36, 0.5)',
                  background: [
                    'linear-gradient(to right, #f59e0b, #fbbf24)',
                    'linear-gradient(to right, #fbbf24, #f59e0b)',
                  ],
                  transition: { duration: 0.5, repeat: Infinity, repeatType: 'reverse' },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/AuthPage"
                  className="block px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-amber-500 to-amber-400 text-blue-950"
                >
                  Sign Up
                </Link>
              </motion.div>
            </div>
          </nav>
        ) : (
          <div className="hidden md:flex items-center space-x-5">
            <motion.button
              onClick={onExport}
              className="bg-gradient-to-r from-amber-500 to-amber-400 text-blue-950 px-4 py-2 rounded-lg items-center font-bold shadow-lg flex"
              whileHover={{
                scale: 1.08,
                boxShadow: '0 0 25px rgba(251, 191, 36, 0.8)',
                background: [
                  'linear-gradient(to right, #f59e0b, #fbbf24)',
                  'linear-gradient(to right, #fbbf24, #f59e0b)',
                ],
                transition: { duration: 0.5, repeat: Infinity, repeatType: 'reverse' },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-download mr-2"></i> Export
            </motion.button>

            <div className="relative">
              <motion.button
                className="flex items-center space-x-2"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-10 h-10 rounded-full bg-blue-800 border-2 border-amber-500 overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-400">
                      <span className="text-blue-950 font-bold text-lg">{user?.name?.charAt(0) || 'U'}</span>
                    </div>
                  )}
                </div>
                <i
                  className={`fas fa-chevron-down text-amber-400 text-sm transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                ></i>
              </motion.button>
              <UserDropdown />
            </div>
          </div>
        )}

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-70 z-40 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMobileMenu}
              />
              <motion.div
                className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-gradient-to-b from-slate-800 to-blue-900 shadow-2xl z-50 md:hidden"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                <div className="flex justify-end p-4">
                  <button className="text-amber-400 text-2xl focus:outline-none" onClick={closeMobileMenu}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <div className="px-6 py-8">
                  <div className="flex flex-col space-y-6">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        to="/AuthPage"
                        className="block w-full text-center px-4 py-3 rounded-lg text-cyan-100 font-medium bg-blue-800/70"
                        onClick={closeMobileMenu}
                      >
                        Login
                      </Link>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        to="/AuthPage"
                        className="block w-full text-center px-4 py-3 rounded-lg font-medium bg-gradient-to-r from-amber-500 to-amber-400 text-blue-950"
                        onClick={closeMobileMenu}
                      >
                        Sign Up
                      </Link>
                    </motion.div>

                    <div className="pt-8 border-t border-blue-700">
                      <p className="text-center text-blue-300 mb-4">Get the app</p>
                      <div className="flex justify-center space-x-4">
                        <motion.a href="#" className="bg-slate-700 p-2 rounded-lg" whileHover={{ y: -3 }}>
                          <i className="fab fa-apple text-2xl text-white"></i>
                        </motion.a>
                        <motion.a href="#" className="bg-slate-700 p-2 rounded-lg" whileHover={{ y: -3 }}>
                          <i className="fab fa-android text-2xl text-green-400"></i>
                        </motion.a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;

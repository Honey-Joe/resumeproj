// src/components/AdminHeader.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AdminHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
            <i className="fas fa-lock text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            ResumeCraft Pro Admin
          </h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <button className="relative text-gray-600">
            <i className="fas fa-bell text-xl"></i>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="relative">
            <button 
              className="flex items-center space-x-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
              <span className="hidden md:inline text-gray-800 font-medium">Admin User</span>
              <i className="fas fa-chevron-down text-gray-600"></i>
            </button>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    <i className="fas fa-user mr-2"></i> Profile
                  </a>
                  <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    <i className="fas fa-cog mr-2"></i> Settings
                  </a>
                  <div className="border-t border-gray-200 my-1"></div>
                  <a href="#" className="block px-4 py-2 text-red-600 hover:bg-red-50">
                    <i className="fas fa-sign-out-alt mr-2"></i> Logout
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
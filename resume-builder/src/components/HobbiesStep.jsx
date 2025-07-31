// src/components/steps/HobbiesStep.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HobbiesStep = ({ resumeData, updateResumeData }) => {
  const handleChange = (index, value) => {
    const updatedHobbies = [...resumeData.hobbies];
    updatedHobbies[index].name = value;
    updateResumeData({ hobbies: updatedHobbies });
  };

  const addHobby = () => {
    updateResumeData({
      hobbies: [...resumeData.hobbies, { name: '' }]
    });
  };

  const removeLastHobby = () => {
    const updatedHobbies = [...resumeData.hobbies];
    updatedHobbies.pop();
    updateResumeData({ hobbies: updatedHobbies });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -30 }} 
      transition={{ duration: 0.4 }}
      className="space-y-6 w-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <i className="fas fa-heart text-indigo-500 mr-3"></i>
          Hobbies & Interests
        </h3>
        <div className="flex space-x-2">
          <motion.button
            onClick={removeLastHobby}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full shadow-sm hover:shadow-md transition-all"
            title="Remove Last Hobby"
          >
            <i className="fas fa-minus text-sm"></i>
          </motion.button>

          <motion.button
            onClick={addHobby}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 flex items-center justify-center bg-indigo-500 text-white rounded-full shadow-sm hover:shadow-md transition-all"
            title="Add Hobby"
          >
            <i className="fas fa-plus text-sm"></i>
          </motion.button>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {resumeData.hobbies.map((hobby, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.3, ease: "easeOut" }
              }} 
              exit={{ 
                opacity: 0, 
                x: -50,
                transition: { duration: 0.2 }
              }}
              transition={{ duration: 0.3 }}
              className="flex items-center p-3 bg-white rounded-xl shadow-xs border border-gray-100 hover:border-indigo-100 transition-colors"
            >
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="e.g., Photography, Chess, Hiking"
                  value={hobby.name}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="w-full rounded-lg p-3 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 text-gray-700 placeholder-gray-400 transition-all"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {resumeData.hobbies.length > 3 && (
        <div className="flex justify-center mt-4">
          <motion.button
            onClick={addHobby}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full shadow-sm hover:shadow-md transition-all"
            title="Add Another Hobby"
          >
            <i className="fas fa-plus text-sm"></i>
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default HobbiesStep;

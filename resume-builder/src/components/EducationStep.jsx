// src/components/steps/EducationStep.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EducationStep = ({ resumeData, updateResumeData }) => {
  const handleChange = (index, field, value) => {
    const updatedEducation = [...resumeData.education];
    updatedEducation[index][field] = value;
    updateResumeData({ education: updatedEducation });
  };

  const addEducation = () => {
    updateResumeData({
      education: [
        ...resumeData.education,
        {
          institution: '',
          degree: '',
          field: '',
          duration: '',
          cgpa: '',
          school: '',
          achievements: ''
        }
      ]
    });
  };

  const removeEducation = (index) => {
    const updatedEducation = [...resumeData.education];
    updatedEducation.splice(index, 1);
    updateResumeData({ education: updatedEducation });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <i className="fas fa-graduation-cap text-indigo-500 mr-3"></i>
          Education
        </h3>
        <motion.button
          onClick={addEducation}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm transition-all"
        >
          <i className="fas fa-plus mr-2 text-sm"></i> Add Education
        </motion.button>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {resumeData.education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative border border-gray-200 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              {/* New Visible Remove Button */}
              <div className="absolute top-4 right-4">
                <motion.button
                  onClick={() => removeEducation(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-red-50 hover:bg-red-100 text-red-500 rounded-full p-2 transition-colors"
                  aria-label="Remove education"
                  title="Remove education"
                >
                  <i className="fas fa-trash-alt text-sm"></i>
                </motion.button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution*</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => handleChange(index, 'institution', e.target.value)}
                  className="w-full rounded-lg p-3 text-sm bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
                  placeholder="University Name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree*</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleChange(index, 'degree', e.target.value)}
                    className="w-full rounded-lg p-3 text-sm bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
                    placeholder="Bachelor of Science"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study*</label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => handleChange(index, 'field', e.target.value)}
                    className="w-full rounded-lg p-3 text-sm bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
                    placeholder="Computer Science"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration*</label>
                  <input
                    type="text"
                    value={edu.duration}
                    onChange={(e) => handleChange(index, 'duration', e.target.value)}
                    className="w-full rounded-lg p-3 text-sm bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
                    placeholder="2016–2020"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CGPA/Score</label>
                  <input
                    type="text"
                    value={edu.cgpa}
                    onChange={(e) => handleChange(index, 'cgpa', e.target.value)}
                    className="w-full rounded-lg p-3 text-sm bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
                    placeholder="3.8 / 4.0 or 92%"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">School (Optional)</label>
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) => handleChange(index, 'school', e.target.value)}
                  className="w-full rounded-lg p-3 text-sm bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
                  placeholder="High School Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Achievements</label>
                <textarea
                  value={edu.achievements}
                  onChange={(e) => handleChange(index, 'achievements', e.target.value)}
                  className="w-full rounded-lg p-3 text-sm bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
                  rows="3"
                  placeholder="Honors, awards, relevant coursework..."
                ></textarea>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default EducationStep;
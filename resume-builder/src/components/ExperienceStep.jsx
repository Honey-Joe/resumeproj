// src/components/steps/ExperienceStep.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ExperienceStep = ({ resumeData, updateResumeData }) => {
  const handleChange = (index, field, value) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience[index][field] = value;
    updateResumeData({ experience: updatedExperience });
  };

  const toggleInternship = (index) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience[index].isInternship = !updatedExperience[index].isInternship;
    updateResumeData({ experience: updatedExperience });
  };

  const addExperience = () => {
    updateResumeData({
      experience: [
        ...resumeData.experience,
        {
          company: '',
          position: '',
          duration: '',
          responsibilities: '',
          technologies: '',
          isInternship: false
        }
      ]
    });
  };

  const removeExperience = (index) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience.splice(index, 1);
    updateResumeData({ experience: updatedExperience });
  };

  const renderExperienceCard = (exp, index) => (
    <motion.div
      key={index}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 relative mb-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      layout
    >
      <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => removeExperience(index)}
            className="p-1 rounded-md text-red-500 hover:bg-red-50"
            title="Remove experience"
          >
            <i className="fas fa-trash-alt text-sm"></i>
          </button>
          <span className="text-xs font-medium text-gray-500">
            Experience #{index + 1}
          </span>
        </div>

        <div className="flex border border-gray-300 rounded-md overflow-hidden">
          <button
            type="button"
            className={`px-2 py-0.5 text-xs transition-colors ${
              !exp.isInternship
                ? 'bg-indigo-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => toggleInternship(index)}
          >
            Full-time
          </button>
          <div className="h-4 w-px bg-gray-300"></div>
          <button
            type="button"
            className={`px-2 py-0.5 text-xs transition-colors ${
              exp.isInternship
                ? 'bg-indigo-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => toggleInternship(index)}
          >
            Internship
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {exp.isInternship ? 'Organization*' : 'Company*'}
          </label>
          <input
            type="text"
            value={exp.company}
            onChange={(e) => handleChange(index, 'company', e.target.value)}
            className="w-full bg-white rounded p-1.5 text-xs border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-transparent"
            placeholder={exp.isInternship ? 'Organization Name' : 'Company Name'}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {exp.isInternship ? 'Role*' : 'Position*'}
          </label>
          <input
            type="text"
            value={exp.position}
            onChange={(e) => handleChange(index, 'position', e.target.value)}
            className="w-full bg-white rounded p-1.5 text-xs border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-transparent"
            placeholder={exp.isInternship ? 'Intern Position' : 'Job Title'}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Duration*
            </label>
            <input
              type="text"
              value={exp.duration}
              onChange={(e) => handleChange(index, 'duration', e.target.value)}
              className="w-full bg-white rounded p-1.5 text-xs border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-transparent"
              placeholder="Jan 2020 - Present"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Technologies
            </label>
            <input
              type="text"
              value={exp.technologies || ''}
              onChange={(e) => handleChange(index, 'technologies', e.target.value)}
              className="w-full bg-white rounded p-1.5 text-xs border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-transparent"
              placeholder="React, Node.js, Python"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {exp.isInternship ? 'Responsibilities & Learnings*' : 'Responsibilities & Achievements*'}
          </label>
          <textarea
            value={exp.responsibilities}
            onChange={(e) => handleChange(index, 'responsibilities', e.target.value)}
            className="w-full bg-white rounded p-1.5 text-xs border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-transparent"
            rows="2"
            placeholder={
              exp.isInternship 
                ? '• Managed project X\n• Learned about Y...' 
                : '• Led project X\n• Optimized process...'
            }
            required
          ></textarea>
          <p className="mt-0.5 text-xs text-gray-500">
            Use bullet points (start with •)
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <i className="fas fa-briefcase text-indigo-500 mr-2 text-base"></i>
            Professional Experience
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            Add work experiences and internships
          </p>
        </div>

        <motion.button
          onClick={addExperience}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <i className="fas fa-plus mr-1 text-xs"></i> Add Experience
        </motion.button>
      </div>

      <div className="space-y-3">
        {resumeData.experience.length === 0 ? (
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-center">
            <i className="fas fa-file-alt text-indigo-400 text-2xl mb-2"></i>
            <h4 className="text-sm font-medium text-gray-700 mb-1">No experiences added</h4>
            <p className="text-xs text-gray-600 mb-2">
              Add your professional experiences
            </p>
            <motion.button
              onClick={addExperience}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center mx-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fas fa-plus mr-1"></i> Add First Experience
            </motion.button>
          </div>
        ) : (
          <AnimatePresence>
            {resumeData.experience.map((exp, index) => renderExperienceCard(exp, index))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ExperienceStep;

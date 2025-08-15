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
      className="bg-slate-800/50 rounded-xl shadow-lg border border-slate-600 p-5 pt-8 relative mb-6 hover:shadow-indigo-500/10 transition-all"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      layout
    >
      {/* Trash icon at top-right */}
      <button
        onClick={() => removeExperience(index)}
        className="absolute top-2 right-2 rounded-full text-red-400 hover:bg-red-500/20 transition-colors"
        title="Remove experience"
      >
        <i className="fas fa-trash-alt text-xs"></i>
      </button>

      <div className="flex justify-between items-center gap-2 mb-5">
        <span className="text-s font-small text-slate-300">
          Experience #{index + 1}
        </span>

        <div className="flex border border-slate-600 rounded-lg overflow-hidden text-xs">
          <button
            type="button"
            className={`px-3 py-1 transition-colors ${
              !exp.isInternship
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
            }`}
            onClick={() => toggleInternship(index)}
          >
            Full-time
          </button>
          <div className="h-5 w-px bg-slate-600"></div>
          <button
            type="button"
            className={`px-3 py-1 transition-colors ${
              exp.isInternship
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
            }`}
            onClick={() => toggleInternship(index)}
          >
            Intern
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {exp.isInternship ? 'Organization*' : 'Company*'}
          </label>
          <input
            type="text"
            value={exp.company}
            onChange={(e) => handleChange(index, 'company', e.target.value)}
            className="w-full bg-slate-800/30 rounded-lg p-3 text-sm border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition"
            placeholder={exp.isInternship ? 'Organization Name' : 'Company Name'}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {exp.isInternship ? 'Role*' : 'Position*'}
          </label>
          <input
            type="text"
            value={exp.position}
            onChange={(e) => handleChange(index, 'position', e.target.value)}
            className="w-full bg-slate-800/30 rounded-lg p-3 text-sm border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition"
            placeholder={exp.isInternship ? 'Intern Position' : 'Job Title'}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Duration*
            </label>
            <input
              type="text"
              value={exp.duration}
              onChange={(e) => handleChange(index, 'duration', e.target.value)}
              className="w-full bg-slate-800/30 rounded-lg p-3 text-sm border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition"
              placeholder="Jan 2020 - Present"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Technologies
            </label>
            <input
              type="text"
              value={exp.technologies || ''}
              onChange={(e) => handleChange(index, 'technologies', e.target.value)}
              className="w-full bg-slate-800/30 rounded-lg p-3 text-sm border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition"
              placeholder="React, Node.js, Python"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {exp.isInternship ? 'Responsibilities & Learnings*' : 'Responsibilities & Achievements*'}
          </label>
          <textarea
            value={exp.responsibilities}
            onChange={(e) => handleChange(index, 'responsibilities', e.target.value)}
            className="w-full bg-slate-800/30 rounded-lg p-3 text-sm border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition"
            rows="3"
            placeholder={
              exp.isInternship 
                ? '• Managed project X\n• Learned about Y...' 
                : '• Led project X\n• Optimized process...'
            }
            required
          ></textarea>
          <p className="mt-1 text-xs text-slate-500">
            Use bullet points (start with •)
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center">
            <i className="fas fa-briefcase text-indigo-400 mr-3 text-xl"></i>
            Experience
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Add work experiences or internships
          </p>
        </div>

        <motion.button
          onClick={addExperience}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <i className="fas fa-plus mr-2"></i> Add Experience
        </motion.button>
      </div>

      <div className="space-y-6">
        {resumeData.experience.length === 0 ? (
          <div className="bg-indigo-900/20 border border-indigo-800 rounded-xl p-6 text-center">
            <i className="fas fa-file-alt text-indigo-400 text-3xl mb-4"></i>
            <h4 className="text-sm font-medium text-slate-300 mb-2">No experiences added</h4>
            <p className="text-xs text-slate-500">
              Add your professional experiences
            </p>
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
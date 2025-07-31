// src/components/steps/ProjectsStep.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectsStep = ({ resumeData, updateResumeData }) => {
  const handleChange = (index, field, value) => {
    const updatedProjects = [...resumeData.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    updateResumeData({ projects: updatedProjects });
  };

  const addProject = () => {
    updateResumeData({
      projects: [
        ...resumeData.projects,
        { title: '', duration: '', technologies: '', description: '', link: '' }
      ]
    });
  };

  const removeProject = (index) => {
    const updatedProjects = resumeData.projects.filter((_, i) => i !== index);
    updateResumeData({ projects: updatedProjects });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <i className="fas fa-project-diagram text-indigo-500 mr-2"></i>
          Projects
        </h3>
        
        <div className="flex gap-2">
          <motion.button
            onClick={() => updateResumeData({ projects: [] })}
            disabled={!resumeData.projects.length}
            className={`flex items-center px-3 py-1.5 rounded-md text-xs ${
              !resumeData.projects.length 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-red-100 hover:bg-red-200 text-red-600'
            }`}
            whileHover={{ scale: !resumeData.projects.length ? 1 : 1.03 }}
          >
            <i className="fas fa-trash-alt mr-1.5 text-xs"></i> Clear All
          </motion.button>
          
          <motion.button
            onClick={addProject}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-md text-xs flex items-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <i className="fas fa-plus mr-1.5 text-xs"></i> Add Project
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        <div className="space-y-4">
          {resumeData.projects.map((project, index) => (
            <motion.div 
              key={index}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-lg shadow-xs border border-gray-100 p-4 relative"
            >
              {/* Bin icon at top left */}
              <motion.button
                onClick={() => removeProject(index)}
                className="absolute top-3 left-3 text-gray-400 hover:text-red-500 z-10"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                title="Remove project"
              >
                <i className="fas fa-trash text-sm"></i>
              </motion.button>

              <div className="ml-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">
                    Project #{index + 1}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Title*</label>
                    <input
                      value={project.title}
                      onChange={(e) => handleChange(index, 'title', e.target.value)}
                      className="w-full text-sm p-2 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-indigo-300"
                      placeholder="E-commerce Website"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Duration*</label>
                    <input
                      value={project.duration}
                      onChange={(e) => handleChange(index, 'duration', e.target.value)}
                      className="w-full text-sm p-2 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-indigo-300"
                      placeholder="Mar 2022 - Jun 2022"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tech Stack*</label>
                  <input
                    value={project.technologies}
                    onChange={(e) => handleChange(index, 'technologies', e.target.value)}
                    className="w-full text-sm p-2 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-indigo-300"
                    placeholder="React, Node.js, MongoDB"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description*</label>
                  <textarea
                    value={project.description}
                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                    className="w-full text-sm p-2 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-indigo-300"
                    rows="3"
                    placeholder="• Developed X feature using Y technology\n• Optimized performance by 40%"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Link</label>
                  <input
                    type="url"
                    value={project.link}
                    onChange={(e) => handleChange(index, 'link', e.target.value)}
                    className="w-full text-sm p-2 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-indigo-300"
                    placeholder="https://github.com/user/project"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {!resumeData.projects.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
        >
          <i className="fas fa-folder-open text-3xl text-gray-300 mb-3"></i>
          <p className="text-gray-500 text-sm">No projects added yet</p>
          <button 
            onClick={addProject}
            className="mt-3 text-indigo-500 hover:text-indigo-700 text-sm font-medium"
          >
            + Add your first project
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProjectsStep;
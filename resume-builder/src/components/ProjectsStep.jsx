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
        { title: '', duration: '', technologies: '', description: '' }
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
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <i className="fas fa-project-diagram text-indigo-400 mr-3 text-xl"></i>
          Projects
        </h3>
        
        <div className="flex gap-3">
          <motion.button
            onClick={() => updateResumeData({ projects: [] })}
            disabled={!resumeData.projects.length}
            className={`flex items-center px-4 py-2 rounded-lg text-sm ${
              !resumeData.projects.length 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-red-900/30 hover:bg-red-900/40 text-red-300'
            }`}
            whileHover={{ scale: !resumeData.projects.length ? 1 : 1.03 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <i className="fas fa-trash-alt mr-2 text-sm"></i> Clear All
          </motion.button>
          
          <motion.button
            onClick={addProject}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <i className="fas fa-plus mr-2 text-sm"></i> Add Project
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <div className="space-y-6">
          {resumeData.projects.map((project, index) => (
            <motion.div 
              key={index}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-slate-800/50 rounded-xl shadow-lg border border-slate-600 p-5 relative"
            >
              {/* Bin icon at top right */}
              <motion.button
                onClick={() => removeProject(index)}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-400 z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Remove project"
                transition={{ duration: 0.15 }}
              >
                <i className="fas fa-trash text-sm"></i>
              </motion.button>

              <div className="pt-1">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-medium text-slate-400 bg-slate-700/30 px-3 py-1 rounded-full">
                    Project #{index + 1}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Title*</label>
                    <input
                      value={project.title}
                      onChange={(e) => handleChange(index, 'title', e.target.value)}
                      className="w-full text-sm p-3 bg-slate-800/30 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                      placeholder="E-commerce Website"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Duration*</label>
                    <input
                      value={project.duration}
                      onChange={(e) => handleChange(index, 'duration', e.target.value)}
                      className="w-full text-sm p-3 bg-slate-800/30 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                      placeholder="Mar 2022 - Jun 2022"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tech Stack*</label>
                  <input
                    value={project.technologies}
                    onChange={(e) => handleChange(index, 'technologies', e.target.value)}
                    className="w-full text-sm p-3 bg-slate-800/30 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                    placeholder="React, Node.js, MongoDB"
                    required
                  />
                </div>

                <div className="mb-1">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description*</label>
                  <textarea
                    value={project.description}
                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                    className="w-full text-sm p-3 bg-slate-800/30 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                    rows="3"
                    placeholder="• Developed X feature using Y technology\n• Optimized performance by 40%"
                    required
                  ></textarea>
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
          transition={{ duration: 0.3 }}
          className="text-center py-10 bg-slate-800/20 rounded-xl border-2 border-dashed border-slate-600"
        >
          <i className="fas fa-folder-open text-3xl text-slate-500 mb-4"></i>
          <p className="text-slate-400 text-sm">No projects added yet</p>
        </motion.div> 
      )}
    </motion.div>
  );
};

export default ProjectsStep;
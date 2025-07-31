

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SkillCategory = React.memo(({ 
  title, 
  icon, 
  items, 
  onRemoveItem,
  hasLevel = false
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm w-full mb-4"
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <h3 className="text-base font-semibold flex items-center text-gray-800">
          <i className={`${icon} mr-2 text-indigo-500`}></i>
          {title}
        </h3>
        <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">
          {items.length} skills
        </span>
      </div>
      
      <AnimatePresence>
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6 text-gray-400 text-sm"
          >
            No skills added yet
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
            {items.map((skill) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-200"
              >
                <div className="flex flex-wrap gap-2 items-center min-w-0">
                  <div className="text-sm font-medium text-gray-800 px-3 py-1 bg-white rounded-md border border-gray-300 truncate max-w-[140px]">
                    {skill.name}
                  </div>
                  {hasLevel && skill.level && (
                    <div className="text-xs bg-indigo-100 text-indigo-700 rounded-full px-2 py-1">
                      {skill.level}
                    </div>
                  )}
                  {skill.issuer && (
                    <div className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-1">
                      {skill.issuer}
                    </div>
                  )}
                </div>
                
                <motion.button
                  onClick={() => onRemoveItem(skill.id)}
                  className="text-red-500 hover:text-red-700 flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Remove ${skill.name}`}
                  tabIndex={0}
                >
                  <i className="fas fa-times text-sm"></i>
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

const SkillsStep = ({ resumeData, updateResumeData }) => {
  // State for each category
  const [softSkills, setSoftSkills] = useState(resumeData.softSkills || []);
  const [programmingSkills, setProgrammingSkills] = useState(resumeData.programmingSkills || []);
  const [frameworks, setFrameworks] = useState(resumeData.frameworks || []);
  const [languages, setLanguages] = useState(resumeData.languages || []);
  const [certifications, setCertifications] = useState(resumeData.certifications || []);
  
  // State for new skill input
  const [newSkill, setNewSkill] = useState({
    category: 'softSkills',
    name: '',
    level: '',
    issuer: ''
  });
  
  // Counter for unique IDs
  const idCounter = React.useRef(1);
  
  // Animation state for input placeholder
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const placeholders = [
    "JavaScript",
    "Communication",
    "React",
    "AWS Certified",
    "Python",
    "Teamwork",
    "Node.js",
    "Google Cloud",
    "Problem-solving"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Update parent data
  useEffect(() => {
    updateResumeData({
      softSkills,
      programmingSkills,
      frameworks,
      languages,
      certifications
    });
  }, [softSkills, programmingSkills, frameworks, languages, certifications, updateResumeData]);

  // Handle adding new skill
  const handleAddSkill = useCallback(() => {
    if (!newSkill.name.trim()) return;
    
    const newItem = {
      id: `skill-${idCounter.current++}`,
      name: newSkill.name.trim()
    };
    
    // Add additional fields based on category
    if (newSkill.category === 'languages' && newSkill.level) {
      newItem.level = newSkill.level;
    }
    
    if (newSkill.category === 'certifications' && newSkill.issuer) {
      newItem.issuer = newSkill.issuer;
    }
    
    // Update the appropriate state
    const setterMap = {
      softSkills: setSoftSkills,
      programmingSkills: setProgrammingSkills,
      frameworks: setFrameworks,
      languages: setLanguages,
      certifications: setCertifications
    };
    
    const setter = setterMap[newSkill.category];
    if (setter) {
      setter(prev => [...prev, newItem]);
    }
    
    // Reset form
    setNewSkill({
      category: newSkill.category,
      name: '',
      level: '',
      issuer: ''
    });
  }, [newSkill]);

  // Handle removing skill
  const handleRemoveSkill = useCallback((category, id) => {
    const setterMap = {
      softSkills: setSoftSkills,
      programmingSkills: setProgrammingSkills,
      frameworks: setFrameworks,
      languages: setLanguages,
      certifications: setCertifications
    };
    
    const setter = setterMap[category];
    if (setter) {
      setter(prev => prev.filter(item => item.id !== id));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <i className="fas fa-star text-yellow-400 mr-2"></i>
          Skills & Expertise
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Categorize your skills for maximum impact
        </p>
      </div>

      <div className="space-y-6">
        <SkillCategory 
          title="Soft Skills" 
          icon="fas fa-comments" 
          items={softSkills}
          onRemoveItem={(id) => handleRemoveSkill('softSkills', id)}
        />
        
        <SkillCategory 
          title="Programming Languages" 
          icon="fas fa-code" 
          items={programmingSkills}
          onRemoveItem={(id) => handleRemoveSkill('programmingSkills', id)}
        />
        
        <SkillCategory 
          title="Frameworks & Tools" 
          icon="fas fa-cubes" 
          items={frameworks}
          onRemoveItem={(id) => handleRemoveSkill('frameworks', id)}
        />
        
        <SkillCategory 
          title="Languages" 
          icon="fas fa-language" 
          items={languages}
          onRemoveItem={(id) => handleRemoveSkill('languages', id)}
          hasLevel={true}
        />
        
        <SkillCategory 
          title="Certifications" 
          icon="fas fa-certificate" 
          items={certifications}
          onRemoveItem={(id) => handleRemoveSkill('certifications', id)}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
        className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"
      >
        <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
          <i className="fas fa-plus-circle text-indigo-500 mr-2"></i>
          Add New Skill/Certification
        </h4>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-medium">Skill Name</label>
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                placeholder={placeholders[placeholderIndex]}
                className="w-full rounded-lg p-3 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-medium">Category</label>
              <select 
                value={newSkill.category}
                onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                className="w-full rounded-lg p-3 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option value="softSkills">Soft Skills</option>
                <option value="programmingSkills">Programming Languages</option>
                <option value="frameworks">Frameworks & Tools</option>
                <option value="languages">Languages</option>
                <option value="certifications">Certifications</option>
              </select>
            </div>
          </div>
          
          {(newSkill.category === 'languages' || newSkill.category === 'certifications') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newSkill.category === 'languages' && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1 font-medium">Proficiency Level</label>
                  <select
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
                    className="w-full rounded-lg p-3 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    <option value="">Select Level</option>
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                  </select>
                </div>
              )}
              
              {newSkill.category === 'certifications' && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1 font-medium">Issuer (Optional)</label>
                  <input
                    type="text"
                    value={newSkill.issuer}
                    onChange={(e) => setNewSkill({...newSkill, issuer: e.target.value})}
                    placeholder="e.g. AWS, Google, Microsoft"
                    className="w-full rounded-lg p-3 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-end pt-2">
            <motion.button
              onClick={handleAddSkill}
              disabled={!newSkill.name.trim()}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium flex items-center ${
                newSkill.name.trim() 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={{ 
                scale: newSkill.name.trim() ? 1.03 : 1,
              }}
              whileTap={{ scale: newSkill.name.trim() ? 0.98 : 1 }}
            >
              <i className="fas fa-plus mr-2"></i> 
              Add Skill
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(SkillsStep);
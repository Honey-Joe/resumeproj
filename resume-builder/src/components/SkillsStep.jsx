import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper function to normalize skill data
const normalizeSkillItem = (item) => {
  if (typeof item.name === 'string') return item;
  
  return {
    ...item,
    name: item.name?.name || item.name?.title || JSON.stringify(item.name)
  };
};

const normalizeSkillArray = (arr) => {
  return (arr || []).map(normalizeSkillItem);
};

const SkillCategory = React.memo(({ 
  title, 
  icon, 
  items, 
  onRemoveItem,
  hasLevel = false
}) => {
  // Safely render values as strings
  const renderValue = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (value.name) return value.name;
    return JSON.stringify(value);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.2 }}
      className="bg-slate-800/50 rounded-lg border border-slate-600 shadow-lg w-full mb-4"
    >
      <div className="flex justify-between items-center px-4 py-3 border-b border-slate-600">
        <h3 className="text-sm font-semibold flex items-center text-white">
          <i className={`${icon} mr-2 text-indigo-400 text-sm`}></i>
          {title}
        </h3>
        <span className="bg-indigo-900/30 text-indigo-300 text-xs px-2 py-1 rounded-full">
          {items.length} skills
        </span>
      </div>
      
      <AnimatePresence>
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-5 text-slate-500 text-sm"
          >
            No skills added yet
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
            {items.map((skill) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-between bg-slate-700/30 rounded-lg px-3 py-2 border border-slate-600"
              >
                <div className="flex flex-wrap gap-1.5 items-center min-w-0">
                  <div className="text-xs font-medium text-white px-2 py-1 bg-slate-800/50 rounded border border-slate-600 truncate max-w-[120px]">
                    {renderValue(skill.name)}
                  </div>
                  {hasLevel && skill.level && (
                    <div className="text-xs bg-indigo-900/30 text-indigo-300 rounded-full px-2 py-0.5">
                      {renderValue(skill.level)}
                    </div>
                  )}
                  {skill.issuer && (
                    <div className="text-xs bg-emerald-900/30 text-emerald-300 rounded-full px-2 py-0.5">
                      {renderValue(skill.issuer)}
                    </div>
                  )}
                </div>
                
                <motion.button
                  onClick={() => onRemoveItem(skill.id)}
                  className="text-red-400 hover:text-red-300 flex items-center justify-center w-6 h-6 rounded-full bg-slate-700 border border-slate-600 shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Remove ${renderValue(skill.name)}`}
                  tabIndex={0}
                >
                  <i className="fas fa-times text-xs"></i>
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
  // Normalize initial data
  const [softSkills, setSoftSkills] = useState(() => 
    normalizeSkillArray(resumeData.softSkills)
  );
  const [programmingSkills, setProgrammingSkills] = useState(() => 
    normalizeSkillArray(resumeData.programmingSkills)
  );
  const [frameworks, setFrameworks] = useState(() => 
    normalizeSkillArray(resumeData.frameworks)
  );
  const [languages, setLanguages] = useState(() => 
    normalizeSkillArray(resumeData.languages)
  );
  const [certifications, setCertifications] = useState(() => 
    normalizeSkillArray(resumeData.certifications)
  );

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
      <div className="mb-5">
        <h3 className="text-xl font-bold text-white flex items-center">
          <i className="fas fa-star text-yellow-400 mr-3 text-xl"></i>
          Skills & Expertise
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Categorize your skills here
        </p>
      </div>

       <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3 }}
        className="bg-slate-800/50 p-5 rounded-xl border border-slate-600 shadow-lg"
      >
        <h4 className="text-sm font-semibold text-white mb-4 flex items-center">
          <i className="fas fa-plus-circle text-indigo-400 mr-3 text-sm"></i>
          Add New Skill/Certification
        </h4>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2 font-medium">Skill Name</label>
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                placeholder={placeholders[placeholderIndex]}
                className="w-full rounded-lg p-3 border border-slate-600 text-sm bg-slate-800/30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm text-slate-300 mb-2 font-medium">Category</label>
              <select 
                value={newSkill.category}
                onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                className="w-full rounded-lg p-3 border border-slate-600 text-sm bg-slate-800/30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  <label className="block text-sm text-slate-300 mb-2 font-medium">Proficiency Level</label>
                  <select
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
                    className="w-full rounded-lg p-3 border border-slate-600 text-sm bg-slate-800/30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  <label className="block text-sm text-slate-300 mb-2 font-medium">Issuer (Optional)</label>
                  <input
                    type="text"
                    value={newSkill.issuer}
                    onChange={(e) => setNewSkill({...newSkill, issuer: e.target.value})}
                    placeholder="e.g. AWS, Google, Microsoft"
                    className="w-full rounded-lg p-3 border border-slate-600 text-sm bg-slate-800/30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30' 
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
              whileHover={{ 
                scale: newSkill.name.trim() ? 1.02 : 1,
              }}
              whileTap={{ scale: newSkill.name.trim() ? 0.98 : 1 }}
            >
              <i className="fas fa-plus mr-2 text-sm"></i> 
              Add Skill
            </motion.button>
          </div>
        </div>
      </motion.div>

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
    </div>
  );
};

export default React.memo(SkillsStep);
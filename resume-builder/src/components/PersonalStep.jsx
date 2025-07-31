// src/components/steps/PersonalStep.jsx
import React from 'react';
import { motion } from 'framer-motion';

const InputField = ({ id, label, value, onChange, placeholder, type = "text", className = "" }) => {
  const inputClass =
    "w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-800 bg-white";

  return (
    <motion.div
      className={`mb-4 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          className={`${inputClass} resize-none h-32`}
          placeholder={placeholder}
        ></textarea>
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          className={inputClass}
          placeholder={placeholder}
        />
      )}
    </motion.div>
  );
};

const PersonalStep = ({ resumeData, updateResumeData }) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    updateResumeData({
      personal: {
        ...resumeData.personal,
        [id]: value,
      },
    });
  };

  return (
    <div>
      <motion.h3
        className="text-2xl font-bold mb-6 text-gray-800 pb-2 border-b border-gray-200 flex items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.i
          className="fas fa-user-circle text-primary mr-3 text-2xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, type: "spring" }}
        ></motion.i>
        Personal Information
      </motion.h3>

      <div className="space-y-4">
        <InputField
          id="name"
          label="Full Name"
          value={resumeData.personal.name || ""}
          onChange={handleChange}
          placeholder="John Doe"
        />

        <InputField
          id="title"
          label="Professional Title"
          value={resumeData.personal.title || ""}
          onChange={handleChange}
          placeholder="Software Engineer"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            id="email"
            label="Email"
            value={resumeData.personal.email || ""}
            onChange={handleChange}
            placeholder="john@example.com"
            type="email"
          />

          <InputField
            id="phone"
            label="Phone"
            value={resumeData.personal.phone || ""}
            onChange={handleChange}
            placeholder="(123) 456-7890"
            type="tel"
          />
        </div>

        <InputField
          id="location"
          label="Location"
          value={resumeData.personal.location || ""}
          onChange={handleChange}
          placeholder="New York, NY"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            id="linkedin"
            label="LinkedIn (Optional)"
            value={resumeData.personal.linkedin || ""}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
            type="url"
          />

          <InputField
            id="github"
            label="GitHub (Optional)"
            value={resumeData.personal.github || ""}
            onChange={handleChange}
            placeholder="https://github.com/username"
            type="url"
          />
        </div>

        <InputField
          id="summary"
          label="Professional Summary"
          value={resumeData.personal.summary || ""}
          onChange={handleChange}
          placeholder="Experienced software engineer with 5+ years of expertise in..."
          type="textarea"
        />
      </div>
    </div>
  );
};

export default PersonalStep;

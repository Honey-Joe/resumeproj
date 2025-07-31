// src/components/StepWizard.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StepWizard = ({ 
  children, 
  resumeData, 
  updateResumeData,
  onFinish 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const totalSteps = React.Children.count(children);

  const stepLabels = [
    "Personal",
    "Education",
    "Experience",
    "Skills",
    "Projects",
    "Hobbies",
    "Template"
  ];

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const goToStep = (step) => {
    if (step >= 1 && step <= totalSteps) setCurrentStep(step);
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const goToPrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  // Responsive step indicators
  const renderStepIndicators = () => {
    if (windowWidth < 768) {
      return (
        <div className="flex justify-center mb-4">
          <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
            Step {currentStep} of {totalSteps}: {stepLabels[currentStep - 1]}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {stepLabels.map((label, index) => {
          const stepNum = index + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;
          
          return (
            <motion.button
              key={stepNum}
              onClick={() => goToStep(stepNum)}
              className={`text-sm px-3 py-2.5 rounded-full font-medium flex items-center gap-2 border transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200'
                  : isCompleted
                    ? 'bg-indigo-100 border-indigo-200 text-indigo-700 hover:bg-indigo-200'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-500 hover:text-indigo-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={`w-7 h-7 flex items-center justify-center rounded-full ${
                isActive 
                  ? 'bg-white text-indigo-600' 
                  : isCompleted
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100 text-indigo-600'
              } font-bold text-xs`}>
                {isCompleted ? <i className="fas fa-check"></i> : stepNum}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </motion.button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Progress Bar */}
      <div className="w-full mb-6 sm:mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-1.5">
          <span className="font-medium">Step {currentStep} of {totalSteps}</span>
          <span className="font-medium">{Math.round(progressPercentage)}% Complete</span>
        </div>
        <div className="w-full h-2.5 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.4 }}
          ></motion.div>
        </div>
      </div>

      {/* Step Indicators */}
      {renderStepIndicators()}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="form-section bg-white rounded-xl shadow-lg p-5 sm:p-8 mb-6"
          style={{
            width: '100%',
            maxWidth: '900px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {React.Children.toArray(children).map((child, index) => (
            <div 
              key={`step-${index + 1}`}
              className={index + 1 === currentStep ? "block h-full" : "hidden"}
            >
              {React.cloneElement(child, { 
                resumeData, 
                updateResumeData,
                step: index + 1
              })}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-4 mt-4">
        <motion.button
          onClick={goToPrevStep}
          disabled={currentStep === 1}
          className={`px-6 py-3 sm:px-8 sm:py-3.5 rounded-lg font-medium text-white flex items-center justify-center ${
            currentStep === 1 
              ? 'opacity-50 cursor-not-allowed' 
              : 'cursor-pointer'
          }`}
          style={{
            background: 'linear-gradient(90deg, #4b5563 0%, #1f2937 100%)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
          whileHover={currentStep !== 1 ? { scale: 1.03 } : {}}
          whileTap={currentStep !== 1 ? { scale: 0.97 } : {}}
        >
          <i className="fas fa-arrow-left mr-3"></i> Previous
        </motion.button>

        {currentStep < totalSteps ? (
          <motion.button
            onClick={goToNextStep}
            className="px-6 py-3 sm:px-8 sm:py-3.5 rounded-lg font-medium text-white flex items-center justify-center"
            style={{
              background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3), 0 2px 4px -1px rgba(99, 102, 241, 0.2)'
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Next <i className="fas fa-arrow-right ml-3"></i>
          </motion.button>
        ) : (
          <motion.button
            onClick={onFinish}
            className="px-6 py-3 sm:px-8 sm:py-3.5 rounded-lg font-medium text-white flex items-center justify-center"
            style={{
              background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
              boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3), 0 2px 4px -1px rgba(16, 185, 129, 0.2)'
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <i className="fas fa-check-circle mr-3"></i> Finish & Preview
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default StepWizard;

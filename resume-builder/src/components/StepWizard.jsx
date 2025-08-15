// src/components/StepWizard.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StepWizard = ({ children, resumeData, updateResumeData, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const totalSteps = React.Children.count(children);

  const stepLabels = [
    "Personal", "Education", "Experience", "Skills",
    "Projects", "Hobbies", "Template"
  ];

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

  // Slow downward scroll function
  const slowScrollDown = (duration = 3000) => {
    const start = window.scrollY;
    const end = document.body.scrollHeight - window.innerHeight;
    const distance = end - start;
    let startTime = null;

    const easeInOutQuad = (t) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const time = timestamp - startTime;
      const progress = Math.min(time / duration, 1);
      const easedProgress = easeInOutQuad(progress);
      window.scrollTo(0, start + distance * easedProgress);
      if (time < duration) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  // New finish handler with slow scroll animation
  const handleFinish = () => {
    // First scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    // After short delay, slow scroll down
    setTimeout(() => {
      slowScrollDown(5000); // 5 seconds downward scroll
    }, 1000);

    // Call external finish logic
    if (typeof onFinish === "function") {
      onFinish();
    }
  };

  const renderStepIndicators = () => {
    if (windowWidth < 768) {
      return (
        <div className="flex justify-center mb-4">
          <div className="bg-indigo-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-indigo-500/20">
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
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-lg shadow-indigo-500/50'
                  : isCompleted
                    ? 'bg-indigo-100 border-indigo-200 text-indigo-800 hover:bg-indigo-200'
                    : 'bg-gradient-to-r from-slate-800 to-slate-900 text-slate-100 border-white/10 hover:border-indigo-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-full font-bold text-xs ${
                  isActive
                    ? 'bg-white text-indigo-700'
                    : isCompleted
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 text-indigo-100'
                }`}
              >
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
        <div className="flex justify-between text-sm text-slate-200 mb-1.5">
          <span className="font-medium">Step {currentStep} of {totalSteps}</span>
          <span className="font-medium">{Math.round(progressPercentage)}% Complete</span>
        </div>
        <div className="w-full h-2.5 sm:h-3 bg-slate-700/40 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.4 }}
          />
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
          className="form-section rounded-xl shadow-xl p-5 sm:p-8 mb-6 flex flex-col gap-4 max-w-3xl mx-auto text-white"
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 10px 30px -10px rgba(30, 58, 138, 0.5)'
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
            currentStep === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:brightness-110'
          }`}
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            boxShadow: '0 4px 6px rgba(30, 41, 59, 0.4)'
          }}
          whileHover={currentStep !== 1 ? { scale: 1.03 } : {}}
          whileTap={currentStep !== 1 ? { scale: 0.97 } : {}}
        >
          <i className="fas fa-arrow-left mr-3"></i> Previous
        </motion.button>

        {currentStep < totalSteps ? (
          <motion.button
            onClick={goToNextStep}
            className="px-6 py-3 sm:px-8 sm:py-3.5 rounded-lg font-medium text-white flex items-center justify-center hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
              boxShadow: '0 4px 6px rgba(99, 102, 241, 0.4)'
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Next <i className="fas fa-arrow-right ml-3"></i>
          </motion.button>
        ) : (
          <motion.button
            onClick={handleFinish}
            className="px-1 py-2 sm:px-9 sm:py-3.0 rounded-lg font-medium text-white flex items-center justify-center hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              boxShadow: '0 4px 6px rgba(16, 185, 129, 0.4)'
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <i className="fas fa-check-circle mr-3"></i> Finish 
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default StepWizard;

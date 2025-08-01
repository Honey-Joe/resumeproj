import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StepWizard from './StepWizard';
import PersonalStep from './PersonalStep';
import EducationStep from './EducationStep';
import ExperienceStep from './ExperienceStep';
import SkillsStep from './SkillsStep';
import ProjectsStep from './ProjectsStep';
import TemplateStep from './TemplateStep';
import HobbiesStep from './HobbiesStep';
import Preview from './Preview';
import { saveResumeData, sanitizeInput } from './resumeService';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

const ResumeBuilder = () => {
  const savedData = localStorage.getItem('resumeData');
  const initialResumeData = savedData
    ? JSON.parse(savedData)
    : {
        personal: {
          name: '',
          title: '',
          email: '',
          phone: '',
          location: '',
          linkedin: '',
          github: '',
          summary: ''
        },
        experience: [],
        education: [],
        projects: [],
        programmingSkills: [],
        frameworks: [],
        softSkills: [],
        hobbies: [],
        template: 'blue'
      };

  const [resumeData, setResumeData] = useState(initialResumeData);
  const [unlockedTemplates, setUnlockedTemplates] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ success: false, message: '' });
  const previewRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  useEffect(() => {
    const fetchUnlockedTemplates = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (email) {
          const response = await fetch(
            `http://apiresumebbuilder.freewilltech.in/get_unlocked_templates.php?email=${email}`
          );
          const data = await response.json();
          if (data.status === "success") {
            setUnlockedTemplates(data.templates);
          }
        }
      } catch (error) {
        console.error("Failed to fetch unlocked templates:", error);
      }
    };

    fetchUnlockedTemplates();
  }, [resumeData?.personal?.email]);

  const updateResumeData = useCallback((newData) => {
    setResumeData(prev => ({
      ...prev,
      ...newData,
      personal: { ...prev.personal, ...(newData.personal || {}) }
    }));
  }, []);

  const handleRefresh = () => {
    if (window.confirm('Are you sure you want to start a new resume? All current data will be lost.')) {
      const freshData = {
        personal: {
          name: '',
          title: '',
          email: '',
          phone: '',
          location: '',
          linkedin: '',
          github: '',
          summary: ''
        },
        experience: [],
        education: [],
        projects: [],
        programmingSkills: [],
        frameworks: [],
        softSkills: [],
        hobbies: [],
        template: 'blue'
      };
      setResumeData(freshData);
      localStorage.setItem('resumeData', JSON.stringify(freshData));
      setSaveStatus({ success: true, message: 'Resume has been reset successfully!' });
      setTimeout(() => setSaveStatus({ success: false, message: '' }), 3000);
    }
  };

  const handleSaveToDB = async () => {
    setIsSaving(true);
    setSaveStatus({ success: false, message: '' });
    try {
      const sanitizedData = sanitizeInput(resumeData);
      await saveResumeData(sanitizedData);
      setSaveStatus({ success: true, message: 'Resume saved successfully!' });
    } catch (error) {
      setSaveStatus({ success: false, message: error.message || 'Failed to save resume' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus({ success: false, message: '' }), 3000);
    }
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    setSaveStatus({ success: false, message: '' });

    try {
      const node = previewRef.current;
      if (!node) throw new Error('Resume container not found');

      const scale = 6;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();

      const dataUrl = await toPng(node, {
        backgroundColor: '#ffffff',
        pixelRatio: scale
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const imgWidth = pdfPageWidth - 20;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      const x = (pdfPageWidth - imgWidth) / 2;

      pdf.addImage(dataUrl, 'PNG', x, 10, imgWidth, imgHeight);
      const name = resumeData?.personal?.name?.replace(/\s+/g, '_') || 'resume';
      pdf.save(`${name}_resume.pdf`);

      setSaveStatus({ success: true, message: 'PDF generated successfully!' });
    } catch (err) {
      console.error('PDF generation error:', err);
      setSaveStatus({
        success: false,
        message: `PDF generation failed: ${err.message || 'Unknown error'}`
      });
    } finally {
      setIsGeneratingPDF(false);
      setTimeout(() => setSaveStatus({ success: false, message: '' }), 3000);
    }
  };

  return (
    <section id="resume-builder" className="py-10 px-4 max-w-screen-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <h2 className="text-4xl font-bold text-gray-900 mb-2">Build Your Perfect Resume</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Fill in your details and watch your resume come to life in real-time
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Form Steps */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow border p-6">
            <StepWizard resumeData={resumeData} updateResumeData={updateResumeData}>
              <PersonalStep resumeData={resumeData} updateResumeData={updateResumeData} />
              <EducationStep resumeData={resumeData} updateResumeData={updateResumeData} />
              <ExperienceStep resumeData={resumeData} updateResumeData={updateResumeData} />
              <SkillsStep resumeData={resumeData} updateResumeData={updateResumeData} />
              <ProjectsStep resumeData={resumeData} updateResumeData={updateResumeData} />
              <HobbiesStep resumeData={resumeData} updateResumeData={updateResumeData} />
              <TemplateStep
                resumeData={resumeData}
                updateResumeData={updateResumeData}
                unlockedTemplates={unlockedTemplates}
                setUnlockedTemplates={setUnlockedTemplates}
              />
            </StepWizard>
          </div>
        </div>

        {/* Right Panel - Preview and Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow border p-6 sticky top-4">
            <div ref={previewRef} className="overflow-hidden">
              <Preview
                resumeData={resumeData}
                onRefresh={handleRefresh}
                unlockedTemplates={unlockedTemplates}
              />
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <button
                onClick={handleRefresh}
                className="px-6 py-2.5 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-sm"
              >
                <i className="fas fa-sync-alt mr-2"></i>
                New Resume
              </button>

              <button
                onClick={handleSaveToDB}
                disabled={isSaving}
                className={`px-6 py-2.5 rounded-xl font-semibold shadow-sm text-white transition-colors ${
                  isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isSaving ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Save Resume
                  </>
                )}
              </button>

              <button
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF}
                className={`px-6 py-2.5 rounded-xl font-semibold shadow-sm text-white transition-colors ${
                  isGeneratingPDF ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isGeneratingPDF ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Generating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-file-pdf mr-2"></i>
                    Download PDF
                  </>
                )}
              </button>
            </div>

            <AnimatePresence>
              {saveStatus.message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-4 px-5 py-3 rounded-md text-sm text-center ${
                    saveStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {saveStatus.message}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeBuilder;

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCookies } from "react-cookie";
import StepWizard from "./StepWizard";
import PersonalStep from "./PersonalStep";
import EducationStep from "./EducationStep";
import ExperienceStep from "./ExperienceStep";
import SkillsStep from "./SkillsStep";
import ProjectsStep from "./ProjectsStep";
import TemplateStep from "./TemplateStep";
import HobbiesStep from "./HobbiesStep";
import Preview from "./Preview";
import { saveResumeData, sanitizeInput } from "./resumeService";
import "@fortawesome/fontawesome-free/css/all.min.css";

const ResetConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-slate-800 border border-blue-600/50 rounded-2xl p-6 w-full max-w-md"
          >
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mb-4">
                <i className="fas fa-exclamation-triangle text-2xl text-rose-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Start New Resume?</h3>
              <p className="text-slate-300">
                All current data will be permanently deleted. This action cannot
                be undone.
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-medium bg-slate-700 hover:bg-slate-600 transition text-white shadow"
              >
                <i className="fas fa-times mr-2" />
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-6 py-2.5 rounded-xl font-medium bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 transition text-white shadow"
              >
                <i className="fas fa-redo mr-2" />
                Confirm Reset
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ResumeBuilder = () => {
  const [cookies, setCookie] = useCookies(["resumeData", "user"]);
  const previewRef = useRef(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const user = cookies.user || {};
  const userEmail = localStorage.getItem("userEmail");
  const userName = typeof user.name === "string" ? user.name : "";

  const [resumeData, setResumeData] = useState(
    cookies.resumeData || {
      personal: {
        name: "",
        title: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        summary: "",
      },
      experience: [],
      education: [],
      projects: [],
      programmingSkills: [],
      frameworks: [],
      softSkills: [],
      hobbies: [],
      template: "blue",
    }
  );

  const [unlockedTemplates, setUnlockedTemplates] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ success: false, message: "" });
  console.log("✅ ", unlockedTemplates);

  // Save resume data to cookies
  useEffect(() => {
    setCookie("resumeData", resumeData, {
      path: "/",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60,
    });
  }, [resumeData, setCookie]);

  // Fetch unlocked templates
  useEffect(() => {
    const fetchUnlockedTemplates = async () => {
      if (!userEmail) return;

      const token = cookies.userToken;

      try {
        const res = await fetch(
          `https://apiresumebbuilder.freewilltech.in/get_unlocked_templates.php?email=${encodeURIComponent(
            userEmail
          )}`
        );
        const data = await res.json();
        console.log("ds",data);
        if (data.status === "success") {
          setUnlockedTemplates(data.templates);
        } else {
          console.warn("Failed to load templates:", data.message);
        }
      } catch (err) {
        console.error("Failed to fetch unlocked templates:", err);
      }
    };

    fetchUnlockedTemplates();
  }, [userEmail, cookies.userToken]);

  const updateResumeData = useCallback((newData) => {
    setResumeData((prev) => ({
      ...prev,
      ...newData,
      personal: { ...prev.personal, ...(newData.personal || {}) },
    }));
  }, []);

  const handleResetConfirm = () => {
    const freshData = {
      personal: {
        name: "",
        title: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        summary: "",
      },
      experience: [],
      education: [],
      projects: [],
      programmingSkills: [],
      frameworks: [],
      softSkills: [],
      hobbies: [],
      template: "blue",
    };
    setResumeData(freshData);
    setUnlockedTemplates([]);
    setSaveStatus({ success: true, message: "Resume reset successfully!" });
    setTimeout(() => setSaveStatus({ success: false, message: "" }), 3000);
    setShowResetModal(false);
  };

  const handleSaveToDB = async () => {
    setIsSaving(true);
    setSaveStatus({ success: false, message: "" });
    try {
      const sanitizedData = sanitizeInput(resumeData);
      await saveResumeData(sanitizedData);
      setSaveStatus({ success: true, message: "Resume saved successfully!" });
    } catch (err) {
      setSaveStatus({
        success: false,
        message: err.message || "Failed to save resume.",
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus({ success: false, message: "" }), 3000);
    }
  };

  return (
    <section className="py-16 px-4 max-w-screen-2xl mx-auto min-h-screen bg-gradient-to-b from-slate-900 to-blue-900 text-white">
      {/* Reset Confirmation Modal */}
      <ResetConfirmationModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetConfirm}
      />

      {/* Save Notification */}
      <AnimatePresence>
        {saveStatus.message && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 rounded-xl shadow-lg px-6 py-3 text-center text-white ${
              saveStatus.success ? "bg-emerald-600" : "bg-rose-700"
            } border`}
          >
            <div className="flex items-center justify-center gap-3">
              <i
                className={`text-xl ${
                  saveStatus.success
                    ? "fas fa-check-circle"
                    : "fas fa-exclamation-circle"
                }`}
              />
              <span>{saveStatus.message}</span>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3 }}
              className={`h-1 mt-2 ${
                saveStatus.success ? "bg-emerald-300" : "bg-rose-300"
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-3">
          Build Your Perfect Resume
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Fill in your details and watch your resume come to life in real-time.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Panel */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl p-6 bg-slate-800/70 border border-blue-500/30 backdrop-blur">
            <StepWizard
              resumeData={resumeData}
              updateResumeData={updateResumeData}
            >
              <PersonalStep
                resumeData={resumeData}
                updateResumeData={updateResumeData}
              />
              <EducationStep
                resumeData={resumeData}
                updateResumeData={updateResumeData}
              />
              <ExperienceStep
                resumeData={resumeData}
                updateResumeData={updateResumeData}
              />
              <SkillsStep
                resumeData={resumeData}
                updateResumeData={updateResumeData}
              />
              <ProjectsStep
                resumeData={resumeData}
                updateResumeData={updateResumeData}
              />
              <HobbiesStep
                resumeData={resumeData}
                updateResumeData={updateResumeData}
              />
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
                unlockedTemplates={unlockedTemplates}
              />
              {console.log("✅ sdffd", unlockedTemplates)}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setShowResetModal(true)}
                className="px-6 py-2.5 rounded-xl font-semibold bg-blue-700 hover:bg-blue-800 transition text-white shadow"
              >
                <i className="fas fa-sync-alt mr-2" />
                New Resume
              </button>

              <button
                onClick={handleSaveToDB}
                disabled={isSaving}
                className={`px-6 py-2.5 rounded-xl font-semibold text-white transition shadow ${
                  isSaving
                    ? "bg-indigo-800 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                }`}
              >
                {isSaving ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2" />
                    Save Resume
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeBuilder;

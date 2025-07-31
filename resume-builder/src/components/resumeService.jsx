import { pdf } from '@react-pdf/renderer';
import ResumePDF from './ResumePDF';

// Save resume to local storage
export const saveResumeData = (resumeData) => {
  try {
    const existingResumes = JSON.parse(localStorage.getItem('resumes')) || [];
    const existingIndex = existingResumes.findIndex(r => r.id === resumeData.id);

    if (existingIndex !== -1) {
      existingResumes[existingIndex] = resumeData;
    } else {
      resumeData.id = Date.now().toString();
      resumeData.createdAt = new Date().toISOString();
      existingResumes.push(resumeData);
    }

    localStorage.setItem('resumes', JSON.stringify(existingResumes));
    return resumeData.id;
  } catch (error) {
    console.error('Error saving resume:', error);
    return null;
  }
};

// Sanitize input recursively
export const sanitizeInput = (data) => {
  return Object.keys(data).reduce((acc, key) => {
    if (typeof data[key] === 'string') {
      acc[key] = data[key].replace(/<[^>]*>?/gm, ''); // Remove HTML tags
    } else if (typeof data[key] === 'object' && data[key] !== null) {
      acc[key] = sanitizeInput(data[key]); // Recursive sanitization
    } else {
      acc[key] = data[key];
    }
    return acc;
  }, {});
};

// Load a specific resume by ID
export const loadResume = (id) => {
  try {
    const resumes = JSON.parse(localStorage.getItem('resumes')) || [];
    return resumes.find(r => r.id === id) || null;
  } catch (error) {
    console.error('Error loading resume:', error);
    return null;
  }
};

// Load all resumes for the current user
export const loadUserResumes = (userId) => {
  try {
    const resumes = JSON.parse(localStorage.getItem('resumes')) || [];
    return resumes.filter(r => r.userId === userId);
  } catch (error) {
    console.error('Error loading user resumes:', error);
    return [];
  }
};

// Delete a resume
export const deleteResume = (id) => {
  try {
    let resumes = JSON.parse(localStorage.getItem('resumes')) || [];
    resumes = resumes.filter(r => r.id !== id);
    localStorage.setItem('resumes', JSON.stringify(resumes));
    return true;
  } catch (error) {
    console.error('Error deleting resume:', error);
    return false;
  }
};

// Simulate resume sharing
export const shareResume = (resumeId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const shareLink = `https://resumecraft.app/share/${resumeId}`;
      resolve(shareLink);
    }, 1000);
  });
};

// Get stats (for admin/analytics)
export const getResumeStats = () => {
  try {
    const resumes = JSON.parse(localStorage.getItem('resumes')) || [];

    const totalResumes = resumes.length;
    const today = new Date().toISOString().split('T')[0];
    const createdToday = resumes.filter(r => r.createdAt.split('T')[0] === today).length;

    const templateCounts = resumes.reduce((acc, resume) => {
      acc[resume.template] = (acc[resume.template] || 0) + 1;
      return acc;
    }, {});

    const templatesUsage = Object.entries(templateCounts).map(([name, value]) => ({
      name,
      value
    }));

    return {
      totalResumes,
      createdToday,
      templatesUsage
    };
  } catch (error) {
    console.error('Error getting resume stats:', error);
    return {
      totalResumes: 0,
      createdToday: 0,
      templatesUsage: []
    };
  }
};

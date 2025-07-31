// src/services/resumeService.js
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-production-api.com'
  : 'http://localhost:5000';

export const saveResumeData = async (resumeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/resume/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(resumeData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Save failed');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Network error');
  }
};

export const generatePDF = async (element, fileName = 'resume') => {
  try {
    const A4_WIDTH = 210; // mm
    const PIXELS_PER_MM = 3.78;

    // Clone the element to avoid side effects
    const clone = element.cloneNode(true);
    clone.style.width = `${A4_WIDTH * PIXELS_PER_MM}px`;
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.visibility = 'visible';
    document.body.appendChild(clone);

    // Generate canvas from cloned element
    const canvas = await html2canvas(clone, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      windowWidth: A4_WIDTH * PIXELS_PER_MM
    });

    document.body.removeChild(clone); // Clean up

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const width = A4_WIDTH;
    const height = (canvas.height * A4_WIDTH) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, width, height, null, 'FAST');

    // ✅ Save the PDF file directly
    pdf.save(`${sanitizeFileName(fileName)}.pdf`);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate and download PDF');
  }
};
// Helper function to sanitize file names
const sanitizeFileName = (name) => {
  return name
    .replace(/[^a-zA-Z0-9_\u0600-\u06FF\u4e00-\u9fff- ]/g, '') // Allow unicode chars
    .replace(/\s+/g, '_')
    .substring(0, 50); // Limit length
};

// Additional helper functions for sanitization
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

// Add other API functions as needed
export const fetchResumeData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/resume`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch resume data');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Network error');
  }
};

export const deleteResume = async (resumeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/resume/${resumeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete resume');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Network error');
  }
};
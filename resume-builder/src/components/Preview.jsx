import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

// Icons definition
const icons = {
  email: (
    <svg xmlns="http://www.w3.org/2000/svg"
      style={{ width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '6px', color: '#333' }}
      viewBox="0 0 20 20" fill="currentColor">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  ),
  phone: (
    <svg xmlns="http://www.w3.org/2000/svg"
      style={{ width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '6px', color: '#333' }}
      viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
  ),
  location: (
    <svg xmlns="http://www.w3.org/2000/svg"
      style={{ width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '6px', color: '#333' }}
      viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
  ),
  linkedin: (
    <svg xmlns="http://www.w3.org/2000/svg"
      style={{ width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '6px', color: '#0077b5' }}
      viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  ),
  github: (
    <svg xmlns="http://www.w3.org/2000/svg"
      style={{ width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '6px', color: '#000' }}
      viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  briefcase: (
    <svg xmlns="http://www.w3.org/2000/svg"
      style={{ width: '18px', height: '18px', verticalAlign: 'middle', marginRight: '6px', color: '#333' }}
      viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
    </svg>
  ),
  user: (
    <svg xmlns="http://www.w3.org/2000/svg"
      style={{ width: '18px', height: '18px', verticalAlign: 'middle', marginRight: '6px', color: '#333' }}
      viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  ),
  tools: (
    <svg xmlns="http://www.w3.org/2000/svg"
      style={{ width: '18px', height: '18px', verticalAlign: 'middle', marginRight: '6px', color: '#333' }}
      viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  ),
  refresh: (
    <svg xmlns="http://www.w3.org/2000/svg"
      style={{ width: '18px', height: '18px', verticalAlign: 'middle', marginRight: '6px', color: '#555' }}
      viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
    </svg>
  ),
  education: (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '18px', height: '18px', verticalAlign: 'middle', marginRight: '6px', color: '#333' }} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
    </svg>
  ),
  project: (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '18px', height: '18px', verticalAlign: 'middle', marginRight: '6px', color: '#333' }} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  ),
  skills: (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '18px', height: '18px', verticalAlign: 'middle', marginRight: '6px', color: '#333' }} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  ),
  website: (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '6px', color: '#333' }} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4.083 9h1.946c.089.34.213.667.368.978.305.63.739 1.176 1.268 1.603.577.467 1.281.775 2.046.898a4.51 4.51 0 01-.666 1.477 6.451 6.451 0 01-2.471-.878 5.377 5.377 0 01-1.491-1.324A5.31 5.31 0 014.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.665.21a4.408 4.408 0 00-.852.512c-.29.218-.558.487-.786.802a3.047 3.047 0 00-.436.975c-.09.338-.11.636-.093.904.01.172.034.4.1.677.065.277.17.572.323.87.306.6.73 1.132 1.24 1.557.51.426 1.09.73 1.71.897.62.167 1.26.2 1.88.1.62-.1 1.2-.33 1.71-.68.51-.35.92-.8 1.22-1.33.3-.53.46-1.13.47-1.75a3.55 3.55 0 00-.13-1.1 3.39 3.39 0 00-.49-.97c-.22-.3-.49-.56-.8-.77-.31-.22-.65-.38-1.02-.49A3.77 3.77 0 0010 4zm-6 6a6 6 0 1112 0 6 6 0 01-12 0z" clipRule="evenodd" />
    </svg>
  ),
  link: (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '6px', color: '#333' }} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5.656 8.242a2 2 0 11-2.828-2.828l3-3a2 2 0 012.828 0 1 1 0 001.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 005.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5z" clipRule="evenodd" />
    </svg>
  ),
  hobbies: (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '18px', height: '18px', verticalAlign: 'middle', marginRight: '6px', color: '#333' }} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
  ),
};

const Preview = forwardRef(({ resumeData, onRefresh, onPdfStart, onPdfComplete, unlockedTemplates = [] }, ref) => {
  const resumeContainerRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ success: false, message: '' });
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageHeight, setPageHeight] = useState(0);
  const previewContainerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Expose download function via ref
  useImperativeHandle(ref, () => ({
    downloadResume: handleDownload,
  }));


 const A4_WIDTH_PX = 794; // 210mm * (96 / 25.4)
  const A4_HEIGHT_PX = 1123; // 297mm * (96 / 25.4)

  useEffect(() => {
    const calculatePageHeight = () => {
      if (resumeContainerRef.current) {
        setPageHeight(A4_HEIGHT_PX);
        const totalHeight = resumeContainerRef.current.scrollHeight;
        const pages = Math.ceil(totalHeight / A4_HEIGHT_PX);
        setTotalPages(pages);
      }
    };

    calculatePageHeight();
    window.addEventListener('resize', calculatePageHeight);
    return () => window.removeEventListener('resize', calculatePageHeight);
  }, [resumeData]);

const handleDownload = async () => {
  if (onPdfStart) onPdfStart();
  setIsGeneratingPDF(true);

  // Constants for A4 dimensions and pixel conversion
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  const PX_PER_MM = 96 / 25.4; // 96dpi conversion
  const A4_WIDTH_PX = A4_WIDTH_MM * PX_PER_MM;
  const A4_HEIGHT_PX = A4_HEIGHT_MM * PX_PER_MM;

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const name = resumeData?.personal?.name?.replace(/\s+/g, '_') || 'resume';

    const resumeElement = resumeContainerRef.current;
    const clone = resumeElement.cloneNode(true);

    // Create temporary container with proper styling
    const tempContainer = document.createElement('div');
    Object.assign(tempContainer.style, {
      position: 'absolute',
      left: '-9999px',
      width: `${A4_WIDTH_PX}px`,
      backgroundColor: 'white',
      overflow: 'hidden',
      boxSizing: 'border-box',
      padding: '0',
      margin: '0',
      fontSize: '12pt',
      fontFamily: 'Arial, sans-serif'
    });

    // Create print-specific styles
    const printStyles = document.createElement('style');
    printStyles.textContent = `
      * {
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        box-decoration-break: clone;
        -webkit-box-decoration-break: clone;
      }
      .page-break-avoid {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    `;

    tempContainer.appendChild(printStyles);
    tempContainer.appendChild(clone);
    document.body.appendChild(tempContainer);

    // Calculate page breaks
    const pageElements = [];
    let currentPageHeight = 0;
    let currentPageElements = [];
    const nonBreakingElements = clone.querySelectorAll('.page-break-avoid');

    const processElement = (el) => {
      const elHeight = el.offsetHeight;
      const isNonBreaking = [...nonBreakingElements].includes(el);
      
      // Check if element fits or needs to break
      if (currentPageHeight + elHeight <= A4_HEIGHT_PX || currentPageHeight === 0) {
        currentPageHeight += elHeight;
        currentPageElements.push(el);
      } else {
        // Finish current page
        pageElements.push([...currentPageElements]);
        
        // Start new page
        currentPageElements = [el];
        currentPageHeight = elHeight;
      }
    };

    // Process all child elements
    Array.from(clone.children).forEach(processElement);
    
    // Push remaining elements
    if (currentPageElements.length > 0) {
      pageElements.push(currentPageElements);
    }

    // Generate PDF pages
    for (let i = 0; i < pageElements.length; i++) {
      if (i > 0) pdf.addPage();
      
      const pageDiv = document.createElement('div');
      pageDiv.style.width = `${A4_WIDTH_PX}px`;
      pageDiv.style.height = `${A4_HEIGHT_PX}px`;
      pageDiv.style.overflow = 'hidden';
      
      pageElements[i].forEach(el => pageDiv.appendChild(el.cloneNode(true)));
      tempContainer.innerHTML = '';
      tempContainer.appendChild(pageDiv);

      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await toPng(pageDiv, {
        pixelRatio: 3,
        quality: 1,
        backgroundColor: 'white',
        width: A4_WIDTH_PX,
        height: A4_HEIGHT_PX,
        cacheBust: true
      });

      pdf.addImage(
        canvas, 
        'PNG', 
        0, 
        0, 
        A4_WIDTH_MM, 
        A4_HEIGHT_MM,
        undefined,
        'FAST'
      );
    }

    // Cleanup
    document.body.removeChild(tempContainer);
    pdf.save(`${name}_resume.pdf`);
    setIsGeneratingPDF(false);
    onPdfComplete?.(true, 'PDF generated successfully!');
  } catch (err) {
    console.error('PDF generation error:', err);
    setIsGeneratingPDF(false);
    onPdfComplete?.(false, `PDF generation failed: ${err.message || 'Unknown error'}`);
  }
};

  const colors = {
    blue: { primary: '#1e40af', secondary: '#3b82f6', accent: '#60a5fa' },
    green: { primary: '#065f46', secondary: '#059669', accent: '#34d399' },
    dark: { primary: '#0f172a', secondary: '#1e293b', accent: '#334155' },
    red: { primary: '#9d174d', secondary: '#db2777', accent: '#ec4899' },
    teal: { primary: '#0f766e', secondary: '#14b8a6', accent: '#2dd4bf' },
    minimal: { primary: '#1e293b', secondary: '#334155', accent: '#64748b' },
    classic: { primary: '#1e293b', secondary: '#334155', accent: '#475569' },
    sidebar: { primary: '#0f172a', secondary: '#1e293b', accent: '#334155' },
    creative: { primary: '#4c1d95', secondary: '#5b21b6', accent: '#7e22ce' }
  }[resumeData?.template || 'blue'] || {
    primary: '#1e40af', secondary: '#3b82f6', accent: '#60a5fa'
  };

  const getTextColor = (bgColor) => {
    const color = bgColor.replace('#', '');
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  const textColor = getTextColor(colors.primary);

const Watermark = ({ text = 'FREE WILL TECHNOLOGIES', unlockedTemplates = [], templateId }) => {
  if (!templateId) return null;
  
  // Check if this specific template is unlocked
  const isUnlocked = unlockedTemplates.includes(templateId);
  
  if (isUnlocked) {
    return null; // Template is unlocked → no watermark
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
      <div
        className="text-[2.5rem] md:text-[5rem] font-extrabold text-gray-300 opacity-60 transform rotate-45 select-none"
        style={{
          textShadow: '2px 2px 8px rgba(255,255,255,0.7), -2px -2px 8px rgba(0,0,0,0.5)',
          whiteSpace: 'nowrap',
          fontSize: window.innerWidth < 768 ? '3.5rem' : undefined,
        }}
      >
        {text.trim()}
      </div>
    </div>
  );
};

  const renderContactItem = (icon, value, link) => (
    value ? (
      <motion.div
        className="flex items-center mb-2 break-words"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="icon-container flex-shrink-0">{icon}</div>
        {link ? (
          <a href={link.startsWith('http') ? link : `https://${link}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:underline transition-all break-all">
            {value}
          </a>
        ) : (
          <span className="text-gray-300 break-all">{value}</span>
        )}
      </motion.div>
    ) : null
  );

  const renderSkills = (skills) => (
    <div className="space-y-3">
      {skills.map((skill, idx) => (
        <motion.div
          key={idx}
          className="skill-item"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {typeof skill === 'object' && skill !== null ? skill.name : skill}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">{skill.level || 'Expert'}</span>
          </div>
          <div className="h-1.5 w-full bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${skill.levelValue || 90}%` }}
              transition={{ duration: 1, delay: idx * 0.1 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderTechnologyTags = (technologies) => {
    if (!technologies) return null;
    
    let techList = [];
    if (Array.isArray(technologies)) {
      techList = technologies.map(t => {
        if (typeof t === 'string') return t;
        if (t && t.name) return t.name;
        return String(t);
      });
    } else if (typeof technologies === 'string') {
      techList = technologies.split(',').map(t => t.trim());
    } else {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {techList.map((tech, idx) => (
          <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
            {tech}
          </span>
        ))}
      </div>
    );
  };

  const renderContactSection = () => {
    const contactItems = [
      { icon: icons.email, value: resumeData?.personal?.email },
      { icon: icons.phone, value: resumeData?.personal?.phone },
      { icon: icons.location, value: resumeData?.personal?.location },
      { icon: icons.linkedin, value: resumeData?.personal?.linkedin, link: resumeData?.personal?.linkedin },
      { icon: icons.github, value: resumeData?.personal?.github, link: resumeData?.personal?.github },
      { icon: icons.website, value: resumeData?.personal?.website, link: resumeData?.personal?.website },
    ].filter(item => item.value);

    if (contactItems.length === 0) return null;

    return (
      <div className="space-y-4 mb-6 text-sm">
        <h2 className="font-bold text-lg mb-3 border-b pb-2">Contact</h2>
        {contactItems.map((item, index) => (
          <div key={index}>
            {renderContactItem(item.icon, item.value, item.link)}
          </div>
        ))}
      </div>
    );
  };

  const getSkillName = (skill) => {
    if (typeof skill === 'string') return skill;
    if (skill && skill.name) return skill.name;
    return '';
  };

  const renderSkillsSection = () => (
    <div>
      {resumeData?.softSkills?.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold text-lg mb-2">Soft Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.softSkills.map((skill, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                {getSkillName(skill)}
              </span>
            ))}
          </div>
        </div>
      )}

      {resumeData?.programmingSkills?.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold text-lg mb-2">Programming Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.programmingSkills.map((skill, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                {getSkillName(skill)}
              </span>
            ))}
          </div>
        </div>
      )}

      {resumeData?.frameworks?.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold text-lg mb-2">Frameworks</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.frameworks.map((skill, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                {getSkillName(skill)}
              </span>
            ))}
          </div>
        </div>
      )}

      {resumeData?.languages?.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold text-lg mb-2">Languages</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.languages.map((lang, idx) => {
              const langName = getSkillName(lang);
              return (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs md:text-sm font-medium"
                >
                  {langName}{lang.level ? ` (${lang.level})` : ''}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {resumeData?.certifications?.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold text-lg mb-2">Certifications</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.certifications.map((cert, idx) => {
              const certName = getSkillName(cert);
              return (
                <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                  {certName}{cert.issuer ? ` (${cert.issuer})` : ''}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const renderHobbiesSection = () => {
    if (!resumeData?.hobbies || resumeData.hobbies.length === 0) return null;
    
    const getHobbyName = (hobby) => {
      if (typeof hobby === 'string') return hobby;
      if (hobby && hobby.name) return hobby.name;
      return '';
    };
    
    return (
      <div className="mb-4">
        <h2 className="font-bold text-lg mb-2 flex items-center">
          <div className="mr-2" style={{ color: colors.primary }}>
            {icons.hobbies}
          </div>
          Hobbies
        </h2>
        <div className="flex flex-wrap gap-2">
          {resumeData.hobbies.map((hobby, idx) => (
            <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
              {getHobbyName(hobby)}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderResumeLayout = () => {
    switch (resumeData?.template || 'blue') {
      case 'blue': return renderModernBlueLayout();
      case 'green': return renderEcoGreenLayout();
      case 'dark-pro': return renderProfessionalDarkTemplate();
      case 'red': return renderBoldRedLayout();
      case 'teal': return renderProfessionalTealLayout();
      case 'minimal': return renderMinimalistLayout();
      case 'classic': return renderClassicLayout();
      case 'sidebar': return renderSidebarLayout();
      case 'creative': return renderCreativeLayout();
      case 'compact': return renderCompactLayout();
      default: return renderModernBlueLayout();
    }
  };

const renderModernBlueLayout = () => (
  <div className="resume-content flex flex-col min-h-[297mm] relative">
    <Watermark templateId={resumeData?.template} unlockedTemplates={unlockedTemplates} />
    
    <motion.div className="p-4 text-center section-padding relative z-10"
      style={{ backgroundColor: colors.primary, color: textColor }}>
      <h1 className="text-2xl md:text-3xl font-bold mb-1">
        {resumeData?.personal?.name || 'Your Name'}
      </h1>
      <p className="text-base md:text-lg">
        {resumeData?.personal?.title || 'Professional Title'}
      </p>
    </motion.div>

    <div className="flex flex-row flex-1 relative z-10">
      <div className="w-1/3 p-4 section-padding"
        style={{ backgroundColor: colors.secondary, color: textColor }}>
        {renderContactSection()}
        {renderSkillsSection()}
        {renderHobbiesSection()}
      </div>

      <div className="w-2/3 p-4 section-padding">
        {resumeData?.personal?.summary && (
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-3 border-b pb-2">Summary</h2>
            <p className="text-sm">{resumeData.personal.summary}</p>
          </div>
        )}

        {resumeData?.experience?.length > 0 && (
          <div className="mb-8">
            <h2 className="font-bold text-lg mb-4 flex items-center pb-2 border-b" style={{ borderColor: colors.primary }}>
              <div className="mr-2 mt-0.5" style={{ color: colors.primary }}>
                {icons.briefcase}
              </div>
              {resumeData.experience[0]?.isInternship ? 'Internship' : 'Experience'}
            </h2>
            <div className="space-y-4">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="pl-2">
                  <div className="flex flex-col md:flex-row justify-between items-baseline">
                    <div className="flex items-center">
                      <h3 className="font-bold text-gray-800">{exp.position || 'Position'}</h3>
                    </div>
                    <span className="text-gray-600 text-sm mt-1 md:mt-0">{exp.duration || 'Duration'}</span>
                  </div>
                  <div className="font-semibold mb-1" style={{ color: colors.primary }}>
                    {exp.company || 'Company'}
                  </div>
                  <p className="text-gray-700 text-sm">
                    {exp.responsibilities || 'Responsibilities and achievements...'}
                  </p>
                  {exp.technologies && (
                    <div className="mt-2">
                      <span className="font-medium">Technologies: </span>
                      {renderTechnologyTags(exp.technologies)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {resumeData?.education?.length > 0 && (
          <div className="mb-8">
            <h2 className="font-bold text-lg mb-4 flex items-center pb-2 border-b" style={{ borderColor: colors.primary }}>
              <div className="mr-2" style={{ color: colors.primary }}>
                {icons.education}
              </div>
              Education
            </h2>
            <div className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <div key={index} className="pl-2">
                  <div className="flex flex-col md:flex-row justify-between items-baseline">
                    <h3 className="font-bold text-gray-800">{edu.degree || 'Degree'}</h3>
                    <span className="text-gray-600 text-sm mt-1 md:mt-0">{edu.duration || 'Year'}</span>
                  </div>
                  <div className="font-semibold mb-1" style={{ color: colors.primary }}>
                    {edu.institution || 'Institution'}
                  </div>
                  <p className="text-gray-700 text-sm">
                    {edu.field || 'Field of Study'} {edu.cgpa && `| CGPA: ${edu.cgpa}`}
                  </p>
                  {edu.school && <p className="text-gray-700 text-sm">School: {edu.school}</p>}
                  {edu.achievements && <p className="text-gray-700 text-sm">Achievements: {edu.achievements}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {resumeData?.projects?.length > 0 && (
          <div>
            <h2 className="font-bold text-lg mb-4 flex items-center pb-2 border-b" style={{ borderColor: colors.primary }}>
              <div className="mr-2" style={{ color: colors.primary }}>
                {icons.project}
              </div>
              Projects
            </h2>
            <div className="space-y-4">
              {resumeData.projects.map((project, index) => (
                <div key={index} className="pl-2">
                  <h3 className="font-bold text-gray-800">
                    {project.link ? (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {project.title || 'Project Name'}
                      </a>
                    ) : project.title || 'Project Name'}
                  </h3>
                  <p className="text-gray-700 text-sm">
                    {project.description || 'Project description...'}
                  </p>
                  {project.technologies && (
                    <div className="mt-2">
                      <span className="font-medium">Technologies: </span>
                      {renderTechnologyTags(project.technologies)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

const renderEcoGreenLayout = () => (
  <div className="resume-content relative overflow-hidden min-h-[297mm]">
    <Watermark unlockedTemplates={unlockedTemplates} templateId={resumeData?.template} />

    {/* Background gradient */}
    <div className="absolute inset-0 z-0" style={{
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary} 50%, ${colors.secondary} 50%, ${colors.secondary} 100%)`,
    }}></div>

    <div className="relative z-20">
      <motion.div className="p-6 text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-1" style={{ color: textColor }}>
          {resumeData?.personal?.name || 'Your Name'}
        </h1>
        <p className="text-xl" style={{ color: textColor }}>
          {resumeData?.personal?.title || 'Professional Title'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* About Me */}
          <motion.div className="p-4 rounded-lg bg-white bg-opacity-90 shadow" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="font-bold text-lg mb-3 flex items-center">
              <div className="mr-2" style={{ color: colors.primary }}>{icons.user}</div> About Me
            </h2>
            <p className="text-gray-700 text-sm">{resumeData?.personal?.summary || 'Professional summary...'}</p>
          </motion.div>

          {/* Skills */}
          <motion.div className="p-4 rounded-lg bg-white bg-opacity-90 shadow" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="font-bold text-lg mb-3 flex items-center">
              <div className="mr-2" style={{ color: colors.primary }}>{icons.skills}</div> Skills
            </h2>
            <div className="space-y-3">{renderSkillsSection()}</div>
          </motion.div>

          {/* Education */}
          {resumeData?.education?.length > 0 && (
            <motion.div className="p-4 rounded-lg bg-white bg-opacity-90 shadow" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <h2 className="font-bold text-lg mb-3 flex items-center">
                <div className="mr-2" style={{ color: colors.primary }}>{icons.education}</div> Education
              </h2>
              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-sm">{edu.degree || 'Degree'}</h3>
                      <span className="text-gray-600 text-xs">{edu.duration || 'Year'}</span>
                    </div>
                    <div className="font-semibold mb-1 text-sm" style={{ color: colors.primary }}>
                      {edu.institution || 'Institution'}
                    </div>
                    {edu.school && <p className="text-white text-xs">School: {edu.school}</p>}
                    {edu.field && (
                      <p className="text-white text-xs">
                        {edu.field} {edu.cgpa && `| CGPA: ${edu.cgpa}`}
                      </p>
                    )}
                    {edu.achievements && <p className="text-white text-xs mt-1">Achievements: {edu.achievements}</p>}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {renderHobbiesSection()}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Contact */}
          <motion.div className="p-4 rounded-lg bg-white bg-opacity-90 shadow" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="font-bold text-lg mb-3 flex items-center">
              <div className="mr-2" style={{ color: colors.primary }}>{icons.email}</div> Contact
            </h2>
            <div className="space-y-3">
              {renderContactItem(icons.email, resumeData?.personal?.email, `mailto:${resumeData?.personal?.email}`)}
              {renderContactItem(icons.phone, resumeData?.personal?.phone)}
              {renderContactItem(icons.location, resumeData?.personal?.location)}
              {renderContactItem(icons.linkedin, resumeData?.personal?.linkedin, resumeData?.personal?.linkedin)}
              {renderContactItem(icons.github, resumeData?.personal?.github, resumeData?.personal?.github)}
              {renderContactItem(icons.website, resumeData?.personal?.website, resumeData?.personal?.website)}
            </div>
          </motion.div>

          {/* Experience */}
          {resumeData?.experience?.length > 0 && (
            <motion.div className="p-4 rounded-lg bg-white bg-opacity-90 shadow" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <h2 className="font-bold text-lg mb-3 flex items-center">
                <div className="mr-2" style={{ color: colors.primary }}>{icons.briefcase}</div>
                {resumeData.experience[0]?.isInternship ? 'Internship' : 'Experience'}
              </h2>
              <div className="space-y-4">
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-sm">{exp.position || 'Position'}</h3>
                      <span className="text-gray-600 text-xs">{exp.duration || 'Duration'}</span>
                    </div>
                    <div className="font-semibold mb-1 text-sm" style={{ color: colors.primary }}>
                      {exp.company || 'Company'}
                    </div>
                    <p className="text-gray-700 text-xs">{exp.responsibilities || 'Responsibilities and achievements...'}</p>
                    {exp.technologies && (
                      <div className="mt-1">
                        <span className="font-medium text-xs">Technologies: </span>
                        {renderTechnologyTags(exp.technologies)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Projects */}
          {resumeData?.projects?.length > 0 && (
            <motion.div className="p-4 rounded-lg bg-white bg-opacity-90 shadow" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <h2 className="font-bold text-lg mb-3 flex items-center">
                <div className="mr-2" style={{ color: colors.primary }}>{icons.project}</div> Projects
              </h2>
              <div className="space-y-4">
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="mb-3">
                    <h3 className="font-bold text-sm text-green-800">
                      {project.link ? (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {project.title}
                        </a>
                      ) : project.title}
                    </h3>
                    <p className="text-gray-700 text-xs">{project.description}</p>
                    {project.technologies && (
                      <div className="mt-2">
                        <span className="font-medium text-sm">Technologies: </span>
                        {renderTechnologyTags(project.technologies)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  </div>
);


 const renderProfessionalDarkTemplate = () => (
  <div className="bg-gray-900 text-white font-sans min-h-screen relative overflow-hidden">
    <Watermark templateId={resumeData?.template} unlockedTemplates={unlockedTemplates} />

    <div className="max-w-5xl mx-auto p-5 relative z-10">
      {/* Header */}
      <div className="relative mb-12">
        <div className="bg-gradient-to-r from-[#1e293b] to-[#0f172a] p-8 md:p-10 relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-0 h-0 border-t-[100px] border-l-[100px] border-l-transparent"
            style={{ borderTopColor: colors.primary, borderTopWidth: 100, borderLeftWidth: 100 }}
          ></div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {resumeData?.personal?.name || 'Your Name'}
              </h1>
              <p className="text-xl text-blue-300">
                {resumeData?.personal?.title || 'Professional Title'}
              </p>
            </div>
            <div className="bg-gray-800 p-3 rounded-full shadow-lg" />
          </div>
        </div>
        <div className="h-6 bg-gradient-to-r from-[#2563eb] via-[#1e293b] to-[#2563eb] transform -skew-y-3 -mt-3 shadow-lg"></div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-1 space-y-8">
         {/* Contact */}
<div className="bg-gray-800 rounded-xl p-6 shadow-lg border-l-4" style={{ borderColor: colors.primary }}>
  <h2 className="text-xl font-bold mb-4 flex items-center" style={{ color: colors.primary }}>
    <span className="p-2 rounded-md mr-3" style={{ background: colors.primary, color: '#fff' }}>
      {icons.email}
    </span>
    CONTACT
  </h2>
  <div className="space-y-3 break-words">
    {/* Phone */}
    {resumeData?.personal?.phone && (
      <div className="flex items-center">
        <span className="mr-3" style={{ color: colors.primary }}>{icons.phone}</span>
        <span className="text-white text-sm">
          {typeof resumeData.personal.phone === 'object' ? resumeData.personal.phone.name : resumeData.personal.phone}
        </span>
      </div>
    )}

    {/* Email */}
    {resumeData?.personal?.email && (
      <div className="flex items-center">
        <span className="mr-3" style={{ color: colors.primary }}>{icons.email}</span>
        <a
          href={`mailto:${typeof resumeData.personal.email === 'object' ? resumeData.personal.email.name : resumeData.personal.email}`}
          className="text-white hover:underline text-sm break-all"
        >
          {typeof resumeData.personal.email === 'object' ? resumeData.personal.email.name : resumeData.personal.email}
        </a>
      </div>
    )}

    {/* Website */}
    {resumeData?.personal?.website && (
      <div className="flex items-center">
        <span className="mr-3" style={{ color: colors.primary }}>{icons.website}</span>
        <a
          href={(typeof resumeData.personal.website === 'object' ? resumeData.personal.website.name : resumeData.personal.website).startsWith('http') 
            ? (typeof resumeData.personal.website === 'object' ? resumeData.personal.website.name : resumeData.personal.website)
            : `https://${typeof resumeData.personal.website === 'object' ? resumeData.personal.website.name : resumeData.personal.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:underline text-sm break-all"
        >
          {typeof resumeData.personal.website === 'object' ? resumeData.personal.website.name : resumeData.personal.website}
        </a>
      </div>
    )}

    {/* LinkedIn */}
    {resumeData?.personal?.linkedin && (
      <div className="flex items-center">
        <span className="mr-3" style={{ color: colors.primary }}>{icons.linkedin}</span>
        <a
          href={(typeof resumeData.personal.linkedin === 'object' ? resumeData.personal.linkedin.name : resumeData.personal.linkedin).startsWith('http')
            ? (typeof resumeData.personal.linkedin === 'object' ? resumeData.personal.linkedin.name : resumeData.personal.linkedin)
            : `https://www.linkedin.com/in/${typeof resumeData.personal.linkedin === 'object' ? resumeData.personal.linkedin.name : resumeData.personal.linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:underline text-sm break-all"
        >
          {typeof resumeData.personal.linkedin === 'object' ? resumeData.personal.linkedin.name : resumeData.personal.linkedin}
        </a>
      </div>
    )}

    {/* GitHub */}
    {resumeData?.personal?.github && (
      <div className="flex items-center">
        <span className="mr-3" style={{ color: colors.primary }}>{icons.github}</span>
        <a
          href={(typeof resumeData.personal.github === 'object' ? resumeData.personal.github.name : resumeData.personal.github).startsWith('http')
            ? (typeof resumeData.personal.github === 'object' ? resumeData.personal.github.name : resumeData.personal.github)
            : `https://github.com/${typeof resumeData.personal.github === 'object' ? resumeData.personal.github.name : resumeData.personal.github}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:underline text-sm break-all"
        >
          {typeof resumeData.personal.github === 'object' ? resumeData.personal.github.name : resumeData.personal.github}
        </a>
      </div>
    )}

    {/* Location */}
    {resumeData?.personal?.location && (
      <div className="flex items-center">
        <span className="mr-3" style={{ color: colors.primary }}>{icons.location}</span>
        <span className="text-white text-sm">
          {typeof resumeData.personal.location === 'object' ? resumeData.personal.location.name : resumeData.personal.location}
        </span>
      </div>
    )}
  </div>
</div>

          {renderSkillsSection()}
          {renderHobbiesSection()}
        </div>

        {/* Right */}
        <div className="lg:col-span-2 space-y-8">
          {/* Summary */}
          {resumeData?.personal?.summary && (
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="p-2 rounded-md mr-3" style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` }}>{icons.user}</span>
                PROFILE
              </h2>
              <p className="text-white leading-relaxed text-sm">{resumeData.personal.summary}</p>
            </div>
          )}

          {/* Experience */}
          {resumeData?.experience?.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg relative overflow-hidden">
              <div className="absolute left-6 top-0 bottom-0 w-0.5" style={{ background: colors.primary }}></div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <span className="p-2 rounded-md mr-3" style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})` }}>
                  {icons.briefcase}
                </span>
                {resumeData.experience[0]?.isInternship ? 'Internship' : 'Experience'}
              </h2>
              <div className="space-y-8 ml-4">
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="relative pl-8">
                    <div className="absolute left-0 top-3 w-4 h-4 rounded-full z-10" style={{ background: colors.primary }}></div>
                    <div className="border-l-2 pl-6 pt-1 pb-4" style={{ borderColor: colors.primary }}>
                      <div className="flex flex-wrap justify-between">
                        <h3 className="text-lg font-bold" style={{ color: colors.primary }}>{exp.position}</h3>
                        <span className="text-sm" style={{ color: colors.accent, background: '#1e293b', padding: '2px 8px', borderRadius: '6px' }}>{exp.duration}</span>
                      </div>
                      <p className="text-white font-medium text-sm">{exp.company}</p>
                      <p className="text-gray-200 mt-2 text-xs">{exp.responsibilities}</p>
                      {exp.technologies && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {renderTechnologyTags(exp.technologies)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resumeData?.projects?.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <span className="p-2 rounded-md mr-3" style={{ background: `linear-gradient(90deg, ${colors.secondary}, ${colors.primary})` }}>
                  {icons.project}
                </span>
                Projects
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-all duration-300">
                    <h3 className="font-bold text-sm" style={{ color: colors.secondary }}>
                      {project.link ? (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          {project.title}
                        </a>
                      ) : project.title}
                    </h3>
                    <p className="text-white mt-2 text-xs">{project.description || 'Project description...'}</p>
                    {project.technologies && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(Array.isArray(project.technologies) ? project.technologies : project.technologies.split(',')).map((tech, i) => (
                          <span key={i} className="px-2 py-1 rounded text-xs" style={{ background: colors.primary, color: '#fff' }}>
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resumeData?.education?.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <span className="p-2 rounded-md mr-3" style={{ background: `linear-gradient(90deg, ${colors.secondary}, ${colors.accent})` }}>
                  {icons.education}
                </span>
                Education
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-all duration-300">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-sm" style={{ color: colors.accent }}>{edu.degree || 'Degree'}</h3>
                      <span className="text-sm" style={{ color: colors.accent }}>{edu.duration || 'Year'}</span>
                    </div>
                    <p className="text-white text-sm">{edu.institution || 'Institution'}</p>
                    {edu.field && (
                      <p className="text-gray-200 text-xs mt-1">{edu.field} {edu.cgpa && `| CGPA: ${edu.cgpa}`}</p>
                    )}
                    {edu.school && <p className="text-gray-200 text-xs mt-1">School: {edu.school}</p>}
                    {edu.achievements && <p className="text-gray-200 text-xs mt-1">Achievements: {edu.achievements}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);


const renderBoldRedLayout = () => (
  <div className="resume-content flex flex-col items-center min-h-[297mm] relative">
    <Watermark
      templateId={resumeData?.template}
      unlockedTemplates={unlockedTemplates}
    />
    <motion.div
      className="w-full p-6 text-center"
      style={{ backgroundColor: colors.primary, color: textColor }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-1">
        {resumeData?.personal?.name || 'Your Name'}
      </h1>
      <p className="text-xl">
        {resumeData?.personal?.title || 'Professional Title'}
      </p>
    </motion.div>

    <div className="w-4/5 py-8 flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {resumeData?.experience?.length > 0 && (
            <motion.div className="mb-8">
              <h2 className="font-bold text-xl mb-4 flex items-center border-b pb-2" style={{ borderColor: colors.primary }}>
                <motion.div
                  className="mr-2"
                  style={{ color: colors.primary }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {icons.briefcase}
                </motion.div>
                {resumeData.experience[0]?.isInternship ? 'Internship' : 'Experience'}
              </h2>
              <div className="space-y-4">
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-sm">{exp.position || 'Position'}</h3>
                      </div>
                      <span className="text-gray-600 text-sm">{exp.duration || 'Duration'}</span>
                    </div>
                    <div className="font-semibold mb-1 text-sm" style={{ color: colors.primary }}>
                      {exp.company || 'Company'}
                    </div>
                    <p className="text-gray-700 text-sm">
                      {exp.responsibilities || 'Responsibilities and achievements...'}
                    </p>
                    {exp.technologies && (
                      <div className="mt-1">
                        <span className="font-medium text-sm">Technologies: </span>
                        {renderTechnologyTags(exp.technologies)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {resumeData?.projects?.length > 0 && (
            <motion.div className="mb-8">
              <h2 className="font-bold text-xl mb-4 flex items-center border-b pb-2" style={{ borderColor: colors.primary }}>
                <div className="mr-2" style={{ color: colors.primary }}>
                  {icons.project}
                </div>
                Projects
              </h2>
              <div className="space-y-4">
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="mb-3">
                    <h3 className="font-bold text-sm">
                      {project.link ? (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
                          {project.title}
                        </a>
                      ) : (
                        project.title || 'Project Name'
                      )}
                    </h3>
                    <p className="text-gray-700 text-sm">
                      {project.description || 'Project description...'}
                    </p>
                    {project.technologies && (
                      <div className="mt-2">
                        <span className="font-medium text-sm">Technologies: </span>
                        {renderTechnologyTags(project.technologies)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div>
          {resumeData?.education?.length > 0 && (
            <motion.div className="mb-8">
              <h2 className="font-bold text-xl mb-4 flex items-center border-b pb-2" style={{ borderColor: colors.primary }}>
                <div className="mr-2" style={{ color: colors.primary }}>
                  {icons.education}
                </div>
                Education
              </h2>
              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-sm">{edu.degree || 'Degree'}</h3>
                      <span className="text-gray-600 text-sm">{edu.duration || 'Year'}</span>
                    </div>
                    <div className="font-semibold mb-1 text-sm" style={{ color: colors.primary }}>
                      {edu.institution || 'Institution'}
                    </div>
                    <p className="text-gray-700 text-sm">
                      {edu.field || 'Field of Study'} {edu.cgpa && `| CGPA: ${edu.cgpa}`}
                    </p>
                    {edu.school && <p className="text-gray-700 text-sm">School: {edu.school}</p>}
                    {edu.achievements && <p className="text-gray-700 text-sm">Achievements: {edu.achievements}</p>}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {renderSkillsSection()}
          {renderHobbiesSection()}

          {resumeData?.personal?.summary && (
            <motion.div className="mb-6">
              <h2 className="font-bold text-xl mb-4 flex items-center border-b pb-2" style={{ borderColor: colors.primary }}>
                <div className="mr-2" style={{ color: colors.primary }}>
                  {icons.user}
                </div>
                Summary
              </h2>
              <p className="text-gray-700 text-sm">
                {resumeData.personal.summary}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>

    <motion.div
      className="w-full p-4 text-center mt-auto"
      style={{ backgroundColor: colors.primary, color: textColor }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm">
        {resumeData?.personal?.email && (
          <span className="flex items-center gap-1">{icons.email}{resumeData.personal.email}</span>
        )}
        {resumeData?.personal?.phone && (
          <span className="flex items-center gap-1">{icons.phone}{resumeData.personal.phone}</span>
        )}
        {resumeData?.personal?.location && (
          <span className="flex items-center gap-1">{icons.location}{resumeData.personal.location}</span>
        )}
        {resumeData?.personal?.linkedin && (
          <a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
            {icons.linkedin} LinkedIn
          </a>
        )}
        {resumeData?.personal?.github && (
          <a href={resumeData.personal.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
            {icons.github} GitHub
          </a>
        )}
        {resumeData?.personal?.website && (
          <a href={resumeData.personal.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
            {icons.website} Website
          </a>
        )}
      </div>
    </motion.div>
  </div>
);



 const renderProfessionalTealLayout = () => (
  <div className="resume-content min-h-[297mm] relative">
    <Watermark
      templateId={resumeData?.template}
      unlockedTemplates={unlockedTemplates}
    />

    <motion.div
      className="p-6 text-center"
      style={{ backgroundColor: colors.primary, color: textColor }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-1" style={{ color: textColor }}>
        {resumeData?.personal?.name || 'Your Name'}
      </h1>
      <p className="text-xl" style={{ color: textColor }}>
        {resumeData?.personal?.title || 'Professional Title'}
      </p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {renderContactSection()}
        {renderSkillsSection()}
        {renderHobbiesSection()}
      </motion.div>

      {/* Middle Column - Summary + Experience */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {resumeData?.personal?.summary && (
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-3 border-b pb-2" style={{ borderColor: colors.primary }}>
              Summary
            </h2>
            <p className="text-gray-700 text-sm">
              {resumeData.personal.summary}
            </p>
          </div>
        )}

        {resumeData?.experience?.length > 0 && (
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-3 border-b pb-2" style={{ borderColor: colors.primary }}>
              {resumeData.experience[0]?.isInternship ? 'Internship' : 'Experience'}
            </h2>
            <div className="space-y-4">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-sm">{exp.position || 'Position'}</h3>
                    <span className="text-gray-600 text-xs">{exp.duration || 'Duration'}</span>
                  </div>
                  <div className="font-semibold mb-1 text-sm" style={{ color: colors.primary }}>
                    {exp.company || 'Company'}
                  </div>
                  <p className="text-gray-700 text-xs">
                    {exp.responsibilities || 'Responsibilities and achievements...'}
                  </p>
                  {exp.technologies && (
                    <div className="mt-1">
                      <span className="font-medium text-xs">Technologies: </span>
                      {renderTechnologyTags(exp.technologies)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Right Column - Education + Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {resumeData?.education?.length > 0 && (
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-3 border-b pb-2" style={{ borderColor: colors.primary }}>Education</h2>
            <div className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-sm">{edu.degree || 'Degree'}</h3>
                    <span className="text-gray-600 text-xs">{edu.duration || 'Year'}</span>
                  </div>
                  <div className="font-semibold mb-1 text-sm" style={{ color: colors.primary }}>
                    {edu.institution || 'Institution'}
                  </div>
                  <p className="text-gray-700 text-xs">
                    {edu.field || 'Field of Study'} {edu.cgpa && `| CGPA: ${edu.cgpa}`}
                  </p>
                  {edu.school && <p className="text-gray-700 text-xs">School: {edu.school}</p>}
                  {edu.achievements && <p className="text-gray-700 text-xs">Achievements: {edu.achievements}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {resumeData?.projects?.length > 0 && (
          <div>
            <h2 className="font-bold text-lg my-3 border-b pb-2" style={{ borderColor: colors.primary }}>Projects</h2>
            <div className="space-y-4">
              {resumeData.projects.map((project, index) => (
                <div key={index} className="mb-3">
                  <h3 className="font-bold text-sm">
                    {project.link ? (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                        {project.title}
                      </a>
                    ) : (
                      project.title || 'Project Name'
                    )}
                  </h3>
                  <p className="text-gray-700 text-xs">
                    {project.description || 'Project description...'}
                  </p>
                  {project.technologies && (
                    <div className="mt-2">
                      <span className="font-medium text-sm">Technologies: </span>
                      {renderTechnologyTags(project.technologies)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  </div>
);


 const renderMinimalistLayout = () => (
  <div className="resume-content p-8 min-h-[297mm] bg-white max-w-[210mm] mx-auto relative text-sm">
    <Watermark
      templateId={resumeData?.template}
      unlockedTemplates={unlockedTemplates}
    />

    {/* Header with Name and Title */}
    <motion.div
      className="text-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-1">
        {resumeData?.personal?.name || 'Your Name'}
      </h1>
      <p className="text-xl text-gray-600">
        {resumeData?.personal?.title || 'Professional Title'}
      </p>

      {/* Contact Info */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-3 text-sm text-gray-500">
        {resumeData?.personal?.email && (
          <span className="flex items-center gap-1">
            {icons.email} {resumeData.personal.email}
          </span>
        )}
        {resumeData?.personal?.phone && (
          <span className="flex items-center gap-1">
            {icons.phone} {resumeData.personal.phone}
          </span>
        )}
        {resumeData?.personal?.location && (
          <span className="flex items-center gap-1">
            {icons.location} {resumeData.personal.location}
          </span>
        )}
        {resumeData?.personal?.linkedin && (
          <a
            href={resumeData.personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline"
          >
            {icons.linkedin} LinkedIn
          </a>
        )}
        {resumeData?.personal?.github && (
          <a
            href={resumeData.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline"
          >
            {icons.github} GitHub
          </a>
        )}
        {resumeData?.personal?.website && (
          <a
            href={resumeData.personal.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline"
          >
            {icons.website} Website
          </a>
        )}
      </div>
    </motion.div>

    {/* Body Sections */}
    <div className="space-y-8">
      {/* Summary */}
      {resumeData?.personal?.summary && (
        <div>
          <h2 className="font-bold text-lg mb-3 border-b pb-2">Summary</h2>
          <p className="text-gray-700">{resumeData.personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData?.experience?.length > 0 && (
        <div>
          <h2 className="font-bold text-lg mb-3 border-b pb-2">
            {resumeData.experience[0]?.isInternship ? 'Internship' : 'Experience'}
          </h2>
          <div className="space-y-4">
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-3">
                <div className="flex flex-wrap justify-between items-center">
                  <div>
                    <h3 className="font-bold">{exp.position || 'Position'}</h3>
                    <div className="font-semibold text-gray-700">
                      {exp.company || 'Company'}
                    </div>
                  </div>
                  <span className="text-gray-600">{exp.duration || 'Duration'}</span>
                </div>
                <p className="text-gray-600 mt-2">{exp.responsibilities}</p>
                {exp.technologies && (
                  <div className="mt-2">
                    <span className="font-medium">Technologies: </span>
                    {renderTechnologyTags(exp.technologies)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resumeData?.education?.length > 0 && (
        <div>
          <h2 className="font-bold text-lg mb-3 border-b pb-2">Education</h2>
          <div className="space-y-4">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex flex-wrap justify-between">
                  <h3 className="font-bold">{edu.degree || 'Degree'}</h3>
                  <span className="text-gray-600">{edu.duration || 'Year'}</span>
                </div>
                <div className="font-semibold text-gray-700">{edu.institution}</div>
                <p className="text-gray-600">
                  {edu.field || 'Field of Study'}
                  {edu.cgpa && ` | CGPA: ${edu.cgpa}`}
                </p>
                {edu.school && <p className="text-gray-600">School: {edu.school}</p>}
                {edu.achievements && (
                  <p className="text-gray-600 mt-1">Achievements: {edu.achievements}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resumeData?.projects?.length > 0 && (
        <div>
          <h2 className="font-bold text-lg mb-3 border-b pb-2">Projects</h2>
          <div className="space-y-4">
            {resumeData.projects.map((project, index) => (
              <div key={index} className="mb-3">
                <div className="flex flex-wrap justify-between items-center">
                  <h3 className="font-bold">
                    {project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-800 hover:underline"
                      >
                        {project.title}
                      </a>
                    ) : (
                      project.title || 'Project Name'
                    )}
                  </h3>
                  <div>
                    {project.duration && (
                      <span className="text-gray-600 text-sm mr-2">{project.duration}</span>
                    )}
                    {project.category && (
                      <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">
                        {project.category}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                {project.technologies && (
                  <div className="mt-2">
                    <span className="font-medium text-sm">Technologies: </span>
                    {renderTechnologyTags(project.technologies)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {resumeData?.certifications?.length > 0 && (
        <div>
          <h2 className="font-bold text-lg mb-3 border-b pb-2">Certifications</h2>
          <div className="space-y-2">
            {resumeData.certifications.map((cert, index) => (
              <div key={index}>
                <div className="font-bold">{cert.name}</div>
                <div className="text-gray-600 text-sm">
                  {cert.issuer} | {cert.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills & Hobbies */}
      {renderSkillsSection()}
      {renderHobbiesSection()}
    </div>
  </div>
);


const renderClassicLayout = () => (
  <div className="resume-content p-8 min-h-[297mm] bg-white relative text-sm">
    <Watermark templateId={resumeData?.template} unlockedTemplates={unlockedTemplates} />

    {/* Header */}
    <motion.div
      className="text-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-1" style={{ color: colors.primary }}>
        {resumeData?.personal?.name || 'Your Name'}
      </h1>
      <p className="text-xl text-gray-600">
        {resumeData?.personal?.title || 'Professional Title'}
      </p>

      {/* Contact Info */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-3 text-sm text-gray-500">
        {resumeData?.personal?.email && (
          <span className="flex items-center gap-1">{icons.email}{resumeData.personal.email}</span>
        )}
        {resumeData?.personal?.phone && (
          <span className="flex items-center gap-1">{icons.phone}{resumeData.personal.phone}</span>
        )}
        {resumeData?.personal?.location && (
          <span className="flex items-center gap-1">{icons.location}{resumeData.personal.location}</span>
        )}
        {resumeData?.personal?.linkedin && (
          <a
            href={resumeData.personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline"
          >
            {icons.linkedin} LinkedIn
          </a>
        )}
        {resumeData?.personal?.github && (
          <a
            href={resumeData.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline"
          >
            {icons.github} GitHub
          </a>
        )}
        {resumeData?.personal?.portfolio && (
          <a
            href={resumeData.personal.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline"
          >
            {icons.portfolio} Portfolio
          </a>
        )}
        {resumeData?.personal?.website && (
          <a
            href={resumeData.personal.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline"
          >
            {icons.website} Website
          </a>
        )}
      </div>
    </motion.div>

    {/* Body Sections */}
    <div className="space-y-8">
      {/* Summary */}
      {resumeData?.personal?.summary && (
        <div className="mb-6">
          <h2 className="font-bold text-lg mb-3 pb-2" style={{ borderBottom: `2px solid ${colors.primary}` }}>Summary</h2>
          <p className="text-gray-700 text-sm">{resumeData.personal.summary}</p>
        </div>
      )}

      {/* Experience / Internship */}
      {resumeData?.experience?.length > 0 && (
        <div>
          <h2 className="font-bold text-lg mb-3 pb-2" style={{ borderBottom: `2px solid ${colors.primary}` }}>
            {resumeData.experience[0]?.isInternship ? 'Internship' : 'Experience'}
          </h2>
          <div className="space-y-4">
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="pl-4 border-l-2 mb-4" style={{ borderColor: colors.primary }}>
                <div className="flex flex-wrap justify-between items-center">
                  <h3 className="font-bold text-sm">{exp.position || 'Position'}</h3>
                  <span className="text-gray-600 text-sm">{exp.duration || 'Duration'}</span>
                </div>
                <div className="font-semibold mb-1 text-sm" style={{ color: colors.primary }}>
                  {exp.company || 'Company'}
                </div>
                <p className="text-gray-700 text-sm">
                  {exp.responsibilities || 'Responsibilities and achievements...'}
                </p>
                {exp.technologies && (
                  <div className="mt-2">
                    <span className="font-medium text-sm">Technologies: </span>
                    {renderTechnologyTags(exp.technologies)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resumeData?.education?.length > 0 && (
        <div>
          <h2 className="font-bold text-lg mb-3 pb-2" style={{ borderBottom: `2px solid ${colors.primary}` }}>Education</h2>
          <div className="space-y-4">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="pl-4 border-l-2 mb-4" style={{ borderColor: colors.primary }}>
                <div className="flex flex-wrap justify-between">
                  <h3 className="font-bold text-sm">{edu.degree || 'Degree'}</h3>
                  <span className="text-gray-600 text-sm">{edu.duration || 'Year'}</span>
                </div>
                <div className="font-semibold mb-1 text-sm" style={{ color: colors.primary }}>
                  {edu.institution || 'Institution'}
                </div>
                {edu.field && <p className="text-gray-700 text-sm">{edu.field}</p>}
                {edu.cgpa && <p className="text-gray-700 text-sm">CGPA: {edu.cgpa}</p>}
                {edu.school && <p className="text-gray-700 text-sm">School: {edu.school}</p>}
                {edu.achievements && <p className="text-gray-700 text-sm mt-1">Achievements: {edu.achievements}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {(resumeData?.softSkills?.length > 0 ||
        resumeData?.programmingSkills?.length > 0 ||
        resumeData?.frameworks?.length > 0 ||
        resumeData?.languages?.length > 0 ||
        resumeData?.certifications?.length > 0) && (
        <div>
          <h2 className="font-bold text-lg mb-3 pb-2" style={{ borderBottom: `2px solid ${colors.primary}` }}>Skills</h2>
          <div className="pl-4 border-l-2" style={{ borderColor: colors.primary }}>
            {renderSkillsSection()}
          </div>
        </div>
      )}

      {/* Projects */}
      {resumeData?.projects?.length > 0 && (
        <div>
          <h2 className="font-bold text-lg mb-3 pb-2" style={{ borderBottom: `2px solid ${colors.primary}` }}>Projects</h2>
          <div className="space-y-4">
            {resumeData.projects.map((project, index) => (
              <div key={index} className="pl-4 border-l-2 mb-4" style={{ borderColor: colors.primary }}>
                <div className="flex flex-wrap justify-between items-center">
                  <h3 className="font-bold text-sm">
                    {project.link ? (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {project.title}
                      </a>
                    ) : (
                      project.title || 'Project Name'
                    )}
                  </h3>
                  <div>
                    {project.duration && <span className="text-gray-600 text-sm mr-3">{project.duration}</span>}
                    {project.category && (
                      <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded">
                        {project.category}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{project.description || 'Project description...'}</p>
                {project.technologies && (
                  <div className="mt-2">
                    <span className="font-medium text-sm">Technologies: </span>
                    {renderTechnologyTags(project.technologies)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hobbies */}
      {renderHobbiesSection()}
    </div>
  </div>
);



  const renderSidebarLayout = () => (
  <div className="resume-content flex flex-col md:flex-row min-h-[297mm] relative">
    <Watermark templateId={resumeData?.template} unlockedTemplates={unlockedTemplates} />

    {/* Sidebar */}
    <motion.div
      className="w-full md:w-1/3 p-6"
      style={{ backgroundColor: colors.primary, color: textColor }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-2xl font-bold mb-1">{resumeData?.personal?.name || 'Your Name'}</h1>
        <p className="text-lg opacity-90">{resumeData?.personal?.title || 'Professional Title'}</p>
      </motion.div>

      {/* Sidebar Sections */}
      <div className="space-y-6">
        {/* Contact */}
        <div className="contact-section">
          <h2 className="font-bold text-lg mb-3 border-b pb-2">Contact</h2>
          <div className="space-y-3">
            {renderContactItem(icons.email, resumeData?.personal?.email)}
            {renderContactItem(icons.phone, resumeData?.personal?.phone)}
            {renderContactItem(icons.location, resumeData?.personal?.location)}
            {renderContactItem(icons.linkedin, resumeData?.personal?.linkedin, resumeData?.personal?.linkedin)}
            {renderContactItem(icons.github, resumeData?.personal?.github, resumeData?.personal?.github)}
            {renderContactItem(icons.website, resumeData?.personal?.website, resumeData?.personal?.website)}
          </div>
        </div>

        {/* Skills */}
        {renderSkillsSection()}

        {/* Education */}
        {resumeData?.education?.length > 0 && (
          <div>
            <h2 className="font-bold text-lg mb-3 border-b pb-2">Education</h2>
            <div className="space-y-3">
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-3">
                  <h3 className="font-bold text-sm">{edu.degree || 'Degree'}</h3>
                  <div className="font-medium mb-1 text-sm">
                    {edu.institution || 'Institution'}
                  </div>
                  <p className="text-xs opacity-90">
                    {edu.duration || 'Year'} | {edu.field || 'Field of Study'} {edu.cgpa && `| CGPA: ${edu.cgpa}`}
                  </p>
                  {edu.school && <p className="text-xs opacity-90">School: {edu.school}</p>}
                  {edu.achievements && <p className="text-xs opacity-90 mt-1">Achievements: {edu.achievements}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hobbies */}
        {renderHobbiesSection()}
      </div>
    </motion.div>

    {/* Main Content */}
    <motion.div
      className="w-full md:w-2/3 p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Summary */}
      {resumeData?.personal?.summary && (
        <div className="mb-8">
          <h2 className="font-bold text-lg mb-3 pb-2 border-b" style={{ borderColor: colors.primary }}>Summary</h2>
          <p className="text-gray-700 text-sm">{resumeData.personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData?.experience?.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-lg mb-3 pb-2 border-b" style={{ borderColor: colors.primary }}>
            {resumeData.experience[0]?.isInternship ? 'Internship' : 'Experience'}
          </h2>
          <div className="space-y-4">
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between">
                  <h3 className="font-bold text-sm">{exp.position || 'Position'}</h3>
                  <span className="text-gray-600 text-xs">{exp.duration || 'Duration'}</span>
                </div>
                <div className="font-semibold mb-1 text-sm" style={{ color: colors.primary }}>
                  {exp.company || 'Company'}
                </div>
                <p className="text-gray-700 text-xs">
                  {exp.responsibilities || 'Responsibilities and achievements...'}
                </p>
                {exp.technologies && (
                  <div className="mt-1">
                    <span className="font-medium text-xs">Technologies: </span>
                    {renderTechnologyTags(exp.technologies)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resumeData?.projects?.length > 0 && (
        <div>
          <h2 className="font-bold text-lg mb-3 pb-2 border-b" style={{ borderColor: colors.primary }}>Projects</h2>
          <div className="space-y-4">
            {resumeData.projects.map((project, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between">
                  <h3 className="font-bold text-sm">
                    {project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        {project.title}
                      </a>
                    ) : (
                      project.title || 'Project Name'
                    )}
                  </h3>
                  {project.category && (
                    <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded">
                      {project.category}
                    </span>
                  )}
                </div>
                <p className="text-gray-700 text-sm">{project.description || 'Project description...'}</p>
                {project.technologies && (
                  <div className="mt-2">
                    <span className="font-medium text-sm">Technologies: </span>
                    {renderTechnologyTags(project.technologies)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  </div>
);


const renderCreativeLayout = () => (
  <div className="resume-content p-8 min-h-[297mm] bg-gray-50 relative">
    <Watermark templateId={resumeData?.template} unlockedTemplates={unlockedTemplates} />

    {/* Header */}
    <div className="mb-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-1" style={{ color: colors.primary }}>
          {resumeData?.personal?.name || 'Your Name'}
        </h1>
        <p className="text-xl text-gray-600">
          {resumeData?.personal?.title || 'Professional Title'}
        </p>
      </motion.div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Sidebar */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 space-y-6">
          <div>
            <h2 className="font-bold text-xl mb-4 pb-2 border-b" style={{ borderColor: colors.primary }}>Contact</h2>
            <div className="space-y-3">
              {renderContactItem(icons.email, resumeData?.personal?.email)}
              {renderContactItem(icons.phone, resumeData?.personal?.phone)}
              {renderContactItem(icons.location, resumeData?.personal?.location)}
              {renderContactItem(icons.linkedin, resumeData?.personal?.linkedin, resumeData?.personal?.linkedin)}
              {renderContactItem(icons.github, resumeData?.personal?.github, resumeData?.personal?.github)}
              {renderContactItem(icons.website, resumeData?.personal?.website, resumeData?.personal?.website)}
            </div>
          </div>
          {renderSkillsSection()}
          {renderHobbiesSection()}
        </div>
      </div>

      {/* Main Content */}
      <div className="md:col-span-2 space-y-8">
        {resumeData?.personal?.summary && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="font-bold text-xl mb-4 pb-2 border-b" style={{ borderColor: colors.primary }}>About Me</h2>
            <p className="text-gray-700">{resumeData.personal.summary}</p>
          </div>
        )}

        {resumeData?.experience?.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="font-bold text-xl mb-4 pb-2 border-b" style={{ borderColor: colors.primary }}>
              {resumeData.experience[0]?.isInternship ? 'Internship' : 'Experience'}
            </h2>
            <div className="space-y-4">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: colors.primary }}>{exp.position || 'Position'}</h3>
                      <div className="font-semibold">{exp.company || 'Company'}</div>
                    </div>
                    <span className="text-gray-600 text-sm bg-gray-100 px-3 py-1 rounded">
                      {exp.duration || 'Duration'}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{exp.responsibilities || 'Responsibilities and achievements...'}</p>
                  {exp.technologies?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {renderTechnologyTags(exp.technologies)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Education */}
          {resumeData?.education?.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="font-bold text-xl mb-4 pb-2 border-b" style={{ borderColor: colors.primary }}>Education</h2>
              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-sm">{edu.degree || 'Degree'}</h3>
                      <span className="text-gray-600 text-xs">{edu.duration || 'Year'}</span>
                    </div>
                    <div className="font-semibold mb-1 text-sm" style={{ color: colors.primary }}>
                      {edu.institution || 'Institution'}
                    </div>
                    <p className="text-gray-700 text-xs">
                      {edu.field || 'Field of Study'} {edu.cgpa && `| CGPA: ${edu.cgpa}`}
                    </p>
                    {edu.school && <p className="text-gray-700 text-xs">School: {edu.school}</p>}
                    {edu.achievements && <p className="text-gray-700 text-xs mt-1">Achievements: {edu.achievements}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resumeData?.projects?.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="font-bold text-xl mb-4 pb-2 border-b" style={{ borderColor: colors.primary }}>Projects</h2>
              <div className="space-y-4">
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm">
                        {project.link ? (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline"
                          >
                            {project.title}
                          </a>
                        ) : (
                          project.title || 'Project Name'
                        )}
                      </h3>
                      {project.category && (
                        <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded">
                          {project.category}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 text-xs">{project.description || 'Project description...'}</p>
                    {project.technologies?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {renderTechnologyTags(project.technologies)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);


  const renderCompactLayout = () => (
  <div className="resume-content bg-white text-gray-800 min-h-[297mm] flex flex-col md:flex-row">
    <Watermark templateId={resumeData?.template} unlockedTemplates={unlockedTemplates} />

    {/* Sidebar */}
    <aside className="bg-gray-100 md:w-1/3 w-full p-6 md:sticky md:top-0 md:h-screen flex flex-col items-center">
      {/* Name & Title */}
      <h1 className="text-2xl font-bold text-center mb-1" style={{ color: colors.primary }}>
        {resumeData?.personal?.name || 'Your Name'}
      </h1>
      <p className="text-sm text-gray-600 text-center mb-6">
        {resumeData?.personal?.title || 'Professional Title'}
      </p>

      {/* Contact Info */}
      <div className="w-full">
        <h2 className="font-semibold text-lg border-b pb-1 mb-4" style={{ borderColor: colors.primary }}>Contact</h2>
        <div className="space-y-2">
          {renderContactItem(icons.email, resumeData?.personal?.email)}
          {renderContactItem(icons.phone, resumeData?.personal?.phone)}
          {renderContactItem(icons.location, resumeData?.personal?.location)}
          {renderContactItem(icons.linkedin, resumeData?.personal?.linkedin)}
          {renderContactItem(icons.github, resumeData?.personal?.github)}
          {renderContactItem(icons.website, resumeData?.personal?.website)}
        </div>
      </div>

      {/* Skills & Hobbies */}
      <div className="mt-8 w-full space-y-6">
        {renderSkillsSection()}
        {renderHobbiesSection?.()}
      </div>
    </aside>

    {/* Main Content */}
    <main className="flex-1 p-6 space-y-8">
      {/* Summary */}
      {resumeData?.personal?.summary && (
        <section className="bg-gray-50 p-5 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-2 border-b pb-1" style={{ borderColor: colors.primary }}>About Me</h2>
          <p className="text-gray-700 text-sm">{resumeData.personal.summary}</p>
        </section>
      )}

      {/* Experience */}
      {resumeData?.experience?.length > 0 && (
        <section className="bg-gray-50 p-5 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4 pb-1 border-b" style={{ borderColor: colors.primary }}>
            {resumeData.experience[0]?.isInternship ? 'Internship' : 'Experience'}
          </h2>
          <div className="space-y-4">
            {resumeData.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-base" style={{ color: colors.primary }}>{exp.position}</h3>
                    <p className="text-sm">{exp.company}</p>
                  </div>
                  <span className="text-xs text-gray-600 bg-gray-200 px-2 py-0.5 rounded">{exp.duration}</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{exp.responsibilities}</p>
                {exp.technologies && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {renderTechnologyTags(exp.technologies)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Projects in Grid */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
        {/* Education */}
        {resumeData?.education?.length > 0 && (
          <section className="bg-gray-50 p-5 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-3 border-b pb-1" style={{ borderColor: colors.primary }}>Education</h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-sm">{edu.degree}</h3>
                  <span className="text-xs text-gray-600">{edu.duration}</span>
                </div>
                <p className="text-sm" style={{ color: colors.primary }}>{edu.institution}</p>
                <p className="text-xs text-gray-700">{edu.field} {edu.cgpa && `| CGPA: ${edu.cgpa}`}</p>
                {edu.school && <p className="text-xs text-gray-700">School: {edu.school}</p>}
                {edu.achievements && <p className="text-xs text-gray-700 mt-1">Achievements: {edu.achievements}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {resumeData?.projects?.length > 0 && (
          <section className="bg-gray-50 p-5 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-3 border-b pb-1" style={{ borderColor: colors.primary }}>Projects</h2>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-sm">
                    {project.link ? (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {project.title}
                      </a>
                    ) : project.title}
                  </h3>
                  {project.category && (
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">{project.category}</span>
                  )}
                </div>
                <p className="text-xs text-gray-700">{project.description}</p>
                {project.technologies && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span className="font-medium text-xs">Tech: </span>
                    {renderTechnologyTags(project.technologies)}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  </div>
);

   const mobileStyles = `
  @media (max-width: 768px) {
    .resume-preview-container {
      overflow-x: auto;
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
    }

    .resume-content-container {
      transform: scale(0.85);
      transform-origin: top center;
    }

    .resume-content {
      width: 100%;
      max-width: 210mm;
      min-height: 297mm;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      margin: 0 auto;
    }

    .resume-content * {
      box-sizing: border-box;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .section-padding {
      padding: 10px !important;
    }

    .flex-col.md\\:flex-row {
      flex-direction: column !important;
    }

    .w-full.md\\:w-1\\/3, 
    .w-full.md\\:w-2\\/3,
    .w-full.md\\:w-1\\/2 {
      width: 100% !important;
    }

    .grid-cols-1.md\\:grid-cols-2,
    .grid-cols-1.md\\:grid-cols-3 {
      grid-template-columns: 1fr !important;
    }

    .text-3xl, .text-4xl {
      font-size: 1.8rem !important;
    }

    .text-xl, .text-2xl {
      font-size: 1.2rem !important;
    }

    .text-lg {
      font-size: 1.1rem !important;
    }

    .text-sm {
      font-size: 0.9rem !important;
    }

    .p-6, .p-8 {
      padding: 1rem !important;
    }

    .mb-8, .mb-6 {
      margin-bottom: 1.5rem !important;
    }

    .space-y-8 > * {
      margin-bottom: 1.5rem !important;
    }

  }
`;

return (
  <div className="flex flex-col items-center w-full">
    <style>{mobileStyles}</style>

    <div className="resume-preview-container w-full">
      {isMobile && (
        <div className="mobile-scroll-hint">
          Pinch to zoom & scroll to view
        </div>
      )}

      <div
        ref={previewContainerRef}
        className="relative bg-white shadow-lg mx-auto"
        style={{
          width: '210mm',
          boxSizing: 'border-box',
        }}
      >
        <div
          className="resume-content"
        >
          <div
            ref={resumeContainerRef}
            className="w-full bg-white relative"
            style={{
              minHeight: '297mm',
              padding: '15mm',
              boxSizing: 'border-box',
            }}
          >
            {renderResumeLayout()}
          </div>
        </div>
      </div>
    </div>

    {/* ⛔ Pagination Removed */}

    <div className="mt-4 flex flex-wrap justify-center gap-3">
      <button
        onClick={handleDownload}
        disabled={isGeneratingPDF}
        className={`flex items-center px-4 py-2 rounded-md text-white transition-colors ${
          isGeneratingPDF ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isGeneratingPDF ? (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        )}
        {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
      </button>
    </div>

    {saveStatus.message && (
      <div
        className={`mt-3 px-4 py-2 rounded-md text-center ${
          saveStatus.success
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {saveStatus.message}
      </div>
    )}
  </div>
);

});
export default Preview;

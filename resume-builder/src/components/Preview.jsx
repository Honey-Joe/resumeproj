import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import axios from 'axios';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PX_PER_MM = 96 / 25.4;  // 96 DPI
const A4_WIDTH_PX = A4_WIDTH_MM * PX_PER_MM;
const A4_HEIGHT_PX = A4_HEIGHT_MM * PX_PER_MM;

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

const Preview = forwardRef(({ resumeData, onRefresh, onPdfStart, onPdfComplete, unlockedTemplates=[]}, ref) => {
 const resumeContainerRef = useRef(null);
  const previewContainerRef = useRef(null);
  
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ success: false, message: '' });
  const [isMobile, setIsMobile] = useState(false);
  const [showWatermarkModal, setShowWatermarkModal] = useState(false);
  const [isTemplateUnlocked, setIsTemplateUnlocked] = useState(false);
  
  // Zoom and pan controls
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startTouches, setStartTouches] = useState(null);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [baseScale, setBaseScale] = useState(1);

  // Check template unlock status
// In your Preview component, update the useEffect that checks unlocked status:
useEffect(() => {
    if (resumeData?.template) {
        // Check if current template is in unlocked templates
        const isUnlocked = unlockedTemplates.some(t => 
            typeof t === 'string' ? t === resumeData.template : t?.name === resumeData.template
        );
        setIsTemplateUnlocked(isUnlocked);
    }
}, [resumeData?.template, unlockedTemplates]);

  // Responsive layout detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Expose download method via ref
  useImperativeHandle(ref, () => ({
    downloadResume: handleDownloadClick,
  }));

  // Responsive scaling
  useEffect(() => {
    const updateBaseScale = () => {
      if (window.innerWidth <= 768) setBaseScale(0.85);
      else if (window.innerWidth <= 1024) setBaseScale(0.9);
      else setBaseScale(1);
    };
    
    updateBaseScale();
    window.addEventListener('resize', updateBaseScale);
    return () => window.removeEventListener('resize', updateBaseScale);
  }, []);

  // Page height calculation

  // Touch and zoom handlers
  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        setStartPosition({ 
          x: e.touches[0].clientX, 
          y: e.touches[0].clientY 
        });
      } else if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        setStartTouches({ distance, scale });
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 1 && startPosition) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - startPosition.x;
        const deltaY = touch.clientY - startPosition.y;
        
        setPosition(prev => ({
          x: prev.x + deltaX / baseScale,
          y: prev.y + deltaY / baseScale
        }));
        setStartPosition({ x: touch.clientX, y: touch.clientY });
      } 
      else if (e.touches.length === 2 && startTouches) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        const newScale = Math.max(
          0.5,
          Math.min(startTouches.scale * (currentDistance / startTouches.distance), 3)
        );
        setScale(newScale);
      }
    };

    const handleTouchEnd = () => {
      setStartTouches(null);
      setStartPosition(null);
    };

    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setScale(prevScale => Math.max(0.5, Math.min(prevScale + delta, 3)));
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [startPosition, startTouches, position, baseScale]);

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

const handleDownloadClick = (forceWatermark = false) => {
  // Close modal if open
  setShowWatermarkModal(false);

  // Check if template is selected
  if (!resumeData?.template) {
    alert("Please select a template first");
    return;
  }

  // If unlocked OR watermark download forced
  if (isTemplateUnlocked || forceWatermark) {
    // Scroll to bottom after a short delay to ensure DOM is ready
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
      
      // Start download after scroll completes
      setTimeout(handleDownload, 300);
    }, 100);
  } else {
    setShowWatermarkModal(true);
  }
};

const handleDownload = async () => {
  if (onPdfStart) onPdfStart();
  setIsGeneratingPDF(true);

  // Constants for A4 dimensions and pixel conversion
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  const PX_PER_MM = 96 / 25.4; // 96dpi conversion
  const A4_WIDTH_PX = A4_WIDTH_MM * PX_PER_MM;

  try {
    const name = resumeData?.personal?.name?.replace(/\s+/g, '_') || 'resume';
    const resumeElement = resumeContainerRef.current;
    
    // Create a deep clone of the element
    const clone = resumeElement.cloneNode(true);

    // Create temporary container with proper styling - USING WORKING EXAMPLE'S STYLING
    const tempContainer = document.createElement('div');
    Object.assign(tempContainer.style, {
      position: 'absolute',
      left: '-9999px',
      width: `${A4_WIDTH_PX}px`,
      backgroundColor: 'white',
      overflow: 'visible',  // Changed from 'hidden'
      boxSizing: 'border-box',
      padding: '0',
      margin: '0',
      fontSize: '12pt',
      fontFamily: 'Arial, sans-serif',
      height: 'auto',      // Added for scrollable content
      minHeight: '100%'    // Added for scrollable content
    });

    // Create print-specific styles - USING WORKING EXAMPLE'S STYLES
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

    // CRITICAL FIX: Wait for rendering to complete
    await new Promise(resolve => {
      // Double requestAnimationFrame ensures layout completion
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });

    // Get full content height
    const fullHeightPx = clone.scrollHeight;
    
    // FIX: Validate height before proceeding
    if (fullHeightPx === 0) {
      throw new Error('Content height is zero, cannot generate PDF');
    }

    // CRITICAL FIX: Create a wrapper div with explicit dimensions
    const contentWrapper = document.createElement('div');
    Object.assign(contentWrapper.style, {
      width: `${A4_WIDTH_PX}px`,
      height: `${fullHeightPx}px`,
      overflow: 'visible',
      backgroundColor: 'white'
    });
    contentWrapper.appendChild(clone.cloneNode(true));
    
    // Replace tempContainer content
    tempContainer.innerHTML = '';
    tempContainer.appendChild(contentWrapper);

    // Wait for rendering
    await new Promise(resolve => setTimeout(resolve, 100));

    // Create canvas with full content height
    const canvas = await toPng(contentWrapper, {
      pixelRatio: 2,  // Reduced for performance
      quality: 1,
      backgroundColor: 'white',
      width: A4_WIDTH_PX,
      height: fullHeightPx,
      cacheBust: true
    });

    // Calculate PDF dimensions
    const heightInMM = (fullHeightPx * A4_WIDTH_MM) / A4_WIDTH_PX;
    
    // Create PDF with dynamic height
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [A4_WIDTH_MM, heightInMM],
      compress: true
    });

    pdf.addImage(
      canvas, 
      'PNG', 
      0, 
      0, 
      A4_WIDTH_MM, 
      heightInMM,
      undefined,
      'FAST'
    );

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

// Calculate appropriate text colors based on background
const getTextColor = (bgColor) => {
    if (!bgColor) return '#1e293b'; // Default dark text
    
    const color = bgColor.replace('#', '');
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#1e293b' : '#f8fafc'; // Dark text on light, light text on dark
};

// Get text colors for all sections
const textColor = {
    primary: getTextColor(colors.primary),
    secondary: getTextColor(colors.secondary),
    accent: getTextColor(colors.accent),
    body: getTextColor('#ffffff'), // For white backgrounds
    darkBody: getTextColor(colors.secondary) // For dark backgrounds
};

// Improved Watermark with adaptive color
const Watermark = ({ text = 'FREE WILL TECHNOLOGIES', unlockedTemplates = [], templateId }) => {
    if (!templateId) return null;
    
    // Check if template is unlocked by looking at template names
    const isUnlocked = unlockedTemplates.some(t => 
        typeof t === 'string' ? t === templateId : t?.name === templateId
    );
    
    if (isUnlocked) return null;

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

// Render contact item with adaptive colors
const renderContactItem = (icon, value, horizontal = false) => {
  if (!value) return null;
  
  return (
    <div className={`flex items-center ${horizontal ? 'mr-4' : 'mb-2'}`}>
      <span className="mr-2" style={{ color: colors.primary }}>
        {icon}
      </span>
      {value.includes('http') ? (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-gray-700 hover:underline"
        >
          {value.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        </a>
      ) : (
        <span className="text-sm text-gray-700">{value}</span>
      )}
    </div>
  );
};

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

const renderPagination = () => {
    if (totalPages > 1) {
        return (
            <div className="flex justify-center items-center mt-4 space-x-4">
                <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                </button>
                <span className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                </span>
                <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                >
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        );
    }
    return null;
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

const getStringValue = (skill) => {
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
              {getStringValue(skill)}
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
                            {getStringValue(skill)}
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
                            {getStringValue(skill)}
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
                        const langName = getStringValue(lang);
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
                        const certName = getStringValue(cert);
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
        case 'elegant-white': return renderElegantWhiteTemplate();
        case 'red': return renderBoldRedLayout();
        case 'teal': return renderProfessionalTealLayout();
        case 'minimal': return renderMinimalistLayout();
        case 'classic': return renderClassicLayout();
        case 'sidebar': return renderSidebarLayout();
        case 'creative': return renderCreativeLayout();
        case 'compact': return renderCompactLayout();
        case 'professional-classic': return renderProfessionalClassicLayout();
        case 'modern-tech': return renderModernTechLayout();
        default: return renderModernBlueLayout();
    }
};

const renderModernBlueLayout = () => (
    <div className="resume-content flex flex-col min-h-[297mm] relative">
        <Watermark templateId={resumeData?.template} unlockedTemplates={unlockedTemplates} />

        <motion.div className="p-4 text-center section-padding relative z-10"
            style={{ backgroundColor: colors.primary, color: textColor.primary }}>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
                {resumeData?.personal?.name || 'Your Name'}
            </h1>
            <p className="text-base md:text-lg">
                {resumeData?.personal?.title || 'Professional Title'}
            </p>
        </motion.div>

        <div className="flex flex-row flex-1 relative z-10">
            <div className="w-1/3 p-4 section-padding"
                style={{ backgroundColor: colors.secondary, color: textColor.secondary }}>
                {renderContactSection()}
                {renderSkillsSection()}
                {renderHobbiesSection()}
            </div>

            <div className="w-2/3 p-4 section-padding" style={{ color: textColor.body }}>
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
                                            <h3 className="font-bold">{exp.position || 'Position'}</h3>
                                        </div>
                                        <span className="text-sm mt-1 md:mt-0">{exp.duration || 'Duration'}</span>
                                    </div>
                                    <div className="font-semibold mb-1" style={{ color: colors.primary }}>
                                        {exp.company || 'Company'}
                                    </div>
                                    <p className="text-sm">
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
                                        <h3 className="font-bold">{edu.degree || 'Degree'}</h3>
                                        <span className="text-sm mt-1 md:mt-0">{edu.duration || 'Year'}</span>
                                    </div>
                                    <div className="font-semibold mb-1" style={{ color: colors.primary }}>
                                        {edu.institution || 'Institution'}
                                    </div>
                                    <p className="text-sm">
                                        {edu.field || 'Field of Study'} {edu.cgpa && `| CGPA: ${edu.cgpa}`}
                                    </p>
                                    {edu.school && <p className="text-sm">School: {edu.school}</p>}
                                    {edu.achievements && <p className="text-sm">Achievements: {edu.achievements}</p>}
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
                                    <h3 className="font-bold">
                                        {project.link ? (
                                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                {project.title || 'Project Name'}
                                            </a>
                                        ) : project.title || 'Project Name'}
                                    </h3>
                                    <p className="text-sm">
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
            <motion.div className="p-6 text-center" 
                style={{ backgroundColor: colors.primary, color: textColor.primary }}
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}>
                <h1 className="text-3xl font-bold mb-1">
                    {resumeData?.personal?.name || 'Your Name'}
                </h1>
                <p className="text-xl">
                    {resumeData?.personal?.title || 'Professional Title'}
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                {/* LEFT COLUMN */}
                <div className="space-y-6">
                    {/* About Me */}
                    <motion.div className="p-4 rounded-lg bg-white bg-opacity-90 shadow" 
                        style={{ color: textColor.body }}
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: 0.2 }}>
                        <h2 className="font-bold text-lg mb-3 flex items-center">
                            <div className="mr-2" style={{ color: colors.primary }}>{icons.user}</div> About Me
                        </h2>
                        <p className="text-sm">{resumeData?.personal?.summary || 'Professional summary...'}</p>
                    </motion.div>

                    {/* Skills */}
                    <motion.div className="p-4 rounded-lg bg-white bg-opacity-90 shadow" 
                        style={{ color: textColor.body }}
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: 0.3 }}>
                        <h2 className="font-bold text-lg mb-3 flex items-center">
                            <div className="mr-2" style={{ color: colors.primary }}>{icons.skills}</div> Skills
                        </h2>
                        <div className="space-y-3">{renderSkillsSection()}</div>
                    </motion.div>

                    {/* Education */}
                    {resumeData?.education?.length > 0 && (
                        <motion.div className="p-4 rounded-lg bg-white bg-opacity-90 shadow" 
                            style={{ color: textColor.body }}
                            initial={{ opacity: 0, x: -20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            transition={{ delay: 0.4 }}>
                            <h2 className="font-bold text-lg mb-3 flex items-center">
                                <div className="mr-2" style={{ color: colors.primary }}>{icons.education}</div> Education
                            </h2>
                            <div className="space-y-4">
                                {resumeData.education.map((edu, index) => (
                                    <div key={index} className="mb-3">
                                        <div className="flex justify-between">
                                            <h3 className="font-bold text-sm">{edu.degree || 'Degree'}</h3>
                                            <span className="text-sm">{edu.duration || 'Year'}</span>
                                        </div>
                                        <div className="font-semibold mb-1 text-sm" style={{ color: colors.primary }}>
                                            {edu.institution || 'Institution'}
                                        </div>
                                        {edu.school && <p className="text-xs">School: {edu.school}</p>}
                                        {edu.field && (
                                            <p className="text-xs">
                                                {edu.field} {edu.cgpa && `| CGPA: ${edu.cgpa}`}
                                            </p>
                                        )}
                                        {edu.achievements && <p className="text-xs mt-1">Achievements: {edu.achievements}</p>}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Hobbies */}
{resumeData?.hobbies?.length > 0 && (
  <motion.div
    className="p-4 rounded-lg bg-white bg-opacity-90 shadow"
    style={{ color: textColor.body }}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4 }}
  >
    <h2 className="font-bold text-lg mb-3 flex items-center">
      <div className="mr-2" style={{ color: colors.primary }}>
        {icons.hobbies}
      </div>
      Interests
    </h2>
    <div className="space-y-2">
      {resumeData.hobbies.map((hobby, index) => (
        <div key={index} className="text-sm">
          {typeof hobby === 'object' ? hobby.name : hobby}
        </div>
      ))}
    </div>
  </motion.div>
)}
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">
                    {/* Contact */}
                    <motion.div className="p-4 rounded-lg bg-white bg-opacity-90 shadow" 
                        style={{ color: textColor.body }}
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: 0.3 }}>
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
                        <motion.div className="p-4 rounded-lg bg-white bg-opacity-90 shadow" 
                            style={{ color: textColor.body }}
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            transition={{ delay: 0.4 }}>
                            <h2 className="font-bold text-lg mb-3 flex items-center">
                                <div className="mr-2" style={{ color: colors.primary }}>{icons.briefcase}</div>
                                {resumeData.experience[0]?.isInternship ? 'Internship' : 'Experience'}
                            </h2>
                            <div className="space-y-4">
                                {resumeData.experience.map((exp, index) => (
                                    <div key={index} className="mb-3">
                                        <div className="flex justify-between">
                                            <h3 className="font-bold text-sm">{exp.position || 'Position'}</h3>
                                            <span className="text-sm">{exp.duration || 'Duration'}</span>
                                        </div>
                                        <div className="font-semibold mb-1 text-sm" style={{ color: colors.primary }}>
                                            {exp.company || 'Company'}
                                        </div>
                                        <p className="text-xs">{exp.responsibilities || 'Responsibilities and achievements...'}</p>
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
                        <motion.div className="p-4 rounded-lg bg-white bg-opacity-90 shadow" 
                            style={{ color: textColor.body }}
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            transition={{ delay: 0.5 }}>
                            <h2 className="font-bold text-lg mb-3 flex items-center">
                                <div className="mr-2" style={{ color: colors.primary }}>{icons.project}</div> Projects
                            </h2>
                            <div className="space-y-4">
                                {resumeData.projects.map((project, index) => (
                                    <div key={index} className="mb-3">
                                        <h3 className="font-bold text-sm" style={{ color: colors.primary }}>
                                            {project.link ? (
                                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                    {project.title}
                                                </a>
                                            ) : project.title}
                                        </h3>
                                        <p className="text-xs">{project.description}</p>
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

const renderElegantWhiteTemplate = () => (
  <div className="bg-white text-gray-800 font-sans min-h-screen relative overflow-hidden">
    <Watermark unlockedTemplates={unlockedTemplates} templateId={resumeData?.template} />

    <div className="max-w-5xl mx-auto p-5 relative z-10">
      {/* Enhanced Header */}
      <div className="relative mb-10">
        <div className="bg-white p-8 md:p-10 relative overflow-hidden border-b-2" style={{ borderColor: colors.primary }}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1 tracking-tight">
                {typeof resumeData?.personal?.name === 'object' ? resumeData.personal.name.name : resumeData?.personal?.name || 'Your Name'}
              </h1>
              <p className="text-xl text-gray-700 mt-2 font-medium">
                {typeof resumeData?.personal?.title === 'object' ? resumeData.personal.title.name : resumeData?.personal?.title || 'Professional Title'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8">
          {/* Contact Section */}
<div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200">
  <h2 className="text-lg font-bold mb-4 flex items-center text-gray-900 tracking-wide uppercase">
    <span className="mr-3 text-gray-700">
      {icons.email}
    </span>
    Contact
  </h2>
  <div className="space-y-3 break-words">
    {/* Phone */}
    {resumeData?.personal?.phone && (
      <div className="flex items-start">
        <span className="mr-3 text-gray-600 mt-0.5">{icons.phone}</span>
        <span className="text-gray-700 text-sm font-medium">
          {typeof resumeData.personal.phone === 'object' ? resumeData.personal.phone.name : resumeData.personal.phone}
        </span>
      </div>
    )}

    {/* Email */}
    {resumeData?.personal?.email && (
      <div className="flex items-start">
        <span className="mr-3 text-gray-600 mt-0.5">{icons.email}</span>
        <a
          href={`mailto:${typeof resumeData.personal.email === 'object'
            ? resumeData.personal.email.name
            : resumeData.personal.email}`}
          className="text-blue-700 hover:underline text-sm break-all font-medium"
        >
          {typeof resumeData.personal.email === 'object'
            ? resumeData.personal.email.name
            : resumeData.personal.email}
        </a>
      </div>
    )}

    {/* Website */}
    {resumeData?.personal?.website && (
      <div className="flex items-start">
        <span className="mr-3 text-gray-600 mt-0.5">{icons.website}</span>
        <a
          href={(typeof resumeData.personal.website === 'object'
            ? resumeData.personal.website.name
            : resumeData.personal.website).startsWith('http')
            ? (typeof resumeData.personal.website === 'object'
                ? resumeData.personal.website.name
                : resumeData.personal.website)
            : `https://${typeof resumeData.personal.website === 'object'
                ? resumeData.personal.website.name
                : resumeData.personal.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 hover:underline text-sm break-all font-medium"
        >
          {typeof resumeData.personal.website === 'object'
            ? resumeData.personal.website.name
            : resumeData.personal.website}
        </a>
      </div>
    )}

    {/* LinkedIn */}
    {resumeData?.personal?.linkedin && (
      <div className="flex items-start">
        <span className="mr-3 text-gray-600 mt-0.5">{icons.linkedin}</span>
        <a
          href={(typeof resumeData.personal.linkedin === 'object'
            ? resumeData.personal.linkedin.name
            : resumeData.personal.linkedin).startsWith('http')
            ? (typeof resumeData.personal.linkedin === 'object'
                ? resumeData.personal.linkedin.name
                : resumeData.personal.linkedin)
            : `https://linkedin.com/in/${typeof resumeData.personal.linkedin === 'object'
                ? resumeData.personal.linkedin.name
                : resumeData.personal.linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 hover:underline text-sm break-all font-medium"
        >
          {typeof resumeData.personal.linkedin === 'object'
            ? resumeData.personal.linkedin.name
            : resumeData.personal.linkedin}
        </a>
      </div>
    )}

    {/* GitHub */}
    {resumeData?.personal?.github && (
      <div className="flex items-start">
        <span className="mr-3 text-gray-600 mt-0.5">{icons.github}</span>
        <a
          href={(typeof resumeData.personal.github === 'object'
            ? resumeData.personal.github.name
            : resumeData.personal.github).startsWith('http')
            ? (typeof resumeData.personal.github === 'object'
                ? resumeData.personal.github.name
                : resumeData.personal.github)
            : `https://github.com/${typeof resumeData.personal.github === 'object'
                ? resumeData.personal.github.name
                : resumeData.personal.github}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 hover:underline text-sm break-all font-medium"
        >
          {typeof resumeData.personal.github === 'object'
            ? resumeData.personal.github.name
            : resumeData.personal.github}
        </a>
      </div>
    )}

    {/* Location */}
    {resumeData?.personal?.location && (
      <div className="flex items-start">
        <span className="mr-3 text-gray-600 mt-0.5">{icons.location}</span>
        <span className="text-gray-700 text-sm font-medium">
          {typeof resumeData.personal.location === 'object'
            ? resumeData.personal.location.name
            : resumeData.personal.location}
        </span>
      </div>
    )}
  </div>
</div>

         {/* Skills */}
  <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200">
    <h2 className="text-lg font-bold mb-4 flex items-center tracking-wide uppercase">
      <span className="mr-3 text-gray-700">{icons.skills}</span>
      Skills
    </h2>
    {renderSkillsSection()}
  </div>

          {/* Hobbies */}
          {resumeData?.hobbies?.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4 flex items-center tracking-wide uppercase">
                <span className="mr-3 text-gray-700">{icons.hobbies}</span>
                Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.hobbies.map((hobby, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300"
                  >
                    {typeof hobby === 'object' ? hobby.name : hobby}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Summary */}
          {resumeData?.personal?.summary && (
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-3 flex items-center tracking-wide uppercase">
                <span className="mr-3 text-gray-700">{icons.user}</span>
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm font-medium">
                {typeof resumeData.personal.summary === 'object' 
                  ? resumeData.personal.summary.name 
                  : resumeData.personal.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {resumeData?.experience?.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200 relative overflow-hidden">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>
              <h2 className="text-lg font-bold mb-5 flex items-center tracking-wide uppercase">
                <span className="mr-3 text-gray-700">
                  {icons.briefcase}
                </span>
                {resumeData.experience[0]?.isInternship ? 'Internship Experience' : 'Professional Experience'}
              </h2>
              <div className="space-y-8 ml-4">
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="relative pl-8">
                    <div className="absolute left-0 top-3 w-3 h-3 rounded-full z-10 bg-gray-500 border-2 border-white shadow"></div>
                    <div className="border-l-2 pl-6 pt-1 pb-4 border-gray-300">
                      <div className="flex flex-wrap justify-between">
                        <h3 className="text-lg font-bold text-gray-900">
                          {typeof exp.position === 'object' ? exp.position.name : exp.position}
                        </h3>
                        <span className="text-sm text-gray-700 font-medium whitespace-nowrap">
                          {typeof exp.duration === 'object' ? exp.duration.name : exp.duration}
                        </span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <p className="text-gray-800 font-medium text-sm">
                          {typeof exp.company === 'object' ? exp.company.name : exp.company}
                        </p>
                        <p className="text-sm text-gray-600">
                          {typeof exp.location === 'object' ? exp.location.name : exp.location}
                        </p>
                      </div>
                      <p className="text-gray-700 mt-3 text-sm leading-relaxed">
                        {typeof exp.responsibilities === 'object' 
                          ? exp.responsibilities.name 
                          : exp.responsibilities}
                      </p>
                      {exp.technologies && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
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
  <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200">
    <h2 className="text-lg font-bold mb-5 flex items-center tracking-wide uppercase">
      <span className="mr-3 text-gray-700">{icons.project}</span>
      Projects
    </h2>
    <div className="grid grid-cols-1 gap-6">
      {resumeData.projects.map((project, index) => (
        <div
          key={index}
          className="p-5 rounded-lg border border-grey-200 bg-white hover:shadow-md transition-all duration-300"
        >
          <h3 className="font-bold text-base text-gray-900 mb-1">
            {project.link ? (
              <a
                href={typeof project.link === 'object' ? project.link.name : project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline"
              >
                {typeof project.title === 'object' ? project.title.name : project.title}
              </a>
            ) : (
              typeof project.title === 'object' ? project.title.name : project.title
            )}
          </h3>

          {/* ✅ Project Duration */}
          {project.duration && (
            <p className="text-sm text-gray-500 italic mb-2">
              {typeof project.duration === 'object' ? project.duration.name : project.duration}
            </p>
          )}

          <p className="text-gray-700 mt-2 text-sm leading-relaxed">
            {typeof project.description === 'object'
              ? project.description.name
              : project.description || 'Project description...'}
          </p>

          {project.technologies && (
            <div className="mt-3 flex flex-wrap gap-2">
              {renderTechnologyTags(project.technologies)}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)}


        {/* Education */}
{resumeData?.education?.length > 0 && (
  <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200">
    <h2 className="text-lg font-bold mb-5 flex items-center tracking-wide uppercase">
      <span className="mr-3 text-gray-700">{icons.education}</span>
      Education
    </h2>
    <div className="space-y-6">
      {resumeData.education.map((edu, index) => (
        <div
          key={index}
          className="pb-4 border-b border-gray-200 last:border-0 last:pb-0"
        >
          {/* Degree + Duration */}
          <div className="flex justify-between">
            <h3 className="font-bold text-base text-gray-900">
              {typeof edu.degree === "object"
                ? edu.degree.name
                : edu.degree || "Degree"}
            </h3>
            <span className="text-sm text-gray-700 font-medium whitespace-nowrap">
              {typeof edu.duration === "object"
                ? edu.duration.name
                : edu.duration || "Year"}
            </span>
          </div>

          {/* Institution */}
          {edu.institution && (
            <p className="text-gray-800 text-sm font-medium mt-1">
              {typeof edu.institution === "object"
                ? edu.institution.name
                : edu.institution}
            </p>
          )}

          {/* School */}
         {edu.school && (
  <p className="text-gray-700 text-sm mt-1">
    <span className="font-medium">High School:</span>{" "}
    {typeof edu.school === "object" ? edu.school.name : edu.school}
  </p>
)}

          {/* Field + CGPA */}
          {edu.field && (
            <p className="text-gray-700 text-sm mt-1">
              {typeof edu.field === "object"
                ? edu.field.name
                : edu.field}
              {edu.cgpa && (
                <span className="font-medium">
                  {" "}
                  | GPA:{" "}
                  {typeof edu.cgpa === "object"
                    ? edu.cgpa.name
                    : edu.cgpa}
                </span>
              )}
            </p>
          )}

          {/* Achievements */}
          {edu.achievements && (
            <p className="text-gray-700 text-sm mt-1">
              <span className="font-medium">Achievements:</span>{" "}
              {typeof edu.achievements === "object"
                ? edu.achievements.name
                : edu.achievements}
            </p>
          )}
        </div>
      ))}
    </div>
  </div>
)}


          {/* Certifications */}
          {resumeData?.certifications?.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4 flex items-center tracking-wide uppercase">
                <span className="mr-3 text-gray-700">{icons.certificate}</span>
                Certifications
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {resumeData.certifications.map((cert, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {typeof cert.name === 'object' ? cert.name.name : cert.name}
                      </h3>
                      <p className="text-gray-700 text-xs">
                        {typeof cert.issuer === 'object' ? cert.issuer.name : cert.issuer}
                      </p>
                    </div>
                    <span className="text-xs text-gray-600 whitespace-nowrap">
                      {typeof cert.date === 'object' ? cert.date.name : cert.date}
                    </span>
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
            style={{ backgroundColor: colors.primary, color: textColor.primary }}
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

        <div className="w-4/5 py-8 flex-1" style={{ color: textColor.body }}>
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
                                            <span className="text-sm">{exp.duration || 'Duration'}</span>
                                        </div>
                                        <div className="font-semibold mb-1 text-sm" style={{ color: colors.primary }}>
                                            {exp.company || 'Company'}
                                        </div>
                                        <p className="text-sm">
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
                                            ) : project.title || 'Project Name'}
                                        </h3>
                                        <p className="text-sm">
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
                                            <span className="text-sm">{edu.duration || 'Year'}</span>
                                        </div>
                                        <div className="font-semibold mb-1 text-sm" style={{ color: colors.primary }}>
                                            {edu.institution || 'Institution'}
                                        </div>
                                        <p className="text-sm">
                                            {edu.field || 'Field of Study'} {edu.cgpa && `| CGPA: ${edu.cgpa}`}
                                        </p>
                                        {edu.school && <p className="text-sm">School: {edu.school}</p>}
                                        {edu.achievements && <p className="text-sm">Achievements: {edu.achievements}</p>}
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
                            <p className="text-sm">
                                {resumeData.personal.summary}
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>

        <motion.div
            className="w-full p-4 text-center mt-auto"
            style={{ backgroundColor: colors.primary, color: textColor.primary }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="flex justify-center space-x-4 text-sm">
                {resumeData?.personal?.email && <span className="break-words">{resumeData.personal.email}</span>}
                {resumeData?.personal?.phone && <span>{resumeData.personal.phone}</span>}
                {resumeData?.personal?.location && <span>{resumeData.personal.location}</span>}
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
            style={{ backgroundColor: colors.primary, color: textColor.primary }}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6" style={{ color: textColor.body }}>
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
                        <h2 className="font-bold text-lg mb-3 border-b pb-2" style={{ borderColor: colors.primary }}>Summary</h2>
                        <p className="text-sm">
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
                                        <span className="text-xs">{exp.duration || 'Duration'}</span>
                                    </div>
                                    <div className="font-semibold mb-1 text-sm" style={{ color: colors.primary }}>
                                        {exp.company || 'Company'}
                                    </div>
                                    <p className="text-xs">
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
                                        <span className="text-xs">{edu.duration || 'Year'}</span>
                                    </div>
                                    <div className="font-semibold mb-1 text-sm" style={{ color: colors.primary }}>
                                        {edu.institution || 'Institution'}
                                    </div>
                                    <p className="text-xs">
                                        {edu.field || 'Field of Study'} {edu.cgpa && `| CGPA: ${edu.cgpa}`}
                                    </p>
                                    {edu.school && <p className="text-xs">School: {edu.school}</p>}
                                    {edu.achievements && <p className="text-xs">Achievements: {edu.achievements}</p>}
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
                                        ) : project.title || 'Project Name'}
                                    </h3>
                                    <p className="text-xs">
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
    <div className="resume-content p-8 min-h-[297mm] bg-white relative" style={{ color: textColor.body }}>
        <Watermark
            templateId={resumeData?.template}
            unlockedTemplates={unlockedTemplates}
        />

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
            <div className="flex flex-wrap justify-center gap-4 mt-3 text-sm text-gray-500">
                {resumeData?.personal?.email && <span>{icons.email} {resumeData.personal.email}</span>}
                {resumeData?.personal?.phone && <span>{icons.phone} {resumeData.personal.phone}</span>}
                {resumeData?.personal?.location && <span>{icons.location} {resumeData.personal.location}</span>}
            </div>
        </motion.div>

        <div className="space-y-8 text-sm">
            {/* Summary */}
            {resumeData?.personal?.summary && (
                <div className="mb-6">
                    <h2 className="font-bold text-lg mb-3 border-b pb-2">Summary</h2>
                    <p className="text-gray-700">
                        {resumeData.personal.summary}
                    </p>
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
                                <p className="text-gray-600 mt-2">
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
                                <div className="font-semibold text-gray-700">
                                    {edu.institution || 'Institution'}
                                </div>
                                <p className="text-gray-600">
                                    {edu.field || 'Field of Study'} {edu.cgpa && `| CGPA: ${edu.cgpa}`}
                                </p>
                                {edu.school && <p className="text-gray-600">School: {edu.school}</p>}
                                {edu.achievements && <p className="text-gray-600 mt-1">Achievements: {edu.achievements}</p>}
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
                                        ) : project.title || 'Project Name'}
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
                                <p className="text-gray-600 text-sm mt-1">
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

            {/* Certifications */}
            {resumeData?.certifications?.length > 0 && (
                <div>
                    <h2 className="font-bold text-lg mb-3 border-b pb-2">Certifications</h2>
                    <div className="space-y-2">
                        {resumeData.certifications.map((cert, index) => (
                            <div key={index}>
                                <div className="font-bold">{cert.name}</div>
                                <div className="text-gray-600 text-sm">{cert.issuer} | {cert.date}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {renderSkillsSection()}
            {renderHobbiesSection()}
        </div>
    </div>
);

const renderClassicLayout = () => (
    <div className="resume-content p-8 min-h-[297mm] bg-white relative" style={{ color: textColor.body }}>
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
            <div className="flex flex-wrap justify-center gap-4 mt-3 text-sm text-gray-500">
                {resumeData?.personal?.email && <span>{icons.email} {resumeData.personal.email}</span>}
                {resumeData?.personal?.phone && <span>{icons.phone} {resumeData.personal.phone}</span>}
                {resumeData?.personal?.location && <span>{icons.location} {resumeData.personal.location}</span>}
                {resumeData?.personal?.linkedin && <span>{icons.linkedin} {resumeData.personal.linkedin}</span>}
                {resumeData?.personal?.portfolio && <span>{icons.portfolio} {resumeData.personal.portfolio}</span>}
            </div>
        </motion.div>

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
                                {edu.field && (
                                    <p className="text-gray-700 text-sm">{edu.field}</p>
                                )}
                                {edu.cgpa && (
                                    <p className="text-gray-700 text-sm">CGPA: {edu.cgpa}</p>
                                )}
                                {edu.school && (
                                    <p className="text-gray-700 text-sm">School: {edu.school}</p>
                                )}
                                {edu.achievements && (
                                    <p className="text-gray-700 text-sm mt-1">Achievements: {edu.achievements}</p>
                                )}
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
                                        ) : project.title || 'Project Name'}
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
  <div className="resume-content bg-white text-gray-800 min-h-[297mm] p-10 font-sans">
    <Watermark
      templateId={resumeData?.template}
      unlockedTemplates={unlockedTemplates}
    />

    {/* Header */}
    <header className="text-center mb-8">
      <h1 className="text-3xl font-bold tracking-tight mb-1">
        {resumeData?.personal?.name || 'John Smith'}
      </h1>
      {resumeData?.personal?.title && (
        <p className="text-base text-gray-600">{resumeData.personal.title}</p>
      )}
    </header>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Sidebar */}
      <div className="space-y-6">
        {/* Contact */}
        <section>
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
            Contact
          </h2>
          <div className="space-y-2 text-sm">
            {renderContactItem(icons.email, resumeData?.personal?.email)}
            {renderContactItem(icons.phone, resumeData?.personal?.phone)}
            {renderContactItem(icons.location, resumeData?.personal?.location)}
            {renderContactItem(icons.linkedin, resumeData?.personal?.linkedin)}
            {renderContactItem(icons.github, resumeData?.personal?.github)}
            {renderContactItem(icons.website, resumeData?.personal?.website)}
          </div>
        </section>

        {/* Skills */}
          <section>
            <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
              Skills
            </h2>
            <div className="space-y-2 text-sm">
              {renderSkillsSection()}
            </div>
          </section>

        {/* Hobbies - Modified for consistency */}
          <section>
            <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
              {renderHobbiesSection()}
            </h2>
          </section>
      </div>

      {/* Main Content */}
      <div className="md:col-span-2 space-y-8">
        {/* About Me */}
        {resumeData?.personal?.summary && (
          <section>
            <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
              About Me
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {resumeData.personal.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {resumeData?.experience?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
              {resumeData.experience[0]?.isInternship ? 'Internship' : 'Experience'}
            </h2>
            <div className="space-y-4">
              {resumeData.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-base">{exp.position}</h3>
                      <p className="text-sm">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-600">{exp.duration}</span>
                  </div>
                  <ul className="list-disc list-inside text-sm text-gray-700 mt-1 space-y-1">
                    {exp.responsibilities?.split('•').filter(Boolean).map((point, i) => (
                      <li key={i}>{point.trim()}</li>
                    ))}
                  </ul>
                  {exp.technologies && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {renderTechnologyTags(exp.technologies)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Education */}
          {resumeData?.education?.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
                Education
              </h2>
              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-sm">{edu.degree}</h3>
                      <span className="text-xs text-gray-600">{edu.duration}</span>
                    </div>
                    <p className="text-sm">{edu.institution}</p>
                    <p className="text-xs text-gray-700">
                      {edu.field} {edu.cgpa && `| CGPA: ${edu.cgpa}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {resumeData?.projects?.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
                Projects
              </h2>
              <div className="space-y-4">
                {resumeData.projects.map((project, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-sm">
                        {project.link ? (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline"
                          >
                            {project.title}
                          </a>
                        ) : project.title}
                      </h3>
                      {project.category && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {project.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                    {project.technologies && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {renderTechnologyTags(project.technologies)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  </div>
);

const renderCreativeLayout = () => (
    <div className="resume-content p-8 min-h-[297mm] bg-gray-50 relative">
        <Watermark unlockedTemplates={unlockedTemplates} templateId={resumeData?.template} />
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
                <div className="bg-white p-6 rounded-xl shadow-lg mb-8 space-y-6" style={{ color: textColor.body }}>
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
                    <div className="bg-white p-6 rounded-xl shadow-lg" style={{ color: textColor.body }}>
                        <h2 className="font-bold text-xl mb-4 pb-2 border-b" style={{ borderColor: colors.primary }}>About Me</h2>
                        <p className="text-gray-700">{resumeData.personal.summary}</p>
                    </div>
                )}

                {resumeData?.experience?.length > 0 && (
                    <div className="bg-white p-6 rounded-xl shadow-lg" style={{ color: textColor.body }}>
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
                        <div className="bg-white p-6 rounded-xl shadow-lg" style={{ color: textColor.body }}>
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
                                            <p className="text-xs text-gray-700">
  {`${edu.field || 'Field of Study'}${edu.cgpa ? ` | CGPA: ${edu.cgpa}` : ''}`}
</p>

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
                        <div className="bg-white p-6 rounded-xl shadow-lg" style={{ color: textColor.body }}>
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
                                                ) : project.title || 'Project Name'}
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
        <Watermark unlockedTemplates={unlockedTemplates} templateId={resumeData?.template} />

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
            <div className="w-full" style={{ color: textColor.body }}>
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
        <main className="flex-1 p-6 space-y-8" style={{ color: textColor.body }}>
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

const renderProfessionalClassicLayout = () => (
  <div className="resume-content bg-white text-gray-800 min-h-[297mm] p-8 font-sans">
    <Watermark
      templateId={resumeData?.template}
      unlockedTemplates={unlockedTemplates}
    />

    {/* Header */}
    <header
      className="text-center mb-6 border-b pb-4"
      style={{ borderColor: colors.primary }}
    >
      <h1
        className="text-3xl font-bold tracking-tight mb-1"
        style={{ color: colors.primary }}
      >
        {resumeData?.personal?.name || "Your Name"}
      </h1>
      {resumeData?.personal?.title && (
        <p className="text-lg text-gray-600">{resumeData.personal.title}</p>
      )}
    </header>

    {/* Contact Info */}
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8 text-sm">
      {renderContactItem(icons.phone, resumeData?.personal?.phone)}
      {renderContactItem(icons.email, resumeData?.personal?.email)}
      {renderContactItem(icons.location, resumeData?.personal?.location)}
      {renderContactItem(icons.linkedin, resumeData?.personal?.linkedin)}
      {renderContactItem(icons.github, resumeData?.personal?.github)}
      {renderContactItem(icons.website, resumeData?.personal?.portfolio)}
    </div>

    {/* Two Column Layout */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* LEFT COLUMN */}
      <div className="md:col-span-2 space-y-6">
        {/* Summary */}
        {resumeData?.personal?.summary && (
          <section>
            <SectionHeader
              title="Summary"
              color={colors.primary}
            />
            <p className="text-gray-700 text-sm leading-relaxed">
              {resumeData.personal.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {resumeData?.experience?.length > 0 && (
          <section>
            <SectionHeader
              title={
                resumeData.experience[0]?.isInternship
                  ? "Internship"
                  : "Work Experience"
              }
              color={colors.primary}
            />
            <div className="space-y-5">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="font-semibold text-base"
                        style={{ color: colors.primary }}
                      >
                        {exp.position}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">
                          {exp.company}
                        </span>
                        {exp.link && (
                          <a
                            href={exp.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center"
                          >
                            <LinkIcon className="w-3 h-3 mr-1" />
                          </a>
                        )}
                      </div>
                    </div>
                    {exp.duration && (
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {exp.duration}
                      </span>
                    )}
                  </div>

                  {/* Responsibilities */}
                  {exp.responsibilities && (
                    <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1 pl-2">
                      {exp.responsibilities
                        .split("•")
                        .filter(Boolean)
                        .map((point, i) => (
                          <li key={i}>{point.trim()}</li>
                        ))}
                    </ul>
                  )}

                  {/* Technologies */}
                  {exp.technologies && (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-medium text-gray-600">
                        Technologies:
                      </span>
                      {renderTechnologyTags(exp.technologies)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {resumeData?.projects?.length > 0 && (
          <section>
            <SectionHeader title="Projects" color={colors.primary} />
            <div className="space-y-4">
              {resumeData.projects.map((project, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm">
                      {project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {project.title}
                        </a>
                      ) : (
                        project.title
                      )}
                    </h3>
                    {project.duration && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {project.duration}
                      </span>
                    )}
                  </div>

                  {project.category && (
                    <span className="block text-xs text-gray-500 mt-0.5">
                      {project.category}
                    </span>
                  )}

                  {project.description && (
                    <p className="text-xs text-gray-700 mt-1 text-left">
                      {project.description}
                    </p>
                  )}

                  {project.technologies && (
                    <div className="mt-2">
                      <span className="text-xs font-medium text-gray-600">
                        Technologies Used:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {renderTechnologyTags(project.technologies)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-6">
       {/* Skills */}
{(
  resumeData?.softSkills?.length > 0 ||
  resumeData?.programmingSkills?.length > 0 ||
  resumeData?.frameworks?.length > 0 ||
  resumeData?.languages?.length > 0 ||
  resumeData?.certifications?.length > 0
) && (
  <section>
    <SectionHeader title="Skills" color={colors.primary} />
    <div className="space-y-4 mt-3">
      
      {/* Soft Skills */}
      {resumeData?.softSkills?.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Soft Skills</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {resumeData.softSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-300 text-xs font-medium"
              >
                {getStringValue(skill)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Programming Skills */}
      {resumeData?.programmingSkills?.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Programming Skills</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {resumeData.programmingSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-300 text-xs font-medium"
              >
                {getStringValue(skill)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Frameworks */}
      {resumeData?.frameworks?.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Frameworks</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {resumeData.frameworks.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-300 text-xs font-medium"
              >
                {getStringValue(skill)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {resumeData?.languages?.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Languages</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {resumeData.languages.map((lang, idx) => {
              const langName = getStringValue(lang);
              return (
                <span
                  key={idx}
                  className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-300 text-xs font-medium"
                >
                  {langName}{lang.level ? ` (${lang.level})` : ''}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Certifications */}
      {resumeData?.certifications?.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Certifications</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {resumeData.certifications.map((cert, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-300 text-xs font-medium"
              >
                {getStringValue(cert)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </section>
)}

        {/* Education */}
        {resumeData?.education?.length > 0 && (
          <section>
            <SectionHeader title="Education" color={colors.primary} />
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-3">
                {edu.degree && (
                  <h3 className="font-semibold text-sm">{edu.degree}</h3>
                )}
                {edu.institution && (
                  <p className="text-sm" style={{ color: colors.primary }}>
                    {edu.institution}
                  </p>
                )}
                {edu.duration && (
                  <p className="text-xs text-gray-600">{edu.duration}</p>
                )}
                {(edu.field || edu.cgpa) && (
                  <p className="text-xs text-gray-700 mt-1">
                    {edu.field}{" "}
                    {edu.cgpa && (
                      <span className="ml-1">| CGPA: {edu.cgpa}</span>
                    )}
                  </p>
                )}
                {edu.school && (
                  <p className="text-gray-700 text-xs mt-1">
                    <span className="font-medium">High School:</span>{" "}
                    {typeof edu.school === "object"
                      ? edu.school.name
                      : edu.school}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}
        
{/* Interests */}
{resumeData?.hobbies?.length > 0 && (
  <section>
    <SectionHeader
      title="Interests"
      color={colors.primary}
    />
    <p className="text-gray-700 text-sm leading-relaxed">
      {resumeData.hobbies
        .map((hobby) => (typeof hobby === 'object' ? hobby.name : hobby))
        .join(', ')}
    </p>
  </section>
)}
      </div>
    </div>
  </div>
);


const renderModernTechLayout = () => (
  <div className="resume-content bg-white text-gray-800 min-h-[297mm] p-8 font-sans text-sm">
    <Watermark templateId={resumeData?.template} unlockedTemplates={unlockedTemplates} />

    {/* Centered Header */}
    <header className="text-center mb-6">
      <h1 className="text-xl font-bold uppercase mb-1" style={{ color: colors.primary }}>
        {resumeData?.personal?.name || 'Your Name'}
      </h1>
      {resumeData?.personal?.title && (
        <p className="text-sm text-gray-600">{resumeData.personal.title}</p>
      )}

      {/* Centered Contact Info */}
      <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs">
        {renderContactItem(icons.email, resumeData?.personal?.email)}
        {renderContactItem(icons.phone, resumeData?.personal?.phone)}
        {renderContactItem(icons.location, resumeData?.personal?.location)}
        {renderContactItem(icons.linkedin, resumeData?.personal?.linkedin)}
        {renderContactItem(icons.github, resumeData?.personal?.github)}
        {renderContactItem(icons.website, resumeData?.personal?.portfolio)}
      </div>
    </header>

    {/* One Column Layout */}
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Summary */}
      {resumeData?.personal?.summary && (
        <section>
          <CenteredSectionHeader title="Profile" color={colors.primary} />
          <hr className="border-t-2 mt-1 mb-3" style={{ borderColor: colors.primary }} />
          <p className="text-gray-700 text-xs leading-relaxed text-center">
            {resumeData.personal.summary}
          </p>
        </section>
      )}

      {/* Skills */}
{(
  resumeData?.softSkills?.length > 0 ||
  resumeData?.programmingSkills?.length > 0 ||
  resumeData?.frameworks?.length > 0 ||
  resumeData?.languages?.length > 0 ||
  resumeData?.certifications?.length > 0
) && (
  <section>
    {/* Main Skills Heading */}
    <CenteredSectionHeader title="Skills" color={colors.primary} />
    <hr className="border-t-2 mt-1 mb-4" style={{ borderColor: colors.primary }} />

    {/* 5 Column Layout for Subheadings */}
    <div className="grid grid-cols-5 gap-4 text-xs">
      {/* Soft Skills */}
      {resumeData?.softSkills?.length > 0 && (
        <div>
          <h3 className="font-semibold text-blue-600 mb-2">Soft Skills</h3>
          <div className="flex flex-col gap-1">
            {resumeData.softSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-300 text-center font-medium"
              >
                {getStringValue(skill)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Programming Skills */}
      {resumeData?.programmingSkills?.length > 0 && (
        <div>
          <h3 className="font-semibold text-blue-600 mb-2">Programming Skills</h3>
          <div className="flex flex-col gap-1">
            {resumeData.programmingSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-300 text-center font-medium"
              >
                {getStringValue(skill)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Frameworks */}
      {resumeData?.frameworks?.length > 0 && (
        <div>
          <h3 className="font-semibold text-blue-600 mb-2">Frameworks</h3>
          <div className="flex flex-col gap-1">
            {resumeData.frameworks.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-300 text-center font-medium"
              >
                {getStringValue(skill)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {resumeData?.languages?.length > 0 && (
        <div>
          <h3 className="font-semibold text-blue-600 mb-2">Languages</h3>
          <div className="flex flex-col gap-1">
            {resumeData.languages.map((lang, idx) => {
              const langName = getStringValue(lang);
              return (
                <span
                  key={idx}
                  className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-300 text-center font-medium"
                >
                  {langName}{lang.level ? ` (${lang.level})` : ''}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Certifications */}
      {resumeData?.certifications?.length > 0 && (
        <div>
          <h3 className="font-semibold text-blue-600 mb-2">Certifications</h3>
          <div className="flex flex-col gap-1">
            {resumeData.certifications.map((cert, idx) => {
              const certName = getStringValue(cert);
              return (
                <span
                  key={idx}
                  className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-300 text-center font-medium"
                >
                  {certName}{cert.issuer ? ` (${cert.issuer})` : ''}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  </section>
)}

      {/* Education */}
      {resumeData?.education?.length > 0 && (
        <section>
          <CenteredSectionHeader title="Education" color={colors.primary} />
          <hr className="border-t-2 mt-1 mb-3" style={{ borderColor: colors.primary }} />
          <div className="space-y-2 text-center text-xs">
            {resumeData.education.map((edu, index) => (
              <div key={index}>
                <h3 className="font-semibold">{edu.degree}</h3>
                <p style={{ color: colors.primary }}>{edu.institution}</p>
                <p className="text-[10px] text-gray-600">{edu.duration}</p>
                <p className="text-[10px] text-gray-700 mt-1">
                  {edu.field} {edu.cgpa && `| CGPA: ${edu.cgpa}`}
                </p>
                 {edu.school && (
  <p className="text-gray-700 text-sm mt-1">
    <span className="font-medium">High School:</span>{" "}
    {typeof edu.school === "object" ? edu.school.name : edu.school}
  </p>
)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {resumeData?.experience?.length > 0 && (
        <section>
          <CenteredSectionHeader
            title={resumeData.experience[0]?.isInternship ? 'Internship Experience' : 'Work Experience'}
            color={colors.primary}
          />
          <hr className="border-t-2 mt-1 mb-3" style={{ borderColor: colors.primary }} />
          <div className="space-y-5">
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="text-center text-xs">
                <div className="flex flex-col items-center mb-1.5">
                  <h3 className="font-semibold" style={{ color: colors.primary }}>
                    {exp.position}
                  </h3>
                  <div className="flex items-center gap-1 flex-wrap justify-center font-medium">
                    <span>{exp.company}</span>
                    {exp.link && (
                      <a href={exp.link} className="text-blue-600 hover:underline flex items-center">
                        <LinkIcon className="w-3 h-3 mr-1" />
                      </a>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded mt-0.5">
                    {exp.duration}
                  </span>
                </div>

                <div className="mt-1.5 text-left">
                  {exp.responsibilities && (
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      {exp.responsibilities.split('•').filter(Boolean).map((point, i) => (
                        <li key={i}>{point.trim()}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {exp.technologies && (
                  <div className="mt-2 flex flex-wrap justify-center gap-1">
                    {renderTechnologyTags(exp.technologies)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

 {resumeData?.projects?.length > 0 && (
  <section>
    <CenteredSectionHeader title="Projects" color={colors.primary} />
    <hr
      className="border-t-2 mt-1 mb-3"
      style={{ borderColor: colors.primary }}
    />
    <div className="space-y-3">
      {resumeData.projects.map((project, index) => (
        <div key={index} className="text-xs text-center">
          {/* Title + Duration */}
          <div className="flex justify-between items-center mb-0.5">
            <h3 className="font-semibold text-gray-900 w-full">
              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {project.title}
                </a>
              ) : (
                project.title
              )}
            </h3>

            {project.duration && (
              <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
                {project.duration}
              </span>
            )}
          </div>

          {/* Category */}
          {project.category && (
            <span className="block text-[10px] text-gray-500 mb-0.5">
              {project.category}
            </span>
          )}

          {/* Description */}
          {project.description && (
            <p className="text-[10px] text-gray-700 leading-snug mb-1 text-left">
              {project.description}
            </p>
          )}

          {/* Technologies */}
          {project.technologies && (
            <div>
              <p className="text-[10px] font-medium text-gray-600 mb-0.5">
                Technologies Used:
              </p>
              <div className="flex flex-wrap justify-center gap-1">
                {renderTechnologyTags(project.technologies)}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </section>
)}
{/* Hobbies */}
{resumeData?.hobbies?.length > 0 && (
  <section>
    <CenteredSectionHeader title="Interests" color={colors.primary} />
    <hr className="border-t-2 mt-1 mb-3" style={{ borderColor: colors.primary }} />

    <div className="flex flex-wrap justify-center gap-2">
      {resumeData.hobbies.map((hobby, index) => (
        <span
          key={index}
          className="px-3 py-1 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-300"
        >
          {typeof hobby === 'object' ? hobby.name : hobby}
        </span>
      ))}
    </div>
  </section>
)}

    </div>
  </div>
);

// Centered Header Component for Modern Tech
const CenteredSectionHeader = ({ title, color }) => (
  <h2 className="text-lg font-semibold uppercase tracking-wide mb-4 text-center" 
      style={{ color }}>
    {title}
  </h2>
);

// Regular Header Component for Professional Classic
const SectionHeader = ({ title, color }) => (
  <h2 className="text-lg font-semibold uppercase tracking-wide mb-3 pb-1 border-b" 
      style={{ borderColor: color }}>
    {title}
  </h2>
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
        <div className="resume-content">
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

    {/* Main Download Button */}
    <div className="mt-4 flex flex-wrap justify-center gap-3">
      <button
        onClick={() => handleDownloadClick()}  
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

    {/* Save Status Message */}
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

    {/* Watermark Detection Modal */}
    {showWatermarkModal && (
      <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl transform transition-all">
          <div className="text-center mb-5">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-50 p-3 rounded-full">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-10 w-10 text-blue-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                  />
                </svg>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              Watermark Detected
            </h3>
            
            <p className="text-gray-600">
              This template includes a watermark preview.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            {/* Download with Watermark */}
            <button 
              onClick={() => handleDownloadClick(true)} // bypass unlock check
              style={{
                backgroundColor: '#e5e7eb',
                color: '#1f2937',
              }}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Download with Watermark
            </button>
            
            {/* Remove Watermark */}
            <button 
              onClick={() => {
                setShowWatermarkModal(false);
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: 'smooth'
                });
              }}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              Remove Watermark
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Cancel */}
          <div className="mt-4 text-center">
            <button 
              onClick={() => setShowWatermarkModal(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
});

export default Preview;

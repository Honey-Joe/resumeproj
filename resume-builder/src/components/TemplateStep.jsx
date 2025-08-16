import React, { useState, useEffect, useRef} from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useCookies } from "react-cookie";

// Layout components (unchanged)
const ClassicLayout = ({ children }) => (
  <div className="flex h-full gap-3">
    <div className="w-1/3 border-r border-gray-200 pr-2">
      {children.filter(child => child.props.section === 'sidebar')}
    </div>
    <div className="w-2/3">{children.filter(child => child.props.section === 'main')}</div>
  </div>
);

const SidebarLayout = ({ children }) => (
  <div className="flex h-full gap-3">
    <div className="w-1/4 bg-gray-50 p-2">{children.filter(child => child.props.section === 'sidebar')}</div>
    <div className="w-3/4">{children.filter(child => child.props.section === 'main')}</div>
  </div>
);

const CreativeLayout = ({ children }) => (
  <div className="h-full">
    <div className="pb-1 mb-1 border-b border-gray-200">
      {children.filter(child => child.props.section === 'header')}
    </div>
    <div className="grid grid-cols-2 gap-1">{children.filter(child => child.props.section === 'main')}</div>
  </div>
);

const TemplateStep = ({ resumeData, updateResumeData }) => {
  const templates = [
    { id: 'blue', name: 'Modern Blue', description: 'Tech & Business', type: 'theme', price: 50 },
    { id: 'green', name: 'Eco Green', description: 'Environment & Health', type: 'theme', price: 50 },
    { id: 'red', name: 'Bold Red', description: 'Sales & Leadership', type: 'theme', price: 50 },
    { id: 'teal', name: 'Professional Teal', description: 'Finance & Consulting', type: 'theme', price: 50 },
    { id: 'elegant-white', name: 'Elegant White', description: 'Executive & Professional', type: 'theme', price: 50 },
    { id: 'minimal', name: 'Minimalist', description: 'Classic & Formal', type: 'layout', price: 50 },
    { id: 'classic', name: 'Classic Layout', description: 'Traditional half box', type: 'layout', price: 50 },
    { id: 'sidebar', name: 'Column Layout', description: 'Modern with column ', type: 'layout', price: 50 },
    { id: 'creative', name: 'Creative Layout', description: 'Unique design for creatives', type: 'layout', price: 50 },
    { id: 'compact', name: 'Compact Layout', description: 'Design for compact resumes', type: 'layout', price: 50 },
    { id: 'professional-classic', name: 'Professional Classic', description: 'Professional and normal', type: 'theme', price: 50 },
    { id: 'modern-tech', name: 'Modern Tech', description: 'Center and Unique', type: 'theme', price: 50 }
  ];

  const [unlockedTemplates, setUnlockedTemplates] = useState([]);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(resumeData.template || null);
  const [filter, setFilter] = useState('all');
  const [cookies] = useCookies(['userData']);
  const userEmail = cookies.userData?.email || "";
  const userName = cookies.userData?.name || "";
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const successPopupRef = useRef(null);  // Add ref for the popup
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false);

   useEffect(() => {
    if (shouldScrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setShouldScrollToTop(false);
    }
  }, [shouldScrollToTop]);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          setIsRazorpayLoaded(true);
          resolve();
        };
        script.onerror = () => {
          console.error('Razorpay script failed to load');
          resolve();
        };
        document.body.appendChild(script);
      });
    };

    if (!isRazorpayLoaded) {
      loadRazorpay();
    }
  }, [isRazorpayLoaded]);

  // Fetch unlocked templates
  const fetchUnlockedTemplates = async () => {
    if (!userEmail) return;

    try {
      const res = await fetch(
        `https://apiresumebbuilder.freewilltech.in/get_unlocked_templates.php?email=${userEmail}`,
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer adminsecret",
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      if (data.status === "success") {
        setUnlockedTemplates(data.templates);
      } else {
        console.error("Server error:", data.message);
      }
    } catch (err) {
      console.error("Failed to fetch unlocked templates:", err);
    }
  };

  // Fetch on mount and when email changes
  useEffect(() => {
    fetchUnlockedTemplates();
  }, [userEmail]);

  // Template Selection
  const selectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    updateResumeData({ template: templateId });
  };

  // Razorpay Payment Handler
  const handlePayment = async () => {
    if (!selectedTemplate) {
      alert("Please select a template before proceeding to payment.");
      return;
    }

    if (!userEmail) {
      alert("User email is missing. Please log in again.");
      return;
    }

    setPaymentProcessing(true);

    try {
      // Step 1: Create Razorpay order on backend
      const response = await fetch("https://apiresumebbuilder.freewilltech.in/create_order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          templateId: selectedTemplate,
          email: userEmail,
        }),
      });

      const text = await response.text();

      if (!text) {
        throw new Error("❌ Empty response from server");
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("❌ Invalid JSON from server: " + text);
      }

      if (data.status !== "success" || !data.order_id) {
        throw new Error("❌ Order creation failed: " + (data.message || "Unknown error"));
      }

      // Step 2: Razorpay Payment
      const options = {
        key: "rzp_live_UwaASm36jyEsg4",
        amount: 5000, // 50 INR
        currency: 'INR',
        name: 'FREE WILL TECHNOLOGIES',
        description: 'Remove watermark from resume',
        order_id: data.order_id,
        handler: async (response) => {
          try {
            // Step 3: Verify Payment with Backend
            const verifyRes = await axios.post('https://apiresumebbuilder.freewilltech.in/verify-payment.php', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              templateId: selectedTemplate,
              email: userEmail,
            });

            const verifyData = verifyRes.data;

           if (verifyData?.status === 'success') {
      setShowSuccessPopup(true);
      setUnlockedTemplates(prev => [...prev, { name: template.id }]);
      await fetchUnlockedTemplates();
      
      // Scroll to the success popup after a short delay
      setTimeout(() => {
        if (successPopupRef.current) {
          successPopupRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 300);
    } else {
              const message = verifyData?.message || "Verification failed";
              alert("❌ Payment verification failed: " + message);
            }
          } catch (err) {
            console.error("❌ Error verifying payment:", err);
            alert("❌ Payment verification request failed.");
          }
        },
        prefill: {
          name: userName || "Resume User",
          email: userEmail,
        },
        theme: {
          color: '#6366F1',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("❌ Payment initiation failed:", err);
      alert("❌ Payment initiation failed: " + err.message);
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Function to determine text color based on background
  const getTextColor = (bgColor) => {
    if (!bgColor) return '#000000';
    
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const rgb = hexToRgb(bgColor);
    if (!rgb) return '#000000';
    
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  // Function to generate preview designs
  const renderPreview = (templateId, colors) => {
    const textColor = getTextColor(colors.primary);
    const isLightText = textColor === '#FFFFFF';
    const contrastColor = isLightText ? '#FFFFFF' : '#000000';
    
    switch(templateId) {
   case 'blue':
  return (
    <>
      {/* Top bar - full width */}
      <div
        className="absolute top-3 left-0 w-full h-2"
        style={{ background: colors.primary }}
      ></div>

      {/* White background for all content below top bar */}
      <div
        className="absolute top-3 left-0 w-full h-full"
        style={{ background: 'white' }}
      ></div>

      {/* Left vertical sidebar line */}
      <div
        className="absolute top-3 left-0 h-full w-3"
        style={{ background: colors.primary }}
      ></div>

      {/* Decorative lines near the top of the sidebar */}
      <div
        className="absolute top-5 left-4 w-6 h-0.5"
        style={{ background: colors.secondary, opacity: 0.9 }}
      ></div>
      <div
        className="absolute top-8 left-4 w-4 h-0.5"
        style={{ background: colors.secondary, opacity: 0.7 }}
      ></div>
      <div
        className="absolute top-11 left-4 w-3 h-0.5"
        style={{ background: colors.secondary, opacity: 0.5 }}
      ></div>
    </>
  );


      
     case 'green':
   return (
    <>
      {/* Top Left - Tall Card */}
      <div className="absolute top-0 left-0 w-1/3 h-2/3 p-2">
        <div
          className="w-full h-full rounded-lg shadow-lg"
          style={{ background: contrastColor, opacity: 0.85 }}
        ></div>
      </div>

      {/* Top Right - Wide Card */}
      <div className="absolute top-0 left-1/3 w-2/3 h-1/3 p-2">
        <div
          className="w-full h-full rounded-lg shadow-lg bg-white"
        ></div>
      </div>

      {/* Middle Right - Square Card */}
      <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 p-2">
        <div
          className="w-full h-full rounded-lg shadow-lg"
          style={{ background: colors.accent, opacity: 0.85 }}
        ></div>
      </div>

      {/* Bottom - Full Width Card */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 p-2">
        <div
          className="w-full h-full rounded-lg shadow-lg bg-white"
        ></div>
      </div>
    </>
  );

      
   case 'red':
  return (
    <>
      {/* Top bar - full width */}
      <div
        className="absolute top-0 left-0 w-full h-2"
        style={{ background: colors.primary }}
      ></div>

      {/* White section below top bar, split into two columns */}
      <div className="absolute top-2 left-0 w-full h-full flex">
        {/* Left column */}
        <div className="w-1/2 bg-white border-r border-gray-200"></div>

        {/* Right column */}
        <div className="w-1/2 bg-white"></div>
      </div>

      {/* Small decorative bar under top bar */}
      <div
        className="absolute top-4 left-3 w-6 h-1 rounded-full"
        style={{ background: contrastColor }}
      ></div>

      {/* Bottom bar - full width */}
      <div
        className="absolute bottom-0 left-0 w-full h-2"
        style={{ background: colors.primary }}
      ></div>
    </>
  );

      
      case 'teal':
        return (
          <>
            <div className="absolute top-0 left-0 w-1/3 h-full" 
                 style={{ background: colors.primary }}></div>
            <div className="absolute top-0 left-1/3 w-1/3 h-full" 
                 style={{ background: colors.secondary }}></div>
            <div className="absolute top-3 left-1/6 w-1 h-3 rounded-sm" 
                 style={{ background: contrastColor }}></div>
          </>
        );
      
      case 'elegant-white':
        return (
          <>
            <div className="absolute inset-0 bg-white rounded-sm">
              <div className="absolute top-0 left-0 right-0 h-3 bg-gray-200"></div>
              <div className="absolute top-4 left-1 right-1">
                <div className="flex justify-between">
                  <div className="w-8 h-1 bg-blue-400"></div>
                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </>
        );
      
      case 'minimal':
        return (
          <>
            <div className="absolute top-3 left-3 right-3 h-0.5 rounded-full" 
                 style={{ background: '#334155' }}></div>
            <div className="absolute top-5 left-3 w-8 h-0.5 rounded-full" 
                 style={{ background: '#334155' }}></div>
          </>
        );
      
case 'classic':
  return (
    <>
      {/* Background */}
      <div className="absolute inset-0 bg-white rounded-sm shadow-sm"></div>

      {/* Left vertical small lines */}
      <div
        className="absolute top-3 left-2 h-4 w-px"
        style={{ background: 'black' }}
      ></div>
      <div
        className="absolute top-8 left-2 h-5 w-px"
        style={{ background: 'black' }}
      ></div>
      <div
        className="absolute top-9 left-2 h-1 w-px"
        style={{ background: 'black' }}
      ></div>

      {/* Top horizontal small lines */}
      <div
        className="absolute top-2 left-3 w-10 h-px"
        style={{ background: 'black' }}
      ></div>
      <div
        className="absolute top-8 left-3 w-10 h-px"
        style={{ background: 'black' }}
      ></div>
      <div
        className="absolute top-2 left-32 w-10 h-px"
        style={{ background: 'black' }}
      ></div>
    </>
  );




     case 'sidebar':
  return (
    <>
      {/* Full white background */}
      <div className="absolute inset-0 bg-white rounded-sm shadow-sm"></div>

      {/* Vertical divider in the middle (2 columns) */}
      <div
        className="absolute top-4 bottom-4 left-1/2 w-px bg-black"
      ></div>

      {/* Top horizontal line inside each column */}
      <div
        className="absolute top-8 left-2 w-4 h-px bg-black"
      ></div>
      <div
        className="absolute top-8 left-8 w-4 h-px bg-black"
      ></div>
    </>
  );

      
     case 'creative':
  return (
    <>
      {/* Row 1 - Two cards */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 p-2">
        <div
          className="w-full h-full rounded-sm shadow-md"
          style={{ background: contrastColor, opacity: 0.85 }}
        ></div>
      </div>

      <div className="absolute top-0 left-1/2 w-1/2 h-1/2 p-2">
        <div
          className="w-full h-full rounded-sm shadow-md bg-white"
        ></div>
      </div>

      {/* Row 2 - Two cards */}
      <div className="absolute top-1/2 left-0 w-1/2 h-1/2 p-2">
        <div
          className="w-full h-full rounded-sm shadow-md bg-white"
        ></div>
      </div>

      <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 p-2">
        <div
          className="w-full h-full rounded-sm shadow-md"
          style={{ background: colors.accent, opacity: 0.85 }}
        ></div>
      </div>
    </>
  );


      case 'compact':
  return (
    <>
      <div
        className="absolute top-0 left-0 h-full w-40"
        style={{ background: colors.primary }}
      ></div>

      <div
        className="absolute top-4 left-4 w-10 h-0.5 rounded-sm"
        style={{ background: contrastColor }}
      ></div>
      <div
        className="absolute top-6 left-4 w-8 h-0.5 rounded-sm"
        style={{ background: contrastColor, opacity: 0.7 }}
      ></div>
    </>
  );

case 'professional-classic':
  return (
    <>
      <div className="absolute inset-0 bg-white rounded-sm shadow-sm">

        {/* Top primary bar */}
        <div
          className="absolute top-0 left-0 right-0 h-2"
          style={{ background: colors.primary }}
        ></div>

        {/* Vertical divider (starts after bar) */}
        <div
          className="absolute top-2.5 bottom-0 left-1/2 w-0.5"
          style={{ background: 'black', opacity: 0.7 }}
        ></div>

        {/* Small horizontal line in left column */}
        <div
          className="absolute top-8 left-1 w-1/3 h-0.5"
          style={{ background: 'black', opacity: 0.6 }}
        ></div>

        {/* Small horizontal line in right column */}
        <div
          className="absolute top-8 left-9 w-1/3 h-0.5"
          style={{ background: 'black', opacity: 0.6 }}
        ></div>
      </div>
    </>
  );

      
    case 'modern-tech':
  return (
    <>
      <div className="absolute inset-0 bg-white rounded-sm shadow-sm">
        
        <div
          className="absolute top-4 left-4 right-4 h-0.5 rounded-sm"
          style={{ background: colors.primary, opacity: 0.8 }}
        ></div>
        <div
          className="absolute top-1/2 left-4 right-4 h-0.5 rounded-sm"
          style={{ background: colors.secondary, opacity: 0.8 }}
        ></div>
        <div
          className="absolute bottom-4 left-4 right-4 h-0.5 rounded-sm"
          style={{ background: colors.accent, opacity: 0.8 }}
        ></div>
      </div>
    </>
  );
      
      default:
        return (
          <>
            <div className="absolute top-0 left-0 w-full h-2" 
                 style={{ background: colors.primary }}></div>
            <div className="absolute top-3 left-2 w-5 h-0.5 rounded-sm" 
                 style={{ background: contrastColor }}></div>
          </>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 relative">
      {showSuccessPopup && (
        <motion.div
        ref={successPopupRef}
          className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center p-4 overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
    <motion.div
      className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-2xl p-10 max-w-xl w-full border-2 border-indigo-600 shadow-2xl relative overflow-hidden"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-purple-500 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-32 h-32 rounded-full bg-blue-500 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 text-center">
        <motion.div 
          className="w-28 h-28 mx-auto mb-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 0.5 }}
        >
          <motion.i 
            className="fas fa-check text-white text-5xl"
            animate={{ scale: [0.8, 1.2, 1] }}
            transition={{ 
              duration: 0.5,
              times: [0, 0.5, 1],
              repeat: Infinity,
              repeatDelay: 2
            }}
          ></motion.i>
        </motion.div>
        
        <h3 className="text-3xl font-bold text-green-400 mb-4 tracking-tight">
          Watermark Successfully Removed!
        </h3>
        
        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
          Your resume now looks completely professional without any watermark. 
          You can download it anytime from your dashboard.
        </p>
        
        <button
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg text-lg"
          onClick={() => window.location.reload()}
        >
          Refresh Page to See Changes
        </button>
        
        <p className="text-slate-500 mt-6 flex items-center justify-center gap-2">
          <i className="fas fa-sync-alt animate-spin"></i>
          Changes will appear after refresh
        </p>
      </div>
    </motion.div>
  </motion.div>
)}

      <motion.h3 
        className="text-xl font-bold mb-4 text-slate-200 flex items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <i className="fas fa-palette text-indigo-400 mr-2"></i>
        Choose Your Template
      </motion.h3>

      <motion.p 
        className="text-sm text-slate-400 mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Select a template that matches your industry. All templates are free to use with watermark.
      </motion.p>

      {/* Template Type Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          className={`px-3 py-1 text-xs rounded-full font-medium ${
            filter === 'all' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
          onClick={() => setFilter('all')}
        >
          All Templates
        </button>
        <button 
          className={`px-3 py-1 text-xs rounded-full font-medium ${
            filter === 'theme' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
          onClick={() => setFilter('theme')}
        >
          Themes
        </button>
        <button 
          className={`px-3 py-1 text-xs rounded-full font-medium ${
            filter === 'layout' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
          onClick={() => setFilter('layout')}
        >
          Layouts
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {templates
          .filter(template => filter === 'all' || template.type === filter)
          .map((template, index) => {
          const colors = getTemplateColor(template.id);
          const isSelected = selectedTemplate === template.id;
          const isLayout = template.type === 'layout';
          const isUnlocked = unlockedTemplates.includes(template.id);
          
          return (
            <div className="relative" key={template.id}>
              {isSelected && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
                    <i className="fas fa-check text-white text-xs"></i>
                  </div>
                </div>
              )}
              
              {isUnlocked && (
                <div className="absolute top-1 left-1 z-10">
                  <div className="bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center">
                    <i className="fas fa-unlock text-white text-[10px]"></i>
                  </div>
                </div>
              )}
              
              <motion.div
                className={`p-3 rounded-lg border cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/50 bg-indigo-900/30'
                    : 'border-slate-600 bg-slate-800/50 hover:bg-slate-700/50'
                }`}
                onClick={() => selectTemplate(template.id)}
                whileHover={{ y: -3 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div
                      className="relative w-14 h-16 rounded overflow-hidden shadow-sm"
                      style={{
                        background: isLayout 
                          ? colors.secondary
                          : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                        border: template.id === 'minimal' 
                          ? `1px solid ${colors.primary}`
                          : 'none'
                      }}
                    >
                      <div className="absolute inset-0 pointer-events-none">
                        {renderPreview(template.id, colors)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <h4 className="font-bold text-sm text-slate-200">
                        {template.name}
                      </h4>
                      <span 
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          template.type === 'theme' 
                            ? 'bg-indigo-500/20 text-indigo-300' 
                            : 'bg-purple-500/20 text-purple-300'
                        }`}
                      >
                        {template.type === 'theme' ? 'Theme' : 'Layout'}
                      </span>
                    </div>
                    
                    <p className="text-xs text-slate-400 mt-1">
                      {template.description}
                    </p>
                    
                    <div className="mt-2 flex items-center">
                      <span className="text-xs text-slate-500 mr-1">Colors:</span>
                      <div className="flex space-x-1">
                        <div 
                          className="w-4 h-4 rounded-full border border-slate-600" 
                          style={{ backgroundColor: colors.primary }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

    {/* Watermark payment section */}
      {selectedTemplate && (
        <motion.div className="mt-6 p-4 bg-indigo-900/30 rounded-lg border border-indigo-700">
          <div className="flex flex-col xm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-medium text-base text-slate-200">
                {/* Improved verification logic */}
                {unlockedTemplates.includes(selectedTemplate) 
                  ? "✅ Watermark Removed" 
                  : "Remove Watermark"}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {unlockedTemplates.includes(selectedTemplate) 
                  ? "Your resume has no watermark"
                  : "Pay ₹50 to remove watermark"}
              </p>
            </div>
      
      {unlockedTemplates.includes(selectedTemplate) ? (
        <span className="text-green-400 font-medium flex items-center">
          <i className="fas fa-check-circle mr-2"></i>
          Watermark Removed
        </span>
      ) : (
        <button
          className={`py-2 px-5 rounded-md text-white font-medium text-sm flex items-center justify-center ${
            paymentProcessing ? 'bg-slate-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          onClick={handlePayment}
          disabled={paymentProcessing || !isRazorpayLoaded}
        >
          {paymentProcessing ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i> Processing...
            </>
          ) : (
            "Pay ₹50 to Remove Watermark"
          )}
        </button>
      )}
    </div>
  </motion.div>
)}
    </div>
  );
};

// Layout selector for resume rendering
export const ResumeLayout = ({ template, children }) => {
  switch(template) {
    case 'classic':
      return <ClassicLayout>{children}</ClassicLayout>;
    case 'sidebar':
      return <SidebarLayout>{children}</SidebarLayout>;
    case 'creative':
      return <CreativeLayout>{children}</CreativeLayout>;
    default:
      return <div className="h-full">{children}</div>;
  }
};

// Section wrapper for layout organization
export const ResumeSection = ({ section, children }) => (
  <div data-section={section}>{children}</div>
);

// Enhanced color definitions
const getTemplateColor = (templateId) => {
  switch (templateId) {
    case 'blue':
      return { 
        primary: '#1e40af', 
        secondary: '#3b82f6',
        accent: '#60a5fa'
      };
    case 'green':
      return { 
        primary: '#065f46', 
        secondary: '#059669',
        accent: '#34d399'
      };
    case 'elegant-white':
      return { 
        primary: '#f8fafc', 
        secondary: '#f1f5f9',
        accent: '#e2e8f0'
      };
    case 'red':
      return { 
        primary: '#9d174d', 
        secondary: '#db2777',
        accent: '#ec4899'
      };
    case 'teal':
      return { 
        primary: '#0f766e', 
        secondary: '#14b8a6',
        accent: '#2dd4bf'
      };
    case 'minimal':
      return { 
        primary: '#e2e8f0', 
        secondary: '#f1f5f9',
        accent: '#cbd5e1'
      };
    case 'classic':
      return { 
        primary: '#1e293b', 
        secondary: '#334155',
        accent: '#475569'
      };
    case 'sidebar':
      return { 
        primary: '#0f172a', 
        secondary: '#1e293b',
        accent: '#334155'
      };
    case 'creative':
      return { 
        primary: '#4c1d95', 
        secondary: '#5b21b6',
        accent: '#7e22ce'
      };
    case 'compact':
      return {
        primary: '#334155', 
        secondary: '#475569',
        accent: '#64748b'
      };
   case 'professional-classic':
  return { 
    primary: '#1E3A8A',   
    secondary: '#FBBF24', 
    accent: '#FCD34D'     
  };

case 'modern-tech':
  return { 
    primary: '#1E40AF',   
    secondary: '#3B82F6', 
    accent: '#06B6D4'     
  };
    default:
      return { 
        primary: '#1e40af', 
        secondary: '#3b82f6',
        accent: '#60a5fa'
      };
  }
};

export default TemplateStep;
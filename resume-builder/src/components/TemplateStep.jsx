import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
// adjust the path as needed


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
    { id: 'dark-pro', name: 'Professional Dark', description: 'Executive & Technical', type: 'theme', price: 50 },
    { id: 'minimal', name: 'Minimalist', description: 'Classic & Formal', type: 'layout', price: 50 },
    { id: 'classic', name: 'Classic Layout', description: 'Traditional two-column', type: 'layout', price: 50 },
    { id: 'sidebar', name: 'Sidebar Layout', description: 'Modern with profile sidebar', type: 'layout', price: 50 },
    { id: 'creative', name: 'Creative Layout', description: 'Unique design for creatives', type: 'layout', price: 50 },
    { id: 'compact', name: 'Compact Layout', description: 'design for compact', type: 'layout', price: 50 }
  ];

  const [unlockedTemplates, setUnlockedTemplates] = useState([]);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [filter, setFilter] = useState('all');
  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName");

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
    if (!resumeData?.personal?.email) return;

    try {
      const res = await fetch(`http://apiresumebbuilder.freewilltech.in/get_unlocked_templates.php?email=${userEmail}`);
      const data = await res.json();
      if (data.status === "success") {
        setUnlockedTemplates(data.templates);
      }
    } catch (err) {
      console.error("Failed to fetch unlocked templates:", err);
    }
  };

  // Fetch on mount and when email changes
  useEffect(() => {
    fetchUnlockedTemplates();
  }, [resumeData?.personal?.email]);

  // Template Selection
  const selectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    updateResumeData({ template: templateId });
  };

  // Razorpay Payment Handler - FIXED
 const handlePayment = async () => {
  if (!selectedTemplate) return;



  // 🔐 Require login
  if (!userEmail || !userName) {
    alert("You must log in or complete your profile before purchasing a template.");
    return;
  }

  setPaymentProcessing(true);
    try {
      // Create order with email
      const response = await fetch("http://apiresumebbuilder.freewilltech.in/create_order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          templateId: selectedTemplate,
          email: userEmail
        }),
      });

      const text = await response.text();
      if (!text) throw new Error("Empty response from server");

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON from server: " + text);
      }

      if (data.status !== "success") {
        throw new Error("Order creation failed: " + (data.message || "Unknown error"));
      }

      const options = {
        key: "rzp_live_UwaASm36jyEsg4", // Replace for dev mode
        amount: 5000, // ₹50 in paisa
        currency: 'INR',
        name: 'FREE WILL TECHNOLOGIES',
        description: 'Remove watermark from resume',
        order_id: data.order_id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post('http://apiresumebbuilder.freewilltech.in/verify-payment.php', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              templateId: selectedTemplate,
              email: userEmail,
            });
            console.log(verifyRes)

            if (verifyRes.data.status === 'success') {
              // Refresh unlocked templates from server
              await fetchUnlockedTemplates();
              // Force UI update
              setSelectedTemplate(selectedTemplate); 
            } else {
              alert('Payment verification failed: ' + verifyRes.data.message);
            }
          } catch (err) {
            console.error(err);
            alert('Payment verification request failed');
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: '#6366F1',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert('Payment initiation failed: ' + err.message);
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
            <div className="absolute top-0 left-0 right-0 h-2 rounded-t" 
                 style={{ background: colors.primary }}></div>
            <div className="absolute top-3 left-1 w-6 h-0.5 rounded-sm" 
                 style={{ background: contrastColor, opacity: 0.9 }}></div>
            <div className="absolute top-4 left-1 w-4 h-0.5 rounded-sm" 
                 style={{ background: contrastColor, opacity: 0.7 }}></div>
            <div className="absolute top-5 left-1 w-3 h-0.5 rounded-sm" 
                 style={{ background: contrastColor, opacity: 0.5 }}></div>
          </>
        );
      
      case 'green':
        return (
          <>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full"
                   style={{ 
                     background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary} 50%, ${colors.secondary} 50%, ${colors.secondary} 100%)`,
                   }}></div>
            </div>
            <div className="absolute top-3 left-3 w-2 h-2 rounded-full" 
                 style={{ background: contrastColor }}></div>
            <div className="absolute top-5 left-3 w-3 h-1 rounded-sm" 
                 style={{ background: contrastColor, opacity: 0.8 }}></div>
          </>
        );
      
      case 'red':
        return (
          <>
            <div className="absolute top-0 left-0 w-full h-4" 
                 style={{ background: colors.primary }}></div>
            <div className="absolute top-4 left-3 w-6 h-1 rounded-full" 
                 style={{ background: contrastColor }}></div>
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
      
      case 'dark-pro':
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-sm">
              <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-blue-900 to-gray-800"></div>
              <div className="absolute top-4 left-1 right-1">
                <div className="flex justify-between">
                  <div className="w-8 h-1 bg-blue-300"></div>
                  <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
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
            <div className="absolute top-0 left-0 w-1/3 h-full" 
                 style={{ background: contrastColor, opacity: 0.6 }}></div>
            <div className="absolute top-2 left-1 w-2/3 h-0.5 rounded-sm" 
                 style={{ background: colors.accent, opacity: 0.8 }}></div>
          </>
        );
      
      case 'sidebar':
        return (
          <>
            <div className="absolute top-0 left-0 w-1/4 h-full rounded-l-sm" 
                 style={{ background: contrastColor, opacity: 0.8 }}></div>
            <div className="absolute top-2 left-1 w-2/3 h-0.5 rounded-sm" 
                 style={{ background: colors.accent, opacity: 0.6 }}></div>
          </>
        );
      
      case 'creative':
        return (
          <>
            <div className="absolute top-0 left-0 right-0 h-1/4 rounded-t-sm" 
                 style={{ background: contrastColor, opacity: 0.8 }}></div>
            <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 rounded-sm" 
                 style={{ background: colors.accent, opacity: 0.8 }}></div>
          </>
        );

      case 'professional':
        return (
          <>
            <div className="absolute top-0 left-0 w-1/4 h-full" 
                 style={{ background: colors.primary }}></div>
            <div className="absolute top-3 left-1/4 ml-2 w-8 h-1 rounded-sm" 
                 style={{ background: contrastColor }}></div>
          </>
        );
      
      case 'vibrant':
        return (
          <>
            <div className="absolute top-0 left-0 right-0 h-3" 
                 style={{ background: colors.primary }}></div>
            <div className="absolute top-4 left-2 w-5 h-5 rounded-full" 
                 style={{ background: colors.secondary }}></div>
          </>
        );
      
      case 'elegant':
        return (
          <>
            <div className="absolute top-0 left-0 w-full h-2" 
                 style={{ background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}></div>
            <div className="absolute top-4 left-2 w-10 h-0.5 rounded-sm" 
                 style={{ background: contrastColor }}></div>
          </>
        );
      
      case 'compact':
        return (
          <>
            <div className="absolute top-0 left-0 w-full h-1" 
                 style={{ background: colors.primary }}></div>
            <div className="absolute top-2 left-1 w-6 h-0.5 rounded-sm" 
                 style={{ background: contrastColor }}></div>
            <div className="absolute top-3 left-1 w-4 h-0.5 rounded-sm" 
                 style={{ background: contrastColor, opacity: 0.7 }}></div>
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
    <div className="max-w-4xl mx-auto px-3">
      <motion.h3 
        className="text-xl font-bold mb-4 text-gray-800 flex items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <i className="fas fa-palette text-indigo-500 mr-2"></i>
        Choose Your Template
      </motion.h3>

      <motion.p 
        className="text-sm text-gray-600 mb-5"
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
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setFilter('all')}
        >
          All Templates
        </button>
        <button 
          className={`px-3 py-1 text-xs rounded-full font-medium ${
            filter === 'theme' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setFilter('theme')}
        >
          Themes
        </button>
        <button 
          className={`px-3 py-1 text-xs rounded-full font-medium ${
            filter === 'layout' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
          
          return (
            <div className="relative" key={template.id}>
              {isSelected && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
                    <i className="fas fa-check text-white text-xs"></i>
                  </div>
                </div>
              )}
              
              <motion.div
                className={`p-3 rounded-lg border cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-300 bg-indigo-50'
                    : 'border-gray-200 bg-white'
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
                      <h4 className="font-bold text-sm">
                        {template.name}
                      </h4>
                      <span 
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          template.type === 'theme' 
                            ? 'bg-indigo-100 text-indigo-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {template.type === 'theme' ? 'Theme' : 'Layout'}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-600 mt-1">
                      {template.description}
                    </p>
                    
                    <div className="mt-2 flex items-center">
                      <span className="text-xs text-gray-500 mr-1">Colors:</span>
                      <div className="flex space-x-1">
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-200" 
                          style={{ backgroundColor: colors.primary }}
                        ></div>
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-200" 
                          style={{ backgroundColor: colors.secondary }}
                        ></div>
                        {colors.accent && (
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-200" 
                            style={{ backgroundColor: colors.accent }}
                          ></div>
                        )}
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
        <motion.div 
          className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-medium text-base text-gray-800">
                {unlockedTemplates.includes(selectedTemplate) 
                  ? "Watermark Removed" 
                  : "Remove Watermark"}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {unlockedTemplates.includes(selectedTemplate) 
                  ? "Your resume will export without watermark"
                  : "Pay ₹50 to remove watermark from exports"}
              </p>
            </div>
            
            {unlockedTemplates.includes(selectedTemplate) ? (
              <span className="text-green-600 font-medium flex items-center">
                <i className="fas fa-check-circle mr-2"></i>
                Watermark Removed
              </span>
            ) : (
              <button
                className={`py-2 px-5 rounded-md text-white font-medium text-sm flex items-center justify-center ${
                  paymentProcessing ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
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
    case 'dark-pro':
      return { 
        primary: '#111827', 
        secondary: '#1f2937',
        accent: '#3b82f6'
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
      }
    default:
      return { 
        primary: '#1e40af', 
        secondary: '#3b82f6',
        accent: '#60a5fa'
      };
  }
};

export default TemplateStep;
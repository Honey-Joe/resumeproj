// src/components/Features.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaRegClone, FaPalette, FaCloudDownloadAlt } from 'react-icons/fa';

const FeatureCard = ({ IconComponent, title, description, delay, color }) => (
  <motion.div
    className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-800/70 to-blue-900/50 backdrop-blur-sm border border-blue-500/30 shadow-xl relative overflow-hidden"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{
      y: -8,
      boxShadow: "0 25px 50px -12px rgba(2, 132, 199, 0.3)",
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }}
    viewport={{ once: true }}
  >
    {/* Gradient border effect */}
    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-2xl blur-sm z-0"></div>
    
    <div className="relative z-10">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${color}`}>
        <IconComponent className="text-white text-xl md:text-2xl" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-blue-200 text-base leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const Features = () => {
  const features = [
    {
      IconComponent: FaRegClone,
      title: "Multi-Template Preview",
      description: "Instantly preview your resume across different professional templates before choosing the final one.",
      color: "bg-gradient-to-br from-sky-500 to-blue-700"
    },
    {
      IconComponent: FaPalette,
      title: "Professional Templates",
      description: "Choose from 9+ ATS-friendly templates designed by hiring professionals to showcase your experience effectively.",
      color: "bg-gradient-to-br from-orange-500 to-amber-500"
    },
    {
      IconComponent: FaCloudDownloadAlt,
      title: "One-Click Export",
      description: "Download as PDF with best Quality Perfect for email applications and online profiles.",
      color: "bg-gradient-to-br from-cyan-500 to-blue-600"
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 overflow-hidden bg-gradient-to-br from-slate-900 to-blue-900 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        {/* Floating grid pattern */}
        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[length:40px_40px]"></div>
        
        {/* Animated blobs */}
        <motion.div 
          className="absolute top-1/4 right-[15%] w-64 h-64 md:w-80 md:h-80 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-[80px] md:blur-[100px] opacity-15"
          animate={{
            scale: [1, 1.1, 1],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-[20%] left-[20%] w-60 h-60 md:w-72 md:h-72 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full blur-[70px] md:blur-[90px] opacity-15"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Resume Features</span>
          </motion.h2>
          
          <motion.p
            className="text-lg text-blue-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Everything you need to create a resume that gets you interviews
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              IconComponent={feature.IconComponent}
              title={feature.title}
              description={feature.description}
              delay={0.2 + index * 0.1}
              color={feature.color}
            />
          ))}
        </div>

        {/* Additional feature highlights */}
        <motion.div 
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          {[
            "ATS Optimization",
            "Real-time Preview",
            "Unlimited Revisions",
            "Mobile-Friendly"
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center p-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span className="text-blue-200 font-medium">{item}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
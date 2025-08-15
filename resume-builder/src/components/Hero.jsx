// src/components/Hero.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Hero = ({ onStartBuilding }) => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['userToken']);
  const [loginMessage, setLoginMessage] = useState('');

  const handleBuildClick = () => {
    const isLoggedIn = !!cookies.userToken;

    if (isLoggedIn) {
      onStartBuilding();
    } else {
      setLoginMessage('You must log in before building your resume');
      setTimeout(() => setLoginMessage(''), 3000);
      navigate('/AuthPage');
    }
  };

  const scrollToExamples = () => {
    const section = document.getElementById('examples');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <section id="hero" className="relative py-16 md:py-28 bg-gradient-to-br from-slate-900 to-blue-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        {/* Floating grid pattern */}
        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[length:40px_40px]"></div>
        
        {/* Animated blobs */}
        <motion.div 
          className="absolute top-1/4 left-[15%] w-64 h-64 md:w-96 md:h-96 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-[80px] md:blur-[100px] opacity-15"
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
          className="absolute top-1/3 right-[10%] w-60 h-60 md:w-80 md:h-80 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full blur-[70px] md:blur-[90px] opacity-15"
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
        
        <motion.div 
          className="absolute bottom-[15%] left-[35%] w-56 h-56 md:w-72 md:h-72 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-[60px] md:blur-[80px] opacity-15"
          animate={{
            scale: [1, 1.15, 1],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="lg:w-1/2 text-center lg:text-left">
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 md:mb-6 text-white"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Craft Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Professional Resume</span> in Minutes
            </motion.h1>
            
            <motion.p 
  className="text-lg md:text-xl text-blue-100 mb-8 md:mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.2 }}
>
  Stand out with beautifully designed templates, real-time previews, and expert content guidance. Make your resume shine. <br />
  <span className="text-orange-400 font-semibold">Must login before building your perfect resume.</span>
</motion.p>

            
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4">
              <motion.button onClick={handleBuildClick}
                className="px-6 py-3 md:px-8 md:py-4 rounded-xl text-base md:text-lg font-semibold text-white shadow-xl group relative overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ 
                  scale: 1.05,
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:from-cyan-600 group-hover:to-blue-700 transition-all duration-300"></div>
                <div className="absolute inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Start Building Now
                </div>
              </motion.button>
              
              <motion.button onClick={scrollToExamples}
                className="px-6 py-3 md:px-8 md:py-4 rounded-xl text-base md:text-lg font-semibold bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-sm border border-orange-400/30 text-white hover:bg-gradient-to-r hover:from-orange-500/30 hover:to-amber-500/30 transition-all duration-300 shadow-xl"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                whileHover={{ 
                  scale: 1.05,
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  View Samples
                </div>
              </motion.button>
            </div>
            
            <motion.div 
              className="mt-8 md:mt-10 flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="flex items-center text-blue-200 text-sm md:text-base">
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Beautiful Templates
              </div>
              <div className="flex items-center text-blue-200 text-sm md:text-base">
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                PDF Export
              </div>
              <div className="flex items-center text-blue-200 text-sm md:text-base">
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                ATS Optimized
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="lg:w-1/2 mt-10 md:mt-12 lg:mt-0 relative w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="relative bg-gradient-to-br from-slate-800 to-blue-900/80 border border-blue-500/30 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-sm">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-2xl blur-sm z-0"></div>
              <div className="relative z-10">
                <div className="flex gap-2 mb-3 md:mb-4">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-amber-400"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-emerald-400"></div>
                </div>
                
                {/* Detailed Resume Sample */}
                <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg border border-slate-700/50 p-4 md:p-6 font-sans">
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl mr-3 md:mr-4">
                      JD
                    </div>
                    <div>
                      <div className="text-lg md:text-xl font-bold text-white">John Doe</div>
                      <div className="text-cyan-400 text-sm md:text-base">Senior Product Designer</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm mb-4">
                    <div className="flex items-center">
                      <svg className="w-3 h-3 md:w-4 md:h-4 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      <span className="text-blue-200">john.doe@example.com</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-3 h-3 md:w-4 md:h-4 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      <span className="text-blue-200">(123) 456-7890</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-3 h-3 md:w-4 md:h-4 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span className="text-blue-200">San Francisco, CA</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-3 h-3 md:w-4 md:h-4 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                      </svg>
                      <span className="text-blue-200">linkedin.com/in/johndoe</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-700/50 pt-3 mb-3">
                    <div className="text-cyan-400 font-semibold text-sm mb-2">PROFESSIONAL SUMMARY</div>
                    <p className="text-blue-200 text-xs md:text-sm mb-4">
                      Creative product designer with 8+ years of experience crafting user-centered digital products. 
                      Passionate about solving complex problems through intuitive interfaces and elegant design systems.
                    </p>
                  </div>
                  
                  <div className="border-t border-slate-700/50 pt-3 mb-3">
                    <div className="text-cyan-400 font-semibold text-sm mb-2">EXPERIENCE</div>
                    <div className="mb-2">
                      <div className="flex justify-between">
                        <div className="text-white font-medium text-sm md:text-base">Senior Product Designer</div>
                        <div className="text-blue-200 text-xs md:text-sm">2020 - Present</div>
                      </div>
                      <div className="text-cyan-400 text-xs md:text-sm">TechCorp Inc., San Francisco</div>
                      <ul className="mt-1 ml-4 list-disc text-blue-200 text-xs md:text-sm">
                        <li>Led redesign of flagship SaaS product</li>
                        <li>Increased user engagement by 42%</li>
                      </ul>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between">
                        <div className="text-white font-medium text-sm md:text-base">UI/UX Designer</div>
                        <div className="text-blue-200 text-xs md:text-sm">2018 - 2020</div>
                      </div>
                      <div className="text-cyan-400 text-xs md:text-sm">Creative Studio, New York</div>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-700/50 pt-3">
                    <div className="text-cyan-400 font-semibold text-sm mb-2">SKILLS</div>
                    <div className="flex flex-wrap gap-2">
                      <div className="px-2 py-1 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 text-cyan-400 text-xs rounded-full">
                        UI/UX Design
                      </div>
                      <div className="px-2 py-1 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 text-cyan-400 text-xs rounded-full">
                        Prototyping
                      </div>
                      <div className="px-2 py-1 bg-gradient-to-r from-orange-500/15 to-amber-500/15 text-amber-400 text-xs rounded-full">
                        User Research
                      </div>
                      <div className="px-2 py-1 bg-gradient-to-r from-orange-500/15 to-amber-500/15 text-amber-400 text-xs rounded-full">
                        Figma
                      </div>
                      <div className="px-2 py-1 bg-gradient-to-r from-blue-500/15 to-indigo-500/15 text-indigo-300 text-xs rounded-full">
                        HTML/CSS
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <motion.div 
              className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg shadow-lg font-medium text-xs md:text-sm"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              Professional Design!
            </motion.div>
          </motion.div>
        </div>
        
        {/* Features Section */}
       <motion.div
  className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.9 }}
>
  {/* Feature 1 */}
  <div className="bg-gradient-to-br from-slate-800/50 to-blue-900/30 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex flex-col items-center text-center">
    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4">
      <svg
        className="w-7 h-7 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        ></path>
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">Professional Templates</h3>
  </div>

  {/* Feature 2 */}
  <div className="bg-gradient-to-br from-slate-800/50 to-blue-900/30 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex flex-col items-center text-center">
    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-4">
      <svg
        className="w-7 h-7 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        ></path>
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">Easy PDF Export</h3>
  </div>

  {/* Feature 3 */}
  <div className="bg-gradient-to-br from-slate-800/50 to-blue-900/30 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex flex-col items-center text-center">
    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4">
      <svg
        className="w-7 h-7 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        ></path>
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">ATS Optimized</h3>
  </div>
</motion.div>
</div>
      
      {/* Floating scroll indicator */}
   <motion.div 
  className="absolute bottom-6 left-[40%] md:left-[48%] transform -translate-x-1/2 flex flex-col items-center text-blue-300 z-20"
  animate={{ y: [0, 6, 0] }}
  transition={{ duration: 2, repeat: Infinity }}
>
  <span className="text-xs mb-2">Scroll to explore</span>
  <svg 
    className="w-4 h-2 sm:w-4 sm:h-2 animate-bounce" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M19 14l-7 7m0 0l-7-7m7 7V3"
    />
  </svg>
</motion.div>
    </section>
  );
};

export default Hero;
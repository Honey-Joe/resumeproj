import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-slate-900 to-blue-900 text-white py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <motion.div 
              className="flex items-center justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500 mr-3">
                <img 
                  src="https://ik.imagekit.io/HoneyJoe/freewill%20technologies%20assetss/logo.jpg?updatedAt=1745004056813"
                  alt="FWT Logo" 
                  className="w-full h-full object-contain bg-white p-1"
                />
              </div>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-300">
                FreeWill Resume Builder
              </h3>
            </motion.div>
            
            <motion.div
              className="mt-4 text-center md:text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.a
                href="mailto:support@freewilltech.in"
                className="text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-envelope mr-2"></i>
                support@freewilltech.in
              </motion.a>
            </motion.div>
          </div>
          
          <div className="flex space-x-1">
            <motion.a 
              href="#" 
              className="text-2xl text-blue-300 hover:text-amber-400 transition-colors"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.9 }}
            >
    
            </motion.a>
            <motion.a 
              href="#" 
              className="text-2xl text-blue-300 hover:text-amber-400 transition-colors"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.9 }}
            >
            </motion.a>
            <motion.a 
              href="https://www.instagram.com/freewill_tech?igsh=MW95b2J0Ym56dWRwcw==" 
              className="text-2xl text-blue-300 hover:text-amber-400 transition-colors"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="fab fa-instagram"></i>
            </motion.a>
            <motion.a 
              href="https://www.linkedin.com/in/freewilltech?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
              className="text-2xl text-blue-300 hover:text-amber-400 transition-colors"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="fab fa-linkedin"></i>
            </motion.a>
          </div>
        </div>
        
       <div className="mt-6 pt-6 text-center border-t border-blue-700 shadow-[0_-1px_0_0_rgba(96,165,250,0.4)]">
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5 }}
  >
    <p className="text-blue-400 text-sm md:text-base">
      &copy; 2025 FWT Resume Builder. All rights reserved.
    </p>
    <p className="text-blue-500 text-xs mt-2">
      Designed by FreeWillTech
    </p>
  </motion.div>
</div>

      </div>
    </footer>
  );
};

export default Footer;

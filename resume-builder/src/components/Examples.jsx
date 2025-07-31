// src/components/Examples.jsx
import React from 'react';
import { motion } from 'framer-motion';

const exampleData = [
  {
    id: 1,
    templateTitle: 'Modern Tech',
    description: 'For developers & engineers',
    gradient: 'from-cyan-500 to-blue-600',
    delay: 0,
    resume: {
      name: 'Johnathan Davis',
      title: 'Senior Software Engineer',
      contact: [
        { icon: 'fas fa-envelope', text: 'john.davis@example.com' },
        { icon: 'fas fa-phone', text: '(415) 555-0123' },
        { icon: 'fab fa-linkedin', text: 'linkedin.com/in/jdavis' }
      ],
      summary: 'Full-stack developer with 8+ years building scalable web applications. Specialized in React ecosystem and cloud infrastructure.',
      experience: [
        {
          role: 'Lead Frontend Developer',
          company: 'Tech Innovations Inc.',
          period: '2020 - Present',
          description: 'Led migration to React ecosystem, reducing load times by 40%.'
        },
        {
          role: 'Software Engineer',
          company: 'Digital Solutions LLC',
          period: '2017 - 2020',
          description: 'Developed RESTful APIs and real-time features using WebSockets.'
        }
      ],
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'GraphQL']
    }
  },
  {
    id: 2,
    templateTitle: 'Creative Design',
    description: 'For designers & artists',
    gradient: 'from-orange-500 to-amber-500',
    delay: 0.1,
    resume: {
      name: 'Emma Rodriguez',
      title: 'UX/UI Designer',
      contact: [
        { icon: 'fas fa-envelope', text: 'emma.rodriguez@example.com' },
        { icon: 'fas fa-phone', text: '(347) 555-9876' },
        { icon: 'fab fa-behance', text: 'behance.net/emmar_design' }
      ],
      summary: 'Award-winning designer with 6 years creating intuitive user interfaces for Fortune 500 companies.',
      experience: [
        {
          role: 'Senior Product Designer',
          company: 'Creative Minds Co.',
          period: '2019 - Present',
          description: 'Redesigned flagship product increasing engagement by 35%.'
        },
        {
          role: 'UI Designer',
          company: 'Visionary Studios',
          period: '2017 - 2019',
          description: 'Created wireframes for apps with 1M+ downloads.'
        }
      ],
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems']
    }
  },
  {
    id: 3,
    templateTitle: 'Executive',
    description: 'For leadership roles',
    gradient: 'from-blue-600 to-indigo-700',
    delay: 0.2,
    resume: {
      name: 'Michael Chen',
      title: 'Operations Director',
      contact: [
        { icon: 'fas fa-envelope', text: 'michael.chen@example.com' },
        { icon: 'fas fa-phone', text: '(212) 555-4567' },
        { icon: 'fab fa-linkedin', text: 'linkedin.com/in/mchen-exec' }
      ],
      summary: 'Strategic leader with 12+ years scaling operations for tech companies.',
      experience: [
        {
          role: 'Director of Operations',
          company: 'Global Enterprises Inc.',
          period: '2018 - Present',
          description: 'Managed $15M budget and led team of 50+.'
        },
        {
          role: 'Senior Operations Manager',
          company: 'Strategic Solutions Group',
          period: '2014 - 2018',
          description: 'Oversaw international expansion into 3 markets.'
        }
      ],
      skills: ['Strategic Planning', 'Budget Management', 'Team Leadership']
    }
  }
];

const Examples = () => {
  return (
    <section id="examples" className="py-16 md:py-24 overflow-hidden bg-gradient-to-br from-slate-900 to-blue-900 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        {/* Floating grid pattern */}
        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[length:40px_40px]"></div>
        
        {/* Animated blobs */}
        <motion.div 
          className="absolute top-1/3 left-[10%] w-64 h-64 md:w-80 md:h-80 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-[80px] md:blur-[100px] opacity-15"
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
          className="absolute bottom-[20%] right-[15%] w-60 h-60 md:w-72 md:h-72 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full blur-[70px] md:blur-[90px] opacity-15"
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Resume Samples</span>
          </motion.h2>
          
          <motion.p
            className="text-lg text-blue-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            See how professionals present their experience with our templates
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {exampleData.map((example) => (
            <motion.div
              key={example.id}
              className="relative rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: example.delay }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
            >
              {/* Gradient border effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-2xl blur-sm z-0"></div>
              
              <div className="relative bg-gradient-to-br from-slate-800/70 to-blue-900/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-5 sm:p-6 z-10 h-full flex flex-col">
                {/* Template header */}
                <div className={`py-3 px-4 rounded-lg mb-4 bg-gradient-to-r ${example.gradient}`}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-bold text-sm sm:text-base">{example.templateTitle}</h3>
                    <span className="text-blue-100 text-xs bg-blue-900/30 px-2 py-1 rounded-full">
                      {example.description}
                    </span>
                  </div>
                </div>
                
                {/* Compact Resume content */}
                <div className="flex-grow flex flex-col">
                  {/* Name and Title */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-white">{example.resume.name}</h3>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-orange-400 to-orange-300 mx-auto my-2 rounded-full"></div>
                    <p className="text-orange-400 font-medium text-sm">{example.resume.title}</p>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="mb-4 bg-slate-800/40 rounded-lg p-3">
                    <div className="space-y-1">
                      {example.resume.contact.map((contact, index) => (
                        <div key={index} className="flex items-start">
                          <i className={`${contact.icon} text-cyan-400 mt-0.5 mr-2 text-xs w-4`}></i>
                          <span className="text-blue-200 text-xs sm:text-sm">{contact.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Summary */}
                  <div className="mb-4">
                    <h4 className="text-cyan-400 text-xs font-bold mb-1 uppercase tracking-wider">Summary</h4>
                    <p className="text-blue-200 text-xs sm:text-sm">{example.resume.summary}</p>
                  </div>
                  
                  {/* Experience */}
                  <div className="mb-4 flex-grow">
                    <h4 className="text-cyan-400 text-xs font-bold mb-2 uppercase tracking-wider">Experience</h4>
                    <div className="space-y-3">
                      {example.resume.experience.map((exp, index) => (
                        <div key={index} className="relative pl-3 border-l border-blue-500/30">
                          <div className="absolute -left-1.5 top-1 w-2 h-2 rounded-full bg-orange-400"></div>
                          <div className="flex justify-between flex-wrap">
                            <span className="font-bold text-white text-sm">{exp.role}</span>
                            <span className="text-orange-400 text-xs font-medium">{exp.period}</span>
                          </div>
                          <p className="text-cyan-400 text-xs font-medium">{exp.company}</p>
                          <p className="text-blue-200 text-xs mt-1">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Skills */}
                  <div>
                    <h4 className="text-cyan-400 text-xs font-bold mb-2 uppercase tracking-wider">Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {example.resume.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 text-xs bg-gradient-to-br from-slate-700/50 to-slate-800/70 text-blue-200 rounded border border-blue-500/30"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-12 md:mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
        </motion.div>
      </div>
    </section>
  );
};

export default Examples;
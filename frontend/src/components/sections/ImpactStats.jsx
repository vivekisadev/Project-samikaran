import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedCounter = ({ text, className }) => {
  const nodeRef = useRef(null);

  useEffect(() => {
    if (!text) return;
    const rawVal = text.toString();
    const numericPart = parseInt(rawVal.replace(/[^0-9]/g, ''), 10) || 0;
    // Extract non-numeric characters (like + or k)
    const suffixPart = rawVal.replace(/[0-9.,]/g, '');

    const obj = { val: 0 };

    let ctx = gsap.context(() => {
      // Zoom effect
      gsap.fromTo(nodeRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: nodeRef.current,
            start: "top 90%"
          }
        }
      );

      // Number count up effect
      gsap.to(obj, {
        val: numericPart,
        duration: 2.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: nodeRef.current,
          start: "top 90%"
        },
        onUpdate: () => {
          if (nodeRef.current) {
            let currentVal = Math.round(obj.val);
            let displayVal = currentVal >= 1000 ? currentVal.toLocaleString() : currentVal;
            if (rawVal.toLowerCase().includes('k')) {
                displayVal = currentVal;
            }
            nodeRef.current.innerHTML = `${displayVal}<span>${suffixPart}</span>`;
          }
        }
      });
    });
    return () => ctx.revert();
  }, [text]);

  return <span ref={nodeRef} className={`inline-block transform-origin-bottom ${className || ''}`}>{text}</span>;
};

const ImpactStats = ({ stats }) => {
  return (
    <section className="py-24 md:py-32 bg-[#FAF9F6] relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tight"
          >
            OUR <span className="text-[#5C6B38]">IMPACT</span> IN ACTION
          </motion.h2>
        </div>

        <div className="flex flex-col md:flex-row items-center">
        
        {/* Left Column - Stats */}
        <div className="w-full md:w-1/3 flex flex-col space-y-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-6xl md:text-7xl font-black text-[#5C6B38] tracking-tight">
              <AnimatedCounter text={stats?.studentsReached || '1,650+'} />
            </h3>
            <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase mt-3">STUDENTS REACHED</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-6xl md:text-7xl font-black text-[#5C6B38] tracking-tight">
              <AnimatedCounter text={stats?.institutions || '14+'} />
            </h3>
            <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase mt-3">INSTITUTIONS</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-6xl md:text-7xl font-black text-[#5C6B38] tracking-tight">
              <AnimatedCounter text={stats?.workshops || '20+'} />
            </h3>
            <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase mt-3">WORKSHOPS CONDUCTED</p>
          </motion.div>
        </div>

        {/* Right Column - Graph & Cards */}
        <div className="w-full md:w-2/3 relative h-[400px] md:h-[500px] mt-20 md:mt-0">
           
           {/* SVG Wavy Line Background Element (Optional blur behind line) */}
           <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#F0F4F8] to-transparent opacity-50 blur-3xl rounded-full transform scale-110"></div>

           {/* Wavy Line SVG */}
           <svg viewBox="0 0 600 400" className="w-full h-full absolute inset-0 z-0 drop-shadow-xl" preserveAspectRatio="xMidYMid meet">
             <defs>
               <linearGradient id="lineGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#6366F1" /> {/* Indigo */}
                 <stop offset="100%" stopColor="#D946EF" /> {/* Fuchsia */}
               </linearGradient>
               <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                 <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                 <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                 </feMerge>
               </filter>
             </defs>
             {/* The curve from bottom-left to top-right */}
             <motion.path 
               initial={{ pathLength: 0, opacity: 0 }}
               whileInView={{ pathLength: 1, opacity: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 1.5, ease: "easeInOut" }}
               d="M 100 300 C 250 300, 250 150, 400 150 C 450 150, 500 100, 550 50" 
               fill="none" 
               stroke="url(#lineGrad)" 
               strokeWidth="8" 
               strokeLinecap="round" 
               filter="url(#glow)" 
             />
           </svg>

           {/* Cards positioned absolutely over the line */}
           
           {/* Card 1: Active Nodes (Dark Card) */}
           <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="absolute top-[40%] left-[20%] transform -translate-y-1/2 bg-[#282B38] rounded-xl p-4 md:p-5 shadow-2xl flex items-center space-x-4 z-10 min-w-[180px]"
           >
              <div className="w-10 h-10 rounded-full bg-[#3D382E] flex items-center justify-center">
                 {/* Lightning bolt icon */}
                 <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd"/></svg>
              </div>
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">ACTIVE NODES</p>
                <p className="text-white font-black text-xl leading-none tracking-tight">1,240</p>
              </div>
           </motion.div>

           {/* Card 2: Growth Rate */}
           <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 }}
              className="absolute top-[10%] right-[5%] md:right-[15%] bg-white rounded-xl p-4 md:p-5 shadow-2xl flex items-center space-x-4 z-10 min-w-[180px]"
           >
              <div className="w-10 h-10 rounded-full bg-[#E8F8F2] flex items-center justify-center">
                 {/* Upward trend arrow icon */}
                 <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">GROWTH RATE</p>
                <p className="text-gray-900 font-black text-xl leading-none tracking-tight">+124%</p>
              </div>
           </motion.div>

           {/* Card 3: Impact Score */}
           <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2 }}
              className="absolute bottom-[15%] right-[10%] md:right-[20%] bg-white rounded-xl p-4 md:p-5 shadow-2xl flex items-center space-x-4 z-10 min-w-[180px]"
           >
              <div className="w-10 h-10 rounded-full bg-[#EFF4FF] flex items-center justify-center">
                 {/* Target/Bullseye icon */}
                 <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3m3 3a3 3 0 003-3m-3 3v-3m0-3V4m0 0L9 7m3-3l3 3" /></svg>
              </div>
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">IMPACT SCORE</p>
                <p className="text-gray-900 font-black text-xl leading-none tracking-tight">98/100</p>
              </div>
           </motion.div>

        </div>
      </div>
      </div>
    </section>
  );
};

export default ImpactStats;

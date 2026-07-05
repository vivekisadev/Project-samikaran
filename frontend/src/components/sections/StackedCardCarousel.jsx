import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';

const Card = ({ item, index, progress, total }) => {
  // We use strict mathematical breakpoints mapping scroll progress from 0 to 1
  const step = 1 / total;
  
  // Define absolute breakpoint progress values for this specific card
  const bp0 = (index - 2) * step;
  const bp1 = (index - 1) * step;
  const bp2 = index * step;
  const bp3 = index * step + step * 0.6; // Hold for 60% of its active step
  const bp4 = (index + 1) * step;

  const breakpoints = [bp0, bp1, bp2, bp3, bp4];
  const isLast = index === total - 1;

  // Scale: 
  // - Starts at 0.85 when 2 steps behind
  // - Grows to 0.95 when 1 step behind
  // - Snaps to 1.0 when at front
  // - Stays 1.0 while holding and leaving
  const scaleValues = [0.85, 0.95, 1.0, 1.0, 1.0];
  
  // Y-Offset:
  // - 80px down when 2 steps behind
  // - 40px down when 1 step behind
  // - 0px (perfect center) when at front
  // - 0px (perfect center) while holding
  // - Shoots up to -100% when leaving (UNLESS it's the last card)
  const yValues = ["80px", "40px", "0px", "0px", isLast ? "0px" : "-100%"];
  
  // Opacity:
  // - Fully opaque while in stack and at front
  // - Fades to 0 when leaving (UNLESS it's the last card)
  const opacityValues = [1, 1, 1, 1, isLast ? 1 : 0];

  const scale = useTransform(progress, breakpoints, scaleValues);
  const y = useTransform(progress, breakpoints, yValues);
  const opacity = useTransform(progress, breakpoints, opacityValues);

  return (
    <motion.div
      style={{
        scale,
        y,
        opacity,
        zIndex: total - index, 
        transformOrigin: "top center",
      }}
      className="absolute top-0 w-full max-w-5xl h-[60vh] md:h-[70vh] bg-white rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)] flex flex-col md:flex-row will-change-transform"
    >
      <div className="w-full md:w-2/3 h-1/2 md:h-full relative overflow-hidden group">
        <img 
          src={item.mainImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&auto=format&fit=crop'} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute top-6 left-6 bg-primary text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
          {item.type || 'Media'}
        </div>
      </div>
      <div className="w-full md:w-1/3 p-6 md:p-12 flex flex-col justify-center bg-gray-50 border-l border-gray-100 relative">
        <h3 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{item.title}</h3>
        <p className="text-gray-600 mb-8 leading-relaxed line-clamp-4">
          {item.description}
        </p>
        
        {item.date && (
          <div className="flex items-center gap-3 mb-8 text-sm font-semibold text-gray-500">
            <Calendar size={18} className="text-primary" />
            {new Date(item.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
          </div>
        )}

        <button className="mt-auto flex items-center justify-between w-full py-4 px-6 rounded-xl bg-white border border-gray-200 text-gray-900 font-bold group hover:border-primary hover:text-primary transition-all shadow-sm">
          View Gallery 
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

const StackedCardCarousel = ({ items = [], onImageClick }) => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Buttery smooth physics mirroring Framer's default
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (!items || items.length === 0) return null;

  return (
    <div 
      ref={containerRef} 
      // Height matches the exact number of segments we need.
      style={{ height: `${items.length * 100}vh` }} 
      className="relative w-full bg-primary"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden z-[100] bg-primary">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-20 left-10 opacity-30">
          <svg width="60" height="100" viewBox="0 0 40 60" fill="none">
             {[...Array(15)].map((_, i) => (
                <circle key={i} cx={5 + (i%3)*15} cy={5 + Math.floor(i/3)*15} r="2.5" fill="#FBBF24"/>
             ))}
          </svg>
        </div>
        <div className="absolute bottom-20 right-10 opacity-30">
          <svg width="60" height="100" viewBox="0 0 40 60" fill="none">
             {[...Array(15)].map((_, i) => (
                <circle key={i} cx={5 + (i%3)*15} cy={5 + Math.floor(i/3)*15} r="2.5" fill="#FBBF24"/>
             ))}
          </svg>
        </div>

        {/* Section Header */}
        <div className="absolute top-12 left-0 w-full text-center px-4 z-10">
          <div className="text-yellow-400 font-black uppercase tracking-[0.3em] text-xs mb-3 block">
            Our Playbook
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Moments That Define Us
          </h2>
        </div>

        {/* Stacked Cards Container */}
        <div className="relative w-full max-w-5xl h-[60vh] md:h-[70vh] mt-24 px-4 flex justify-center">
          {items.map((item, index) => (
            <Card 
              key={item._id || index} 
              item={item} 
              index={index} 
              progress={smoothProgress} 
              total={items.length} 
            />
          ))}
        </div>
        
        <div className="absolute bottom-8 left-0 w-full text-center z-10">
          <p className="text-white/50 text-sm font-medium tracking-wide">
            Scroll down to explore
          </p>
        </div>
      </div>
    </div>
  );
};

export default StackedCardCarousel;

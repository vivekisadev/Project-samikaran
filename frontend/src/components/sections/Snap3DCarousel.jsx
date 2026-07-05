
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';

const Snap3DCarousel = ({ items = [], onImageClick }) => {
  const safeItems = items || [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play logic
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      if (safeItems.length === 0) return;
      setActiveIndex((current) => (current + 1) % safeItems.length);
    }, 2000); // Change slide every 2 seconds
    
    return () => clearInterval(interval);
  }, [safeItems.length, isHovered]);

  const handleNext = () => {
    if (safeItems.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % safeItems.length);
  };

  const handlePrev = () => {
    if (safeItems.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + safeItems.length) % safeItems.length);
  };

  const getCardStyle = (index) => {
    // Calculate shortest distance in a circular array
    let distance = index - activeIndex;
    if (distance > safeItems.length / 2) distance -= safeItems.length;
    if (distance < -safeItems.length / 2) distance += safeItems.length;

    const absDistance = Math.abs(distance);
    
    // Base styles for the active card
    let scale = 1;
    let opacity = 1;
    let x = 0;
    let zIndex = 50;
    
    // Landscape dimensions for center card
    const centerWidth = 600;
    const centerHeight = 400;

    if (absDistance === 0) {
      // Center
      scale = 1;
      opacity = 1;
      x = 0;
      zIndex = 50;
    } else if (absDistance === 1) {
      // 1st neighbor
      scale = 0.65;
      opacity = 0.8;
      x = distance > 0 ? 320 : -320;
      zIndex = 40;
    } else if (absDistance === 2) {
      // 2nd neighbor
      scale = 0.45;
      opacity = 0.5;
      x = distance > 0 ? 500 : -500;
      zIndex = 30;
    } else if (absDistance === 3) {
      // 3rd neighbor
      scale = 0.3;
      opacity = 0.3;
      x = distance > 0 ? 620 : -620;
      zIndex = 20;
    } else {
      // Hidden
      scale = 0;
      opacity = 0;
      x = distance > 0 ? 700 : -700;
      zIndex = 10;
    }

    return {
      scale,
      opacity,
      x,
      zIndex,
      width: centerWidth,
      height: centerHeight
    };
  };

  const activeItem = safeItems.length > 0 ? safeItems[activeIndex] : null;

  return (
    <div 
      className="relative w-full overflow-hidden bg-primary py-24 min-h-[90vh] flex flex-col justify-center items-center font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Static Section Header */}
      <div className="text-center px-4 z-10 mb-8">
        <div className="text-yellow-400 font-bold uppercase tracking-[0.3em] text-sm mb-3 block">
          Our Playbook
        </div>
        <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
          Moments That Define Us
        </h2>
      </div>

      {/* 3D Snap Track Container */}
      <div className="relative w-full max-w-[1200px] flex items-center justify-center mt-12">
        
        {/* Left Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="absolute left-4 md:left-12 z-[70] p-4 bg-black/50 hover:bg-yellow-400 text-white hover:text-black rounded-full backdrop-blur-md transition-colors"
        >
          <ArrowRight size={24} className="rotate-180" />
        </button>

        <div className="relative flex items-center justify-center w-full h-[500px] perspective-1000">
          {safeItems.map((item, index) => {
            const { scale, opacity, x, zIndex, width, height } = getCardStyle(index);
            const isActive = index === activeIndex;

            return (
              <motion.div
                key={item._id || index}
                className="absolute cursor-pointer rounded-sm overflow-hidden shadow-2xl group"
              initial={false}
              animate={{
                scale,
                opacity,
                x,
                zIndex
              }}
              transition={{
                duration: 0.4,
                ease: [0.25, 1, 0.5, 1] // Super smooth cubic bezier
              }}
              style={{
                width: `${width}px`,
                height: `${height}px`,
                originX: 0.5,
                originY: 0.5,
              }}
              onClick={() => {
                if (isActive) {
                  onImageClick && onImageClick(item, index);
                } else {
                  setActiveIndex(index);
                }
              }}
            >
              {/* Image */}
              <img 
                src={item.mainImage || item.url || item.image || item.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&auto=format&fit=crop'} 
                alt={item.title || 'Playbook Moment'} 
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />

            </motion.div>
          );
        })}

        {/* Camera Brackets (like the Framer example) */}
        <div className="absolute w-[640px] h-[440px] pointer-events-none z-[60] flex flex-col justify-between">
          <div className="flex justify-between w-full h-10">
            <div className="w-8 h-full border-t-2 border-l-2 border-white/50" />
            <div className="w-8 h-full border-t-2 border-r-2 border-white/50" />
          </div>
          <div className="flex justify-between w-full h-10">
            <div className="w-8 h-full border-b-2 border-l-2 border-white/50" />
            <div className="w-8 h-full border-b-2 border-r-2 border-white/50" />
          </div>
        </div>
      </div>

      {/* Right Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); handleNext(); }}
        className="absolute right-4 md:right-12 z-[70] p-4 bg-black/50 hover:bg-yellow-400 text-white hover:text-black rounded-full backdrop-blur-md transition-colors"
      >
        <ArrowRight size={24} />
      </button>
    </div>

      {/* Dynamic Footer based on active item */}
      <div className="absolute bottom-16 text-center z-10 w-full px-4">
        <motion.div 
          key={`footer-${activeIndex}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeItem?.date && (
            <div className="text-white/50 font-medium tracking-[0.2em] text-xs mb-2">
               {new Date(activeItem.date).getFullYear()}
            </div>
          )}
          <div className="text-white/80 font-bold uppercase tracking-[0.1em] text-xs max-w-lg mx-auto line-clamp-2">
            {activeItem?.description || 'Explore our moments.'}
          </div>
        </motion.div>
      </div>
      
    </div>
  );
};

export default Snap3DCarousel;

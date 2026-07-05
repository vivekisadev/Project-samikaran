
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';

const Snap3DCarousel = ({ items = [], onImageClick }) => {
  if (!items || items.length === 0) return null;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play logic
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 3000); // Change slide every 3 seconds
    
    return () => clearInterval(interval);
  }, [items.length, isHovered]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const getCardStyle = (index) => {
    // Calculate shortest distance in a circular array
    let distance = index - activeIndex;
    if (distance > items.length / 2) distance -= items.length;
    if (distance < -items.length / 2) distance += items.length;

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

  const activeItem = items[activeIndex];

  return (
    <div 
      className="relative w-full overflow-hidden bg-primary py-24 min-h-[90vh] flex flex-col justify-center items-center font-mono"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Dynamic Header based on active item (like the Framer example) */}
      <div className="absolute top-16 text-center z-10 w-full px-4">
        <motion.div 
          key={`header-${activeIndex}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-yellow-400/80 font-bold uppercase tracking-[0.2em] text-xs mb-2 block">
            {activeItem?.type || 'Our Playbook'}
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-widest uppercase">
            {activeItem?.title || 'Moments'}
          </h2>
        </motion.div>
      </div>

      {/* 3D Snap Track */}
      <div className="relative flex items-center justify-center w-full h-[500px] perspective-1000 mt-12">
        {items.map((item, index) => {
          const { scale, opacity, x, zIndex, width, height } = getCardStyle(index);
          const isActive = index === activeIndex;

          return (
            <motion.div
              key={item._id || index}
              className="absolute cursor-pointer rounded-sm overflow-hidden shadow-2xl"
              initial={false}
              animate={{
                scale,
                opacity,
                x,
                zIndex
              }}
              transition={{
                duration: 0.6,
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
                src={item.mainImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&auto=format&fit=crop'} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-105"
              />

              {/* View details overlay only on active card */}
              <AnimatePresence>
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                  >
                    <div className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 uppercase tracking-widest text-sm">
                      View <ArrowRight size={16} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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

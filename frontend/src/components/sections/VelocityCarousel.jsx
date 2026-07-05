import React, { useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform, wrap } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';

const VelocityCarousel = ({ items = [], onImageClick }) => {
  if (!items || items.length === 0) return null;

  // Duplicate items to ensure smooth infinite scrolling
  const duplicatedItems = [...items, ...items, ...items, ...items];
  
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="relative w-full overflow-hidden bg-primary py-24 min-h-[80vh] flex flex-col justify-center">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 opacity-30 pointer-events-none">
        <svg width="60" height="100" viewBox="0 0 40 60" fill="none">
           {[...Array(15)].map((_, i) => (
              <circle key={i} cx={5 + (i%3)*15} cy={5 + Math.floor(i/3)*15} r="2.5" fill="#FBBF24"/>
           ))}
        </svg>
      </div>

      {/* Section Header */}
      <div className="text-center px-4 z-10 mb-16">
        <div className="text-yellow-400 font-black uppercase tracking-[0.3em] text-xs mb-3 block">
          Our Playbook
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Moments That Define Us
        </h2>
      </div>

      {/* Infinite Scrolling Track */}
      <div 
        className="relative flex items-center w-full overflow-hidden" 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoveredIndex(null);
        }}
      >
        <motion.div
          className="flex gap-6 px-4 animate-marquee-horizontal"
          style={{
            animationPlayState: isHovered ? 'paused' : 'running',
            width: 'max-content'
          }}
        >
          {duplicatedItems.map((item, idx) => {
            const isCardHovered = hoveredIndex === idx;
            const isAnyHovered = hoveredIndex !== null;
            
            return (
              <motion.div
                key={`${item._id || item.id}-${idx}`}
                onMouseEnter={() => setHoveredIndex(idx)}
                layout
                className={`relative flex-shrink-0 cursor-pointer overflow-hidden rounded-3xl transition-all duration-500 ease-out`}
                style={{
                  width: isCardHovered ? '700px' : '480px',
                  height: isCardHovered ? '380px' : '300px',
                  opacity: isAnyHovered && !isCardHovered ? 0.4 : 1,
                  filter: isAnyHovered && !isCardHovered ? 'blur(2px) grayscale(50%)' : 'blur(0px) grayscale(0%)',
                  zIndex: isCardHovered ? 20 : 10,
                  transform: isCardHovered ? 'scale(1.05)' : 'scale(1)'
                }}
                onClick={() => onImageClick && onImageClick(item, idx % items.length)}
              >
                {/* Image Background */}
                <div className="absolute inset-0 w-full h-full">
                  <img 
                    src={item.mainImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&auto=format&fit=crop'} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end text-white h-full pointer-events-none">
                  <div className="mb-auto">
                    <span className="bg-primary/90 backdrop-blur-md text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider inline-block mb-4 shadow-lg border border-white/20">
                      {item.type || 'Media'}
                    </span>
                  </div>

                  <motion.div layout="position">
                    <h3 className="text-2xl font-bold mb-2 leading-tight drop-shadow-md">
                      {item.title}
                    </h3>
                    
                    {/* Expandable details */}
                    <div 
                      className="overflow-hidden transition-all duration-500 ease-out"
                      style={{
                        maxHeight: isCardHovered ? '150px' : '0px',
                        opacity: isCardHovered ? 1 : 0,
                        transform: isCardHovered ? 'translateY(0)' : 'translateY(10px)'
                      }}
                    >
                      <p className="text-gray-200 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                      
                      {item.date && (
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-4">
                          <Calendar size={14} className="text-yellow-400" />
                          {new Date(item.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm tracking-wide">
                        View Details <ArrowRight size={14} />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default VelocityCarousel;

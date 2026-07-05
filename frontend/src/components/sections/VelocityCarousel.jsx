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
              <div
                key={`${item._id || item.id}-${idx}`}
                onMouseEnter={() => setHoveredIndex(idx)}
                className={`relative flex-shrink-0 cursor-pointer overflow-hidden rounded-[2.5rem] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] border border-white/10 shadow-2xl bg-black/20`}
                style={{
                  width: '650px',
                  height: '420px',
                  opacity: isAnyHovered && !isCardHovered ? 0.3 : 1,
                  filter: isAnyHovered && !isCardHovered ? 'blur(4px) grayscale(70%)' : 'blur(0px) grayscale(0%)',
                  zIndex: isCardHovered ? 20 : 10,
                  transform: isCardHovered ? 'translateY(-10px)' : 'translateY(0px)',
                  boxShadow: isCardHovered ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 0 20px rgba(255, 255, 255, 0.05)' : '0 10px 30px -5px rgba(0, 0, 0, 0.5)'
                }}
                onClick={() => onImageClick && onImageClick(item, idx % items.length)}
              >
                {/* Image Background */}
                <div className="absolute inset-0 w-full h-full">
                  <img 
                    src={item.mainImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&auto=format&fit=crop'} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-[1000ms] ease-out hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/95 via-[#0a0a0a]/40 to-transparent mix-blend-multiply" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end text-white h-full pointer-events-none">
                  <div className="mb-auto">
                    <span className="bg-white/10 backdrop-blur-xl text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] inline-block mb-4 shadow-lg border border-white/20">
                      {item.type || 'Media'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-3xl font-extrabold mb-3 leading-tight tracking-tight text-white/95">
                      {item.title}
                    </h3>
                    
                    {/* Expandable details */}
                    <div 
                      className="overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                      style={{
                        maxHeight: isCardHovered ? '200px' : '0px',
                        opacity: isCardHovered ? 1 : 0,
                        transform: isCardHovered ? 'translateY(0)' : 'translateY(20px)'
                      }}
                    >
                      <p className="text-white/70 text-sm mb-5 line-clamp-3 leading-relaxed font-medium">
                        {item.description}
                      </p>
                      
                      {item.date && (
                        <div className="flex items-center gap-2 text-xs font-bold text-white/50 mb-5 tracking-wide uppercase">
                          <Calendar size={14} className="text-yellow-400/80" />
                          {new Date(item.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-yellow-400 font-extrabold text-sm tracking-widest uppercase transition-colors">
                        View Details <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default VelocityCarousel;

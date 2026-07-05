import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const updateCursor = (e) => {
        gsap.to(cursorRef.current, {
          x: e.clientX - 12,
          y: e.clientY - 12,
          duration: 0.15,
          ease: "power2.out"
        });
      };
      window.addEventListener('mousemove', updateCursor);
      return () => window.removeEventListener('mousemove', updateCursor);
    });
    
    return () => ctx.revert();
  }, []);

  return (
    <div 
      className="custom-cursor fixed top-0 left-0 w-6 h-6 rounded-full bg-primary/50 border border-primary mix-blend-multiply pointer-events-none z-[9999] hidden md:block" 
      ref={cursorRef} 
    />
  );
};

export default CustomCursor;

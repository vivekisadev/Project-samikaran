import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

const HeroSection = () => {
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);
  
  const [heroImages, setHeroImages] = useState([
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1920&auto=format&fit=crop"
  ]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch('/api/media');
        const data = await res.json();
        if (data.success && data.media.length > 0) {
          setHeroImages(data.media.map(m => m.mainImage || m.url));
        }
      } catch (err) {
        console.error("Failed to fetch carousel images:", err);
      }
    };
    fetchMedia();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const heroRef = useRef(null);
  
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(".hero-element", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: "power3.out", delay: 0.1 }
      );
    }, heroRef);
    
    return () => ctx.revert();
  }, []);

  const { scrollY } = useScroll();
  // Parallax effect: as you scroll down, the background images move down at 40% speed
  const yParallax = useTransform(scrollY, [0, 1000], [0, 400]);

  return (
    <section ref={heroRef} className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-10 bg-black">
      
      {/* Parallax Background Container */}
      <motion.div 
        style={{ y: yParallax }} 
        className="absolute inset-[-10%] w-[120%] h-[120%] z-0"
      >
        <AnimatePresence mode="popLayout">
            <motion.img 
                key={currentHeroIdx}
                initial={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
                src={heroImages[currentHeroIdx]} 
                alt="NGO Background" 
                className="w-full h-full object-cover absolute inset-0"
            />
        </AnimatePresence>
      </motion.div>
      
      {/* Dark overlay to ensure text is always readable against the full-screen images */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Decorative blurred lighting to add premium feel */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-orange-400/20 rounded-full blur-[100px] pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-teal-400/20 rounded-full blur-[100px] pointer-events-none z-10" />
      
      <div className="container mx-auto px-4 z-20 flex flex-col items-center text-center w-full max-w-5xl">
        
        {/* Welcome Badge */}
        <div className="hero-element inline-block px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-primary font-bold mb-8 border border-primary/20 text-sm tracking-widest uppercase mt-8">
          Welcome to SAMIKARAN
        </div>
        
        {/* Original Typography */}
        <h1 className="hero-element text-6xl md:text-8xl font-black leading-tight mb-8 text-white drop-shadow-2xl tracking-tighter">
          Finding Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-400 drop-shadow-md">Voice</span>, <br />
          Finding Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-primary drop-shadow-md">Way</span>
        </h1>

        {/* Subtext */}
        <p className="hero-element text-xl md:text-2xl text-white/90 mb-12 max-w-3xl leading-relaxed font-medium bg-black/30 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl">
          We build communication and professional skills to strengthen confidence in underserved communities, enabling individuals to lead lives of purpose.
        </p>
        
        {/* Pill Buttons */}
        <div className="hero-element flex gap-4 md:gap-6 flex-wrap justify-center">
          <Link 
            to="/donate" 
            className="bg-[#18483B] text-white px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:scale-105 hover:bg-[#0f2d25] transition-all shadow-lg"
          >
            Donate
          </Link>
          <Link 
            to="/about" 
            className="bg-white/10 backdrop-blur-md border border-white/50 text-white px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-white/20 transition-all shadow-lg"
          >
            Learn More
          </Link>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import aboutImage from '../assets/media/about_image.png';

// Import extracted components
import HeroSection from '../components/sections/HeroSection';
import ImpactStats from '../components/sections/ImpactStats';
import LiveProjects from '../components/sections/LiveProjects';
import Testimonials from '../components/sections/Testimonials';
import DepthBlurCarousel from '../components/sections/DepthBlurCarousel';
import StackedCardCarousel from '../components/sections/StackedCardCarousel';

const Home = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [impactStats, setImpactStats] = useState({
    studentsReached: '1650+',
    institutions: '14+',
    workshops: '20+'
  });
  const [liveProjects, setLiveProjects] = useState([]);
  const [currentMomentsSlide, setCurrentMomentsSlide] = useState(0);

  useEffect(() => {
    fetch('/api/media')
      .then(r => r.json())
      .then(data => {
        if (data.success) setMediaItems(data.media);
      });
    
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.settings.impactStats) {
          setImpactStats(data.settings.impactStats);
        }
      });

    fetch('/api/projects')
      .then(r => r.json())
      .then(data => {
        if (data.success) setLiveProjects(data.projects);
      });
  }, []);

  const openModal = (event) => {
    setSelectedEvent(event);
    setCurrentImgIdx(0);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const nextImg = () => {
    if (!selectedEvent?.gallery) return;
    setCurrentImgIdx((prev) => (prev + 1) % (selectedEvent.gallery.length + 1));
  };

  const prevImg = () => {
    if (!selectedEvent?.gallery) return;
    const total = selectedEvent.gallery.length + 1;
    setCurrentImgIdx((prev) => (prev - 1 + total) % total);
  };

  const allImages = selectedEvent ? [selectedEvent.mainImage, ...(selectedEvent.gallery || [])] : [];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Impact Stats */}
      <ImpactStats stats={impactStats} />

      {/* Quick About */}
      <section className="py-24 bg-white">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
              <div className="relative">
                  <div className="w-full h-[500px] bg-gray-100 rounded-xl overflow-hidden relative shadow-2xl">
                      <img 
                        src={aboutImage} 
                        alt="About Samikaran" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                      />
                  </div>
              </div>
              <div>
                  <h2 className="text-sm font-bold tracking-wide text-secondary uppercase mb-2">About Us</h2>
                  <h3 className="text-4xl font-bold text-gray-900 mb-6">Bridging Opportunity Gaps</h3>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                      Samikaran was founded to enable individuals to lead lives of purpose — not as a privilege, but as a right.
                  </p>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                      We build communication and professional skills to strengthen confidence in underserved communities. At Samikaran, we believe that when people find their voice, they find their way.
                  </p>
                  <Link to="/about" className="text-primary font-bold hover:brightness-90 inline-flex items-center gap-2 text-lg group">
                      Read Our Full Story <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
              </div>
          </div>
      </section>

      {/* Featured Projects Preview */}
      <LiveProjects liveProjects={liveProjects} />

      {/* Moments Carousel Section — Stacked Card Parallax */}
      <StackedCardCarousel items={mediaItems} onImageClick={(item, idx) => openModal(mediaItems[idx])} />

      {/* Playbook Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10"
          >
            <button 
              onClick={closeModal}
              className="absolute top-10 right-10 w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all z-[110]"
            >
              <X size={28} />
            </button>

            <div className="container mx-auto h-full flex flex-col md:flex-row gap-10 items-center">
              <div className="w-full md:w-2/3 h-[50vh] md:h-full relative group rounded-xl overflow-hidden border border-white/5 shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentImgIdx}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6 }}
                    src={allImages[currentImgIdx]} 
                    className="w-full h-full object-cover"
                    alt="Gallery item"
                  />
                </AnimatePresence>

                {/* Navigation Arrows */}
                <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={prevImg} className="w-14 h-14 rounded-xl bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-primary transition-colors">
                    <ChevronLeft size={32} />
                  </button>
                  <button onClick={nextImg} className="w-14 h-14 rounded-xl bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-primary transition-colors">
                    <ChevronRight size={32} />
                  </button>
                </div>

                {/* Progress Indicators */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
                  {allImages.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImgIdx ? 'w-10 bg-primary' : 'w-3 bg-white/20'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="w-full md:w-1/3 text-left">
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-4 block"
                >
                  {selectedEvent.type}
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 leading-tight"
                >
                  {selectedEvent.title}
                </motion.h2>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <p className="text-gray-400 text-lg font-medium leading-relaxed">
                    {selectedEvent.description}
                  </p>
                  <div className="pt-10 border-t border-white/10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Event Date</p>
                      <p className="text-white font-bold">{new Date(selectedEvent.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA */}
      <section className="py-24 bg-secondary relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
           <div className="container mx-auto px-4 text-center relative z-10">
               <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Join Hands With Us</h2>
               <p className="text-xl text-gray-800 mb-10 max-w-2xl mx-auto">
                   Your contribution can light up a life. Volunteer, donate, or spread the word.
               </p>
               <div className="flex gap-4 justify-center">
                   <Link to="/contact" className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-gray-800 transition-colors">
                       Become a Volunteer
                   </Link>
                   <Link to="/donate" className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold shadow-lg hover:bg-gray-100 transition-colors">
                       Make a Donation
                   </Link>
               </div>
           </div>
      </section>
    </div>
  );
};

export default Home;

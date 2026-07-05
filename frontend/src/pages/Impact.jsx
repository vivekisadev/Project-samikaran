import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ArrowRight, Calendar, ExternalLink, X, MapPin, CheckCircle, Heart, Megaphone, TrendingUp, Users, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const BentoCard = ({ children, className, delay = 0, onClick, hoverable = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay }}
    onClick={onClick}
    className={`bg-white rounded-xl p-6 md:p-8 border border-gray-100 shadow-sm overflow-hidden relative group flex flex-col ${hoverable ? 'hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer' : ''} ${className}`}
  >
    {children}
  </motion.div>
);

const Impact = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [liveProjects, setLiveProjects] = useState([]);
  const [liveReports, setLiveReports] = useState([]);
  const [liveAnnouncements, setLiveAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [impactStats, setImpactStats] = useState({
    studentsReached: '1650+',
    institutions: '14+',
    workshops: '20+'
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then(res => res.json()),
      fetch('/api/reports').then(res => res.json()),
      fetch('/api/announcements').then(res => res.json()),
      fetch('/api/settings').then(res => res.json()).catch(() => ({}))
    ]).then(([p, r, a, s]) => {
      if(p.success) setLiveProjects(p.projects);
      if(r.success) setLiveReports(r.reports);
      if(a.success) setLiveAnnouncements(a.announcements);
      if(s && s.success && s.settings && s.settings.impactStats) setImpactStats(s.settings.impactStats);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const getImg = (item) => item.image || item.media || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop';

  return (
    <div className="bg-gray-50 min-h-screen pt-0 pb-20 relative font-sans selection:bg-primary/20">
        

      {/* Programs and Journey */}
      <section className="bg-gray-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Our Journey & Programs</h2>
              <h3 className="text-4xl font-bold mb-6">Creating Spaces for Growth</h3>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                Samikaran started with a simple belief: confidence and opportunity should not depend on where someone begins their journey. Over time, we have worked with schools, colleges, ITIs, and learning centres to conduct interactive workshops and learning programs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mt-16">
                {/* Baat-Cheet */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white/5 p-8 rounded-xl border border-white/10"
                >
                    <h4 className="text-3xl font-bold text-secondary mb-4">Baat-Cheet</h4>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                        A learning program designed to help children express themselves more openly and confidently. Through activities, discussions, and creative exercises, students explore their thoughts, emotions, and communication skills in a supportive environment. The program focuses on social-emotional learning along with English comprehension.
                    </p>
                    <div className="bg-white/10 p-6 rounded-xl">
                        <h5 className="font-bold text-white mb-2">Pilot Programme (3 Months)</h5>
                        <p className="text-gray-400 text-sm">
                            Conducted at Lakhi Ram Anathalaya, engaging children in creative sessions on social-emotional learning and English. Through games, storytelling, and discussions, we built their confidence to express and work together.
                        </p>
                    </div>
                </motion.div>

                {/* Sahi Manzil */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white/5 p-8 rounded-xl border border-white/10"
                >
                    <h4 className="text-3xl font-bold text-primary mb-4">Sahi Manzil</h4>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                        A workshop series focused on professional development and skill building for students. It introduces communication, digital tools, presentation, and career awareness, guiding students towards the right direction with skills needed in today's world.
                    </p>
                    
                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <div>
                                <h5 className="font-bold text-white">In Schools</h5>
                                <p className="text-gray-400 text-sm">Focuses on creativity, communication, and digital tools like Canva and AI platforms.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                            <div>
                                <h5 className="font-bold text-white">In Colleges</h5>
                                <p className="text-gray-400 text-sm">Covers resume building, communication, modern workplace expectations, and professional development.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                            <div>
                                <h5 className="font-bold text-white">In ITIs</h5>
                                <p className="text-gray-400 text-sm">Strengthens communication, confidence, and awareness of opportunities for students with strong technical knowledge.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
      </section>

      {/* Upcoming & Stats */}
      <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-12 gap-12">
              <div className="md:col-span-5">
                  <h3 className="text-4xl font-bold text-gray-900 mb-8">Our Impact</h3>
                  <div className="space-y-8">
                      <div>
                          <h4 className="text-5xl font-black text-primary mb-2">{impactStats.studentsReached || '1650+'}</h4>
                          <p className="text-xl font-bold text-gray-900 mb-1">Students Reached</p>
                          <p className="text-gray-600">Engaged through skill-building workshops and learning initiatives.</p>
                      </div>
                      <div>
                          <h4 className="text-5xl font-black text-secondary mb-2">{impactStats.institutions || '14+'}</h4>
                          <p className="text-xl font-bold text-gray-900 mb-1">Institutions</p>
                          <p className="text-gray-600">Collaborated with schools, colleges, and ITIs.</p>
                      </div>
                      <div>
                          <h4 className="text-5xl font-black text-accent mb-2">{impactStats.workshops || '20+'}</h4>
                          <p className="text-xl font-bold text-gray-900 mb-1">Workshops Conducted</p>
                          <p className="text-gray-600">Focused on communication, creativity, and professional development.</p>
                      </div>
                  </div>
              </div>

              <div className="md:col-span-7 space-y-8">
                  <h3 className="text-4xl font-bold text-gray-900 mb-8">Upcoming Initiatives</h3>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                  >
                      <h4 className="text-2xl font-bold text-gray-900 mb-3">Baat-Cheet Activity Booklet</h4>
                      <p className="text-gray-600 mb-4">
                          We are launching an activity-based booklet designed to support social and emotional learning along with English comprehension for children. It includes 40+ interactive activities for children aged 7–17.
                      </p>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <span className="font-bold text-gray-900">Goal:</span> <span className="text-gray-600">To create a simple and accessible learning resource that helps children build confidence while strengthening language and emotional awareness.</span>
                      </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                  >
                      <h4 className="text-2xl font-bold text-gray-900 mb-3">Safe & Unsafe Touch Workshop</h4>
                      <p className="text-gray-600 mb-4">
                          An activity-based awareness workshop helping students understand the difference between safe and unsafe touch. It encourages recognizing boundaries, personal safety, and speaking up.
                      </p>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <span className="font-bold text-gray-900">Goal:</span> <span className="text-gray-600">To create safer learning environments by encouraging awareness, understanding, and open conversations around personal safety.</span>
                      </div>
                  </motion.div>
              </div>
          </div>
      </section>
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>

              <div className="relative h-64 md:h-80">
                <img 
                    src={getImg(selectedItem)} 
                    alt={selectedItem.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6 md:left-8 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{selectedItem.status || (selectedItem._type === 'report' ? 'Published' : 'Active')}</span>
                        {selectedItem.location && (
                             <span className="flex items-center gap-1 text-sm bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm"><MapPin size={14} /> {selectedItem.location}</span>
                        )}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-1">{selectedItem.title}</h2>
                    <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                        <Calendar size={14} /> {selectedItem.date || new Date(selectedItem.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                </div>
              </div>

              <div className="p-8 md:p-10">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Content */}
                    <div className="md:col-span-2">
                        <div className="prose prose-lg text-gray-600 prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 whitespace-pre-wrap font-medium">
                            {selectedItem.fullContent ? (
                                <div dangerouslySetInnerHTML={{ __html: selectedItem.fullContent }} />
                            ) : (
                                <p>{selectedItem.description}</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Sidebar Stats */}
                    <div className="space-y-6">
                        {selectedItem.stats && selectedItem.stats.length > 0 && (
                          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><CheckCircle className="text-primary" size={20} /> Impact Stats</h3>
                              <div className="space-y-4">
                                  {selectedItem.stats.map((stat, i) => (
                                      <div key={i} className="border-b border-gray-200 last:border-0 pb-3 last:pb-0">
                                          <div className="text-3xl font-black text-gray-900">{stat.value}</div>
                                          <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">{stat.label}</div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                        )}
                        
                        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-8 border border-primary/20 text-center shadow-sm">
                            <p className="text-gray-900 font-bold mb-4">Inspired by this?</p>
                            <Link 
                                to={`/donate`} 
                                className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                            >
                                <Heart size={18} fill="currentColor" /> Donate Now
                            </Link>
                        </div>
                    </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Impact;

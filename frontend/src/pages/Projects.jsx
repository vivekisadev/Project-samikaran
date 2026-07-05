import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderHeart, FileText, Megaphone } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [reports, setReports] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, r, a] = await Promise.all([
          fetch('/api/projects').then(res => res.json()),
          fetch('/api/reports').then(res => res.json()),
          fetch('/api/announcements').then(res => res.json())
        ]);
        
        if (p.success) setProjects(p.projects);
        if (r.success) setReports(r.reports);
        if (a.success) setAnnouncements(a.announcements);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
       <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-primary border-r-2" />
       </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#fbfbfd]">
      <div className="container mx-auto px-4 max-w-7xl">
         
         {/* Page Header */}
         <div className="text-center mb-24">
            <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-4 block">
              Global Operations
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-6">
              OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">IMPACT</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-500 font-bold text-lg max-w-2xl mx-auto leading-relaxed">
              Explore our active missions, review our transparency reports, and stay aligned with our future updates.
            </motion.p>
         </div>

         {/* Projects Section */}
         <div className="mb-32">
            <div className="flex items-center gap-4 mb-12">
               <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><FolderHeart size={24} /></div>
               <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Active Missions</h2>
            </div>
            {projects.length === 0 ? (
               <div className="p-12 text-center text-gray-400 font-black uppercase tracking-widest text-sm bg-white rounded-xl border border-gray-100 shadow-sm">No missions active.</div>
            ) : (
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((project, i) => (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.1 }} key={project.id} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 group">
                       <div className="h-48 bg-gray-100 relative overflow-hidden">
                          {project.image ? (
                             <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          ) : <div className="w-full h-full flex items-center justify-center text-gray-300"><FolderHeart size={40} /></div>}
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase text-gray-900 tracking-widest">{project.status}</div>
                       </div>
                       <div className="p-8">
                          <h3 className="text-xl font-black text-gray-900 mb-3">{project.title}</h3>
                          <p className="text-gray-500 font-bold text-sm line-clamp-3 mb-6">{project.description}</p>
                       </div>
                    </motion.div>
                  ))}
               </div>
            )}
         </div>

         {/* Setup Grid for Reports and Announcements */}
         <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Reports Section */}
            <div>
               <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><FileText size={24} /></div>
                 <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Impact Reports</h2>
              </div>
              <div className="space-y-6">
                 {reports.length === 0 ? (
                    <p className="text-gray-400 font-black text-sm uppercase tracking-widest">No reports published.</p>
                 ) : reports.map((report, i) => (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i*0.1 }} key={report.id} className="p-8 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group flex flex-col md:flex-row gap-6">
                       {report.media && (
                          <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                             <img src={report.media} alt={report.title} className="w-full h-full object-cover" />
                          </div>
                       )}
                       <div>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">{new Date(report.createdAt).toLocaleDateString()}</p>
                          <h3 className="text-lg font-black text-gray-900 group-hover:text-primary transition-colors">{report.title}</h3>
                          <p className="text-gray-500 text-sm font-bold mt-2 line-clamp-2">{report.description}</p>
                       </div>
                    </motion.div>
                 ))}
              </div>
            </div>

            {/* Announcements Section */}
            <div>
               <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><Megaphone size={24} /></div>
                 <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Future Updates</h2>
              </div>
              <div className="space-y-6">
                 {announcements.length === 0 ? (
                    <p className="text-gray-400 font-black text-sm uppercase tracking-widest">No future announcements pending.</p>
                 ) : announcements.map((ann, i) => (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i*0.1 }} key={ann.id} className="p-8 bg-gradient-to-br from-white to-orange-50/30 rounded-xl border border-orange-100 shadow-sm hover:shadow-lg transition-all">
                       <p className="inline-block px-3 py-1 bg-orange-100/50 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4">Upcoming</p>
                       <h3 className="text-xl font-black text-gray-900 mb-2">{ann.title}</h3>
                       <p className="text-gray-600 font-bold mb-4">{ann.description}</p>
                       {ann.media && (
                          <div className="w-full h-40 rounded-xl overflow-hidden mt-6">
                             <img src={ann.media} alt="Cover" className="w-full h-full object-cover" />
                          </div>
                       )}
                    </motion.div>
                 ))}
              </div>
            </div>

         </div>

      </div>
    </div>
  );
};

export default Projects;

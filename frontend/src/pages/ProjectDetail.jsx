import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, CheckCircle, Heart } from 'lucide-react';
import { projects } from '../data/projects';

const ProjectDetail = () => {
  const { id } = useParams();
  const project = projects.find(p => p.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Project Not Found</h2>
        <Link to="/publications" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft size={20} /> Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Header */}
      <div className="relative h-[60vh] w-full bg-gray-900">
        <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white max-w-5xl">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex items-center gap-4 mb-4">
                    <span className="bg-primary text-white text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {project.status}
                    </span>
                    <span className="flex items-center gap-2 text-white/80">
                        <Calendar size={18} /> {project.date}
                    </span>
                    <span className="flex items-center gap-2 text-white/80">
                        <MapPin size={18} /> {project.location}
                    </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">{project.title}</h1>
            </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-10 grid md:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="md:col-span-2 bg-white rounded-t-3xl p-8 md:p-0">
             <div className="prose prose-lg text-gray-600 max-w-none">
                 <div dangerouslySetInnerHTML={{ __html: project.fullContent }} />
             </div>

             <div className="mt-12 pt-12 border-t border-gray-100">
                <Link to="/publications" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium">
                    <ArrowLeft size={20} /> Back to All Projects
                </Link>
             </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100 sticky top-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Impact Stats</h3>
                <div className="space-y-6 mb-8">
                    {project.stats.map((stat, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                            <div className="bg-secondary/20 p-3 rounded-full text-secondary-dark">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-gray-900">{stat.value}</h4>
                                <p className="text-gray-500 font-medium">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <h4 className="font-bold text-gray-800 mb-2">Support This Cause</h4>
                    <p className="text-gray-500 text-sm mb-6">Your contribution goes directly to this project.</p>
                    <Link 
                        to={`/donate/${project.id}`} 
                        className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                    >
                        <Heart size={20} fill="currentColor" /> Donate Now
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;

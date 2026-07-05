import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LiveProjects = ({ liveProjects }) => {
  return (
    <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
             <div className="text-center mb-16">
                <h2 className="text-xl font-bold tracking-wide text-secondary uppercase mb-2">Our Work</h2>
                <h3 className="text-4xl font-bold text-gray-900">Publication & Projects</h3>
             </div>
             
             <div className="grid md:grid-cols-2 gap-8">
                 {liveProjects.slice(0, 2).map((project) => (
                     <div key={project._id || project.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2 border border-gray-100">
                         <div className="h-64 bg-gray-200 relative overflow-hidden">
                             <img 
                                 src={project.image} 
                                 alt={project.title} 
                                 className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                             />
                             <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-primary font-bold px-3 py-1 rounded-full text-sm shadow-sm">
                                 {project.status}
                             </div>
                         </div>
                         <div className="p-8">
                             <h4 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors">{project.title}</h4>
                             <p className="text-gray-600 mb-6">{project.description}</p>
                             <Link to="/impact" className="text-primary font-bold hover:text-secondary transition-colors uppercase text-sm tracking-wide inline-flex items-center gap-1">
                                 View Details <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                             </Link>
                         </div>
                     </div>
                 ))}
             </div>
             
             <div className="text-center mt-12">
                 <Link to="/impact" className="inline-block border-2 border-primary text-primary px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-all">
                     View All Projects
                 </Link>
             </div>
        </div>
    </section>
  );
};

export default LiveProjects;

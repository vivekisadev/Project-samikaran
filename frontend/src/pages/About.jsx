import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Target, Globe, ShieldCheck, Users, ArrowRight, BookOpen, Briefcase, Activity, Flag, Sunrise, Zap, Compass, Star, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  { q: "What is Samikaran?", a: "Samikaran is a social initiative focused on building communication, confidence, and professional skills among students and youth, especially from underserved communities." },
  { q: "What kind of programs does Samikaran conduct?", a: "Samikaran conducts activity-based workshops and learning programs that focus on social-emotional learning, English comprehension, communication skills, and professional development for students." },
  { q: "Who can participate in Samikaran’s programs?", a: "Our programs are designed for school students, college students, and ITI students. Different workshops are tailored to suit the needs of each age group." },
  { q: "What is the Baat-Cheet program?", a: "Baat-Cheet is an activity-based learning program focused on social-emotional learning and English comprehension. It encourages children to express their thoughts, understand emotions, and communicate more confidently." },
  { q: "What is the Sahi Manzil workshop?", a: "Sahi Manzil is a professional development workshop designed to help students build practical skills such as communication, digital literacy, and career awareness." },
  { q: "Can schools or colleges collaborate with Samikaran?", a: "Yes. Samikaran actively collaborates with schools, colleges, and training institutions to conduct workshops and learning programs for students." },
  { q: "How can someone get involved with Samikaran?", a: "Individuals and institutions can support Samikaran by collaborating for workshops, implementing learning programs, or helping expand these initiatives to reach more students." },
  { q: "How can I contact Samikaran or express interest?", a: "You can connect with us through the interest form available on the website. Our team will get in touch to explore possible collaborations or participation." }
];

const FAQItem = ({ faq, isOpen, toggle }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border border-gray-100 rounded-xl mb-4 overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <button 
        onClick={toggle}
        className="w-full text-left px-8 py-6 flex justify-between items-center focus:outline-none group"
      >
        <span className="font-black text-gray-900 text-lg pr-8 group-hover:text-primary transition-colors">{faq.q}</span>
        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-primary text-white rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary'}`}>
          <ChevronDown size={20} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-gray-50/50"
          >
            <div className="px-8 pb-8 text-gray-600 leading-relaxed border-t border-gray-100 pt-6 text-lg font-medium">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const About = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1524069290683-0457abfe42c3?q=80&w=2070&auto=format&fit=crop" 
            alt="Children smiling" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            Finding Your Voice, <br/> Finding Your Way
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl font-light text-gray-100 max-w-2xl mx-auto"
          >
            Samikaran was founded to bridge opportunity gaps and enable individuals to lead lives of purpose — not as a privilege, but as a right.
          </motion.p>
        </div>
      </section>

      {/* About & Problem Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Our Story</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Bridging the Gap</h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              We build communication and professional skills to strengthen confidence in underserved communities, enabling individuals to lead lives of purpose.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              At Samikaran, we believe that when people find their voice, they find their way.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-secondary/20 rounded-xl transform rotate-3"></div>
            <img 
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop" 
              alt="Community work" 
              className="relative rounded-xl shadow-xl w-full h-[500px] object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-gray-50 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-xl shadow-sm border border-gray-100"
          >
            <Target className="w-12 h-12 text-primary mb-6" />
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Providing communication and professional skills to build confidence in underserved communities.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white p-10 rounded-xl shadow-sm border border-gray-100"
          >
            <Sunrise className="w-12 h-12 text-secondary mb-6" />
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
               To build an able society where every individual leads a life of purpose.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Focus Areas Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Focus Areas</h2>
          <h3 className="text-4xl font-bold text-gray-900 mb-4">Supporting Learning & Opportunity</h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">The key areas where we work to build confidence and open doors.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-blue-50/50 rounded-xl border border-blue-100 hover:shadow-lg transition-all flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                 <BookOpen className="w-7 h-7 text-blue-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">Education</h4>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 bg-green-50/50 rounded-xl border border-green-100 hover:shadow-lg transition-all flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                 <Briefcase className="w-7 h-7 text-green-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">Livelihoods</h4>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-8 bg-rose-50/50 rounded-xl border border-rose-100 hover:shadow-lg transition-all flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mb-6">
                 <Activity className="w-7 h-7 text-rose-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">Health</h4>
            </motion.div>
        </div>
      </section>



      {/* Approach and Values */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Our Foundation</h2>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">Approach & Values</h3>
              <p className="text-gray-600 text-lg">
                  We focus on learning experiences that are interactive, practical, and rooted in real-life situations. We believe that learning happens best when students feel safe to speak, explore, and make mistakes.
              </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                  { title: "Empowerment", desc: "Every individual has the potential to grow when given the right support, encouragement, and opportunities.", icon: <Zap /> },
                  { title: "Inclusion", desc: "We aim to create spaces where everyone feels respected, heard, and valued regardless of their background.", icon: <Users /> },
                  { title: "Confidence Building", desc: "Confidence is at the heart of our work. We focus on helping students believe in their abilities.", icon: <Star /> },
                  { title: "Collaboration", desc: "Meaningful change happens when communities, educators, and organizations work together.", icon: <Globe /> },
                  { title: "Continuous Learning", desc: "We remain open to learning from every experience, constantly improving our programs.", icon: <Compass /> },
              ].map((value, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 border border-gray-100 rounded-xl hover:shadow-xl transition-all group bg-white"
                  >
                      <div className="w-12 h-12 bg-gray-50 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                          {value.icon}
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h4>
                      <p className="text-gray-600">
                          {value.desc}
                      </p>
                  </motion.div>
              ))}
          </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
              <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Have Questions?</h2>
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Frequently Asked Questions</h3>
              <p className="text-gray-500 text-lg">Everything you need to know about our initiatives.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index} 
                faq={faq} 
                isOpen={openFaq === index} 
                toggle={() => setOpenFaq(openFaq === index ? null : index)} 
              />
            ))}
          </div>
        </div>
      </section>

       {/* CTA */}
       <section className="py-24 bg-primary relative overflow-hidden text-center">
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
           <div className="relative z-10 max-w-3xl mx-auto px-6">
               <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">What's Next</h2>
               <p className="text-xl text-white/90 mb-10">
                   We are looking to collaborate with schools and institutions to bring programs like Baat-Cheet and Sahi Manzil to more students. By working together, we hope to create more spaces where young people can learn, grow, and discover their potential.
               </p>
               <Link to="/contact" className="bg-white text-primary px-10 py-4 rounded-full font-bold shadow-lg hover:bg-gray-100 transition-colors inline-block transform hover:scale-105">
                   Partner With Us
               </Link>
           </div>
       </section>
    </div>
  );
};

export default About;

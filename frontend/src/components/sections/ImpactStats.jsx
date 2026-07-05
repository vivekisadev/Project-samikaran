import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedCounter = ({ text }) => {
  const nodeRef = useRef(null);

  useEffect(() => {
    if (!text) return;
    const rawVal = text.toString();
    const numericPart = parseInt(rawVal.replace(/[^0-9]/g, ''), 10) || 0;
    // Extract non-numeric characters (like + or k)
    const suffixPart = rawVal.replace(/[0-9.,]/g, '');

    const obj = { val: 0 };

    let ctx = gsap.context(() => {
      // Zoom effect
      gsap.fromTo(nodeRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: nodeRef.current,
            start: "top 90%"
          }
        }
      );

      // Number count up effect
      gsap.to(obj, {
        val: numericPart,
        duration: 2.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: nodeRef.current,
          start: "top 90%"
        },
        onUpdate: () => {
          if (nodeRef.current) {
            let currentVal = Math.round(obj.val);
            let displayVal = currentVal >= 1000 ? currentVal.toLocaleString() : currentVal;
            if (rawVal.toLowerCase().includes('k')) {
                displayVal = currentVal;
            }
            // Inject the number, and apply orange color specifically to the suffix (+ sign)
            nodeRef.current.innerHTML = `${displayVal}<span class="text-[#18483B]">${suffixPart}</span>`;
          }
        }
      });
    });
    return () => ctx.revert();
  }, [text]);

  return <span ref={nodeRef} className="inline-block transform-origin-bottom text-gray-900">{text}</span>;
};

const ImpactStats = ({ stats }) => {
  return (
    <section className="py-24 md:py-32 bg-[#F4F1EA] relative overflow-hidden impact-section">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black text-gray-900 mb-6 uppercase tracking-tight"
          >
            OUR <span className="text-[#18483B]">IMPACT</span> IN ACTION
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Samikaran supports grassroots leaders, educators, and advocates who fight for equity, dignity, and justice.
          </motion.p>
        </div>
        
        {/* 3-Card Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
           
           {/* Card 1 */}
           <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, ease: "easeOut", duration: 0.6 }}
              className="bg-white rounded-[2rem] p-10 h-[450px] flex flex-col justify-between shadow-sm hover:shadow-xl transition-shadow duration-300"
           >
              <h3 className="text-sm font-bold tracking-widest text-gray-900 uppercase">STUDENTS REACHED</h3>
              <div className="flex-grow flex items-center">
                 <h4 className="text-6xl lg:text-8xl font-black tracking-tighter">
                    <AnimatedCounter text={stats?.studentsReached || '1650+'} />
                 </h4>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed">
                 We helped students develop communication skills to build confidence and inspire personal growth.
              </p>
           </motion.div>

           {/* Card 2 */}
           <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, ease: "easeOut", duration: 0.6 }}
              className="bg-white rounded-[2rem] p-10 h-[450px] flex flex-col justify-between shadow-sm hover:shadow-xl transition-shadow duration-300"
           >
              <h3 className="text-sm font-bold tracking-widest text-gray-900 uppercase">INSTITUTIONS</h3>
              <div className="flex-grow flex items-center">
                 <h4 className="text-7xl lg:text-8xl font-black tracking-tighter">
                    <AnimatedCounter text={stats?.institutions || '14+'} />
                 </h4>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed">
                 We back local solutions and partner with schools and organizations to deliver targeted educational programs.
              </p>
           </motion.div>

           {/* Card 3 */}
           <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, ease: "easeOut", duration: 0.6 }}
              className="bg-white rounded-[2rem] p-10 h-[450px] flex flex-col justify-between shadow-sm hover:shadow-xl transition-shadow duration-300"
           >
              <h3 className="text-sm font-bold tracking-widest text-gray-900 uppercase">WORKSHOPS</h3>
              <div className="flex-grow flex items-center">
                 <h4 className="text-6xl lg:text-8xl font-black tracking-tighter">
                    <AnimatedCounter text={stats?.workshops || '20+'} />
                 </h4>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed">
                 We supported communities by organizing interactive sessions focusing on professional and personal development.
              </p>
           </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ImpactStats;

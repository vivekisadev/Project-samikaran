import React, { useState, useEffect } from 'react';

const apiBase = '';

const TestimonialCard = ({ name, role, text, avatar }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md border-primary transition-shadow duration-300 w-full mb-6 break-inside-avoid">
    <div className="flex items-center gap-4 mb-4">
      {avatar ? (
         <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover bg-gray-100 border border-gray-200" />
      ) : (
         <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold text-xl">{name?.charAt(0)}</div>
      )}
      <div>
        <h4 className="font-bold text-gray-900 leading-tight">{name}</h4>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-0.5">{role}</p>
      </div>
    </div>
    <p className="text-gray-600 leading-relaxed text-sm">
      "{text}"
    </p>
  </div>
);

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${apiBase}/api/testimonials`);
        const data = await res.json();
        if (data.success) {
           setTestimonials(data.testimonials.filter(t => t.is_active));
        }
      } catch (err) {
        console.error("Failed to load testimonials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading) {
     return <div className="py-24 text-center">Loading stories...</div>;
  }

  if (testimonials.length === 0) {
     return null; // Don't show the section if no active testimonials
  }

  // Split testimonials into 3 arrays for the 3 columns
  const third = Math.ceil(testimonials.length / 3);
  const col1 = testimonials.slice(0, third);
  const col2 = testimonials.slice(third, third * 2);
  const col3 = testimonials.slice(third * 2);

  return (
    <section className="py-24 bg-gray-50 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl z-0 pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10 text-center mb-16">
        <h2 className="text-primary font-black uppercase tracking-[0.2em] text-xs mb-4">Loved by our community</h2>
        <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">See why they trust us</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Read the stories of transformation and growth from the students, parents, and partners we work with every day.
        </p>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Marquee Columns Container with CSS Mask for smooth top/bottom blur */}
        <div className="flex gap-6 justify-center h-[700px] overflow-hidden group [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
          
          {/* Column 1: Downward */}
          {col1.length > 0 && (
            <div className="flex-1 max-w-[350px] relative">
              <div className="w-full absolute top-0 animate-marquee-vertical-down flex flex-col">
                 {/* Repeat 4 times to ensure it overflows 700px, then duplicate the entire set for seamless 50% translation loop */}
                 {[...col1, ...col1, ...col1, ...col1].map((t, i) => <TestimonialCard key={`c1-${i}`} {...t} />)}
                 {[...col1, ...col1, ...col1, ...col1].map((t, i) => <TestimonialCard key={`c1-dup-${i}`} {...t} />)}
              </div>
            </div>
          )}

          {/* Column 2: Upward */}
          {col2.length > 0 && (
            <div className="flex-1 max-w-[350px] relative hidden md:block">
              <div className="w-full absolute top-0 animate-marquee-vertical-up flex flex-col">
                 {[...col2, ...col2, ...col2, ...col2].map((t, i) => <TestimonialCard key={`c2-${i}`} {...t} />)}
                 {[...col2, ...col2, ...col2, ...col2].map((t, i) => <TestimonialCard key={`c2-dup-${i}`} {...t} />)}
              </div>
            </div>
          )}

          {/* Column 3: Downward */}
          {col3.length > 0 && (
            <div className="flex-1 max-w-[350px] relative hidden lg:block">
              <div className="w-full absolute top-0 animate-marquee-vertical-down flex flex-col">
                 {[...col3, ...col3, ...col3, ...col3].map((t, i) => <TestimonialCard key={`c3-${i}`} {...t} />)}
                 {[...col3, ...col3, ...col3, ...col3].map((t, i) => <TestimonialCard key={`c3-dup-${i}`} {...t} />)}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default Testimonials;

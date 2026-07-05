import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import CustomCursor from './components/CustomCursor';
import SmoothScroll from './components/common/SmoothScroll';

import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';


import Impact from './pages/Impact';
import Media from './pages/Media';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import AdminApp from './admin/AdminApp';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <Layout>
      <SmoothScroll />
      <CustomCursor />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />


        <Route path="/impact" element={<Impact />} />
        <Route path="/media" element={<Media />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/donate/:programId" element={<Donate />} />
        <Route path="/admin/*" element={<AdminApp />} />
        
        <Route path="*" element={
          <div className="flex items-center justify-center min-h-[60vh] flex-col">
            <h1 className="text-4xl font-bold text-gray-300">404</h1>
            <p className="text-gray-500 mt-2">Page Not Found</p>
          </div>
        } />
      </Routes>
    </Layout>
  );
};

export default App;

import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {!isAdmin && <Navbar />}
      <main className={!isAdmin ? "flex-grow pt-16 md:pt-20" : "flex-grow"}>
        {children}
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
};

export default Layout;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, X, Heart } from 'lucide-react';
import { toggleMobileMenu, closeMobileMenu } from '../../store/slices/uiSlice';

import logo from '../../assets/media/1.png.png';

import { motion } from 'framer-motion';

const Navbar = () => {
  const dispatch = useDispatch();
  const { isMobileMenuOpen } = useSelector((state) => state.ui);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Impact', path: '/impact' },
    { name: 'Media', path: '/media' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-[100] bg-white shadow-md border-b border-gray-100"
    >
      <div className="container mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center group shrink-0 h-12 md:h-16 overflow-hidden" onClick={() => dispatch(closeMobileMenu())}>
            <img src={logo} alt="Samikaran Logo" className="h-32 md:h-44 lg:h-48 w-auto object-contain -my-10 md:-my-14 transition-transform duration-300 group-hover:scale-105" />
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
                <Link 
                    key={link.path} 
                    to={link.path}
                    className="relative group"
                >
                    <span className={`text-sm font-medium transition-colors hover:text-primary ${
                        isActive(link.path) ? 'text-primary font-bold' : 'text-gray-600'
                    }`}>
                        {link.name}
                    </span>
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${isActive(link.path) ? 'w-full' : ''}`}></span>
                </Link>
            ))}
            <Link 
                to="/donate" 
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
                <Heart size={18} fill="currentColor" className="animate-pulse" />
                <span>Donate</span>
            </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
            className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors"
            onClick={() => dispatch(toggleMobileMenu())}
        >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-lg p-4 flex flex-col gap-4"
        >
             {navLinks.map((link) => (
                <Link 
                    key={link.path} 
                    to={link.path}
                    className={`block py-2 px-4 rounded-lg transition-colors ${
                        isActive(link.path) ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => dispatch(closeMobileMenu())}
                >
                    {link.name}
                </Link>
            ))}
             <Link 
                to="/donate" 
                className="flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-medium shadow-md hover:bg-primary/90 transition-colors"
                onClick={() => dispatch(closeMobileMenu())}
            >
                <Heart size={18} fill="currentColor" />
                <span>Donate Now</span>
            </Link>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;

//assignment requirements are commented! (plus other comments in general)
import { Link, useLocation } from 'react-router-dom';
import { motion } from "motion/react";
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white"> 
      {/* nav--for all */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute top-0 left-0 right-0 z-30 bg-white border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <Link to="/">
              <motion.div 
                className="text-xl text-black cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                Major Decisions
              </motion.div>
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className={`px-4 py-2 rounded-lg transition-all ${
                  isActive('/') 
                    ? 'text-white bg-red-600' 
                    : 'text-black hover:bg-red-600 hover:text-white'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`px-4 py-2 rounded-lg transition-all ${
                  isActive('/about') 
                    ? 'text-white bg-red-600' 
                    : 'text-black hover:bg-red-600 hover:text-white'
                }`}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className={`px-4 py-2 rounded-lg transition-all ${
                  isActive('/contact') 
                    ? 'text-white bg-red-600' 
                    : 'text-black hover:bg-red-600 hover:text-white'
                }`}
              >
                Contact
              </Link>
              <Link 
                to="/help" 
                className={`px-4 py-2 rounded-lg transition-all ${
                  isActive('/help') 
                    ? 'text-white bg-red-600' 
                    : 'text-black hover:bg-red-600 hover:text-white'
                }`}
              >
                Help
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* page content */}
      {children}

      {/* footer--for all */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-black"
      >
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Link to="/">
                <motion.div 
                  whileHover={{ scale: 1.1, backgroundColor: 'rgb(220, 38, 38)' }}
                  className="text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Home
                </motion.div>
              </Link>
              <Link to="/about">
                <motion.div 
                  whileHover={{ scale: 1.1, backgroundColor: 'rgb(220, 38, 38)' }}
                  className="text-white px-4 py-2 rounded-lg transition-colors"
                >
                  About
                </motion.div>
              </Link>
              <Link to="/contact">
                <motion.div 
                  whileHover={{ scale: 1.1, backgroundColor: 'rgb(220, 38, 38)' }}
                  className="text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Contact
                </motion.div>
              </Link>
              <Link to="/help">
                <motion.div 
                  whileHover={{ scale: 1.1, backgroundColor: 'rgb(220, 38, 38)' }}
                  className="text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Help
                </motion.div>
              </Link>
            </div>
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm text-white/80">
              INST377- Cideth Oliva & Khadija Wane

            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

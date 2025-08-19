import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Stethoscope } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Stethoscope className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">HealthAI Assistant</h1>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/doctors" 
              className={`transition-colors duration-200 ${
                isActive('/doctors') 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              For Doctors
            </Link>
            <Link 
              to="/patients" 
              className={`transition-colors duration-200 ${
                isActive('/patients') 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              For Patients
            </Link>
            <Link 
              to="/rural" 
              className={`transition-colors duration-200 ${
                isActive('/rural') 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Rural Care
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
              Sign In
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Get Demo
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/doctors" 
                className={`transition-colors duration-200 ${
                  isActive('/doctors') 
                    ? 'text-blue-600 font-semibold' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                For Doctors
              </Link>
              <Link 
                to="/patients" 
                className={`transition-colors duration-200 ${
                  isActive('/patients') 
                    ? 'text-blue-600 font-semibold' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                For Patients
              </Link>
              <Link 
                to="/rural" 
                className={`transition-colors duration-200 ${
                  isActive('/rural') 
                    ? 'text-blue-600 font-semibold' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Rural Care
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <button className="text-blue-600 hover:text-blue-700 transition-colors duration-200 mb-2 block">
                  Sign In
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 block w-full text-left">
                  Get Demo
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
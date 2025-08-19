import React from 'react';
import { Stethoscope, Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Stethoscope className="h-8 w-8 text-blue-400" />
              <h3 className="text-2xl font-bold">HealthAI Assistant</h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Revolutionizing healthcare accessibility through intelligent AI solutions. 
              Empowering doctors, patients, and communities worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#doctors" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">For Doctors</a></li>
              <li><a href="#patients" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">For Patients</a></li>
              <li><a href="#rural" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Rural Care</a></li>
              <li><a href="#integration" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">API Documentation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">hello@healthai.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 HealthAI Assistant. All rights reserved. HIPAA Compliant Healthcare Solutions.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
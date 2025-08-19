import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Globe, Users, Stethoscope, Phone } from 'lucide-react';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              AI-Powered Healthcare
              <span className="text-blue-600 block">Assistant Platform</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing healthcare with intelligent voice-to-report generation, 
              ethical data sharing, and accessible rural care solutions. 
              Designed for scalability and low-tech accessibility.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center group">
                Schedule Demo
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link 
                to="/doctors"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center justify-center"
              >
                Explore Platform
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                <Shield className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">HIPAA Compliant</h3>
                <p className="text-gray-600 text-center">Enterprise-grade security with ethical data sharing framework</p>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                <Zap className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered</h3>
                <p className="text-gray-600 text-center">Advanced NLP for voice-to-text and intelligent summarization</p>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                <Globe className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Access</h3>
                <p className="text-gray-600 text-center">Multi-language support for rural and underserved communities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Healthcare Role
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access tailored solutions designed specifically for your healthcare needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Link 
              to="/doctors"
              className="group p-8 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-all duration-200 hover:shadow-lg"
            >
              <div className="text-center">
                <Stethoscope className="h-16 w-16 text-blue-600 mx-auto mb-6 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Healthcare Professionals</h3>
                <p className="text-gray-600 mb-6">
                  Voice-to-report generation, AI summaries, and patient record management
                </p>
                <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700">
                  <span className="font-semibold">Access Doctor Portal</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link 
              to="/patients"
              className="group p-8 bg-green-50 rounded-2xl hover:bg-green-100 transition-all duration-200 hover:shadow-lg"
            >
              <div className="text-center">
                <Users className="h-16 w-16 text-green-600 mx-auto mb-6 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Patients</h3>
                <p className="text-gray-600 mb-6">
                  Access your medical records and manage consent-based data sharing
                </p>
                <div className="flex items-center justify-center text-green-600 group-hover:text-green-700">
                  <span className="font-semibold">Access Patient Portal</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link 
              to="/rural"
              className="group p-8 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-all duration-200 hover:shadow-lg"
            >
              <div className="text-center">
                <Phone className="h-16 w-16 text-purple-600 mx-auto mb-6 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Rural Communities</h3>
                <p className="text-gray-600 mb-6">
                  Call-in service with AI triage and remote doctor consultations
                </p>
                <div className="flex items-center justify-center text-purple-600 group-hover:text-purple-700">
                  <span className="font-semibold">Access Rural Care</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
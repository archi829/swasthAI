import React from 'react';
import { Phone, MessageCircle, Users, MapPin } from 'lucide-react';

const RuralPage = () => {
  const features = [
    {
      icon: Phone,
      title: "Call-in Service",
      description: "Basic phone access for symptom description in local languages"
    },
    {
      icon: MessageCircle,
      title: "AI Triage Assistant",
      description: "Intelligent questioning to gather relevant medical information"
    },
    {
      icon: Users,
      title: "Remote Doctor Reviews",
      description: "Volunteer healthcare professionals provide expert consultations"
    },
    {
      icon: MapPin,
      title: "Local Language Support",
      description: "Responses delivered in local dialects for better understanding"
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Rural Healthcare Access
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Bridging the healthcare gap for underserved communities with accessible, 
            AI-powered remote consultation and triage services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-blue-800 rounded-xl hover:bg-blue-700 transition-colors duration-200">
              <feature.icon className="h-10 w-10 text-blue-300 mb-4" />
              <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
              <p className="text-blue-100">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              Asynchronous Care Model
            </h3>
            <div className="space-y-4 text-blue-100">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <p>Patient calls and describes symptoms in their native language</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <p>AI triage assistant asks relevant follow-up questions</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <p>Case review by qualified volunteer healthcare professionals</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
                <p>Response and recommendations delivered in local dialect</p>
              </div>
            </div>
          </div>

          <div className="bg-white text-gray-900 rounded-2xl p-8">
            <h4 className="text-2xl font-bold mb-6 text-center">Impact Statistics</h4>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-sm text-gray-600">Supported Languages</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Availability</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
                <div className="text-sm text-gray-600">Triage Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">2hrs</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
            </div>
            <button className="w-full mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuralPage;
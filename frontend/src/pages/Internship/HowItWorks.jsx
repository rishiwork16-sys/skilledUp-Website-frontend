// src/pages/Internship/HowItWorks.jsx
import React from 'react';
import Button from '../../components/ui/Button';

const HowItWorks = ({ onApplyClick }) => {
  const steps = [
    {
      icon: '📝',
      title: 'Apply Online',
      description: 'Choose your preferred domain and submit your application in minutes',
      color: 'bg-green-600'
    },
    {
      icon: '✉️',
      title: 'Get Offer Letter',
      description: 'Receive an official internship offer letter to begin your journey',
      color: 'bg-amber-600'
    },
    {
      icon: '📋',
      title: 'Weekly Tasks',
      description: 'Work on weekly tasks and gain hands-on experience',
      color: 'bg-blue-600'
    },
    {
      icon: '📤',
      title: 'Submit Projects',
      description: 'Upload projects to showcase your learning',
      color: 'bg-blue-600'
    },
    {
      icon: '🏆',
      title: 'Earn Certificates',
      description: 'Receive verified certificates and experience letter',
      color: 'bg-green-600'
    }
  ];

  return (
    <section className="bg-gray-900 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-3">
            How It Works
          </h2>
          <p className="text-gray-300 font-semibold">
            Understand your internship journey in just a few simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mb-10">
          {steps.map((step, index) => (
            <div key={index} className="text-center p-4">
              <div className="relative w-14 h-14 mx-auto mb-4">
                <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white">{step.icon}</span>
                </div>
                <div className={`absolute -top-2 -right-2 w-6 h-6 ${step.color} rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-gray-900`}>
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-white font-black mb-2">
                {step.title}
              </h3>
              
              <p className="text-gray-300 text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={onApplyClick}
            variant="primary"
            size="medium"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Start Your Journey Today →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
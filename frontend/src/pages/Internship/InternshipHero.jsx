// src/pages/Internship/InternshipHero.jsx
import React from 'react';
import Button from '../../components/ui/Button';

const InternshipHero = ({ activeInterns, domainsCount, onApplyClick }) => {
  return (
    <section className="bg-blue-800 py-10 px-4 text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-6">
          Gain Real Industry Experience with Our Virtual Internship Program
        </h1>
        <p className="text-blue-100 text-lg font-semibold mb-8 max-w-2xl mx-auto">
          Work on live projects, learn from experts, and earn a verified internship certificate.
        </p>
        
        <Button
  onClick={onApplyClick}
  variant="secondary"  // This uses blue-100 background
  size="large"
  className="bg-white text-blue-800 hover:bg-white hover:shadow-lg"
>
  Apply For Internship →
</Button>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-10">
          <div className="text-center">
            <div className="text-4xl font-black text-white mb-2">
              {activeInterns.toLocaleString()}+
            </div>
            <div className="text-blue-200 text-sm font-bold">
              Active Interns
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-black text-white mb-2">
              {domainsCount}+
            </div>
            <div className="text-blue-200 text-sm font-bold">
              Domains
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-black text-white mb-2">
              100%
            </div>
            <div className="text-blue-200 text-sm font-bold">
              Remote Work
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InternshipHero;
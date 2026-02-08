import React, { useState } from 'react';

const DifferencesSection = () => {
  const [hoveredDiffIndex, setHoveredDiffIndex] = useState(null);

  const differencePoints = [
    {
      title: 'Industry-Driven Curriculum',
      desc: 'Designed with real-world business use cases and current market demand.',
    },
    {
      title: 'Hands-On Learning',
      desc: 'Live training, projects, internships, and practical assignments.',
    },
    {
      title: 'Expert Mentorship',
      desc: 'Learn directly from industry professionals and experienced practitioners.',
    },
    {
      title: 'Placement-First Approach',
      desc: 'Interview preparation, career guidance, and recruiter alignment from day one.',
    },
    {
      title: 'Career Continuity',
      desc: 'Support that extends beyond course completion until placement.',
    },
    {
      title: 'Verified Certification',
      desc: 'Earn recognized certificates to validate your skills and boost your professional profile.',
    }
  ];

  return (
    <section className="py-20 px-5 bg-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">What Makes skilledUp Different</h2>
          <p className="text-gray-600 text-lg">
            We don't just teach course material; we construct career pathways using a holistic approach to education.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {differencePoints.map((point, index) => {
            const isHovered = hoveredDiffIndex === index;
            return (
              <div
                key={index}
                className={`bg-white p-8 rounded-2xl shadow-sm border border-white/50 transition-all duration-400 h-full flex flex-col relative overflow-hidden cursor-default ${
                  isHovered ? 'transform -translate-y-3 shadow-xl border-blue-200' : ''
                }`}
                onMouseEnter={() => setHoveredDiffIndex(index)}
                onMouseLeave={() => setHoveredDiffIndex(null)}
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 text-center">
                  {point.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed flex-grow">
                  {point.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DifferencesSection;
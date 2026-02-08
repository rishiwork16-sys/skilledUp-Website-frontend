// src/pages/Internship/Certificates.jsx
import React from 'react';
import Card from '../../components/ui/Card';

const Certificates = ({ onImageClick }) => {
  const certificates = [
    {
      title: 'Internship Offer Letter',
      description: 'Official offer letter confirming your internship role and start date.',
      image: '/images/internship_letter.jpg'
    },
    {
      title: 'Internship Certificate',
      description: 'Verified certificate showcasing your skills and hands-on experience.',
      image: '/images/internship_certificate.png'
    },
    {
      title: 'Letter of Recommendation',
      description: 'Personalized letter highlighting your performance and contributions.',
      image: '/images/recommended_letter.jpg'
    }
  ];

  return (
    <section className="py-10 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-3">
            Internship Certificate Preview
          </h2>
          <p className="text-gray-600 font-semibold">
            Official Documentation That Boosts Your Career Credibility
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {certificates.map((cert, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="p-6 text-center">
                <h3 className="text-xl font-black text-blue-800 mb-3">
                  {cert.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  {cert.description}
                </p>
              </div>
              
              <div className="bg-gray-50 border-t border-gray-200 p-8 flex items-center justify-center">
                <div 
  className="w-48 h-32 border-2 border-gray-300 rounded-lg overflow-hidden shadow-md cursor-pointer bg-white relative group"
  onClick={() => onImageClick(cert.image)}
>
  {/* ✅ PREVIEW IMAGE */}
  <img
    src={cert.image}
    alt={cert.title}
    className="w-full h-full object-contain"
  />

  {/* 🔍 Hover overlay */}
  {/* <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <div className="bg-blue-600/90 text-white px-4 py-2 rounded-full text-xs font-bold">
      Click to Zoom
    </div>
  </div> */}
</div>

              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
import React from 'react';

const MissionSection = () => {
  return (
    <section className="py-10 px-5 border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-8 text-center">Our Mission</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="pr-4">
            <p className="text-gray-600 mb-4 leading-relaxed">
              At skilledUp, our mission is to bridge the gap between education and employability by transforming
              academic knowledge into real-world, job-ready skills. We are committed to empowering students and
              professionals with industry-relevant training, hands-on projects, expert mentorship, and continuous
              career guidance.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Through a placement-first approach and a strong focus on emerging technologies like
              Data Science, Analytics, and Artificial Intelligence, we strive to build confident, capable, and future-ready
              professionals who can thrive in a rapidly evolving digital economy.
            </p>
          </div>
          <div className="flex justify-center items-center">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Innovation and Growth"
              className="w-full h-64 md:h-72 rounded-lg object-cover shadow-lg"
              onError={(e) => {
                e.target.style.background = 'linear-gradient(45deg, #2563eb, #1e40af)';
                e.target.classList.add('flex', 'justify-center', 'items-center', 'text-white', 'text-lg', 'font-medium');
                e.target.innerHTML = 'Innovation & Growth';
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-black text-white py-10 px-5 text-center border-b-2 border-blue-600">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">About skilledUp</h1>
        <p className="text-lg md:text-xl opacity-90 mt-2">
          From classroom knowledge to real-world impact, skilledUp prepares you for what employers need.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
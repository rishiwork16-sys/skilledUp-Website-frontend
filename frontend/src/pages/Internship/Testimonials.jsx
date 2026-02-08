// src/pages/Internship/Testimonials.jsx
import React from "react";
import Card from "../../components/ui/Card";
import { testimonials } from "../../constants/testimonials";

const Testimonials = ({
  currentSlide,
  onNextSlide,
  onPrevSlide,
  onGoToSlide,
}) => {
  return (
    <section className="bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-3">
            Success Stories
          </h2>
          <p className="text-gray-600 font-semibold max-w-2xl mx-auto">
            Hear from our interns who transformed their careers
          </p>
        </div>

        {/* Slider Wrapper */}
        <div className="relative max-w-3xl mx-auto">
          {/* Prev Button */}
          <button
            onClick={onPrevSlide}
            className="
              absolute left-0 top-1/2 -translate-y-1/2 
              -translate-x-4 md:-translate-x-6
              bg-blue-600/80 text-white 
              w-10 h-10 rounded-full 
              flex items-center justify-center 
              hover:bg-blue-700 
              z-10
            "
          >
            ‹
          </button>

          {/* Slides */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <Card className="p-6">
                    {/* Header */}
                    <div className="flex items-start mb-4">
                      {/* ✅ PERFECT INITIALS AVATAR */}
                      <div
                        className="
                          w-10 h-10
                          sm:w-12 sm:h-12
                          rounded-full
                          bg-gradient-to-br from-blue-600 to-blue-800
                          border-2 border-blue-600
                          mr-3 sm:mr-4
                          flex items-center justify-center
                          shrink-0
                        "
                      >
                        <div
                          className="
                            w-full h-full
                            flex items-center justify-center
                            text-white
                            text-sm sm:text-lg
                            font-black
                            leading-none
                          "
                        >
                          {testimonial.initials}
                        </div>
                      </div>

                      {/* Name & Role */}
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-blue-800">
                          {testimonial.name}
                        </h3>
                        <p className="text-gray-600 font-semibold text-xs sm:text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>

                    {/* Quote */}
                    <p className="text-gray-600 italic text-base sm:text-lg leading-relaxed">
                      “{testimonial.quote}”
                    </p>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={onNextSlide}
            className="
              absolute right-0 top-1/2 -translate-y-1/2 
              translate-x-4 md:translate-x-6
              bg-blue-600/80 text-white 
              w-10 h-10 rounded-full 
              flex items-center justify-center 
              hover:bg-blue-700 
              z-10
            "
          >
            ›
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => onGoToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index
                  ? "bg-blue-600 scale-125"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

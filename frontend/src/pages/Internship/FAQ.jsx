// src/pages/Internship/FAQ.jsx
import React, { useState } from 'react';
import { faqs } from '../../constants/faqs';

const FAQItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-blue-800 font-bold text-lg pr-4">
          {question}
        </h3>
        <span className="text-blue-600 font-black text-xl">
          {isOpen ? '−' : '+'}
        </span>
      </div>
      <div className={`mt-3 text-gray-600 ${isOpen ? 'block' : 'hidden'}`}>
        {answer}
      </div>
    </div>
  );
};

const FAQ = () => {
  return (
    <section className="bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 font-semibold">
            Find answers to common questions about our internship program
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
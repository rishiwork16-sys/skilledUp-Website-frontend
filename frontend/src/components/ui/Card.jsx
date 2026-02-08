// src/components/ui/Card.jsx
import React from 'react';

const Card = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
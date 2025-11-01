
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-sm p-4 text-center">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-primary">
          AI Marketing Mockup Generator
        </h1>
        <p className="text-gray-600 mt-1">
          Instantly visualize your brand on anything.
        </p>
      </div>
    </header>
  );
};

export default Header;

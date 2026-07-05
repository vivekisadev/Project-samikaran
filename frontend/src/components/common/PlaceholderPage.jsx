import React from 'react';

const PlaceholderPage = ({ title }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-xl text-gray-600 max-w-lg mb-8">
        We are working hard to bring this page to life. Stay tuned for updates regarding {title.toLowerCase()}.
      </p>
      <div className="w-20 h-1 bg-secondary rounded-full"></div>
    </div>
  );
};

export default PlaceholderPage;

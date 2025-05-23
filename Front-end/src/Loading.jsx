import React from 'react';
import { assets } from './assets/assets';

const Loading = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <img 
        src={assets.logo} // Adjust if using a different path
        alt="Loading..." 
        className="w-24 h-24 object-contain"
      />
    </div>
  );
};

export default Loading;

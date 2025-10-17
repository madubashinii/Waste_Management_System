import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', size = 'default' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div className={`animate-spin rounded-full border-b-2 border-emerald-600 ${sizeClasses[size]}`}></div>
      <span className="ml-2 text-gray-600">{message}</span>
    </div>
  );
};

export default LoadingSpinner;

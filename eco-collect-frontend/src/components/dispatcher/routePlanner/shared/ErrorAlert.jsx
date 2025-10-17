import React from 'react';

const ErrorAlert = ({ error, className = '' }) => {
  if (!error) return null;

  return (
    <div className={`mb-4 p-3 bg-red-50 border border-red-200 rounded-lg ${className}`}>
      <p className="text-sm text-red-600">{error}</p>
    </div>
  );
};

export default ErrorAlert;

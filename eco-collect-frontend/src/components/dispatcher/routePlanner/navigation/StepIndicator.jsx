import React from 'react';

const StepIndicator = ({ currentStep, steps }) => {
  const currentStepData = steps.find(step => step.id === currentStep);
  
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Step {currentStep}: {currentStepData?.title || 'Unknown Step'}
      </h2>
    </div>
  );
};

export default StepIndicator;

import React from 'react';

const StepProgressBar = ({ steps, currentStep }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                isActive ? 'bg-emerald-600 text-white' :
                isCompleted ? 'bg-emerald-100 text-emerald-600' :
                'bg-gray-200 text-gray-500'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-xs mt-1 ${isActive ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgressBar;

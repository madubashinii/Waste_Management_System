import React from 'react';
import { 
  HiOutlineChevronLeft, 
  HiOutlineChevronRight, 
  HiOutlineCheckCircle 
} from 'react-icons/hi';

const StepNavigation = ({ 
  currentStep, 
  totalSteps, 
  canProceed, 
  saving, 
  onPrevious, 
  onNext, 
  onSave 
}) => {
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  return (
    <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
      <button
        onClick={onPrevious}
        disabled={isFirstStep}
        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <HiOutlineChevronLeft className="w-4 h-4" />
        Previous
      </button>
      
      {isLastStep ? (
        <button
          onClick={onSave}
          disabled={saving}
          className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <HiOutlineCheckCircle className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Route'}
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Next
          <HiOutlineChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default StepNavigation;

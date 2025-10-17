import { useState } from 'react';
import {
  HiOutlineMap,
  HiOutlineLocationMarker,
  HiOutlinePlus,
  HiOutlineArrowRight,
  HiOutlineTruck,
  HiOutlineCheckCircle
} from 'react-icons/hi';
import { validateStep, canProceedToStep } from './utils/stepValidation';

export const useStepNavigation = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: 'Route Name', icon: HiOutlineMap },
    { id: 2, title: 'Date & Zone', icon: HiOutlineLocationMarker },
    { id: 3, title: 'Add Wards', icon: HiOutlinePlus },
    { id: 4, title: 'Arrange Order', icon: HiOutlineArrowRight },
    { id: 5, title: 'Assign Truck', icon: HiOutlineTruck },
    { id: 6, title: 'Save Route', icon: HiOutlineCheckCircle },
  ];

  // Navigation functions
  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const goToStep = (stepNumber) => {
    if (stepNumber >= 1 && stepNumber <= steps.length) {
      setCurrentStep(stepNumber);
    }
  };

  const resetToFirstStep = () => {
    setCurrentStep(1);
  };

  // Validation function for each step
  const canProceed = (formData) => {
    return canProceedToStep(currentStep, formData);
  };

  // Get validation message for current step
  const getValidationMessage = (formData) => {
    return validateStep(currentStep, formData);
  };

  // Check if step is completed
  const isStepCompleted = (stepNumber, formData) => {
    return currentStep > stepNumber;
  };

  // Check if step is active
  const isStepActive = (stepNumber) => {
    return currentStep === stepNumber;
  };

  return {
    // State
    currentStep,
    steps,
    
    // Navigation functions
    nextStep,
    prevStep,
    goToStep,
    resetToFirstStep,
    
    // Validation functions
    canProceed,
    getValidationMessage,
    isStepCompleted,
    isStepActive
  };
};

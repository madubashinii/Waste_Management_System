/**
 * Step validation utilities for route planner
 */

export const STEP_VALIDATORS = {
  routeName: (value) => {
    if (!value || !value.trim()) return 'Please enter a route name';
    if (value.trim().length < 3) return 'Route name must be at least 3 characters';
    if (value.trim().length > 100) return 'Route name must be less than 100 characters';
    return null;
  },

  collectionDate: (value) => {
    if (!value) return 'Please select a collection date';
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) return 'Collection date cannot be in the past';
    return null;
  },

  selectedZone: (value) => {
    if (!value) return 'Please select a zone';
    return null;
  },

  selectedWards: (value) => {
    if (!value || value.length === 0) return 'Please select at least one ward';
    return null;
  },

  assignedTruck: (value) => {
    if (!value) return 'Please assign a truck';
    return null;
  }
};

export const validateStep = (stepNumber, formData) => {
  switch (stepNumber) {
    case 1: 
      return STEP_VALIDATORS.routeName(formData.routeName);
    case 2: 
      const dateError = STEP_VALIDATORS.collectionDate(formData.collectionDate);
      if (dateError) return dateError;
      return STEP_VALIDATORS.selectedZone(formData.selectedZone);
    case 3: 
      return STEP_VALIDATORS.selectedWards(formData.selectedWards);
    case 4: 
      return STEP_VALIDATORS.selectedWards(formData.selectedWards);
    case 5: 
      return STEP_VALIDATORS.assignedTruck(formData.assignedTruck);
    case 6: 
      return null; // Final step, no validation needed
    default: 
      return 'Please complete the current step';
  }
};

export const canProceedToStep = (stepNumber, formData) => {
  return validateStep(stepNumber, formData) === null;
};

import { useState, useCallback } from 'react';

/**
 * Custom hook for managing form state with validation
 */
export const useFormState = (initialState = {}) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const updateFields = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const setFieldError = useCallback((field, error) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const setAllErrors = useCallback((newErrors) => {
    setErrors(newErrors);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialState);
    setErrors({});
  }, [initialState]);

  const validateField = useCallback((field, validator) => {
    const value = formData[field];
    const error = validator ? validator(value) : null;
    
    if (error) {
      setFieldError(field, error);
      return false;
    } else {
      setFieldError(field, null);
      return true;
    }
  }, [formData, setFieldError]);

  const validateForm = useCallback((validators) => {
    let isValid = true;
    const newErrors = {};

    Object.keys(validators).forEach(field => {
      const validator = validators[field];
      const value = formData[field];
      const error = validator ? validator(value) : null;
      
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData]);

  return {
    formData,
    errors,
    updateField,
    updateFields,
    setFieldError,
    setAllErrors,
    clearErrors,
    resetForm,
    validateField,
    validateForm
  };
};

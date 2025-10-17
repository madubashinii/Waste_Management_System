// Ward validation utilities
export const validateWard = (ward, index, allWards = []) => {
  const { wardNumber, wardName } = ward;
  
  if (!wardNumber || !wardName.trim()) return 'Both fields required';
  if (isNaN(wardNumber) || wardNumber < 1) return 'Invalid ward number';
  if (wardName.trim().length < 2) return 'Name too short';
  
  // Check for duplicates within the same form
  if (allWards.some((w, i) => i !== index && w.wardNumber === wardNumber)) {
    return 'Duplicate ward number';
  }
  if (allWards.some((w, i) => i !== index && w.wardName === ward.wardName)) {
    return 'Duplicate ward name';
  }
  
  return null;
};

export const validateWards = (wards) => {
  const validWards = wards.filter(w => w.wardNumber && w.wardName.trim());
  
  if (validWards.length === 0) {
    return { isValid: false, error: 'At least one ward required' };
  }

  for (let i = 0; i < validWards.length; i++) {
    const wardError = validateWard(validWards[i], i, validWards);
    if (wardError) {
      return { isValid: false, error: `Ward ${i + 1}: ${wardError}` };
    }
  }

  return { isValid: true, validWards };
};

// Zone validation utilities
export const validateZoneName = (zoneName) => {
  const trimmed = zoneName.trim();
  
  if (!trimmed) return 'Zone name is required';
  if (trimmed.length < 3) return 'Zone name must be at least 3 characters';
  if (trimmed.length > 100) return 'Zone name must be less than 100 characters';
  
  return null;
};

// Route name validation
export const validateRouteName = (routeName) => {
  const trimmed = routeName.trim();
  
  if (!trimmed) return 'Route name is required';
  if (trimmed.length < 3) return 'Route name must be at least 3 characters';
  if (trimmed.length > 100) return 'Route name must be less than 100 characters';
  
  return null;
};

import { useState, useEffect } from 'react';
import { wardService } from '../../../../services/dispatcher';
import { validateWards } from '../shared/validation';

export const useWardManagement = () => {
  const [wards, setWards] = useState([{ wardNumber: '', wardName: '' }]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addWard = () => setWards([...wards, { wardNumber: '', wardName: '' }]);
  
  const removeWard = (index) => setWards(wards.filter((_, i) => i !== index));
  
  const updateWard = (index, field, value) => {
    const updated = [...wards];
    updated[index] = { ...updated[index], [field]: value };
    setWards(updated);
  };

  const validateAndSaveWards = async (selectedZoneId, zones) => {
    if (!selectedZoneId) {
      setError('Please select a zone');
      return { success: false };
    }

    const validation = validateWards(wards);
    if (!validation.isValid) {
      setError(validation.error);
      return { success: false };
    }

    setIsLoading(true);
    setError('');

    try {
      const zone = zones.find(z => z.zoneId === parseInt(selectedZoneId));
      const results = [];
      let successCount = 0;

      for (const ward of validation.validWards) {
        try {
          const response = await wardService.createWard({
            zoneId: zone.zoneId,
            wardNumber: parseInt(ward.wardNumber),
            wardName: ward.wardName.trim()
          });
          
          if (response.success) {
            results.push({ success: true, ward: response.data });
            successCount++;
          } else {
            results.push({ success: false, ward, message: response.message });
          }
        } catch (err) {
          results.push({ success: false, ward, message: err.message });
        }
      }

      const message = `${successCount}/${validation.validWards.length} ward(s) created successfully in zone "${zone.zoneName}"!`;
      return { 
        success: true, 
        data: { zone, wardResults: results, successCount }, 
        message 
      };
    } catch (err) {
      setError(err.message || 'Failed to save wards');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setWards([{ wardNumber: '', wardName: '' }]);
    setError('');
    setIsLoading(false);
  };

  return {
    wards,
    error,
    isLoading,
    addWard,
    removeWard,
    updateWard,
    validateAndSaveWards,
    reset,
    setError
  };
};

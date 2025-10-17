import { useState, useEffect } from 'react';
import { zoneService } from '../../../../services/dispatcher';

export const useZoneManagement = (isOpen) => {
  const [zones, setZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) loadZones();
  }, [isOpen]);

  const loadZones = async () => {
    try {
      const response = await zoneService.getAllZones();
      if (response.success) {
        setZones(response.data || []);
      } else {
        setError('Failed to load zones');
      }
    } catch (err) {
      setError('Failed to load zones');
    }
  };

  const reset = () => {
    setSelectedZoneId('');
    setError('');
  };

  return {
    zones,
    selectedZoneId,
    setSelectedZoneId,
    error,
    setError,
    reset
  };
};

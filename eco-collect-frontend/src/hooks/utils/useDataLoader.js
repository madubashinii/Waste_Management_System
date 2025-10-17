import { useState, useCallback } from 'react';
import { useAsyncOperation } from './useAsyncOperation';

/**
 * Custom hook for managing data loading operations
 */
export const useDataLoader = () => {
  const [data, setData] = useState([]);
  const { loading, error, execute, clearError } = useAsyncOperation();

  const loadData = useCallback(async (serviceCall, onSuccess, onError) => {
    return execute(
      async () => {
        const response = await serviceCall();
        // Check if response has success property (backend API format)
        if (response && typeof response === 'object' && 'success' in response) {
          if (response.success) {
            const loadedData = response.data || [];
            setData(loadedData);
            return loadedData;
          } else {
            throw new Error(response.message || 'Failed to load data');
          }
        } else {
          // If response doesn't have success property, assume it's the data directly
          const loadedData = Array.isArray(response) ? response : (response?.data || []);
          setData(loadedData);
          return loadedData;
        }
      },
      onSuccess,
      onError
    );
  }, [execute]);

  const refreshData = useCallback(async (serviceCall, onSuccess, onError) => {
    return loadData(serviceCall, onSuccess, onError);
  }, [loadData]);

  const clearData = useCallback(() => {
    setData([]);
    clearError();
  }, [clearError]);

  return {
    data,
    loading,
    error,
    loadData,
    refreshData,
    clearData,
    setData
  };
};

import { useState } from 'react';
import { useFormState, useAsyncOperation } from './utils';
import { RoutePlannerService } from './services/routePlannerService';

const INITIAL_FORM_STATE = {
  routeName: '',
  collectionDate: '',
  selectedZone: '',
  selectedWards: [],
  assignedTruck: ''
};

export const useRoutePlanner = (getCurrentUserId) => {
  // Form state management
  const {
    formData,
    updateField,
    updateFields,
    resetForm: resetFormState
  } = useFormState(INITIAL_FORM_STATE);

  // Async operation management
  const { loading: saving, execute } = useAsyncOperation();

  // Ward management functions
  const handleWardToggle = (ward) => {
    const currentWards = formData.selectedWards;
    const newWards = currentWards.some(w => w.wardId === ward.wardId)
      ? currentWards.filter(w => w.wardId !== ward.wardId)
      : [...currentWards, ward];
    
    updateField('selectedWards', newWards);
  };

  const moveWard = (index, direction) => {
    const currentWards = [...formData.selectedWards];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < currentWards.length) {
      [currentWards[index], currentWards[targetIndex]] = [currentWards[targetIndex], currentWards[index]];
      updateField('selectedWards', currentWards);
    }
  };

  // Reset form function
  const resetForm = () => {
    resetFormState();
  };

  // Save route function
  const handleSaveRoute = async (onSuccess, onError) => {
    try {
      // Get current user ID (dispatcher) from auth context
      const dispatcherId = getCurrentUserId();
      
      if (!dispatcherId) {
        onError?.('Please sign in to create routes');
        return;
      }

      // Validate form data
      RoutePlannerService.validateRouteData(formData);

      // Execute the save operation
      await execute(
        async () => {
          // Prepare route data
          const routeData = RoutePlannerService.prepareRouteData(formData, dispatcherId);
          
          // Create the route
          const createdRoute = await RoutePlannerService.createRoute(routeData);
          
          // Save ward order if wards are selected
          if (formData.selectedWards.length > 0) {
            await RoutePlannerService.saveWardOrder(createdRoute.routeId, formData.selectedWards);
          }
          
          return createdRoute;
        },
        (createdRoute) => {
          const message = `Route created successfully with ${formData.selectedWards.length} ward(s) in order! Status: Pending`;
          onSuccess?.(message);
          resetForm();
        },
        (error) => {
          onError?.(error.message || 'Failed to create route. Please try again.');
        }
      );
    } catch (error) {
      console.error('Error saving route:', error);
      onError?.(error.message || 'Failed to create route. Please try again.');
    }
  };

  return {
    // Form state
    routeName: formData.routeName,
    setRouteName: (value) => updateField('routeName', value),
    collectionDate: formData.collectionDate,
    setCollectionDate: (value) => updateField('collectionDate', value),
    selectedZone: formData.selectedZone,
    setSelectedZone: (value) => updateField('selectedZone', value),
    selectedWards: formData.selectedWards,
    setSelectedWards: (value) => updateField('selectedWards', value),
    assignedTruck: formData.assignedTruck,
    setAssignedTruck: (value) => updateField('assignedTruck', value),
    saving,
    
    // Functions
    handleWardToggle,
    moveWard,
    resetForm,
    handleSaveRoute
  };
};

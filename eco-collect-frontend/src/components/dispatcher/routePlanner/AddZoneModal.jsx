import React, { useState } from 'react';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { zoneService } from '../../../services/dispatcher/index.js';
import { BaseModal, ErrorAlert, LoadingButton } from './shared';
import { validateZoneName } from './shared/validation';

const AddZoneModal = ({ isOpen, onClose, onSave }) => {
  const [zoneName, setZoneName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    const validationError = validateZoneName(zoneName);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await zoneService.createZone({ zoneName: zoneName.trim() });
      if (!response.success) throw new Error(response.message || 'Failed to create zone');
      
      onSave(response.data, `Zone "${zoneName}" created successfully!`);
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to save zone');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setZoneName('');
    setError('');
    setIsLoading(false);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Zone"
      icon={HiOutlineLocationMarker}
      maxWidth="max-w-md"
    >
      <ErrorAlert error={error} />

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Zone Name *
        </label>
        <input
          type="text"
          value={zoneName}
          onChange={(e) => setZoneName(e.target.value)}
          placeholder="e.g., Colombo North District 1"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      </div>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> After creating the zone, you can add wards to it using the Add wards section.
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3">
        <LoadingButton
          onClick={handleClose}
          disabled={isLoading}
          variant="secondary"
        >
          Cancel
        </LoadingButton>
        <LoadingButton
          onClick={handleSave}
          loading={isLoading}
          loadingText="Creating..."
        >
          Create Zone
        </LoadingButton>
      </div>
    </BaseModal>
  );
};

export default AddZoneModal;

import React from 'react';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { BaseModal, ErrorAlert, LoadingButton, WardForm } from './shared';
import { useWardManagement } from './hooks/useWardManagement';
import { useZoneManagement } from './hooks/useZoneManagement';
import { validateWard } from './shared/validation';

const AddWardsModal = ({ isOpen, onClose, onSave }) => {
  const wardManagement = useWardManagement();
  const zoneManagement = useZoneManagement(isOpen);

  const handleSave = async () => {
    const result = await wardManagement.validateAndSaveWards(
      zoneManagement.selectedZoneId, 
      zoneManagement.zones
    );
    
    if (result.success) {
      onSave(result.data, result.message);
      handleClose();
    }
  };

  const handleClose = () => {
    wardManagement.reset();
    zoneManagement.reset();
    onClose();
  };

  const combinedError = wardManagement.error || zoneManagement.error;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Wards"
      icon={HiOutlineLocationMarker}
      maxWidth="max-w-2xl"
    >
      <ErrorAlert error={combinedError} />

      {/* Zone Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Zone *</label>
        <select
          value={zoneManagement.selectedZoneId}
          onChange={(e) => zoneManagement.setSelectedZoneId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="">Select a zone...</option>
          {zoneManagement.zones.map((zone) => (
            <option key={zone.zoneId} value={zone.zoneId}>
              {zone.zoneName}
            </option>
          ))}
        </select>
      </div>

      {/* Ward Form */}
      <WardForm
        wards={wardManagement.wards}
        onAddWard={wardManagement.addWard}
        onRemoveWard={wardManagement.removeWard}
        onUpdateWard={wardManagement.updateWard}
        validateWard={validateWard}
      />

      {/* Footer */}
      <div className="flex items-center justify-end gap-3">
        <LoadingButton
          onClick={handleClose}
          disabled={wardManagement.isLoading}
          variant="secondary"
        >
          Cancel
        </LoadingButton>
        <LoadingButton
          onClick={handleSave}
          loading={wardManagement.isLoading}
          loadingText="Creating..."
          disabled={!zoneManagement.selectedZoneId}
        >
          Create Wards
        </LoadingButton>
      </div>
    </BaseModal>
  );
};

export default AddWardsModal;

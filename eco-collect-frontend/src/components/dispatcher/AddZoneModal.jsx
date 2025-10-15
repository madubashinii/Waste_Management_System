import { useState } from 'react';
import { HiX, HiOutlinePlus, HiOutlineTrash, HiOutlineLocationMarker } from 'react-icons/hi';
import { zoneService } from '../../services/dispatcher/zoneService';

const AddZoneModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    zoneName: '',
    wards: [{ wardNumber: '', wardName: '' }]
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [visibleWardsCount, setVisibleWardsCount] = useState(5); // Show 5 wards initially

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.zoneName.trim()) newErrors.zoneName = 'Zone name is required';
    
    formData.wards.forEach((ward, index) => {
      if (!ward.wardNumber || !ward.wardName.trim()) {
        newErrors[`ward_${index}`] = 'Both ward number and name are required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save zone
  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({}); // Clear previous errors
    
    try {
      const zoneData = {
        zoneName: formData.zoneName,
        wards: formData.wards.map(ward => ({
          wardNumber: parseInt(ward.wardNumber),
          wardName: ward.wardName
        }))
      };

      console.log('Sending zone data:', zoneData);
      const response = await zoneService.createZone(zoneData);
      console.log('API response:', response);
      
      // Pass success message to parent component
      const successMessage = `Zone "${zoneData.zoneName}" with ${zoneData.wards.length} wards saved successfully!`;
      onSave(response.data || response, successMessage);
      handleClose();
      
    } catch (error) {
      console.error('Error saving zone:', error);
      setErrors({ general: error.message || 'Failed to save zone. Please check if the backend server is running.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Load more wards
  const loadMoreWards = () => {
    setVisibleWardsCount(prev => Math.min(prev + 5, formData.wards.length));
  };


  //  Reset form
  const handleClose = () => {
    setFormData({ zoneName: '', wards: [{ wardNumber: '', wardName: '' }] });
    setErrors({});
    setIsLoading(false);
    setVisibleWardsCount(5); // Reset visible wards count
    onClose();
  };

  // Update form data
  const updateFormData = (updates) => setFormData(prev => ({ ...prev, ...updates }));
  const updateWard = (index, field, value) => {
    const updatedWards = [...formData.wards];
    updatedWards[index] = { ...updatedWards[index], [field]: value };
    updateFormData({ wards: updatedWards });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <HiOutlineLocationMarker className="mr-2 text-emerald-600" />
            Add New Zone
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <HiX className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Zone Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Zone Name *</label>
            <input
              type="text"
              value={formData.zoneName}
              onChange={(e) => updateFormData({ zoneName: e.target.value })}
              placeholder="e.g., Colombo North District 1"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.zoneName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.zoneName && <p className="mt-1 text-sm text-red-600">{errors.zoneName}</p>}
          </div>

          {/* Wards Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Wards</h3>
              <button
                onClick={() => {
                  updateFormData({ wards: [...formData.wards, { wardNumber: '', wardName: '' }] });
                  // If we're showing all wards, increase visible count to show the new one
                  if (visibleWardsCount >= formData.wards.length) {
                    setVisibleWardsCount(prev => prev + 1);
                  }
                }}
                className="flex items-center px-3 py-1 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                <HiOutlinePlus className="mr-1" />
                Add Ward
              </button>
            </div>

            {/* Scrollable Wards Container */}
            <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
              <div className="space-y-4 p-4">
                {formData.wards.slice(0, visibleWardsCount).map((ward, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ward Number *</label>
                      <input
                        type="number"
                        value={ward.wardNumber}
                        onChange={(e) => updateWard(index, 'wardNumber', e.target.value)}
                        placeholder="e.g., 1"
                        min="1"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          errors[`ward_${index}`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div className="flex-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ward Name *</label>
                      <input
                        type="text"
                        value={ward.wardName}
                        onChange={(e) => updateWard(index, 'wardName', e.target.value)}
                        placeholder="e.g., Mattakkuliya"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          errors[`ward_${index}`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {formData.wards.length > 1 && (
                      <button
                        onClick={() => {
                          const updatedWards = formData.wards.filter((_, i) => i !== index);
                          updateFormData({ wards: updatedWards });
                          // Adjust visible count if needed
                          if (visibleWardsCount > updatedWards.length) {
                            setVisibleWardsCount(updatedWards.length);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg"
                      >
                        <HiOutlineTrash className="text-lg" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Load More Button */}
              {visibleWardsCount < formData.wards.length && (
                <div className="p-4 border-t border-gray-200 bg-white">
                  <button
                    onClick={loadMoreWards}
                    className="w-full py-2 px-4 text-emerald-600 hover:text-emerald-700 font-medium border border-emerald-200 hover:border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    Load More Wards ({formData.wards.length - visibleWardsCount} remaining)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Zone'
            )}
          </button>
        </div>
      </div>

    </div>
  );
};

export default AddZoneModal;
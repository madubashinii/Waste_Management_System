import { useState, useEffect } from 'react';
import { HiOutlineTruck, HiOutlineX, HiOutlinePlus } from 'react-icons/hi';
import { vehicleService } from '../../services/dispatcher/vehicleService';

// Constants
const VEHICLE_TYPES = ['Compactor', 'Open Truck', 'Small Collection Vehicle'];
const VEHICLE_CAPACITIES = ['3 tons', '5 tons', '7 tons', '8 tons', '10 tons', '12 tons'];
const VEHICLE_STATUSES = ['available', 'assigned', 'maintenance', 'out_of_service'];
const INITIAL_FORM_DATA = { vehicleNumber: '', vehicleType: '', capacity: '', status: 'available' };

// Utility functions
const formatStatus = (status) => status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

const AddVehicleModal = ({ isOpen, onClose, onSave, vehicleData, onVehicleChange, isEditMode = false }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(vehicleData || INITIAL_FORM_DATA);
    setErrors({});
  }, [vehicleData, isOpen]);

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onVehicleChange(updated);
  };

  const validateForm = () => {
    const { vehicleNumber, vehicleType, capacity } = formData;
    if (!vehicleNumber || !vehicleType || !capacity) {
      setErrors({ general: 'Please fill in all required fields' });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = isEditMode 
        ? await vehicleService.updateVehicle(vehicleData.id, formData)
        : await vehicleService.createVehicle(formData);
      
      if (response.success) {
        setFormData(INITIAL_FORM_DATA);
        onVehicleChange(INITIAL_FORM_DATA);
        onSave(response.data);
        onClose();
      } else {
        setErrors({ general: response.message });
      }
    } catch (error) {
      setErrors({ general: error.message || `Failed to ${isEditMode ? 'update' : 'create'} vehicle. Please try again.` });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormField = ({ field, label, type, placeholder, options }) => (
    <div key={field}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {type === 'select' ? (
        <select
          value={formData[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="">Select {field.replace('_', ' ')}</option>
          {options.map(option => (
            <option key={option} value={option}>
              {field === 'status' ? formatStatus(option) : option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={formData[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      )}
    </div>
  );

  const formFields = [
    { field: 'vehicleNumber', label: 'Vehicle Number *', type: 'text', placeholder: 'e.g., WM-101' },
    { field: 'vehicleType', label: 'Vehicle Type *', type: 'select', options: VEHICLE_TYPES },
    { field: 'capacity', label: 'Capacity *', type: 'select', options: VEHICLE_CAPACITIES },
    { field: 'status', label: 'Status', type: 'select', options: VEHICLE_STATUSES }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <HiOutlineTruck className="mr-2 text-emerald-600" />
            {isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <HiOutlineX className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formFields.map(renderFormField)}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <HiOutlinePlus className="mr-2" />
                {isEditMode ? 'Save Changes' : 'Add Vehicle'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVehicleModal;
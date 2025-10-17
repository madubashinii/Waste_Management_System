import { useState, useEffect } from 'react';
import { HiOutlineTruck, HiOutlineX, HiOutlinePlus } from 'react-icons/hi';
import { truckService } from '../../services/dispatcher/truckService';

const TRUCK_TYPES = [
  'Mini Truck', 'Small Tipper Truck', 'Open Truck (Medium)', 'Compactor Truck',
  'Flatbed Truck', 'Tanker Truck', 'Heavy Dump Truck'
];

const TRUCK_CAPACITIES = [1000, 1500, 3000, 5000, 6000, 7000, 8000, 10000, 12000, 15000];
const TRUCK_STATUSES = ['Active', 'Maintenance', 'Inactive'];
const INITIAL_FORM_DATA = { truckName: '', truckType: '', capacityKg: '', status: 'Active' };

const TRUCK_CAPACITY_MAPPING = {
  'Mini Truck': { min: 1000, max: 1500 },
  'Small Tipper Truck': { min: 3000, max: 5000 },
  'Open Truck (Medium)': { min: 5000, max: 7000 },
  'Compactor Truck': { min: 8000, max: 10000 },
  'Flatbed Truck': { min: 6000, max: 8000 },
  'Tanker Truck': { min: 8000, max: 12000 },
  'Heavy Dump Truck': { min: 12000, max: 15000 }
};

const getRecommendedCapacityRange = (truckType) => TRUCK_CAPACITY_MAPPING[truckType] || null;

const AddTruckModal = ({ isOpen, onClose, onSave, truckData, onTruckChange, isEditMode = false }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(truckData || INITIAL_FORM_DATA);
    setErrors({});
  }, [truckData, isOpen]);

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onTruckChange(updated);
  };

  const validateForm = () => {
    const { truckName, truckType, capacityKg } = formData;
    if (!truckName || !truckType || !capacityKg) {
      setErrors({ general: 'Please fill in all required fields' });
      return false;
    }
    if (capacityKg && (isNaN(capacityKg) || capacityKg <= 0)) {
      setErrors({ general: 'Capacity must be a positive number' });
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
        ? await truckService.updateTruck(truckData.truckId, formData)
        : await truckService.createTruck(formData);
      
      if (response.success) {
        setFormData(INITIAL_FORM_DATA);
        onTruckChange(INITIAL_FORM_DATA);
        onSave(response.data);
        onClose();
      } else {
        setErrors({ general: response.message });
      }
    } catch (error) {
      setErrors({ general: error.message || `Failed to ${isEditMode ? 'update' : 'create'} truck. Please try again.` });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormField = ({ field, label, type, placeholder, options }) => {
    const capacityRange = field === 'capacityKg' ? getRecommendedCapacityRange(formData.truckType) : null;
    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500";
    
    return (
      <div key={field}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {field === 'capacityKg' && capacityRange && (
            <span className="ml-2 text-xs text-emerald-600 font-normal">
              * Recommended: {capacityRange.min} - {capacityRange.max} kg
            </span>
          )}
        </label>
        {type === 'select' ? (
          <select value={formData[field]} onChange={(e) => handleChange(field, e.target.value)} className={inputClass}>
            <option value="">Select {field.replace('_', ' ')}</option>
            {options.map(option => {
              const isRecommended = field === 'capacityKg' && capacityRange && 
                option >= capacityRange.min && option <= capacityRange.max;
              return (
                <option key={option} value={option} className={isRecommended ? 'font-semibold' : ''}>
                  {field === 'capacityKg' ? `${option} kg${isRecommended ? ' *' : ''}` : option}
                </option>
              );
            })}
          </select>
        ) : (
          <input
            type={type}
            value={formData[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={placeholder}
            className={inputClass}
          />
        )}
        {field === 'capacityKg' && capacityRange && (
          <div className="mt-1 text-xs text-gray-500">
            <span className="text-emerald-600">*</span> Recommended capacity range for {formData.truckType}
          </div>
        )}
      </div>
    );
  };

  const formFields = [
    { field: 'truckName', label: 'Truck Name *', type: 'text', placeholder: 'e.g., WM-Truck-101' },
    { field: 'truckType', label: 'Truck Type *', type: 'select', options: TRUCK_TYPES },
    { field: 'capacityKg', label: 'Capacity (kg) *', type: 'select', options: TRUCK_CAPACITIES },
    { field: 'status', label: 'Status', type: 'select', options: TRUCK_STATUSES }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <HiOutlineTruck className="mr-2 text-emerald-600" />
            {isEditMode ? 'Edit Truck' : 'Add New Truck'}
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
                {isEditMode ? 'Save Changes' : 'Add Truck'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTruckModal;
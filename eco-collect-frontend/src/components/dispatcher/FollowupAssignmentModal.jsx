import { useState, useEffect } from 'react';
import { HiOutlineUser, HiOutlineTruck, HiOutlineX, HiOutlineClock, HiOutlineExclamationCircle } from 'react-icons/hi';
import { followupService } from '../../services/dispatcher/followupService';
import { truckService } from '../../services/dispatcher/truckService';
import userService from '../../services/userService';

// Priority options
const PRIORITY_OPTIONS = [
  { value: 'NORMAL', label: 'Normal', color: 'bg-gray-100 text-gray-800' },
  { value: 'HIGH', label: 'High', color: 'bg-red-100 text-red-800' }
];

// Initial form data
const INITIAL_FORM_DATA = {
  driverId: '',
  truckId: '',
  priority: 'NORMAL',
  dueDate: '',
  collectionDate: '',
  notes: ''
};

const FollowupAssignmentModal = ({ 
  isOpen, 
  onClose, 
  followup, 
  onSave 
}) => {
  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Data state
  const [drivers, setDrivers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState(null);

  // Load data when modal opens
  useEffect(() => {
    if (isOpen) {
      loadData();
      // Set default due date to tomorrow if not provided
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultDueDate = tomorrow.toISOString().slice(0, 16); // Format for datetime-local input
      
      setFormData({
        ...INITIAL_FORM_DATA,
        dueDate: defaultDueDate,
        collectionDate: defaultDueDate,
        priority: followup?.priority || 'NORMAL'
      });
      setErrors({});
    }
  }, [isOpen, followup]);

  const loadData = async () => {
    setLoadingData(true);
    setDataError(null);

    try {
      // Load drivers and trucks in parallel
      const [driversResponse, trucksResponse] = await Promise.all([
        userService.getCollectors(), // Drivers are collectors
        truckService.getAllTrucks()
      ]);

      // Process drivers data
      let driversData = [];
      if (driversResponse && Array.isArray(driversResponse)) {
        driversData = driversResponse.map(driver => ({
          id: driver.userId,
          name: driver.name,
          email: driver.email,
          status: 'available'
        }));
      }

      // Process trucks data
      let trucksData = [];
      if (trucksResponse && trucksResponse.data) {
        trucksData = trucksResponse.data
          .filter(truck => truck.status === 'Active') // Only active trucks
          .map(truck => ({
            id: truck.truckId,
            name: truck.truckName,
            type: truck.truckType,
            capacity: truck.capacityKg,
            status: truck.status
          }));
      }

      setDrivers(driversData);
      setTrucks(trucksData);

    } catch (error) {
      console.error('Error loading assignment data:', error);
      setDataError('Failed to load drivers and trucks. Please try again.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Driver is required
    if (!formData.driverId) {
      newErrors.driverId = 'Please select a driver';
    }
    
    // Truck is required
    if (!formData.truckId) {
      newErrors.truckId = 'Please select a truck';
    }
    
    // Due date is required and must be in the future
    if (!formData.dueDate) {
      newErrors.dueDate = 'Please select a due date';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.dueDate = 'Due date must be in the future';
      }
    }
    
    // Collection date is required and must be in the future
    if (!formData.collectionDate) {
      newErrors.collectionDate = 'Please select a collection date';
    } else {
      const selectedDate = new Date(formData.collectionDate);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.collectionDate = 'Collection date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Ensure the date format includes seconds for proper LocalDateTime parsing
      const formattedCollectionDate = formData.collectionDate + ':00';

      // Debug: Log the data being sent
      console.log('Assignment data being sent:', {
        followupId: followup.id,
        driverId: parseInt(formData.driverId),
        truckId: parseInt(formData.truckId),
        originalCollectionDate: formData.collectionDate,
        formattedCollectionDate: formattedCollectionDate
      });

      // Call the complete assignment API which updates followup, route_stops, and sets status to IN_PROGRESS
      const response = await followupService.completeFollowupAssignment(
        followup.id,
        parseInt(formData.driverId),
        parseInt(formData.truckId),
        formattedCollectionDate
      );

      if (response?.success) {
        onSave(response.data);
        handleClose();
      } else {
        setErrors({ general: response?.message || 'Failed to complete followup assignment' });
      }
    } catch (error) {
      console.error('Error completing followup assignment:', error);
      setErrors({ 
        general: error.message || 'Failed to complete followup assignment. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setDataError(null);
    onClose();
  };

  const getSelectedDriver = () => {
    return drivers.find(d => d.id === parseInt(formData.driverId));
  };

  const getSelectedTruck = () => {
    return trucks.find(t => t.id === parseInt(formData.truckId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <HiOutlineUser className="mr-2 text-emerald-600" />
            Complete Followup Assignment
          </h2>
          <button 
            onClick={handleClose} 
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <HiOutlineX className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Followup Info */}
          {followup && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Followup Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">ID:</span>
                  <span className="ml-2 font-medium">#{followup.id}</span>
                </div>
                <div>
                  <span className="text-gray-600">Bin ID:</span>
                  <span className="ml-2 font-medium">{followup.binId}</span>
                </div>
                <div>
                  <span className="text-gray-600">Ward:</span>
                  <span className="ml-2 font-medium">{followup.wardName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Reason:</span>
                  <span className="ml-2 font-medium">{followup.reasonCode}</span>
                </div>
              </div>
            </div>
          )}

          {/* Data Loading Error */}
          {dataError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <HiOutlineExclamationCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-800">{dataError}</p>
              </div>
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <HiOutlineExclamationCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Driver Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Driver *
              </label>
              <select
                value={formData.driverId}
                onChange={(e) => handleChange('driverId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.driverId ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loadingData || isLoading}
              >
                <option value="">Select a driver...</option>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name} ({driver.email})
                  </option>
                ))}
              </select>
              {errors.driverId && (
                <p className="mt-1 text-sm text-red-600">{errors.driverId}</p>
              )}
              {getSelectedDriver() && (
                <p className="mt-1 text-sm text-gray-500">
                  Selected: {getSelectedDriver().name}
                </p>
              )}
            </div>

            {/* Truck Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Truck *
              </label>
              <select
                value={formData.truckId}
                onChange={(e) => handleChange('truckId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.truckId ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loadingData || isLoading}
              >
                <option value="">Select a truck...</option>
                {trucks.map(truck => (
                  <option key={truck.id} value={truck.id}>
                    {truck.name} - {truck.type} ({truck.capacity}kg)
                  </option>
                ))}
              </select>
              {errors.truckId && (
                <p className="mt-1 text-sm text-red-600">{errors.truckId}</p>
              )}
              {getSelectedTruck() && (
                <p className="mt-1 text-sm text-gray-500">
                  Selected: {getSelectedTruck().name} ({getSelectedTruck().type})
                </p>
              )}
            </div>

            {/* Priority Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="space-y-2">
                {PRIORITY_OPTIONS.map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value={option.value}
                      checked={formData.priority === option.value}
                      onChange={(e) => handleChange('priority', e.target.value)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                      disabled={isLoading}
                    />
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${option.color}`}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.dueDate ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Select when this followup should be completed
              </p>
            </div>

            {/* Collection Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.collectionDate}
                onChange={(e) => handleChange('collectionDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.collectionDate ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.collectionDate && (
                <p className="mt-1 text-sm text-red-600">{errors.collectionDate}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Select when the collection should be performed (updates route_stops table)
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
                placeholder="Add any additional notes or instructions for the driver..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                disabled={isLoading}
              />
              <p className="mt-1 text-sm text-gray-500">
                Optional notes or special instructions for the driver
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || loadingData || dataError}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <HiOutlineClock className="animate-spin mr-2 h-4 w-4" />
                Completing Assignment...
              </>
            ) : (
              <>
                <HiOutlineUser className="mr-2 h-4 w-4" />
                Complete Assignment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowupAssignmentModal;

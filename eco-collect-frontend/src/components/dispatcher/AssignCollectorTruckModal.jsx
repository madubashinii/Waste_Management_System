import { useState, useEffect } from 'react';
import { HiOutlineX, HiOutlineUserGroup, HiOutlineTruck, HiOutlineCheck } from 'react-icons/hi';
import userService from '../../services/userService';
import { truckService } from '../../services/dispatcher/truckService';
import { routeService } from '../../services/dispatcher/routeService';
import SnackBar from '../common/SnackBar';

const AssignCollectorTruckModal = ({ 
  isOpen, 
  onClose, 
  route, 
  onAssign 
}) => {
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [collectors, setCollectors] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [snackbar, setSnackbar] = useState({ isOpen: false, message: '', type: 'success' });

  useEffect(() => {
    if (isOpen) {
      loadCollectorsAndTrucks();
    } else {
      // Reset selections when modal closes
      setSelectedCollector(null);
      setSelectedTruck(null);
      setError(null);
    }
  }, [isOpen, route]);

  const loadCollectorsAndTrucks = async () => {
    setLoadingData(true);
    setError(null);
    
    try {
      // Load collectors and trucks in parallel
      const [collectorsResponse, trucksResponse] = await Promise.all([
        userService.getCollectors(),
        truckService.getAllTrucks()
      ]);
      
      console.log('Collectors response:', collectorsResponse);
      console.log('Trucks response:', trucksResponse);
      
      // Handle collectors data
      let collectorsData = [];
      if (collectorsResponse && Array.isArray(collectorsResponse)) {
        // userService.getCollectors() returns the array directly via axios
        collectorsData = collectorsResponse.map(collector => ({
          id: collector.userId,
          name: collector.name,
          email: collector.email,
          status: 'available' // Default status for collectors
        }));
      } else if (collectorsResponse && collectorsResponse.data && Array.isArray(collectorsResponse.data)) {
        // Fallback for different response structure
        collectorsData = collectorsResponse.data.map(collector => ({
          id: collector.userId || collector.id,
          name: collector.name,
          email: collector.email,
          status: 'available'
        }));
      }
      
      console.log('Processed collectors data:', collectorsData);
      
      // Handle trucks data
      let trucksData = [];
      if (trucksResponse && trucksResponse.data) {
        trucksData = trucksResponse.data.map(truck => ({
          id: truck.truckId,
          name: truck.truckName,
          capacity: truck.capacityKg ? `${truck.capacityKg}kg` : truck.truckType,
          status: truck.status === 'Active' ? 'available' : 'in_use',
          licensePlate: truck.licensePlate || 'N/A'
        }));
      }
      
      setCollectors(collectorsData);
      setTrucks(trucksData);
      
      // Pre-select existing assignments if available
      if (route) {
        const existingCollector = collectorsData.find(c => c.id === route.collectorId);
        const existingTruck = trucksData.find(t => t.id === route.truckId);
        setSelectedCollector(existingCollector || null);
        setSelectedTruck(existingTruck || null);
      }
    } catch (error) {
      console.error('Error loading collectors and trucks:', error);
      setError(`Failed to load collectors and trucks: ${error.message || 'Unknown error'}`);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCollector || !selectedTruck) {
      setError('Please select both a collector and a truck');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Assign collector first
      const collectorResponse = await routeService.assignCollector(
        route.routeId,
        selectedCollector.id
      );
      
      if (!collectorResponse || !collectorResponse.success) {
        throw new Error(collectorResponse?.message || 'Failed to assign collector');
      }
      
      // Assign truck to route
      const truckResponse = await routeService.assignTruck(route.routeId, selectedTruck.id);
      
      if (!truckResponse || !truckResponse.success) {
        throw new Error(truckResponse?.message || 'Failed to assign truck');
      }
      
      // Update route status to in_progress (using underscore to match enum)
      try {
        await routeService.updateRouteStatus(route.routeId, 'in_progress');
      } catch (statusError) {
        console.warn('Failed to update route status:', statusError);
        // Continue with assignment even if status update fails
      }
      
      // Call the onAssign callback with the selected data
      onAssign({
        routeId: route.routeId,
        collectorId: selectedCollector.id,
        collectorName: selectedCollector.name,
        truckId: selectedTruck.id,
        truckName: selectedTruck.name,
        status: 'in_progress'
      });
      
      // Show success message
      setSnackbar({
        isOpen: true,
        message: `Successfully assigned ${selectedCollector.name} and ${selectedTruck.name} to ${route.routeName}`,
        type: 'success'
      });
      
      // Close modal after a short delay to show the success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to assign collector and truck. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedCollector(null);
    setSelectedTruck(null);
    setError(null);
    setCollectors([]);
    setTrucks([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Assign Collector & Truck
            </h2>
            {route && (
              <p className="text-sm text-gray-600 mt-1">
                Route: {route.routeName} • Zone: {route.zoneName}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <HiOutlineX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loadingData && (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-600">Loading collectors and trucks...</span>
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Collectors Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineUserGroup className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-semibold text-gray-900">Select Collector</h3>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {collectors.length === 0 && !loadingData ? (
                  <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">No collectors available</p>
                  </div>
                ) : (
                  collectors.map((collector) => (
                  <div
                    key={collector.id}
                    onClick={() => setSelectedCollector(collector)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedCollector?.id === collector.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : collector.status === 'available'
                        ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{collector.name}</p>
                        <p className="text-sm text-gray-600">{collector.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          collector.status === 'available'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {collector.status}
                        </span>
                        {selectedCollector?.id === collector.id && (
                          <HiOutlineCheck className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
                )}
              </div>
            </div>

            {/* Trucks Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineTruck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-semibold text-gray-900">Select Truck</h3>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {trucks.map((truck) => (
                  <div
                    key={truck.id}
                    onClick={() => setSelectedTruck(truck)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTruck?.id === truck.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : truck.status === 'available'
                        ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{truck.name}</p>
                        <p className="text-sm text-gray-600">
                          {truck.capacity} • {truck.licensePlate}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          truck.status === 'available'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {truck.status}
                        </span>
                        {selectedTruck?.id === truck.id && (
                          <HiOutlineCheck className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedCollector || !selectedTruck || loading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Assigning...
              </>
            ) : (
              <>
                <HiOutlineCheck className="w-4 h-4" />
                Assign Collector & Truck
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Success SnackBar */}
      <SnackBar
        isOpen={snackbar.isOpen}
        onClose={() => setSnackbar({ ...snackbar, isOpen: false })}
        message={snackbar.message}
        type={snackbar.type}
      />
    </div>
  );
};

export default AssignCollectorTruckModal;

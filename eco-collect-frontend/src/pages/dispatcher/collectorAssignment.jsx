import { useState } from 'react';
import DispatcherSidebar from '../../components/dispatcher/DispatcherSidebar';
import VehicleManagementModal from '../../components/dispatcher/VehicleManagementModal';
import {
  HiOutlineTruck,
  HiOutlineUserGroup,
  HiOutlineCheckCircle,
  HiOutlineSearch,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineRefresh,
  HiOutlineMap,
  HiOutlineTrash,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineCog,
} from 'react-icons/hi';

// Constants
const DRIVERS = [
  { id: 'driver-1', name: 'Nimal Perera', license: 'DL-001234', status: 'available', experience: '5 years' },
  { id: 'driver-2', name: 'Kumari Silva', license: 'DL-002345', status: 'assigned', experience: '3 years' },
  { id: 'driver-3', name: 'Kamal Fernando', license: 'DL-003456', status: 'available', experience: '7 years' },
  { id: 'driver-4', name: 'Sunil Bandara', license: 'DL-004567', status: 'assigned', experience: '4 years' },
  { id: 'driver-5', name: 'Sanduni Jayasinghe', license: 'DL-005678', status: 'available', experience: '2 years' },
  { id: 'driver-6', name: 'Ranjith Mendis', license: 'DL-006789', status: 'on-leave', experience: '6 years' },
];

const TRUCKS = [
  { id: 'truck-1', name: 'WM-101', capacity: '5 tons', type: 'Compactor', status: 'available', lastService: '2024-10-01' },
  { id: 'truck-2', name: 'WM-207', capacity: '7 tons', type: 'Compactor', status: 'assigned', lastService: '2024-09-28' },
  { id: 'truck-3', name: 'WM-312', capacity: '5 tons', type: 'Open Truck', status: 'available', lastService: '2024-10-05' },
  { id: 'truck-4', name: 'WM-408', capacity: '10 tons', type: 'Compactor', status: 'assigned', lastService: '2024-09-25' },
  { id: 'truck-5', name: 'WM-515', capacity: '5 tons', type: 'Open Truck', status: 'maintenance', lastService: '2024-10-10' },
  { id: 'truck-6', name: 'WM-623', capacity: '7 tons', type: 'Compactor', status: 'available', lastService: '2024-10-03' },
];

// Mock published routes
const mockPublishedRoutes = [
  { 
    id: 'route-1', 
    routeName: 'CMB-Fort-R01', 
    zone: 'Colombo Fort', 
    date: '2024-10-15', 
    stops: 18, 
    status: 'unassigned',
    wasteType: 'Mixed',
    distance: '12.5 km',
  },
  { 
    id: 'route-2', 
    routeName: 'CMB-007-R02', 
    zone: 'Cinnamon Gardens', 
    date: '2024-10-15', 
    stops: 20, 
    status: 'assigned',
    wasteType: 'Recyclable',
    distance: '15.3 km',
    driver: 'Kumari Silva',
    truck: 'WM-207',
  },
  { 
    id: 'route-3', 
    routeName: 'NEG-012-R03', 
    zone: 'Negombo', 
    date: '2024-10-16', 
    stops: 25, 
    status: 'unassigned',
    wasteType: 'Organic',
    distance: '18.2 km',
  },
  { 
    id: 'route-4', 
    routeName: 'KDY-008-R04', 
    zone: 'Kandy City', 
    date: '2024-10-16', 
    stops: 21, 
    status: 'assigned',
    wasteType: 'Mixed',
    distance: '16.8 km',
    driver: 'Sunil Bandara',
    truck: 'WM-408',
  },
  { 
    id: 'route-5', 
    routeName: 'GAL-015-R05', 
    zone: 'Galle Fort', 
    date: '2024-10-17', 
    stops: 16, 
    status: 'unassigned',
    wasteType: 'Recyclable',
    distance: '10.4 km',
  },
];

const STATUS_COLORS = {
  available: 'bg-emerald-100 text-emerald-800',
  assigned: 'bg-blue-100 text-blue-800',
  'on-leave': 'bg-gray-100 text-gray-800',
  maintenance: 'bg-amber-100 text-amber-800',
  unassigned: 'bg-red-100 text-red-800',
};

// Reusable Components
const FilterSection = ({ filters, onFilterChange }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
      <HiOutlineSearch className="mr-2" />
      Filter Routes
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <HiOutlineCalendar className="inline mr-1" />
          Date
        </label>
        <input
          type="date"
          value={filters.date}
          onChange={(e) => onFilterChange('date', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <HiOutlineLocationMarker className="inline mr-1" />
          Zone
        </label>
        <select
          value={filters.zone}
          onChange={(e) => onFilterChange('zone', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="all">All Zones</option>
          <option value="colombo-fort">Colombo Fort</option>
          <option value="colombo-07">Cinnamon Gardens</option>
          <option value="negombo">Negombo</option>
          <option value="kandy">Kandy City</option>
          <option value="galle">Galle Fort</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="all">All Status</option>
          <option value="unassigned">Unassigned</option>
          <option value="assigned">Assigned</option>
        </select>
      </div>
    </div>
  </div>
);

const RouteCard = ({ route, onAssign }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
    route.status === 'unassigned' ? 'border-red-600' : 'border-emerald-600'
  }`}>
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-bold text-gray-900">{route.routeName}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[route.status]}`}>
            {route.status.toUpperCase()}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="flex items-center text-sm text-gray-600">
            <HiOutlineLocationMarker className="mr-2 text-emerald-600" />
            <span>{route.zone}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <HiOutlineCalendar className="mr-2 text-emerald-600" />
            <span>{route.date}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <HiOutlineMap className="mr-2 text-emerald-600" />
            <span>{route.stops} stops • {route.distance}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <HiOutlineTrash className="mr-2 text-emerald-600" />
            <span>{route.wasteType}</span>
          </div>
        </div>

        {route.status === 'assigned' && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center text-emerald-800">
                <HiOutlineUserGroup className="mr-2" />
                <span className="font-medium">{route.driver}</span>
              </div>
              <div className="flex items-center text-emerald-800">
                <HiOutlineTruck className="mr-2" />
                <span className="font-medium">{route.truck}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    <button
      onClick={() => onAssign(route)}
      className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
        route.status === 'unassigned'
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
    >
      {route.status === 'unassigned' ? 'Assign Collector & Vehicle' : 'Reassign'}
    </button>
  </div>
);

const AssignmentModal = ({ route, isOpen, onClose, onConfirm }) => {
  const [selectedDriver, setSelectedDriver] = useState(route?.driver || '');
  const [selectedTruck, setSelectedTruck] = useState(route?.truck || '');

  if (!isOpen || !route) return null;

  const availableDrivers = DRIVERS.filter(d => d.status === 'available' || d.name === route.driver);
  const availableTrucks = TRUCKS.filter(t => t.status === 'available' || t.name === route.truck);

  const handleConfirm = () => {
    const driver = DRIVERS.find(d => d.id === selectedDriver);
    const truck = TRUCKS.find(t => t.id === selectedTruck);
    
    if (driver && truck) {
      onConfirm(route.id, driver, truck);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Assign Collector & Vehicle</h2>
          <p className="text-sm text-gray-600 mt-1">Route: {route.routeName}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Route Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Route Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Zone:</span>
                <span className="ml-2 font-medium text-gray-900">{route.zone}</span>
              </div>
              <div>
                <span className="text-gray-600">Date:</span>
                <span className="ml-2 font-medium text-gray-900">{route.date}</span>
              </div>
              <div>
                <span className="text-gray-600">Stops:</span>
                <span className="ml-2 font-medium text-gray-900">{route.stops}</span>
              </div>
              <div>
                <span className="text-gray-600">Distance:</span>
                <span className="ml-2 font-medium text-gray-900">{route.distance}</span>
              </div>
            </div>
          </div>

          {/* Driver Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <HiOutlineUserGroup className="inline mr-1" />
              Select Collector
            </label>
            <div className="space-y-2">
              {availableDrivers.map(driver => (
                <div
                  key={driver.id}
                  onClick={() => setSelectedDriver(driver.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedDriver === driver.id
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{driver.name}</p>
                      <p className="text-sm text-gray-600">{driver.license} • {driver.experience}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[driver.status]}`}>
                      {driver.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Truck Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <HiOutlineTruck className="inline mr-1" />
              Select Vehicle
            </label>
            <div className="space-y-2">
              {availableTrucks.map(truck => (
                <div
                  key={truck.id}
                  onClick={() => setSelectedTruck(truck.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedTruck === truck.id
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{truck.name}</p>
                      <p className="text-sm text-gray-600">{truck.type} • {truck.capacity}</p>
                      <p className="text-xs text-gray-500 mt-1">Last service: {truck.lastService}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[truck.status]}`}>
                      {truck.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confirmation Message */}
          {selectedDriver && selectedTruck && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-sm text-emerald-800 flex items-center">
                <HiOutlineCheckCircle className="mr-2" />
                Ready to assign. Click "Confirm Assignment" to proceed.
              </p>
            </div>
          )}

          {/* Warnings */}
          {availableDrivers.length === 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-sm text-red-800 flex items-center">
                <HiOutlineExclamationCircle className="mr-2" />
                No available collectors. All collectors are currently assigned or on leave.
              </p>
            </div>
          )}
          {availableTrucks.length === 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 flex items-center">
                <HiOutlineExclamationCircle className="mr-2" />
                No available vehicles. All vehicles are currently assigned or under maintenance.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedDriver || !selectedTruck}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold"
          >
            Confirm Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

const ResourceOverview = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    {/* Collectors Overview */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <HiOutlineUserGroup className="mr-2" />
        Collectors Overview
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Available</span>
          <span className="font-bold text-emerald-600">
            {DRIVERS.filter(d => d.status === 'available').length}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Assigned</span>
          <span className="font-bold text-blue-600">
            {DRIVERS.filter(d => d.status === 'assigned').length}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">On Leave</span>
          <span className="font-bold text-gray-600">
            {DRIVERS.filter(d => d.status === 'on-leave').length}
          </span>
        </div>
      </div>
    </div>

    {/* Vehicles Overview */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <HiOutlineTruck className="mr-2" />
        Vehicles Overview
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Available</span>
          <span className="font-bold text-emerald-600">
            {TRUCKS.filter(t => t.status === 'available').length}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Assigned</span>
          <span className="font-bold text-blue-600">
            {TRUCKS.filter(t => t.status === 'assigned').length}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Under Maintenance</span>
          <span className="font-bold text-amber-600">
            {TRUCKS.filter(t => t.status === 'maintenance').length}
          </span>
        </div>
      </div>
    </div>
  </div>
);

// Main Component
const CollectorAssignment = () => {
  const today = new Date().toISOString().split('T')[0];
  
  const [filters, setFilters] = useState({
    date: today,
    zone: 'all',
    status: 'all',
  });

  const [routes, setRoutes] = useState(mockPublishedRoutes);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleAssignClick = (route) => {
    setSelectedRoute(route);
    setIsModalOpen(true);
  };

  const handleConfirmAssignment = (routeId, driver, truck) => {
    setRoutes(prev => prev.map(route => 
      route.id === routeId 
        ? { ...route, status: 'assigned', driver: driver.name, truck: truck.name }
        : route
    ));
    setIsModalOpen(false);
    setSelectedRoute(null);
  };

  // Filter routes based on selected filters
  const filteredRoutes = routes.filter(route => {
    if (filters.zone !== 'all' && !route.zone.toLowerCase().includes(filters.zone)) {
      return false;
    }
    if (filters.status !== 'all' && route.status !== filters.status) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <DispatcherSidebar />
      
      <div className="lg:pl-72">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-8 pb-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Collector & Vehicle Assignment</h1>
                <p className="mt-2 text-gray-600">Assign collectors and vehicles to published routes</p>
              </div>
              <button
                onClick={() => setIsVehicleModalOpen(true)}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                <HiOutlineCog className="mr-2" />
                Manage Vehicles
              </button>
            </div>
          </div>

          {/* Resource Overview */}
          <ResourceOverview />

          {/* Filter Section */}
          <FilterSection
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {/* Routes List */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Published Routes</h2>
              <span className="text-sm text-gray-600">
                Showing {filteredRoutes.length} of {routes.length} routes
              </span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRoutes.length === 0 ? (
                <div className="col-span-2 bg-white rounded-lg shadow-md p-8 text-center">
                  <HiOutlineClock className="mx-auto text-4xl text-gray-400 mb-2" />
                  <p className="text-gray-500">No routes match your filters</p>
                </div>
              ) : (
                filteredRoutes.map(route => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    onAssign={handleAssignClick}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      <AssignmentModal
        route={selectedRoute}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRoute(null);
        }}
        onConfirm={handleConfirmAssignment}
      />

      {/* Vehicle Management Modal */}
      <VehicleManagementModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
      />
    </div>
  );
};

export default CollectorAssignment;


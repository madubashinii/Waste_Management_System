import { useState, useEffect } from 'react';
import DispatcherSidebar from '../../components/dispatcher/DispatcherSidebar';
import TruckManagementModal from '../../components/dispatcher/TruckManagementModal';
import PublishedRoutesCard from '../../components/dispatcher/PublishedRoutesCard';
import AssignCollectorTruckModal from '../../components/dispatcher/AssignCollectorTruckModal';
import { truckService } from '../../services/dispatcher/truckService';
import { zoneService } from '../../services/dispatcher/zoneService';
import { routeService } from '../../services/dispatcher/routeService';
import userService from '../../services/userService';
import {
  HiOutlineTruck,
  HiOutlineUserGroup,
  HiOutlineSearch,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineRefresh,
  HiOutlineCog,
} from 'react-icons/hi';


const TRUCKS = [
  { truckId: 1, truckName: 'WM-Truck-101', truckType: 'Compactor Truck', capacityKg: 10000, status: 'Active', lastService: '2024-10-01' },
  { truckId: 2, truckName: 'WM-Truck-207', truckType: 'Open Truck (Medium)', capacityKg: 7000, status: 'Active', lastService: '2024-09-28' },
  { truckId: 3, truckName: 'WM-Truck-312', truckType: 'Small Tipper Truck', capacityKg: 5000, status: 'Active', lastService: '2024-10-05' },
  { truckId: 4, truckName: 'WM-Truck-408', truckType: 'Tanker Truck', capacityKg: 12000, status: 'Active', lastService: '2024-09-25' },
  { truckId: 5, truckName: 'WM-Truck-515', truckType: 'Mini Truck', capacityKg: 1500, status: 'Maintenance', lastService: '2024-10-10' },
  { truckId: 6, truckName: 'WM-Truck-623', truckType: 'Flatbed Truck', capacityKg: 8000, status: 'Active', lastService: '2024-10-03' },
  { truckId: 7, truckName: 'WM-Truck-734', truckType: 'Heavy Dump Truck', capacityKg: 15000, status: 'Active', lastService: '2024-09-30' },
];

// Routes data is now fetched by PublishedRoutesCard component

const STATUS_COLORS = {
  available: 'bg-emerald-100 text-emerald-800',
  assigned: 'bg-blue-100 text-blue-800',
  'on-leave': 'bg-gray-100 text-gray-800',
  maintenance: 'bg-amber-100 text-amber-800',
  unassigned: 'bg-red-100 text-red-800',
  published: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  Active: 'bg-emerald-100 text-emerald-800',
  Maintenance: 'bg-amber-100 text-amber-800',
  Inactive: 'bg-red-100 text-red-800',
};

// Reusable Components
const FilterSection = ({ filters, onFilterChange, zones, zonesLoading, zonesError }) => (
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
          {zonesLoading && (
            <HiOutlineRefresh className="inline ml-2 animate-spin text-gray-400" />
          )}
        </label>
        <select
          value={filters.zone}
          onChange={(e) => onFilterChange('zone', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          disabled={zonesLoading}
        >
          <option value="all">All Zones</option>
          {zonesError ? (
            <option value="error" disabled>Error loading zones</option>
          ) : (
            zones.map((zone) => (
              <option key={zone.zoneId} value={zone.zoneName}>
                {zone.zoneName}
              </option>
            ))
          )}
        </select>
        {zonesError && (
          <p className="text-red-500 text-xs mt-1">Failed to load zones</p>
        )}
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



const ResourceOverview = ({ trucks, trucksLoading, trucksError, collectors, collectorsLoading, collectorsError }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    {/* Collectors Overview */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <HiOutlineUserGroup className="mr-2" />
        Collectors Overview
        {collectorsLoading && (
          <HiOutlineRefresh className="ml-2 animate-spin text-gray-400" />
        )}
      </h2>
      
      {collectorsError ? (
        <div className="text-center py-4">
          <p className="text-red-600 text-sm">Failed to load collector data</p>
          <p className="text-gray-500 text-xs mt-1">{collectorsError}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Available</span>
            <span className="font-bold text-emerald-600">
              {collectors ? collectors.filter(d => d.status === 'available').length : 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Assigned</span>
            <span className="font-bold text-blue-600">
              {collectors ? collectors.filter(d => d.status === 'assigned').length : 0}
            </span>
          </div>
        </div>
      )}
    </div>

    {/* Trucks Overview */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <HiOutlineTruck className="mr-2" />
        Trucks Overview
        {trucksLoading && (
          <HiOutlineRefresh className="ml-2 animate-spin text-gray-400" />
        )}
      </h2>
      
      {trucksError ? (
        <div className="text-center py-4">
          <p className="text-red-600 text-sm">Failed to load truck data</p>
          <p className="text-gray-500 text-xs mt-1">{trucksError}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Active</span>
            <span className="font-bold text-emerald-600">
              {trucks ? trucks.filter(t => t.status === 'Active').length : 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Inactive</span>
            <span className="font-bold text-red-600">
              {trucks ? trucks.filter(t => t.status === 'Inactive').length : 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Maintenance</span>
            <span className="font-bold text-amber-600">
              {trucks ? trucks.filter(t => t.status === 'Maintenance').length : 0}
            </span>
          </div>
        </div>
      )}
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

  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTruckModalOpen, setIsTruckModalOpen] = useState(false);
  
  // Truck data state (keeping for ResourceOverview component)
  const [trucks, setTrucks] = useState(null);
  const [trucksLoading, setTrucksLoading] = useState(true);
  const [trucksError, setTrucksError] = useState(null);

  // Collectors data state (keeping for ResourceOverview component)
  const [collectors, setCollectors] = useState([]);
  const [collectorsLoading, setCollectorsLoading] = useState(true);
  const [collectorsError, setCollectorsError] = useState(null);

  // Zones data state
  const [zones, setZones] = useState([]);
  const [zonesLoading, setZonesLoading] = useState(true);
  const [zonesError, setZonesError] = useState(null);

  // Define fetch functions outside useEffect so they can be reused
  const fetchTrucks = async () => {
    try {
      setTrucksLoading(true);
      setTrucksError(null);
      const trucksData = await truckService.getAllTrucks();
      setTrucks(trucksData.data || trucksData); // Handle different response structures
    } catch (error) {
      console.error('Error fetching trucks:', error);
      setTrucksError(error.message || 'Failed to load trucks');
    } finally {
      setTrucksLoading(false);
    }
  };

  const fetchCollectors = async () => {
    try {
      setCollectorsLoading(true);
      setCollectorsError(null);
      
      // Fetch both collectors and routes data
      const [collectorsData, routesData] = await Promise.all([
        userService.getCollectors(),
        routeService.getAllRoutes().catch(() => ({ data: [] })) // Fallback if routes fail
      ]);
      
      // Get assigned collector IDs from routes
      const assignedCollectorIds = new Set();
      if (routesData && routesData.data) {
        routesData.data.forEach(route => {
          if (route.collectorId) {
            assignedCollectorIds.add(route.collectorId);
          }
        });
      }
      
      // Transform collector data to match the expected format
      const transformedCollectors = collectorsData.map((collector, index) => ({
        id: collector.userId,
        name: collector.name,
        license: `DL-${String(collector.userId).padStart(6, '0')}`, // Generate license based on userId
        status: assignedCollectorIds.has(collector.userId) ? 'assigned' : 'available', // Set status based on route assignments
        experience: `${Math.floor(Math.random() * 8) + 1} years`, // Mock experience - could be a real field
        email: collector.email
      }));
      
      setCollectors(transformedCollectors);
    } catch (error) {
      console.error('Error fetching collectors:', error);
      setCollectorsError(error.message || 'Failed to load collectors');
      // Fallback to empty array if API fails
      setCollectors([]);
    } finally {
      setCollectorsLoading(false);
    }
  };

  const fetchZones = async () => {
    try {
      setZonesLoading(true);
      setZonesError(null);
      const zonesData = await zoneService.getAllZones();
      
      // Handle different response structures
      const zonesList = zonesData.data || zonesData || [];
      setZones(zonesList);
    } catch (error) {
      console.error('Error fetching zones:', error);
      setZonesError(error.message || 'Failed to load zones');
      // Fallback to empty array if API fails
      setZones([]);
    } finally {
      setZonesLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchTrucks();
    fetchCollectors();
    fetchZones();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleAssignClick = (route) => {
    setSelectedRoute(route);
    setIsModalOpen(true);
  };

  const handleAssignSuccess = (assignmentData) => {
    console.log('Assignment successful:', assignmentData);
    setIsModalOpen(false);
    setSelectedRoute(null);
    // Refresh collectors data to update their assignment status
    fetchCollectors();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DispatcherSidebar />
      
      <div className="lg:pl-72">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-8 pb-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Collector & Truck Assignment</h1>
                <p className="mt-2 text-gray-600">Assign collectors and trucks to published routes</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    fetchCollectors();
                    fetchTrucks();
                  }}
                  className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                  disabled={collectorsLoading || trucksLoading}
                >
                  <HiOutlineRefresh className={`mr-2 ${(collectorsLoading || trucksLoading) ? 'animate-spin' : ''}`} />
                  Refresh Status
                </button>
                <button
                  onClick={() => setIsTruckModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  <HiOutlineCog className="mr-2" />
                  Manage Trucks
                </button>
              </div>
            </div>
          </div>

          {/* Resource Overview */}
          <ResourceOverview 
            trucks={trucks}
            trucksLoading={trucksLoading}
            trucksError={trucksError}
            collectors={collectors}
            collectorsLoading={collectorsLoading}
            collectorsError={collectorsError}
          />

          {/* Filter Section */}
          <FilterSection
            filters={filters}
            onFilterChange={handleFilterChange}
            zones={zones}
            zonesLoading={zonesLoading}
            zonesError={zonesError}
          />

          {/* Published Routes */}
          <PublishedRoutesCard 
            onAssignRoute={handleAssignClick}
            filters={filters}
          />
        </div>
      </div>

      {/* Assignment Modal */}
      <AssignCollectorTruckModal
        route={selectedRoute}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRoute(null);
        }}
        onAssign={handleAssignSuccess}
      />

      {/* Truck Management Modal */}
      <TruckManagementModal
        isOpen={isTruckModalOpen}
        onClose={() => setIsTruckModalOpen(false)}
      />
    </div>
  );
};

export default CollectorAssignment;


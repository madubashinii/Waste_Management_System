import { useState } from 'react';
import DispatcherSidebar from '../../components/dispatcher/DispatcherSidebar';
import AddRouteStopModal from '../../components/dispatcher/AddRouteStopModal';
import {
  HiOutlineLocationMarker,
  HiOutlineMap,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineEye,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineTruck,
  HiOutlineUser,
  HiOutlineCamera,
  HiOutlineMenu,
} from 'react-icons/hi';

// Mock data for routes and route stops
const mockRoutes = [
  { route_id: 1, route_name: 'Colombo North - Morning', zone: 'Colombo North District 1', status: 'PUBLISHED', date: '2024-10-20' },
  { route_id: 2, route_name: 'Colombo South - Evening', zone: 'Colombo South District 1', status: 'PUBLISHED', date: '2024-10-20' },
  { route_id: 3, route_name: 'Kandy Central Route', zone: 'Colombo Central District 1', status: 'PUBLISHED', date: '2024-10-21' },
];

const mockRouteStops = [
  {
    stop_id: 1,
    route_id: 1,
    bin_id: 101,
    bin_location: 'Galle Road, near Liberty Plaza',
    driver_id: 5,
    driver_name: 'Nimal Perera',
    resident_id: null,
    stop_order: 1,
    collected: true,
    photo_url: '/photos/stop1.jpg',
    planned_eta: '2024-10-20 08:00:00',
    arrived_at: '2024-10-20 08:05:00',
    status: 'DONE',
    reason_code: 'NONE',
    source: 'QR',
    weight_kg: 25.5,
    notes: 'Collected on time',
  },
  {
    stop_id: 2,
    route_id: 1,
    bin_id: 102,
    bin_location: 'Duplication Road, Police Station',
    driver_id: 5,
    driver_name: 'Nimal Perera',
    resident_id: null,
    stop_order: 2,
    collected: false,
    photo_url: null,
    planned_eta: '2024-10-20 08:30:00',
    arrived_at: '2024-10-20 08:35:00',
    status: 'MISSED',
    reason_code: 'NO_BIN_OUT',
    source: 'MANUAL',
    weight_kg: 0,
    notes: 'Bin not placed outside',
  },
  {
    stop_id: 3,
    route_id: 1,
    bin_id: 103,
    bin_location: 'Ward Place, Commercial Bank',
    driver_id: 5,
    driver_name: 'Nimal Perera',
    resident_id: 234,
    stop_order: 3,
    collected: false,
    photo_url: null,
    planned_eta: '2024-10-20 09:00:00',
    arrived_at: null,
    status: 'PENDING',
    reason_code: 'NONE',
    source: 'MANUAL',
    weight_kg: 0,
    notes: null,
  },
];

// Status colors
const STATUS_COLORS = {
  PENDING: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  DONE: 'bg-emerald-100 text-emerald-800',
  MISSED: 'bg-red-100 text-red-800',
  SKIPPED: 'bg-amber-100 text-amber-800',
};

const REASON_CODES = {
  NONE: 'None',
  BLOCKED: 'Access Blocked',
  NO_BIN_OUT: 'Bin Not Out',
  SAFETY: 'Safety Issue',
  OTHER: 'Other',
};

// Components
const FilterBar = ({ selectedRoute, onRouteChange, statusFilter, onStatusChange, searchTerm, onSearchChange }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-gray-900 flex items-center">
        <HiOutlineFilter className="mr-2" />
        Filters
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <HiOutlineMap className="inline mr-1" />
          Select Route
        </label>
        <select
          value={selectedRoute}
          onChange={(e) => onRouteChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="">All Routes</option>
          {mockRoutes.map(route => (
            <option key={route.route_id} value={route.route_id}>
              {route.route_name} - {route.date}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <HiOutlineCheckCircle className="inline mr-1" />
          Status
        </label>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
          <option value="MISSED">Missed</option>
          <option value="SKIPPED">Skipped</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <HiOutlineSearch className="inline mr-1" />
          Search Location
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search bin location..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
    </div>
  </div>
);

const RouteStopRow = ({ stop, onView, onEdit, onDelete }) => (
  <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
    <td className="px-4 py-4">
      <div className="flex items-center space-x-3">
        <div className="flex items-center">
          <HiOutlineMenu className="text-gray-400 text-lg mr-2" />
          <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {stop.stop_order}
          </span>
        </div>
      </div>
    </td>
    <td className="px-4 py-4">
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">Bin #{stop.bin_id}</span>
        <span className="text-sm text-gray-600 flex items-center mt-1">
          <HiOutlineLocationMarker className="mr-1" />
          {stop.bin_location}
        </span>
      </div>
    </td>
    <td className="px-4 py-4">
      {stop.driver_name ? (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">{stop.driver_name}</span>
          <span className="text-xs text-gray-500">ID: {stop.driver_id}</span>
        </div>
      ) : (
        <span className="text-sm text-gray-500">Not assigned</span>
      )}
    </td>
    <td className="px-4 py-4">
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[stop.status]}`}>
        {stop.status}
      </span>
    </td>
    <td className="px-4 py-4">
      <div className="flex flex-col text-sm">
        {stop.collected ? (
          <span className="text-emerald-600 font-medium flex items-center">
            <HiOutlineCheckCircle className="mr-1" />
            Yes ({stop.weight_kg} kg)
          </span>
        ) : (
          <span className="text-red-600 font-medium flex items-center">
            <HiOutlineXCircle className="mr-1" />
            No
          </span>
        )}
        {stop.reason_code !== 'NONE' && (
          <span className="text-xs text-amber-600 mt-1">{REASON_CODES[stop.reason_code]}</span>
        )}
      </div>
    </td>
    <td className="px-4 py-4">
      <div className="flex flex-col text-sm text-gray-600">
        <span>ETA: {stop.planned_eta ? new Date(stop.planned_eta).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
        {stop.arrived_at && (
          <span className="text-xs text-blue-600 mt-1">
            Arrived: {new Date(stop.arrived_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </td>
    <td className="px-4 py-4">
      <div className="flex items-center space-x-2">
        {stop.photo_url && (
          <button
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="View Photo"
          >
            <HiOutlineCamera className="text-lg" />
          </button>
        )}
        <span className={`text-xs px-2 py-1 rounded ${
          stop.source === 'QR' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {stop.source}
        </span>
      </div>
    </td>
    <td className="px-4 py-4">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onView(stop)}
          className="text-blue-600 hover:text-blue-800 transition-colors"
          title="View Details"
        >
          <HiOutlineEye className="text-xl" />
        </button>
        <button
          onClick={() => onEdit(stop)}
          className="text-emerald-600 hover:text-emerald-800 transition-colors"
          title="Edit"
        >
          <HiOutlinePencil className="text-xl" />
        </button>
        <button
          onClick={() => onDelete(stop.stop_id)}
          className="text-red-600 hover:text-red-800 transition-colors"
          title="Delete"
        >
          <HiOutlineTrash className="text-xl" />
        </button>
      </div>
    </td>
  </tr>
);

const RouteStopsTable = ({ stops, onView, onEdit, onDelete, selectedRoute }) => {
  // Show empty state if no route is selected
  if (!selectedRoute) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <HiOutlineMap className="mx-auto text-6xl text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Select A Route to Start</h3>
        <p className="text-gray-500">Choose a route from the filter above to view and rearrange the stops</p>
      </div>
    );
  }

  // Show no stops found message if route is selected but no stops match
  if (stops.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <HiOutlineMap className="mx-auto text-4xl text-gray-400 mb-2" />
        <p className="text-gray-500">No route stops found for this route. Adjust filters or add stops.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <HiOutlineMap className="mr-2" />
          Route Stops ({stops.length})
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Order</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Bin & Location</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Driver</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Collected</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Source</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stops.map(stop => (
              <RouteStopRow
                key={stop.stop_id}
                stop={stop}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// Main Component
const RouteStops = () => {
  const [selectedRoute, setSelectedRoute] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [routeStops, setRouteStops] = useState(mockRouteStops);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredStops = routeStops.filter(stop => {
    const matchesRoute = !selectedRoute || stop.route_id.toString() === selectedRoute;
    const matchesStatus = !statusFilter || stop.status === statusFilter;
    const matchesSearch = !searchTerm || stop.bin_location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRoute && matchesStatus && matchesSearch;
  });

  const handleView = (stop) => {
    alert(`Viewing details for Stop #${stop.stop_id}\nLocation: ${stop.bin_location}\nStatus: ${stop.status}`);
  };

  const handleEdit = (stop) => {
    alert(`Edit functionality for Stop #${stop.stop_id} - Coming soon!`);
  };

  const handleDelete = (stopId) => {
    if (confirm('Are you sure you want to delete this route stop?')) {
      setRouteStops(prev => prev.filter(stop => stop.stop_id !== stopId));
      alert('Route stop deleted successfully!');
    }
  };

  const handleCreateStop = (stopData) => {
    console.log('Creating route stops:', stopData);
    const stopCount = stopData.wards.length;
    alert(`Successfully created ${stopCount} route stop${stopCount !== 1 ? 's' : ''} for ${stopData.route_name}!`);
    setIsCreateModalOpen(false);
    // In real app, this would make an API call to create stops based on ward order
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DispatcherSidebar />
      
      <div className="lg:pl-72">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-8 pb-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Route Stops Management</h1>
              <p className="mt-2 text-gray-600">Manage and monitor route stop details for published routes</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <HiOutlinePlus className="mr-2" />
              Add Route Stop
            </button>
          </div>

          <FilterBar
            selectedRoute={selectedRoute}
            onRouteChange={setSelectedRoute}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <RouteStopsTable
            stops={filteredStops}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            selectedRoute={selectedRoute}
          />

          <AddRouteStopModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateStop}
          />
        </div>
      </div>
    </div>
  );
};

export default RouteStops;


import { useState, useEffect } from 'react';
import AddTruckModal from './AddTruckModal';
import SnackBar from '../common/SnackBar';
import { HiOutlineTruck, HiOutlineX, HiOutlinePlus, HiOutlinePencil, HiOutlineSortAscending, HiOutlineFilter } from 'react-icons/hi';
import { truckService } from '../../services/dispatcher/truckService';

const STATUS_COLORS = {
  Active: 'bg-emerald-100 text-emerald-800',
  Maintenance: 'bg-amber-100 text-amber-800',
  Inactive: 'bg-red-100 text-red-800'
};

const INITIAL_TRUCK_DATA = { truckName: '', truckType: '', capacityKg: '', status: 'Active' };
const SORT_OPTIONS = { NEWEST: 'newest', OLDEST: 'oldest' };
const FILTER_OPTIONS = { ALL: 'all', ACTIVE: 'Active', MAINTENANCE: 'Maintenance', INACTIVE: 'Inactive' };
const TABLE_HEADERS = ['Truck Name', 'Type', 'Capacity', 'Status', 'Created', 'Actions'];

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { 
  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
});

const formatStatus = (status) => status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

const TruckManagementModal = ({ isOpen, onClose }) => {
  const [trucks, setTrucks] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState(null);
  const [newTruck, setNewTruck] = useState(INITIAL_TRUCK_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ isOpen: false, message: '', type: 'success' });
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST);
  const [filterBy, setFilterBy] = useState(FILTER_OPTIONS.ALL);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadTrucks();
    } else {
      resetModalState();
    }
  }, [isOpen]);

  const resetModalState = () => {
    setIsAddModalOpen(false);
    setEditingTruck(null);
    setNewTruck(INITIAL_TRUCK_DATA);
    setError(null);
    setSnackbar({ isOpen: false, message: '', type: 'success' });
    setSortBy(SORT_OPTIONS.NEWEST);
    setFilterBy(FILTER_OPTIONS.ALL);
    setSearchTerm('');
  };

  const loadTrucks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await truckService.getAllTrucks();
      if (response.success) {
        setTrucks(response.data || []);
      } else {
        setError(response.message || 'Failed to load trucks');
      }
    } catch (error) {
      console.error('Error loading trucks:', error);
      setError(error.message.includes('Failed to fetch') || error.message.includes('CORS') 
        ? 'Cannot connect to backend server. Please ensure the backend is running on http://localhost:8080'
        : error.message || 'Failed to load trucks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (message, type = 'success') => {
    setSnackbar({ isOpen: true, message, type });
  };

  const getProcessedTrucks = () => {
    let filtered = trucks;

    if (filterBy !== FILTER_OPTIONS.ALL) {
      filtered = filtered.filter(truck => truck.status === filterBy);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(truck => 
        truck.truckName.toLowerCase().includes(term) ||
        truck.truckType.toLowerCase().includes(term) ||
        truck.capacityKg.toString().includes(term)
      );
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortBy === SORT_OPTIONS.NEWEST ? dateB - dateA : dateA - dateB;
    });
  };

  const handleAddTruck = () => {
    loadTrucks();
    showSnackbar('Truck added successfully!');
  };

  const handleEditTruck = (truck) => {
    setEditingTruck({ ...truck });
    setIsAddModalOpen(true);
  };

  const handleUpdateTruck = () => {
    loadTrucks();
    showSnackbar('Truck updated successfully!');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterBy(FILTER_OPTIONS.ALL);
  };

  const LoadingSpinner = () => (
    <svg className="animate-spin h-4 w-4 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  const renderErrorState = () => (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Trucks</h3>
      <p className="text-gray-500 mb-4">There was an error connecting to the server.</p>
      <button onClick={loadTrucks} className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
        Try Again
      </button>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <HiOutlineTruck className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Trucks Found</h3>
      <p className="text-gray-500 mb-4">Your truck fleet is empty. Add your first truck to get started.</p>
      <button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors">
        <HiOutlinePlus className="mr-2" />
        Add First Truck
      </button>
    </div>
  );

  const renderFilteredEmptyState = () => (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <HiOutlineFilter className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Trucks Match Your Filters</h3>
      <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria.</p>
      <button onClick={clearFilters} className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
        Clear Filters
      </button>
    </div>
  );

  const renderLoadingState = () => (
    <tr>
      <td colSpan="6" className="px-6 py-12 text-center">
        <div className="flex items-center justify-center">
          <LoadingSpinner />
          <span className="ml-2 text-gray-600">Loading trucks...</span>
        </div>
      </td>
    </tr>
  );

  const renderTruckRow = (truck) => (
    <tr key={truck.truckId} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <HiOutlineTruck className="w-5 h-5 text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-900">{truck.truckName}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{truck.truckType}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{truck.capacityKg} kg</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[truck.status]}`}>
          {formatStatus(truck.status)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(truck.createdAt)}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button onClick={() => handleEditTruck(truck)} className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded" title="Edit truck">
          <HiOutlinePencil className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );

  const renderControls = () => (
    <div className="space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Total Trucks: {error ? 'N/A' : getProcessedTrucks().length} 
          {trucks.length !== getProcessedTrucks().length && (
            <span className="text-gray-400"> (of {trucks.length})</span>
          )}
        </span>
        <button onClick={loadTrucks} disabled={isLoading} className="text-sm text-emerald-600 hover:text-emerald-700 disabled:opacity-50 flex items-center">
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">Loading...</span>
            </>
          ) : 'Refresh'}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <HiOutlineSortAscending className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 font-medium">Sort by:</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
            <option value={SORT_OPTIONS.NEWEST}>Newest First</option>
            <option value={SORT_OPTIONS.OLDEST}>Oldest First</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <HiOutlineFilter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 font-medium">Filter:</span>
          <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
            <option value={FILTER_OPTIONS.ALL}>All Status</option>
            <option value={FILTER_OPTIONS.ACTIVE}>Active</option>
            <option value={FILTER_OPTIONS.MAINTENANCE}>Maintenance</option>
            <option value={FILTER_OPTIONS.INACTIVE}>Inactive</option>
          </select>
        </div>

        <div className="flex-1">
          <input type="text" placeholder="Search trucks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <HiOutlineTruck className="mr-2" />
              Truck Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">Manage your fleet of waste collection trucks</p>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsAddModalOpen(true)} className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors">
              <HiOutlinePlus className="mr-2" />
              Add Truck
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <HiOutlineX className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 flex-shrink-0">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-800">Connection Error</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
            {renderControls()}
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      {TABLE_HEADERS.map(header => (
                        <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? renderLoadingState() : getProcessedTrucks().map(renderTruckRow)}
                  </tbody>
                </table>
              </div>

              {!isLoading && !error && trucks.length === 0 && renderEmptyState()}
              {!isLoading && !error && trucks.length > 0 && getProcessedTrucks().length === 0 && renderFilteredEmptyState()}
              {!isLoading && error && renderErrorState()}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddTruckModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTruck(null);
        }}
        onSave={editingTruck ? handleUpdateTruck : handleAddTruck}
        truckData={editingTruck || newTruck}
        onTruckChange={editingTruck ? setEditingTruck : setNewTruck}
        isEditMode={!!editingTruck}
      />

      <SnackBar
        isOpen={snackbar.isOpen}
        onClose={() => setSnackbar({ ...snackbar, isOpen: false })}
        message={snackbar.message}
        type={snackbar.type}
        duration={4000}
        position="top-right"
      />
    </div>
  );
};

export default TruckManagementModal;
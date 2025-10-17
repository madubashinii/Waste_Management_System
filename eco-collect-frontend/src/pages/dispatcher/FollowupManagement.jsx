import { useState, useEffect } from 'react';
import FollowupPickupsTable from '../../components/dispatcher/FollowupPickupsTable';
import FollowupAssignmentModal from '../../components/dispatcher/FollowupAssignmentModal';
import { followupService } from '../../services/dispatcher/followupService';
import { truckService } from '../../services/dispatcher/truckService';
import { wardService } from '../../services/dispatcher/wardService';
import SnackBar from '../../components/common/SnackBar';
import {
  HiOutlineRefresh,
  HiOutlineFilter,
  HiOutlineSearch
} from 'react-icons/hi';


const FollowupManagement = () => {
  // State management
  const [followups, setFollowups] = useState([]);
  const [filteredFollowups, setFilteredFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trucks, setTrucks] = useState([]);
  const [wards, setWards] = useState([]);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [reasonFilter, setReasonFilter] = useState('');
  const [wardFilter, setWardFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedFollowup, setSelectedFollowup] = useState(null);

  // Snackbar state
  const [snackBar, setSnackBar] = useState({ isOpen: false, message: '', type: 'success' });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Apply filters whenever filters or followups change
  useEffect(() => {
    applyFilters();
  }, [followups, statusFilter, priorityFilter, reasonFilter, wardFilter, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [followupsResponse, trucksResponse, wardsResponse] = await Promise.all([
        followupService.getAllFollowups(),
        truckService.getAllTrucks(),
        wardService.getAllWards()
      ]);

      if (followupsResponse?.success && followupsResponse?.data) {
        setFollowups(followupsResponse.data);
      }

      if (trucksResponse?.success && trucksResponse?.data) {
        setTrucks(trucksResponse.data);
      }

      if (wardsResponse?.success && wardsResponse?.data) {
        setWards(wardsResponse.data);
      }

    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load followup data. Please try again.');
      setSnackBar({ isOpen: true, message: 'Failed to load data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...followups];

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(f => f.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter) {
      filtered = filtered.filter(f => f.priority === priorityFilter);
    }

    // Apply reason filter
    if (reasonFilter) {
      filtered = filtered.filter(f => f.reasonCode === reasonFilter);
    }

    // Apply ward filter
    if (wardFilter) {
      filtered = filtered.filter(f => f.wardId === parseInt(wardFilter));
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(f => 
        f.binId?.toLowerCase().includes(term) ||
        f.originalDriverName?.toLowerCase().includes(term) ||
        f.newAssignedDriverName?.toLowerCase().includes(term) ||
        f.wardName?.toLowerCase().includes(term)
      );
    }

    setFilteredFollowups(filtered);
  };


  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First, process any existing missed/skipped route stops to create followups
      console.log('Processing existing missed/skipped route stops...');
      const processResponse = await followupService.processExistingMissedSkippedStops();
      
      if (processResponse?.success) {
        console.log('Successfully processed existing route stops');
      } else {
        console.log('No existing route stops to process or processing failed');
      }
      
      // Then, update priority and reason codes for existing followups based on business rules
      console.log('Updating followup priority and reason codes...');
      const updateResponse = await followupService.updateFollowupPriorityAndReasonCodes();
      
      if (updateResponse?.success) {
        console.log('Successfully updated followup priority and reason codes');
        const updatedCount = updateResponse.data || 0;
        setSnackBar({ 
          isOpen: true, 
          message: `Refreshed data and updated ${updatedCount} followup entries with correct priority/reason codes`, 
          type: 'success' 
        });
      } else {
        console.log('No followup entries to update or update failed');
        setSnackBar({ 
          isOpen: true, 
          message: 'Refreshed followup data', 
          type: 'success' 
        });
      }
      
      // Finally, load the updated data
      await loadData();
      
    } catch (error) {
      console.error('Error during refresh:', error);
      setSnackBar({ 
        isOpen: true, 
        message: 'Error during refresh, but data was still loaded', 
        type: 'warning' 
      });
      
      // Still try to load data even if processing failed
      await loadData();
    }
  };



  const handleAssignFollowup = (followup) => {
    setSelectedFollowup(followup);
    setShowAssignmentModal(true);
  };

  const handleAssignmentSave = (updatedFollowup) => {
    setSnackBar({ 
      isOpen: true, 
      message: 'Followup assignment completed successfully and route_stops updated', 
      type: 'success' 
    });
    loadData(); // Refresh data
    setShowAssignmentModal(false);
    setSelectedFollowup(null);
  };



  const renderFilters = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <HiOutlineFilter className="mr-2" />
          Filters
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200 disabled:opacity-50"
          >
            <HiOutlineRefresh className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by bin ID, driver, ward..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">All Priorities</option>
            <option value="HIGH">High</option>
            <option value="NORMAL">Normal</option>
          </select>
        </div>

        {/* Ward Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ward</label>
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">All Wards</option>
            {wards.map(ward => (
              <option key={ward.wardId} value={ward.wardId}>
                {ward.wardName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {(statusFilter || priorityFilter || reasonFilter || wardFilter || searchTerm) && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setStatusFilter('');
              setPriorityFilter('');
              setReasonFilter('');
              setWardFilter('');
              setSearchTerm('');
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );

  const handleBulkAction = (action, followupIds) => {
    console.log(`Bulk action: ${action} on followup IDs:`, followupIds);
    // Implement bulk actions here
    switch (action) {
      case 'assign':
        // Handle bulk assignment
        break;
      case 'cancel':
        // Handle bulk cancellation
        break;
      default:
        break;
    }
  };

  return (
    <>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-8 pb-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Followup Management</h1>
              <p className="mt-2 text-gray-600">Manage followup pickups for missed, skipped, and overdue collections</p>
            </div>
          </div>

          {/* Filters */}
          {renderFilters()}

          {/* Followup Table */}
          <FollowupPickupsTable
            followups={filteredFollowups}
            loading={loading}
            error={error}
            onRefresh={handleRefresh}
            onBulkAction={handleBulkAction}
            onAssignFollowup={handleAssignFollowup}
          />
        </div>

      {/* Assignment Modal */}
      <FollowupAssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => {
          setShowAssignmentModal(false);
          setSelectedFollowup(null);
        }}
        followup={selectedFollowup}
        onSave={handleAssignmentSave}
      />

      {/* Snackbar */}
      <SnackBar
        isOpen={snackBar.isOpen}
        message={snackBar.message}
        type={snackBar.type}
        onClose={() => setSnackBar({ ...snackBar, isOpen: false })}
      />
    </>
  );
};

export default FollowupManagement;

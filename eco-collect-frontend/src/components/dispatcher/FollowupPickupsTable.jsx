import React, { useState, useMemo } from 'react';
import {
  HiOutlineUser,
  HiOutlineExclamationCircle,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineSortAscending,
  HiOutlineSortDescending,
  HiOutlineSelector,
  HiOutlineRefresh
} from 'react-icons/hi';

// Status color mappings
const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ASSIGNED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-orange-100 text-orange-800',
  DONE: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
};

const PRIORITY_COLORS = {
  HIGH: 'bg-red-100 text-red-800',
  NORMAL: 'bg-gray-100 text-gray-800'
};

const REASON_COLORS = {
  MISSED: 'bg-red-100 text-red-800',
  SKIPPED: 'bg-orange-100 text-orange-800',
  OVERDUE: 'bg-yellow-100 text-yellow-800',
  MANUAL: 'bg-blue-100 text-blue-800'
};

const WASTE_TYPE_COLORS = {
  General: 'bg-gray-100 text-gray-800',
  Recyclable: 'bg-blue-100 text-blue-800',
  Organic: 'bg-green-100 text-green-800'
};

// Sorting configuration
const SORT_CONFIG = {
  id: { key: 'id', type: 'number' },
  binId: { key: 'binId', type: 'string' },
  wardName: { key: 'wardName', type: 'string' },
  wasteType: { key: 'wasteType', type: 'string' },
  originalDriverName: { key: 'originalDriverName', type: 'string' },
  priority: { key: 'priority', type: 'string' },
  dueAt: { key: 'dueAt', type: 'date' },
  status: { key: 'status', type: 'string' },
  reasonCode: { key: 'reasonCode', type: 'string' }
};

const FollowupPickupsTable = ({
  followups = [],
  loading = false,
  error = null,
  onRefresh,
  onAssignFollowup
}) => {
  // State management
  const [sortField, setSortField] = useState('dueAt');
  const [sortDirection, setSortDirection] = useState('asc');

  // Computed values
  const sortedFollowups = useMemo(() => {
    if (!followups.length) return [];

    return [...followups].sort((a, b) => {
      const config = SORT_CONFIG[sortField];
      if (!config) return 0;

      let aValue = a[config.key];
      let bValue = b[config.key];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Type-specific sorting
      if (config.type === 'number') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (config.type === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [followups, sortField, sortDirection]);

  // Utility functions
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };


  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <HiOutlineSelector className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <HiOutlineSortAscending className="w-4 h-4 text-emerald-600" />
      : <HiOutlineSortDescending className="w-4 h-4 text-emerald-600" />;
  };

  const renderSortableHeader = (field, label) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        {getSortIcon(field)}
      </div>
    </th>
  );

  const renderLoadingState = () => (
    <tr>
      <td colSpan="10" className="px-6 py-12 text-center">
        <div className="flex items-center justify-center space-x-2">
          <HiOutlineRefresh className="animate-spin text-emerald-600" />
          <span className="text-gray-600">Loading followup pickups...</span>
        </div>
      </td>
    </tr>
  );

  const renderErrorState = () => (
    <tr>
      <td colSpan="10" className="px-6 py-12 text-center">
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading data</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
            >
              Try Again
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  const renderEmptyState = () => (
    <tr>
      <td colSpan="10" className="px-6 py-12 text-center">
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No followup pickups found</h3>
          <p className="mt-1 text-sm text-gray-500">No followup pickups are currently available.</p>
        </div>
      </td>
    </tr>
  );

  const renderFollowupRow = (followup) => (
    <tr key={followup.id} className="hover:bg-gray-50">
      {/* ID */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        #{followup.id}
      </td>

      {/* Bin ID & Location */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">{followup.binId}</span>
          </div>
          <span className="text-sm text-gray-600 flex items-center">
            <HiOutlineLocationMarker className="mr-1" />
            {followup.wardName || 'Location not found'}
          </span>
        </div>
      </td>

      {/* Ward */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {followup.wardName}
      </td>

      {/* Waste Type */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${WASTE_TYPE_COLORS[followup.wasteType] || 'bg-gray-100 text-gray-800'}`}>
          {followup.wasteType}
        </span>
      </td>

      {/* Original Driver */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="flex items-center">
          <HiOutlineUser className="mr-1 text-gray-400" />
          {followup.originalDriverName || 'Unassigned'}
        </div>
      </td>

      {/* Priority */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${PRIORITY_COLORS[followup.priority]}`}>
          {followup.priority}
        </span>
      </td>

      {/* Due Date */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="flex items-center">
          <HiOutlineCalendar className="mr-1 text-gray-400" />
          <span className={isOverdue(followup.dueAt) ? 'text-red-600 font-medium' : ''}>
            {formatDate(followup.dueAt)}
          </span>
          {isOverdue(followup.dueAt) && (
            <HiOutlineExclamationCircle className="ml-1 text-red-500" />
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[followup.status]}`}>
          {followup.status}
        </span>
      </td>

      {/* Reason Code */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${REASON_COLORS[followup.reasonCode]}`}>
          {followup.reasonCode}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {onAssignFollowup && (
          <button
            onClick={() => onAssignFollowup(followup)}
            disabled={followup.status === 'IN_PROGRESS'}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
              followup.status === 'IN_PROGRESS'
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            {followup.status === 'IN_PROGRESS' ? 'In Progress' : 'Assign'}
          </button>
        )}
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Followup Pickups ({sortedFollowups.length})
          </h3>
          
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200 disabled:opacity-50"
            >
              <HiOutlineRefresh className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {renderSortableHeader('id', 'ID')}
              {renderSortableHeader('binId', 'Bin ID & Location')}
              {renderSortableHeader('wardName', 'Ward')}
              {renderSortableHeader('wasteType', 'Waste Type')}
              {renderSortableHeader('originalDriverName', 'Original Driver')}
              {renderSortableHeader('priority', 'Priority')}
              {renderSortableHeader('dueAt', 'Due Date')}
              {renderSortableHeader('status', 'Status')}
              {renderSortableHeader('reasonCode', 'Reason Code')}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && renderLoadingState()}
            {error && renderErrorState()}
            {!loading && !error && sortedFollowups.length === 0 && renderEmptyState()}
            {!loading && !error && sortedFollowups.map(renderFollowupRow)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FollowupPickupsTable;

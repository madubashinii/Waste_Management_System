// Status formatting utilities
export const formatRouteStatus = (status) => {
  const statusConfig = {
    pending: { text: 'PENDING', color: 'bg-yellow-100 text-yellow-800' },
    in_progress: { text: 'IN PROGRESS', color: 'bg-blue-100 text-blue-800' },
    completed: { text: 'COMPLETED', color: 'bg-green-100 text-green-800' }
  };
  return statusConfig[status] || { text: status?.toUpperCase() || 'UNKNOWN', color: 'bg-gray-100 text-gray-800' };
};

export const formatWardStatus = (ward, assignedWardNumbers) => {
  const wardIdentifier = ward.wardNumber || ward.id;
  const isAvailable = !assignedWardNumbers.has(wardIdentifier);
  
  return {
    isAvailable,
    status: isAvailable ? 'available' : 'assigned',
    statusText: isAvailable ? 'Available' : 'Already Assigned',
    statusColor: isAvailable ? 'text-green-600' : 'text-red-600',
    bgColor: isAvailable ? 'bg-green-50' : 'bg-red-50',
    borderColor: isAvailable ? 'border-green-200' : 'border-red-200'
  };
};

export const getStatusBadgeClass = (status) => {
  const statusConfig = {
    pending: 'bg-yellow-600 text-yellow-100',
    in_progress: 'bg-blue-600 text-blue-100',
    completed: 'bg-green-600 text-green-100'
  };
  return statusConfig[status] || 'bg-gray-600 text-gray-100';
};

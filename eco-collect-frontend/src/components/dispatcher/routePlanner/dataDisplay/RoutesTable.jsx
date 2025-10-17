import React, { useState } from 'react';
import { HiOutlineMap } from 'react-icons/hi';
import LoadingSpinner from './LoadingSpinner';
import RouteStats from './RouteStats';
import RouteTableRow from './RouteTableRow';
import EditRouteModal from './EditRouteModal';

const RoutesTable = ({ 
  routes, 
  routesLoading, 
  routeStats, 
  onRefresh, 
  onEditRoute, 
  formatStatus 
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = (route) => {
    setSelectedRoute(route);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedRoute(null);
    setIsSaving(false);
  };

  const handleSaveRoute = async (updatedRoute) => {
    setIsSaving(true);
    try {
      if (onEditRoute) {
        await onEditRoute(updatedRoute);
      }
      handleModalClose();
    } catch (error) {
      console.error('Error saving route:', error);
      // You might want to show an error message here
    } finally {
      setIsSaving(false);
    }
  };
  const renderTableContent = () => {
    if (routesLoading) {
      return <LoadingSpinner message="Loading routes..." />;
    }

    if (routes.length === 0) {
      return (
        <div className="text-center py-8">
          <HiOutlineMap className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No routes found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first route above.</p>
        </div>
      );
    }

    return (
      <div className="max-h-96 overflow-y-auto relative">
        {routes.length > 3 && (
          <>
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent pointer-events-none z-20"></div>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none z-20"></div>
          </>
        )}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Zone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collection Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Truck
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dispatcher
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collector
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {routes.map((route) => (
              <RouteTableRow
                key={route.routeId}
                route={route}
                onEditRoute={handleEditClick}
                formatStatus={formatStatus}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div className="mt-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="mb-4">
            <RouteStats
              routeStats={routeStats}
              routesCount={routes.length}
              routesLoading={routesLoading}
              onRefresh={onRefresh}
            />
          </div>
          
          <div className="overflow-x-auto">
            {renderTableContent()}
          </div>
        </div>
      </div>

      {/* Edit Route Modal */}
      <EditRouteModal
        isOpen={editModalOpen}
        onClose={handleModalClose}
        route={selectedRoute}
        onSave={handleSaveRoute}
        isLoading={isSaving}
      />
    </>
  );
};

export default RoutesTable;

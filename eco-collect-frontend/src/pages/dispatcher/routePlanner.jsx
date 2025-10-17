import { useState } from 'react';
import DispatcherSidebar from '../../components/dispatcher/DispatcherSidebar';
import AddZoneModal from '../../components/dispatcher/routePlanner/AddZoneModal';
import AddWardsModal from '../../components/dispatcher/routePlanner/AddWardsModal';
import SnackBar from '../../components/common/SnackBar';
import { useAuth } from '../../context/AuthContext';
import { useRoutePlanner } from '../../hooks/useRoutePlanner';
import { useRouteData } from '../../hooks/useRouteData';
import { useStepNavigation } from '../../hooks/useStepNavigation';
import {
  RouteNameStep,
  DateZoneStep,
  WardSelectionStep,
  WardOrderingStep,
  TruckAssignmentStep,
  RouteSummaryStep
} from '../../components/dispatcher/routePlanner/steps';
import {
  StepProgressBar,
  StepNavigation,
  StepIndicator
} from '../../components/dispatcher/routePlanner/navigation';
import { RoutesTable } from '../../components/dispatcher/routePlanner/dataDisplay';
import {
  HiOutlinePlus
} from 'react-icons/hi';

const RoutePlanner = () => {
  const { getCurrentUserId } = useAuth();
  
  // Custom hooks
  const {
    routeName,
    setRouteName,
    collectionDate,
    setCollectionDate,
    selectedZone,
    setSelectedZone,
    selectedWards,
    setSelectedWards,
    assignedTruck,
    setAssignedTruck,
    saving,
    handleWardToggle,
    moveWard,
    resetForm,
    handleSaveRoute
  } = useRoutePlanner(getCurrentUserId);

  const {
    zones,
    trucks,
    wards,
    routes,
    assignedWardsOnDate,
    loading,
    routesLoading,
    assignedWardsLoading,
    loadRoutes,
    loadAssignedWardsForDate,
    getAvailableWards,
    getAvailableWardsWithAssigned,
    getZoneWards,
    getActiveTrucks,
    getRouteStats
  } = useRouteData();

  const {
    currentStep,
    steps,
    nextStep,
    prevStep,
    canProceed,
    resetToFirstStep
  } = useStepNavigation();

  // Local state for modals and notifications
  const [isAddZoneModalOpen, setIsAddZoneModalOpen] = useState(false);
  const [isAddWardsModalOpen, setIsAddWardsModalOpen] = useState(false);
  const [snackBar, setSnackBar] = useState({ isOpen: false, message: '', type: 'success' });

  // Get zone wards for current selected zone
  const zoneWards = getZoneWards(selectedZone);

  // Helper function to format status
  const formatStatus = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'PENDING', color: 'bg-yellow-100 text-yellow-800' };
      case 'in_progress':
        return { text: 'IN PROGRESS', color: 'bg-blue-100 text-blue-800' };
      case 'completed':
        return { text: 'COMPLETED', color: 'bg-green-100 text-green-800' };
      default:
        return { text: status.toUpperCase(), color: 'bg-gray-100 text-gray-800' };
    }
  };


  const handleSaveZone = (data, message) => {
    setSnackBar({ isOpen: true, message, type: 'success' });
  };

  const handleSaveWards = (data, message) => {
    setSnackBar({ isOpen: true, message, type: 'success' });
  };

  const handleEditRoute = (route) => {
    // TODO: Implement route editing functionality
    // For now, show a message that editing is not yet implemented
    setSnackBar({ 
      isOpen: true, 
      message: `Edit functionality for route "${route.routeName}" will be implemented soon`, 
      type: 'info' 
    });
  };

  // Handle save route with callbacks
  const onSaveRouteSuccess = async (message) => {
    setSnackBar({ isOpen: true, message, type: 'success' });
    await loadRoutes();
    resetToFirstStep();
  };

  const onSaveRouteError = (message, type = 'error') => {
    setSnackBar({ isOpen: true, message, type });
  };

  const handleSaveRouteClick = () => {
    handleSaveRoute(onSaveRouteSuccess, onSaveRouteError);
  };

  // Form data for validation
  const formData = {
    routeName,
    collectionDate,
    selectedZone,
    selectedWards,
    assignedTruck
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RouteNameStep
            routeName={routeName}
            setRouteName={setRouteName}
          />
        );

      case 2:
        return (
          <DateZoneStep
            collectionDate={collectionDate}
            setCollectionDate={setCollectionDate}
            selectedZone={selectedZone}
            setSelectedZone={setSelectedZone}
            zones={zones}
            loadAssignedWardsForDate={loadAssignedWardsForDate}
            getAvailableWardsWithAssigned={getAvailableWardsWithAssigned}
            assignedWardsLoading={assignedWardsLoading}
            onError={(message) => setSnackBar({ isOpen: true, message, type: 'error' })}
          />
        );

      case 3:
        return (
          <WardSelectionStep
            zoneWards={zoneWards}
            selectedWards={selectedWards}
            handleWardToggle={handleWardToggle}
            getAvailableWards={getAvailableWards}
            collectionDate={collectionDate}
            selectedZone={selectedZone}
            assignedWardsOnDate={assignedWardsOnDate}
          />
        );

      case 4:
        return (
          <WardOrderingStep
            selectedWards={selectedWards}
            moveWard={moveWard}
          />
        );

      case 5:
        return (
          <TruckAssignmentStep
            assignedTruck={assignedTruck}
            setAssignedTruck={setAssignedTruck}
            getActiveTrucks={getActiveTrucks}
            trucks={trucks}
          />
        );

      case 6:
        return (
          <RouteSummaryStep
            routeName={routeName}
            collectionDate={collectionDate}
            selectedZone={selectedZone}
            selectedWards={selectedWards}
            assignedTruck={assignedTruck}
            zones={zones}
            trucks={trucks}
          />
        );

      default:
        return null;
    }
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
                <h1 className="text-3xl font-bold text-gray-900">Route Planner</h1>
                <p className="mt-2 text-gray-600">Create and publish collection routes for zones and wards</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsAddZoneModalOpen(true)}
                  className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  <HiOutlinePlus className="mr-2" />
                  Add New Zones
                </button>
                <button
                  onClick={() => setIsAddWardsModalOpen(true)}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  <HiOutlinePlus className="mr-2" />
                  Add New Wards
                </button>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <StepProgressBar 
            steps={steps} 
            currentStep={currentStep} 
          />

          {/* Step Content */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <StepIndicator 
              currentStep={currentStep} 
              steps={steps} 
            />
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <span className="ml-2 text-gray-600">Loading data...</span>
              </div>
            ) : (
              renderStep()
            )}

            {/* Navigation */}
            <StepNavigation
              currentStep={currentStep}
              totalSteps={6}
              canProceed={canProceed(formData)}
              saving={saving}
              onPrevious={prevStep}
              onNext={nextStep}
              onSave={handleSaveRouteClick}
            />
          </div>
        </div>

        {/* Routes Table */}
        <RoutesTable
          routes={routes}
          routesLoading={routesLoading}
          routeStats={getRouteStats()}
          onRefresh={loadRoutes}
          onEditRoute={handleEditRoute}
          formatStatus={formatStatus}
        />
      </div>

      {/* Modals */}
      <AddZoneModal
        isOpen={isAddZoneModalOpen}
        onClose={() => setIsAddZoneModalOpen(false)}
        onSave={handleSaveZone}
      />

      <AddWardsModal
        isOpen={isAddWardsModalOpen}
        onClose={() => setIsAddWardsModalOpen(false)}
        onSave={handleSaveWards}
      />

      {/* SnackBar */}
      <SnackBar
        isOpen={snackBar.isOpen}
        onClose={() => setSnackBar(prev => ({ ...prev, isOpen: false }))}
        message={snackBar.message}
        type={snackBar.type}
        duration={6000}
      />
    </div>
  );
};

export default RoutePlanner;
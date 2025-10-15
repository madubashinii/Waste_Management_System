import { useState } from 'react';
import DispatcherSidebar from '../../components/dispatcher/DispatcherSidebar';
import AddZoneModal from '../../components/dispatcher/AddZoneModal';
import SnackBar from '../../components/common/SnackBar';
import {
  HiOutlineLocationMarker,
  HiOutlineMap,
  HiOutlineRefresh,
  HiOutlineCheckCircle,
  HiOutlineCalendar,
  HiOutlinePlus,
  HiX,
  HiOutlineTruck,
} from 'react-icons/hi';

// Constants
const ZONES = [
  { id: 'colombo-north-district-1', name: 'Colombo North District 1' },
  { id: 'colombo-north-district-2', name: 'Colombo North District 2' },
  { id: 'colombo-south-district-1', name: 'Colombo South District 1' },
  { id: 'colombo-central-district-1', name: 'Colombo Central District 1' },
];

const WARDS_BY_ZONE = {
  'colombo-north-district-1': [
    { wardNumber: 1, wardName: 'Mattakkuliya' },
    { wardNumber: 2, wardName: 'Modera' },
    { wardNumber: 3, wardName: 'Mahawatte' },
    { wardNumber: 4, wardName: 'Aluthmawatha' },
    { wardNumber: 5, wardName: 'Lunupokuna' },
    { wardNumber: 6, wardName: 'Bloemendhal' },
    { wardNumber: 7, wardName: 'Kotahena East' },
    { wardNumber: 8, wardName: 'Kotahena West' },
  ],
  'colombo-north-district-2': [
    { wardNumber: 9, wardName: 'Kochchikade North' },
    { wardNumber: 10, wardName: 'Kochchikade South' },
    { wardNumber: 11, wardName: 'Masangasweediya' },
    { wardNumber: 12, wardName: 'New Bazaar' },
  ],
  'colombo-south-district-1': [
    { wardNumber: 45, wardName: 'Wellawatta North' },
    { wardNumber: 46, wardName: 'Wellawatta South' },
    { wardNumber: 47, wardName: 'Bambalapitiya' },
    { wardNumber: 48, wardName: 'Kirulapone' },
  ],
  'colombo-central-district-1': [
    { wardNumber: 25, wardName: 'Kollupitiya' },
    { wardNumber: 26, wardName: 'Cinnamon Gardens' },
    { wardNumber: 27, wardName: 'Borella' },
    { wardNumber: 28, wardName: 'Maradana' },
  ],
};

const INPUT_BASE = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500';

// Helper functions
const getZoneName = (zoneId) => ZONES.find(z => z.id === zoneId)?.name;
const isWardSelected = (wardNumber, selectedWards) => selectedWards.some(w => w.wardNumber === wardNumber);

// Components
const FormSection = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
      <Icon className="mr-2" />
      {title}
    </h2>
    {children}
  </div>
);

const WardBadge = ({ ward, onRemove }) => (
  <div className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
    <span>Ward {ward.wardNumber} - {ward.wardName}</span>
    <button onClick={() => onRemove(ward.wardNumber)} className="ml-2 hover:bg-blue-700 rounded-full p-0.5">
      <HiX className="text-lg" />
    </button>
  </div>
);

const WardButton = ({ ward, isSelected, onClick }) => (
  <button
    onClick={onClick}
    disabled={isSelected}
    className={`p-3 border-2 rounded-lg text-left transition-all ${
      isSelected
        ? 'border-blue-300 bg-blue-50 cursor-not-allowed opacity-50'
        : 'border-gray-200 hover:border-emerald-500 hover:bg-emerald-50'
    }`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="font-semibold text-gray-900">Ward {ward.wardNumber}</p>
        <p className="text-sm text-gray-600">{ward.wardName}</p>
      </div>
      {isSelected ? (
        <HiOutlineCheckCircle className="text-blue-600 text-xl" />
      ) : (
        <HiOutlinePlus className="text-emerald-600 text-xl" />
      )}
    </div>
  </button>
);

const ZoneSelection = ({ selectedZone, onZoneChange, collectionDate, onDateChange }) => (
  <FormSection title="Step 1: Select Zone and Date" icon={HiOutlineLocationMarker}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <HiOutlineCalendar className="inline mr-1" />
          Collection Date
        </label>
        <input type="date" value={collectionDate} onChange={(e) => onDateChange(e.target.value)} className={INPUT_BASE} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <HiOutlineLocationMarker className="inline mr-1" />
          Select Zone
        </label>
        <select value={selectedZone || ''} onChange={(e) => onZoneChange(e.target.value)} className={INPUT_BASE}>
          <option value="">-- Select a Zone --</option>
          {ZONES.map(zone => <option key={zone.id} value={zone.id}>{zone.name}</option>)}
        </select>
      </div>
    </div>
    {selectedZone && (
      <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
        <p className="text-sm text-emerald-800 font-medium">✓ Selected: {getZoneName(selectedZone)}</p>
      </div>
    )}
  </FormSection>
);

const WardSelection = ({ zone, selectedWards, onToggleWard }) => {
  const availableWards = zone ? WARDS_BY_ZONE[zone] || [] : [];
  
  if (!zone) {
    return (
      <FormSection title="Step 2: Add Wards" icon={HiOutlineMap}>
        <div className="text-center py-8 text-gray-500">
          <HiOutlineLocationMarker className="mx-auto text-4xl mb-2" />
          <p>Please select a zone first</p>
        </div>
      </FormSection>
    );
  }

  return (
    <FormSection title={`Step 2: Add Wards for ${getZoneName(zone)}`} icon={HiOutlineMap}>
      {selectedWards.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-semibold text-gray-700 mb-2">Selected Wards ({selectedWards.length}):</p>
          <div className="flex flex-wrap gap-2">
            {selectedWards.map(ward => <WardBadge key={ward.wardNumber} ward={ward} onRemove={onToggleWard} />)}
          </div>
        </div>
      )}
      <p className="text-sm font-medium text-gray-700 mb-3">Available Wards - Click to add:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {availableWards.map(ward => (
          <WardButton
            key={ward.wardNumber}
            ward={ward}
            isSelected={isWardSelected(ward.wardNumber, selectedWards)}
            onClick={() => onToggleWard(ward)}
          />
        ))}
      </div>
    </FormSection>
  );
};

const RouteDetails = ({ zone, selectedWards, collectionDate, routeName, onRouteNameChange, vehicleType, onVehicleTypeChange }) => {
  if (!selectedWards.length) return null;

  return (
    <FormSection title="Step 3: Route Details" icon={HiOutlineTruck}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Route Name</label>
          <input
            type="text"
            value={routeName}
            onChange={(e) => onRouteNameChange(e.target.value)}
            placeholder="e.g., Colombo North - Morning"
            className={INPUT_BASE}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
          <select value={vehicleType} onChange={(e) => onVehicleTypeChange(e.target.value)} className={INPUT_BASE}>
            <option value="compactor">Compactor Truck</option>
            <option value="tipper">Tipper Truck</option>
            <option value="small">Small Collection Vehicle</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Collection Date</label>
          <input type="text" value={collectionDate} disabled className={`${INPUT_BASE} bg-gray-100 cursor-not-allowed`} />
        </div>
      </div>
      <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-gray-900">{getZoneName(zone)}</p>
            <p className="text-xs text-gray-600">Zone</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{selectedWards.length}</p>
            <p className="text-xs text-gray-600">Wards</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{vehicleType}</p>
            <p className="text-xs text-gray-600">Vehicle</p>
          </div>
        </div>
      </div>
    </FormSection>
  );
};

const PublishSection = ({ canPublish, onPublish, isPublishing, onDuplicateLastWeek }) => (
  <FormSection title="Step 4: Publish Route" icon={HiOutlineCheckCircle}>
    <div className="flex items-center justify-end mb-4 -mt-8">
      <button onClick={onDuplicateLastWeek} className="flex items-center text-sm text-emerald-600 hover:text-emerald-700 font-medium">
        <HiOutlineRefresh className="mr-1" />
        Duplicate Last Week
      </button>
    </div>
    {!canPublish ? (
      <div className="text-center py-8 text-gray-500">
        <HiOutlineCheckCircle className="mx-auto text-4xl mb-2" />
        <p>Complete all steps above to publish</p>
      </div>
    ) : (
      <>
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 flex items-center">
            <HiOutlineCheckCircle className="mr-2" />
            Publishing will create the route. Manage stops from Route Stops page.
          </p>
        </div>
        <button
          onClick={onPublish}
          disabled={isPublishing}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg flex items-center justify-center"
        >
          <HiOutlineRefresh className={`mr-2 ${isPublishing ? 'animate-spin' : ''}`} />
          {isPublishing ? 'Publishing Route...' : 'Publish Route'}
        </button>
      </>
    )}
  </FormSection>
);

// Main Component
const RoutePlanner = () => {
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    collectionDate: today,
    selectedZone: '',
    selectedWards: [],
    routeName: '',
    vehicleType: 'compactor',
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const [isAddZoneModalOpen, setIsAddZoneModalOpen] = useState(false);
  const [snackBar, setSnackBar] = useState({ isOpen: false, message: '', type: 'success' });

  const handleZoneChange = (zoneId) => {
    setFormData(prev => ({ ...prev, selectedZone: zoneId, selectedWards: [] }));
  };

  const handleToggleWard = (ward) => {
    setFormData(prev => ({
      ...prev,
      selectedWards: isWardSelected(ward.wardNumber, prev.selectedWards)
        ? prev.selectedWards.filter(w => w.wardNumber !== ward.wardNumber)
        : [...prev.selectedWards, ward]
    }));
  };

  const handlePublish = () => {
    setIsPublishing(true);
    
    const routeData = {
      ...formData,
      zoneName: getZoneName(formData.selectedZone),
    };

    console.log('Publishing route:', routeData);
    
    setTimeout(() => {
      alert('Route published successfully! Manage route stops from the Route Stops page.');
      setIsPublishing(false);
      setFormData(prev => ({ ...prev, selectedWards: [], routeName: '' }));
    }, 1500);
  };

  const handleDuplicateLastWeek = () => {
    alert('Feature coming soon: Duplicate last week\'s route');
  };

  const handleAddZone = () => {
    setIsAddZoneModalOpen(true);
  };

  const handleSaveZone = (zoneData, successMessage) => {
    console.log('Zone saved successfully:', zoneData);
    
    // Show success SnackBar
    if (successMessage) {
      setSnackBar({
        isOpen: true,
        message: successMessage,
        type: 'success'
      });
    }
    
    // Optionally refresh the zones list or update the UI
    // You could call an API to get updated zones and update the ZONES constant
  };

  // Handle SnackBar close
  const handleSnackBarClose = () => {
    setSnackBar(prev => ({ ...prev, isOpen: false }));
  };

  const canPublish = formData.selectedZone && formData.selectedWards.length > 0 && formData.routeName.trim();

  return (
    <div className="min-h-screen bg-gray-50">
      <DispatcherSidebar />
      <div className="lg:pl-72">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-8 pb-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Route Planner</h1>
                <p className="mt-2 text-gray-600">Create and publish collection routes for zones and wards</p>
              </div>
              <button
                onClick={handleAddZone}
                className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                title="Add New Zone/Ward"
              >
                <HiOutlinePlus className="mr-2" />
                Add New Zones/ Wards
              </button>
            </div>
          </div>

          <ZoneSelection
            selectedZone={formData.selectedZone}
            onZoneChange={handleZoneChange}
            collectionDate={formData.collectionDate}
            onDateChange={(date) => setFormData(prev => ({ ...prev, collectionDate: date }))}
          />

          <WardSelection
            zone={formData.selectedZone}
            selectedWards={formData.selectedWards}
            onToggleWard={handleToggleWard}
          />

          <RouteDetails
            zone={formData.selectedZone}
            selectedWards={formData.selectedWards}
            collectionDate={formData.collectionDate}
            routeName={formData.routeName}
            onRouteNameChange={(name) => setFormData(prev => ({ ...prev, routeName: name }))}
            vehicleType={formData.vehicleType}
            onVehicleTypeChange={(type) => setFormData(prev => ({ ...prev, vehicleType: type }))}
          />

          <PublishSection
            canPublish={canPublish}
            onPublish={handlePublish}
            isPublishing={isPublishing}
            onDuplicateLastWeek={handleDuplicateLastWeek}
          />
        </div>
      </div>


      {/* Add Zone Modal */}
      <AddZoneModal
        isOpen={isAddZoneModalOpen}
        onClose={() => setIsAddZoneModalOpen(false)}
        onSave={handleSaveZone}
      />

      {/* SnackBar */}
      <SnackBar
        isOpen={snackBar.isOpen}
        onClose={handleSnackBarClose}
        message={snackBar.message}
        type={snackBar.type}
        duration={6000}
        position="top-right"
      />
    </div>
  );
};

export default RoutePlanner;

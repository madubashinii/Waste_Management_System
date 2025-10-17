import { useState } from 'react';
import {
  HiOutlineMap,
  HiOutlineLocationMarker,
  HiX,
  HiOutlineChevronUp,
  HiOutlineChevronDown,
  HiOutlineCheckCircle,
  HiOutlineMenu,
} from 'react-icons/hi';

// Mock route data with wards (in real app, fetch from API)
const mockRoutesWithWards = [
  {
    route_id: 1,
    route_name: 'Colombo North - Morning',
    zone: 'Colombo North District 1',
    wards: [
      { wardNumber: 1, wardName: 'Mattakkuliya' },
      { wardNumber: 2, wardName: 'Modera' },
      { wardNumber: 5, wardName: 'Lunupokuna' },
    ],
  },
  {
    route_id: 2,
    route_name: 'Colombo South - Evening',
    zone: 'Colombo South District 1',
    wards: [
      { wardNumber: 45, wardName: 'Wellawatta North' },
      { wardNumber: 46, wardName: 'Wellawatta South' },
      { wardNumber: 47, wardName: 'Bambalapitiya' },
    ],
  },
  {
    route_id: 3,
    route_name: 'Kandy Central Route',
    zone: 'Colombo Central District 1',
    wards: [
      { wardNumber: 25, wardName: 'Kollupitiya' },
      { wardNumber: 26, wardName: 'Cinnamon Gardens' },
    ],
  },
];

const WardRow = ({ ward, index, totalWards, onMoveUp, onMoveDown }) => (
  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="flex items-center space-x-3">
      <HiOutlineMenu className="text-gray-400" />
      <div className="flex items-center space-x-2">
        <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          {index + 1}
        </span>
        <div>
          <p className="font-semibold text-gray-900">Ward {ward.wardNumber}</p>
          <p className="text-sm text-gray-600">{ward.wardName}</p>
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onMoveUp(index)}
        disabled={index === 0}
        className="p-1 text-gray-400 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Move up"
      >
        <HiOutlineChevronUp className="text-xl" />
      </button>
      <button
        onClick={() => onMoveDown(index)}
        disabled={index === totalWards - 1}
        className="p-1 text-gray-400 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Move down"
      >
        <HiOutlineChevronDown className="text-xl" />
      </button>
    </div>
  </div>
);

const AddRouteStopModal = ({ isOpen, onClose, onSubmit }) => {
  const [selectedRoute, setSelectedRoute] = useState('');
  const [orderedWards, setOrderedWards] = useState([]);

  if (!isOpen) return null;

  const selectedRouteData = mockRoutesWithWards.find(r => r.route_id.toString() === selectedRoute);

  const handleRouteChange = (routeId) => {
    setSelectedRoute(routeId);
    const route = mockRoutesWithWards.find(r => r.route_id.toString() === routeId);
    if (route) {
      setOrderedWards([...route.wards]);
    } else {
      setOrderedWards([]);
    }
  };

  const handleMoveUp = (index) => {
    if (index > 0) {
      const newWards = [...orderedWards];
      [newWards[index], newWards[index - 1]] = [newWards[index - 1], newWards[index]];
      setOrderedWards(newWards);
    }
  };

  const handleMoveDown = (index) => {
    if (index < orderedWards.length - 1) {
      const newWards = [...orderedWards];
      [newWards[index], newWards[index + 1]] = [newWards[index + 1], newWards[index]];
      setOrderedWards(newWards);
    }
  };

  const handleSubmit = () => {
    if (!selectedRoute || orderedWards.length === 0) {
      alert('Please select a route first');
      return;
    }

    const stopData = {
      route_id: selectedRoute,
      route_name: selectedRouteData?.route_name,
      zone: selectedRouteData?.zone,
      wards: orderedWards,
    };

    onSubmit(stopData);
    
    // Reset form
    setSelectedRoute('');
    setOrderedWards([]);
  };

  const handleClose = () => {
    setSelectedRoute('');
    setOrderedWards([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <HiOutlineLocationMarker className="mr-2" />
            Add Route Stops
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <HiX className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Select Route */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <HiOutlineMap className="inline mr-1" />
              Step 1: Select Route
            </label>
            <select
              value={selectedRoute}
              onChange={(e) => handleRouteChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">-- Select a Route --</option>
              {mockRoutesWithWards.map(route => (
                <option key={route.route_id} value={route.route_id}>
                  {route.route_name} - {route.zone}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Arrange Wards */}
          {selectedRouteData && (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Step 2: Arrange Ward Order
                </label>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                  <p className="text-sm text-blue-800">
                    <HiOutlineCheckCircle className="inline mr-1" />
                    Use the arrows to rearrange the ward collection order. The stops will be created in this sequence.
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {orderedWards.map((ward, index) => (
                  <WardRow
                    key={ward.wardNumber}
                    ward={ward}
                    index={index}
                    totalWards={orderedWards.length}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                  />
                ))}
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{orderedWards.length}</p>
                    <p className="text-xs text-gray-600">Wards in Route</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{orderedWards.length}</p>
                    <p className="text-xs text-gray-600">Stops to Create</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!selectedRoute && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <HiOutlineMap className="mx-auto text-5xl text-gray-400 mb-3" />
              <p className="text-gray-500">Select a route to view and arrange its wards</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedRoute || orderedWards.length === 0}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors flex items-center"
          >
            <HiOutlineCheckCircle className="mr-2" />
            Create {orderedWards.length} Route Stop{orderedWards.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRouteStopModal;


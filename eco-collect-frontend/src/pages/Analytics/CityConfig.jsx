import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

function CityConfig() {
  const [activeTab, setActiveTab] = useState('zones');
  const [zones, setZones] = useState([]);
  const [wasteTypes, setWasteTypes] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});

  const tabs = [
    { id: 'zones', label: '🗺️ Zones' },
    { id: 'waste-types', label: '🗑️ Waste Types' },
    { id: 'trucks', label: '🚛 Trucks' },
    { id: 'users', label: '👥 Users' }
  ];

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      switch (activeTab) {
        case 'zones':
          setZones(await adminService.getZones());
          break;
        case 'waste-types':
          setWasteTypes(await adminService.getWasteTypes());
          break;
        case 'trucks':
          setTrucks(await adminService.getTrucks());
          break;
        case 'users':
          setUsers(await adminService.getUsers());
          break;
      }
    } catch (error) {
      alert(`Error loading ${activeTab}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, data = {}) => {
    setModalType(type);
    setFormData(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
    setModalType('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      switch (modalType) {
        case 'zone':
          if (formData.zone_id) {
            await adminService.updateZone(formData.zone_id, formData);
          } else {
            await adminService.createZone(formData);
          }
          break;
        case 'wasteType':
          if (formData.waste_type_id) {
            await adminService.updateWasteType(formData.waste_type_id, formData);
          } else {
            await adminService.createWasteType(formData);
          }
          break;
        case 'truck':
          if (formData.truck_id) {
            await adminService.updateTruck(formData.truck_id, formData);
          } else {
            await adminService.createTruck(formData);
          }
          break;
        case 'user':
          if (formData.user_id) {
            await adminService.updateUser(formData.user_id, formData);
          } else {
            await adminService.createUser(formData);
          }
          break;
      }
      await loadData();
      closeModal();
    } catch (error) {
      alert(`Error saving ${modalType}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      setLoading(true);
      switch (type) {
        case 'zone':
          await adminService.deleteZone(id);
          break;
        case 'wasteType':
          await adminService.deleteWasteType(id);
          break;
        case 'truck':
          await adminService.deleteTruck(id);
          break;
        case 'user':
          await adminService.deleteUser(id);
          break;
      }
      await loadData();
    } catch (error) {
      alert(`Error deleting ${type}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderModal = () => {
    if (!showModal) return null;

    const modalConfig = {
      zone: {
        title: formData.zone_id ? 'Edit Zone' : 'Add New Zone',
        fields: [
          { name: 'zone_name', label: 'Zone Name', type: 'text', required: true }
        ]
      },
      wasteType: {
        title: formData.waste_type_id ? 'Edit Waste Type' : 'Add Waste Type',
        fields: [
          { name: 'name', label: 'Waste Type Name', type: 'text', required: true },
          { name: 'recyclable', label: 'Recyclable', type: 'checkbox' }
        ]
      },
      truck: {
        title: formData.truck_id ? 'Edit Truck' : 'Add Truck',
        fields: [
          { name: 'truck_name', label: 'Truck Name', type: 'text', required: true },
          { name: 'truck_type', label: 'Truck Type', type: 'text', required: true },
          { name: 'capacity_kg', label: 'Capacity (kg)', type: 'number' },
          { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Maintenance', 'Inactive'] }
        ]
      },
      user: {
        title: formData.user_id ? 'Edit User' : 'Create User',
        fields: [
          { name: 'name', label: 'Full Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'phone', label: 'Phone', type: 'text' },
          { name: 'role', label: 'Role', type: 'select', options: ['Admin', 'Dispatcher', 'Collector', 'Resident'], required: true }
        ]
      }
    };

    const config = modalConfig[modalType];
    if (!config) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">{config.title}</h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            {config.fields.map(field => (
              <div key={field.name} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <input
                    type="checkbox"
                    checked={formData[field.name] || false}
                    onChange={(e) => setFormData({...formData, [field.name]: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={field.required}
                  />
                )}
              </div>
            ))}
            <div className="flex gap-3 justify-end mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🏙️ City Configuration</h1>
          <p className="text-gray-600 mt-2">Manage zones, waste types, trucks, and users</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b">
            <nav className="flex -mb-px">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading...</p>
              </div>
            )}

            {!loading && (
              <>
                {/* Zones Tab */}
                {activeTab === 'zones' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Zones Management</h2>
                      <button
                        onClick={() => openModal('zone')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        + Add Zone
                      </button>
                    </div>
                    <div className="grid gap-4">
                      {zones.map(zone => (
                        <div key={zone.zone_id} className="bg-gray-50 p-4 rounded-lg border flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{zone.zone_name}</h3>
                            <p className="text-sm text-gray-600">ID: {zone.zone_id}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal('zone', zone)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete('zone', zone.zone_id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                      {zones.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No zones configured. Add your first zone to get started.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Waste Types Tab */}
                {activeTab === 'waste-types' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Waste Types</h2>
                      <button
                        onClick={() => openModal('wasteType')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        + Add Waste Type
                      </button>
                    </div>
                    <div className="grid gap-4">
                      {wasteTypes.map(type => (
                        <div key={type.waste_type_id} className="bg-gray-50 p-4 rounded-lg border flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{type.name}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              type.recyclable
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {type.recyclable ? '♻️ Recyclable' : '🚫 Not Recyclable'}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal('wasteType', type)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete('wasteType', type.waste_type_id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                      {wasteTypes.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No waste types configured.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Trucks Tab */}
                {activeTab === 'trucks' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Trucks Management</h2>
                      <button
                        onClick={() => openModal('truck')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        + Add Truck
                      </button>
                    </div>
                    <div className="grid gap-4">
                      {trucks.map(truck => (
                        <div key={truck.truck_id} className="bg-gray-50 p-4 rounded-lg border flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{truck.truck_name}</h3>
                            <div className="text-sm text-gray-600 flex gap-4 mt-1">
                              <span>Type: {truck.truck_type}</span>
                              {truck.capacity_kg && <span>Capacity: {truck.capacity_kg}kg</span>}
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                truck.status === 'Active' ? 'bg-green-100 text-green-800' :
                                truck.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {truck.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal('truck', truck)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete('truck', truck.truck_id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                      {trucks.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No trucks configured.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Users Management</h2>
                      <button
                        onClick={() => openModal('user')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        + Create User
                      </button>
                    </div>
                    <div className="grid gap-4">
                      {users.map(user => (
                        <div key={user.user_id} className="bg-gray-50 p-4 rounded-lg border flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{user.name}</h3>
                            <div className="text-sm text-gray-600 flex gap-4 mt-1">
                              <span>{user.email}</span>
                              <span>{user.phone}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                                user.role === 'Dispatcher' ? 'bg-blue-100 text-blue-800' :
                                user.role === 'Collector' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {user.role}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal('user', user)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete('user', user.user_id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                      {users.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No users configured.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {renderModal()}
    </div>
  );
}

export default CityConfig;
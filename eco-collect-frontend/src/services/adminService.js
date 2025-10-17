// src/services/adminService.js
import api from './api';

// Mock data for development
const mockZones = [
  { zone_id: 1, zone_name: 'North Zone', created_at: '2024-01-01' },
  { zone_id: 2, zone_name: 'South Zone', created_at: '2024-01-01' },
  { zone_id: 3, zone_name: 'East Zone', created_at: '2024-01-01' },
  { zone_id: 4, zone_name: 'West Zone', created_at: '2024-01-01' }
];

const mockWasteTypes = [
  { waste_type_id: 1, name: 'General Waste', recyclable: false, created_at: '2024-01-01' },
  { waste_type_id: 2, name: 'Organic Waste', recyclable: true, created_at: '2024-01-01' },
  { waste_type_id: 3, name: 'Recycling', recyclable: true, created_at: '2024-01-01' },
  { waste_type_id: 4, name: 'E-Waste', recyclable: true, created_at: '2024-01-01' }
];

const mockTrucks = [
  { truck_id: 1, truck_name: 'TRUCK-001', truck_type: 'Compactor', capacity_kg: 5000, status: 'Active', created_at: '2024-01-01' },
  { truck_id: 2, truck_name: 'TRUCK-002', truck_type: 'Recycling Truck', capacity_kg: 3000, status: 'Active', created_at: '2024-01-01' }
];

const mockUsers = [
  { user_id: 1, name: 'John Admin', email: 'admin@ecocollect.com', role: 'Admin', phone: '+1234567890', created_at: '2024-01-01' },
  { user_id: 2, name: 'Mike Dispatcher', email: 'dispatcher@ecocollect.com', role: 'Dispatcher', phone: '+1234567891', created_at: '2024-01-01' }
];

// Use mock data for now - set to false when backend is ready
const USE_MOCK_DATA = true;

const adminService = {
  // Zones
  getZones: async () => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockZones;
    }
    return api.get('/zones');
  },

  createZone: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newZone = {
        zone_id: Math.max(...mockZones.map(z => z.zone_id)) + 1,
        ...data,
        created_at: new Date().toISOString()
      };
      mockZones.push(newZone);
      return newZone;
    }
    return api.post('/zones', data);
  },

  updateZone: async (id, data) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockZones.findIndex(z => z.zone_id === id);
      if (index !== -1) {
        mockZones[index] = { ...mockZones[index], ...data };
      }
      return mockZones[index];
    }
    return api.put(`/zones/${id}`, data);
  },

  deleteZone: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockZones.findIndex(z => z.zone_id === id);
      if (index !== -1) {
        mockZones.splice(index, 1);
      }
      return { success: true };
    }
    return api.delete(`/zones/${id}`);
  },

  // Waste Types
  getWasteTypes: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockWasteTypes;
    }
    return api.get('/waste-types');
  },

  createWasteType: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newType = {
        waste_type_id: Math.max(...mockWasteTypes.map(w => w.waste_type_id)) + 1,
        ...data,
        created_at: new Date().toISOString()
      };
      mockWasteTypes.push(newType);
      return newType;
    }
    return api.post('/waste-types', data);
  },

  updateWasteType: async (id, data) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockWasteTypes.findIndex(w => w.waste_type_id === id);
      if (index !== -1) {
        mockWasteTypes[index] = { ...mockWasteTypes[index], ...data };
      }
      return mockWasteTypes[index];
    }
    return api.put(`/waste-types/${id}`, data);
  },

  deleteWasteType: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockWasteTypes.findIndex(w => w.waste_type_id === id);
      if (index !== -1) {
        mockWasteTypes.splice(index, 1);
      }
      return { success: true };
    }
    return api.delete(`/waste-types/${id}`);
  },

  // Trucks
  getTrucks: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockTrucks;
    }
    return api.get('/trucks');
  },

  createTruck: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newTruck = {
        truck_id: Math.max(...mockTrucks.map(t => t.truck_id)) + 1,
        ...data,
        created_at: new Date().toISOString()
      };
      mockTrucks.push(newTruck);
      return newTruck;
    }
    return api.post('/trucks', data);
  },

  updateTruck: async (id, data) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockTrucks.findIndex(t => t.truck_id === id);
      if (index !== -1) {
        mockTrucks[index] = { ...mockTrucks[index], ...data };
      }
      return mockTrucks[index];
    }
    return api.put(`/trucks/${id}`, data);
  },

  deleteTruck: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockTrucks.findIndex(t => t.truck_id === id);
      if (index !== -1) {
        mockTrucks.splice(index, 1);
      }
      return { success: true };
    }
    return api.delete(`/trucks/${id}`);
  },

  // Users
  getUsers: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockUsers;
    }
    return api.get('/users');
  },

  createUser: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newUser = {
        user_id: Math.max(...mockUsers.map(u => u.user_id)) + 1,
        ...data,
        created_at: new Date().toISOString()
      };
      mockUsers.push(newUser);
      return newUser;
    }
    return api.post('/users', data);
  },

  updateUser: async (id, data) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockUsers.findIndex(u => u.user_id === id);
      if (index !== -1) {
        mockUsers[index] = { ...mockUsers[index], ...data };
      }
      return mockUsers[index];
    }
    return api.put(`/users/${id}`, data);
  },

  deleteUser: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockUsers.findIndex(u => u.user_id === id);
      if (index !== -1) {
        mockUsers.splice(index, 1);
      }
      return { success: true };
    }
    return api.delete(`/users/${id}`);
  },

  // Pricing
  getActivePricingModel: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        model_id: 1,
        name: 'PAYT',
        description: 'Pay-As-You-Throw pricing model',
        configuration: {
          general: 0.15,
          organic: 0.10,
          recycling: 0.00,
          e_waste: 0.25
        },
        is_active: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-15'
      };
    }
    return api.get('/pricing-models/active');
  },

  createPricingModel: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        model_id: Date.now(),
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    return api.post('/pricing-models', data);
  },

  // Billing
  getInvoices: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        { invoice_id: 1, resident_id: 4, resident_name: 'David Resident', amount: 18.50, status: 'paid', billing_period_start: '2024-01-01', billing_period_end: '2024-01-31', created_at: '2024-01-31' },
        { invoice_id: 2, resident_id: 5, resident_name: 'Lisa Johnson', amount: 22.75, status: 'sent', billing_period_start: '2024-01-01', billing_period_end: '2024-01-31', created_at: '2024-01-31' }
      ];
    }
    return api.get('/billing');
  },

  runBilling: async (startDate, endDate) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        invoices: [
          { invoice_id: 1, resident_id: 4, resident_name: 'David Resident', amount: 18.50, status: 'draft', billing_period_start: startDate, billing_period_end: endDate },
          { invoice_id: 2, resident_id: 5, resident_name: 'Lisa Johnson', amount: 22.75, status: 'draft', billing_period_start: startDate, billing_period_end: endDate }
        ]
      };
    }
    return api.post('/billing/run', { startDate, endDate });
  },

  approveAllInvoices: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, message: 'All invoices approved' };
    }
    return api.post('/billing/approve-all');
  },

  sendAllInvoices: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, message: 'All invoices sent' };
    }
    return api.post('/billing/send-all');
  },

  updateInvoice: async (id, data) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { invoice_id: id, ...data };
    }
    return api.put(`/billing/${id}`, data);
  },

  // Reports
  getReport: async (reportType, dateRange) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [];
    }
    return api.get(`/reports/${reportType}`, dateRange);
  }
};

export default adminService;
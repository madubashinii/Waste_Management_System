// src/services/adminService.js
import api from './api';

// Mock data
const mockZones = [
  { zone_id: 1, zone_name: 'North Zone', created_at: '2024-01-01' },
  { zone_id: 2, zone_name: 'South Zone', created_at: '2024-01-01' },
  { zone_id: 3, zone_name: 'East Zone', created_at: '2024-01-01' }
];

// ... other mock data arrays

const USE_MOCK_DATA = true;

// Use named exports instead of default
export const adminService = {
  getZones: async () => {
    if (USE_MOCK_DATA) {
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

  getWasteTypes: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        { waste_type_id: 1, name: 'General Waste', recyclable: false, created_at: '2024-01-01' },
        { waste_type_id: 2, name: 'Organic Waste', recyclable: true, created_at: '2024-01-01' },
        { waste_type_id: 3, name: 'Recycling', recyclable: true, created_at: '2024-01-01' }
      ];
    }
    return api.get('/waste-types');
  },

  createWasteType: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { waste_type_id: Date.now(), ...data, created_at: new Date().toISOString() };
    }
    return api.post('/waste-types', data);
  },

  getTrucks: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        { truck_id: 1, truck_name: 'TRUCK-001', truck_type: 'Compactor', status: 'Active', created_at: '2024-01-01' },
        { truck_id: 2, truck_name: 'TRUCK-002', truck_type: 'Recycling Truck', status: 'Active', created_at: '2024-01-01' }
      ];
    }
    return api.get('/trucks');
  },

  createTruck: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { truck_id: Date.now(), ...data, created_at: new Date().toISOString() };
    }
    return api.post('/trucks', data);
  },

  getUsers: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        { user_id: 1, name: 'John Admin', email: 'admin@ecocollect.com', role: 'Admin', created_at: '2024-01-01' },
        { user_id: 2, name: 'Mike Dispatcher', email: 'dispatcher@ecocollect.com', role: 'Dispatcher', created_at: '2024-01-01' }
      ];
    }
    return api.get('/users');
  },

  createUser: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { user_id: Date.now(), ...data, created_at: new Date().toISOString() };
    }
    return api.post('/users', data);
  },

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
      return { model_id: Date.now(), ...data, created_at: new Date().toISOString() };
    }
    return api.post('/pricing-models', data);
  },

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
      return { success: true };
    }
    return api.post('/billing/approve-all');
  },

  sendAllInvoices: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
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

  getReport: async (reportType, dateRange) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Return mock report data based on type
      switch (reportType) {
        case 'waste-by-zone':
          return [
            { zone: 'North Zone', total_waste: 1500, recycled: 900 },
            { zone: 'South Zone', total_waste: 1200, recycled: 800 }
          ];
        case 'recycling-rate':
          return [
            { zone: 'North Zone', recycling_rate: '60%' },
            { zone: 'South Zone', recycling_rate: '67%' }
          ];
        default:
          return [];
      }
    }
    return api.get(`/reports/${reportType}`, dateRange);
  }
};

// Keep default export for backward compatibility
export default adminService;
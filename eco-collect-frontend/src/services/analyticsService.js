const API_BASE = 'http://localhost:8080/api';

export const analyticsService = {
  // Pricing
  createPricingModel: (data) => fetch(`${API_BASE}/pricing-models`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),

  // Zones
  createZone: (zoneData) => fetch(`${API_BASE}/zones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(zoneData)
  }),

  // Billing
  runBilling: (from, to) => fetch(`${API_BASE}/billing/run?from=${from}&to=${to}`, {
    method: 'POST'
  })
};
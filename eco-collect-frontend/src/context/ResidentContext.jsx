import { createContext, useState } from "react";

// Mocked Users
const users = [
  { user_id: 1, name: 'Resident A', role: 'Resident' },
];

// Mocked Bins for residents
const initialBins = [
  { binId: 1, location: "123 Main St", binType: "General", status: "Active", zoneId: 1 },
  { binId: 2, location: "456 Oak Ave", binType: "Recyclable", status: "Active", zoneId: 1 },
  { binId: 3, location: "789 Pine Rd", binType: "Organic", status: "Inactive", zoneId: 2 },
  { binId: 4, location: "321 Elm St", binType: "General", status: "Missing", zoneId: 2 },
];

// Mocked Pickup Requests
const initialPickups = [
  {
    pickupId: 1,
    residentId: 1,
    pickupType: "Regular",
    address: "123 Main St",
    status: "Pending",
    scheduledDate: "2025-10-20",
    items: [
      { type: "Plastic", quantity: 2 },
      { type: "Paper", quantity: 1.5 },
    ],
    zoneId: 1,
  },
  {
    pickupId: 2,
    residentId: 1,
    pickupType: "Bulky",
    address: "123 Main St",
    status: "Completed",
    scheduledDate: "2025-10-10",
    items: [
      { type: "E-waste", quantity: 1 },
      { type: "Metal", quantity: 3 },
    ],
    zoneId: 1,
  },
  {
    pickupId: 3,
    residentId: 2,
    pickupType: "Emergency",
    address: "456 Oak Ave",
    status: "Pending",
    scheduledDate: "2025-10-18",
    items: [
      { type: "Glass", quantity: 5 },
    ],
    zoneId: 2,
  },
];

// Mocked Notifications
const initialNotifications = [
  { notificationId: 1, type: "Pickup Update", message: "Pickup #1 approved", read: false },
  { notificationId: 2, type: "Pickup Update", message: "Pickup #2 completed", read: true },
  { notificationId: 3, type: "Billing Alert", message: "Invoice #5 is due soon", read: false },
  { notificationId: 4, type: "System", message: "New recycling rules applied to your zone", read: false },
];

// Mocked Waste Data
const initialWasteByType = [
  { wasteType: "Plastic", totalQuantity: 12.5 },
  { wasteType: "Organic", totalQuantity: 7 },
  { wasteType: "Glass", totalQuantity: 3.2 },
];

const initialWasteOverTime = [
  { date: "2025-10-01", Plastic: 2, Organic: 1, Glass: 0.5 },
  { date: "2025-10-02", Plastic: 1.5, Organic: 2, Glass: 1 },
  { date: "2025-10-03", Plastic: 3, Organic: 0.5, Glass: 0.7 },
  { date: "2025-10-04", Plastic: 2, Organic: 1.2, Glass: 0.4 },
];

export const ResidentContext = createContext();

export const ResidentProvider = ({ children }) => {
  const [bins, setBins] = useState(initialBins);
  const [pickupRequests, setPickupRequests] = useState(initialPickups);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [wasteByType, setWasteByType] = useState(initialWasteByType);
  const [wasteOverTime, setWasteOverTime] = useState(initialWasteOverTime);

  // Add a new pickup request
  const addPickupRequest = (newPickup) => {
    setPickupRequests(prev => [...prev, { ...newPickup, pickupId: prev.length + 1, status: "Pending" }]);
  };

  // Cancel a pickup request
  const cancelPickup = (pickupId) => {
    setPickupRequests(prev =>
      prev.map(p => p.pickupId === pickupId ? { ...p, status: "Cancelled" } : p)
    );
  };

  // Update bin status locally
  const updateBinStatus = (binId, status) => {
    setBins(prev =>
      prev.map(b => b.binId === binId ? { ...b, status } : b)
    );
  };

  // Add new waste entry (optional for demo)
  const addWasteLog = (newEntry) => {
    setWasteByType(prev => {
      const idx = prev.findIndex(w => w.wasteType === newEntry.wasteType);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx].totalQuantity += newEntry.quantity;
        return updated;
      } else {
        return [...prev, { wasteType: newEntry.wasteType, totalQuantity: newEntry.quantity }];
      }
    });

    setWasteOverTime(prev => {
      const today = new Date().toISOString().split("T")[0];
      const idx = prev.findIndex(d => d.date === today);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx][newEntry.wasteType] = (updated[idx][newEntry.wasteType] || 0) + newEntry.quantity;
        return updated;
      } else {
        return [...prev, { date: today, [newEntry.wasteType]: newEntry.quantity }];
      }
    });
  };

  return (
    <ResidentContext.Provider value={{
      bins,
      pickupRequests,
      notifications,
      wasteByType,
      wasteOverTime,
      addPickupRequest,
      cancelPickup,
      updateBinStatus,
      addWasteLog
    }}>
      {children}
    </ResidentContext.Provider>
  );
};

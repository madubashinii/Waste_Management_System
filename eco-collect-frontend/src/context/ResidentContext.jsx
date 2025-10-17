import { createContext, useState } from "react";

// Mocked Users
const users = [
    { user_id: 1, name: 'Resident A', role: 'Resident' },
];

// Mocked Bins for resident
const initialBins = [
  { binId: 1, location: "123 Main St", binType: "General", status: "Active" },
  { binId: 2, location: "456 Oak Ave", binType: "Recyclable", status: "Active" },
];

// Mocked Pickup Requests
const initialPickups = [
  {
    pickupId: 1,
    pickupType: "Regular",
    address: "123 Main St",
    status: "Pending",
    items: [{ type: "Plastic", quantity: 2 }],
    zoneId: 1,
  },
];

// Mocked Notifications
const initialNotifications = [
  { notificationId: 1, type: "Pickup Update", message: "Pickup approved", read: false },
];

export const ResidentContext = createContext();

export const ResidentProvider = ({ children }) => {
  const [bins, setBins] = useState(initialBins);
  const [pickupRequests, setPickupRequests] = useState(initialPickups);
  const [notifications, setNotifications] = useState(initialNotifications);

  // Add a new pickup request
  const addPickupRequest = (newPickup) => {
    setPickupRequests((prev) => [...prev, { ...newPickup, pickupId: prev.length + 1, status: "Pending" }]);
  };

  // Cancel a pickup request
  const cancelPickup = (pickupId) => {
    setPickupRequests((prev) =>
      prev.map((p) => (p.pickupId === pickupId ? { ...p, status: "Cancelled" } : p))
    );
  };

  // Update bin status locally
  const updateBinStatus = (binId, status) => {
    setBins((prev) =>
      prev.map((b) => (b.binId === binId ? { ...b, status } : b))
    );
  };

  return (
    <ResidentContext.Provider value={{ bins, pickupRequests, notifications, addPickupRequest, cancelPickup, updateBinStatus }}>
      {children}
    </ResidentContext.Provider>
  );
};

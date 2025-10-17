import React, { useContext } from "react";
import { ResidentContext } from "../../context/ResidentContext";

const DashboardLayout = () => {
  const { bins, pickupRequests, notifications } = useContext(ResidentContext);

  // For demo, take the first user's name
  const userName = "Resident A";

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#f8f9fa" }}
    >
      <div className="card shadow p-4" style={{ minWidth: "300px" }}>
        <h4 className="text-success mb-3">
          <i className="fa-solid fa-user me-2"></i>
          {userName}
        </h4>
        <p>Total Bins: {bins.length}</p>
        <p>Pending Pickups: {pickupRequests.filter(p => p.status === "Pending").length}</p>
        <p>Unread Notifications: {notifications.filter(n => !n.read).length}</p>
      </div>
    </div>
  );
};

export default DashboardLayout;

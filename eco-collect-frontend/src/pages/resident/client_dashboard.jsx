import React, { useContext, useEffect, useState } from "react";
import { ResidentContext } from "../../context/ResidentContext";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from "recharts";

const DashboardLayout = () => {
  const { pickupRequests, notifications } = useContext(ResidentContext);

  const userName = "Resident A";

  const [wasteByType, setWasteByType] = useState([]);
  const [wasteOverTime, setWasteOverTime] = useState([]);

  useEffect(() => {
    // Fetch aggregated waste by type
    fetch("/api/waste-log/stats")
      .then(res => res.json())
      .then(setWasteByType);

    // Fetch time-series waste data
    fetch("/api/waste-log/over-time")
      .then(res => res.json())
      .then(setWasteOverTime);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "'Segoe UI', sans-serif",
        background: "#f8f9fa",
        padding: "20px"
      }}
    >
      {/* User Card */}
      <div className="card shadow p-4 mb-4" style={{ maxWidth: "400px", margin: "0 auto" }}>
        <h4 className="text-success mb-3">
          <i className="fa-solid fa-user me-2"></i>
          {userName}
        </h4>
        <p>Pending Pickups: {pickupRequests.filter(p => p.status === "Pending").length}</p>
        <p>Unread Notifications: {notifications.filter(n => !n.read).length}</p>
      </div>

      {/* Waste by Type - Bar Chart */}
      <div className="card shadow p-3 mb-4">
        <h5>Waste by Type</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={wasteByType}>
            <XAxis dataKey="wasteType" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalQuantity" fill="#4caf50" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Waste Over Time - Line Chart */}
      <div className="card shadow p-3">
        <h5>Waste Over Time</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={wasteOverTime}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* Assuming each waste type is a key in the data */}
            {wasteOverTime[0] &&
              Object.keys(wasteOverTime[0])
                .filter(key => key !== "date")
                .map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={["#4caf50", "#ff9800", "#2196f3"][index % 3]}
                  />
                ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardLayout;

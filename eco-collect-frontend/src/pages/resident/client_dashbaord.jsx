import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Billing from "./Billing";
import Requests from "./Requests";
import Bins from "./Bins";

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [userName, setUserName] = useState("User");
  const [binSummary, setBinSummary] = useState({
    plasticCount: 0,
    organicCount: 0,
    generalCount: 0,
  });

  useEffect(() => {
    fetch("/api/dashboard")
      .then(res => res.json())
      .then(data => {
        setUserName(data.userName);
        setBinSummary(data.binSummary);
      });
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div>
            <h4>Welcome, {userName}</h4>
            <h6 className="mt-3">Bin Summary</h6>
            <ul className="list-group">
              <li className="list-group-item">
                Plastic Bin: {binSummary.plasticCount} items
              </li>
              <li className="list-group-item">
                Organic Bin: {binSummary.organicCount} items
              </li>
              <li className="list-group-item">
                General Bin: {binSummary.generalCount} items
              </li>
            </ul>
          </div>
        );
      case "payment":
        return <Billing />;
      case "requests":
        return <Requests />;
      case "bins":
        return <Bins binSummary={binSummary}/>;
      default:
        return null;
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Sidebar */}
      <div
        className="bg-light p-3"
        style={{ width: "220px", boxShadow: "2px 0 5px rgba(0,0,0,0.1)" }}
      >
        <h5 className="mb-4 text-success">
          <i className="fa-solid fa-user"></i> {userName}
        </h5>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <button
              className={`btn w-100 text-start ${activeTab === "home" ? "btn-success text-white" : "btn-light"}`}
              onClick={() => setActiveTab("home")}
            >
              <i className="fa-solid fa-house me-2"></i> Home
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`btn w-100 text-start ${activeTab === "payment" ? "btn-success text-white" : "btn-light"}`}
              onClick={() => setActiveTab("payment")}
            >
              <i className="fa-solid fa-money-bill-wave me-2"></i> Payment
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`btn w-100 text-start ${activeTab === "requests" ? "btn-success text-white" : "btn-light"}`}
              onClick={() => setActiveTab("requests")}
            >
              <i className="fa-solid fa-truck me-2"></i> Requests
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`btn w-100 text-start ${activeTab === "bins" ? "btn-success text-white" : "btn-light"}`}
              onClick={() => setActiveTab("bins")}
            >
              <i className="fa-solid fa-recycle me-2"></i> Bins
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4 bg-light">{renderContent()}</div>
    </div>
  );
};

export default DashboardLayout;

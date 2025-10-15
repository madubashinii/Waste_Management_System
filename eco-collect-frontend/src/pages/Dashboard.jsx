import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/pricing', label: 'PRICING' },
    { path: '/city-config', label: 'CITY CONFIG' },
    { path: '/billing', label: 'BILLING' },
    { path: '/reports', label: 'REPORTS' },
    { path: '/imports', label: 'IMPORTS' },
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Smart Waste Management - Analytics Dashboard</h1>
        <nav className="main-nav">
          {navItems.map(item => (
            <button
              key={item.path}
              className={location.pathname === item.path ? 'active' : ''}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
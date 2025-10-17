import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/pricing', label: 'PRICING', icon: '💰' },
  { path: '/city-config', label: 'CITY CONFIG', icon: '🏙️' },
  { path: '/billing', label: 'BILLING', icon: '🧾' },
  { path: '/reports', label: 'REPORTS', icon: '📊' },
];

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActivePath = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Smart Waste Management - Analytics Dashboard
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  isActivePath(item.path)
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
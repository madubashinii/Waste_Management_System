import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Analytics/Pricing';
import CityConfig from './pages/Analytics/CityConfig';
import Billing from './pages/Analytics/Billing';
import Reports from './pages/Analytics/Reports';
import Imports from './pages/Analytics/Imports';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route path="pricing" element={<Pricing />} />
          <Route path="city-config" element={<CityConfig />} />
          <Route path="billing" element={<Billing />} />
          <Route path="reports" element={<Reports />} />
          <Route path="imports" element={<Imports />} />
          <Route index element={<Navigate to="/pricing" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
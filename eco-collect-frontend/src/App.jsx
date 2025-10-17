import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/common/Home';
import SignUp from './pages/common/SignUp';
import SignIn from './pages/common/SignIn';
import DispatcherDashboard from './pages/dispatcher/dispatcherDashboard';
import RoutePlanner from './pages/dispatcher/routePlanner';
import RouteStops from './pages/dispatcher/routeStops';
import CollectorAssignment from './pages/dispatcher/collectorAssignment';
import CollectorRoutesWrapper from './pages/collector/CollectorRoutesWrapper';
import ResidentRoutesWrapper from './pages/resident/ResidentRoutesWrapper';

// Analytics Pages
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Analytics/Pricing';
import CityConfig from './pages/Analytics/CityConfig';
import Billing from './pages/Analytics/Billing';
import Reports from './pages/Analytics/Reports';

// Common Layout Component
const CommonLayout = ({ children }) => (
  <>
    <Header />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Routes>
            {/* Public Routes with Header and Footer */}
            <Route path="/" element={<CommonLayout><Home /></CommonLayout>} />
            <Route path="/signup" element={<CommonLayout><SignUp /></CommonLayout>} />
            <Route path="/signin" element={<CommonLayout><SignIn /></CommonLayout>} />

            {/* Analytics Routes with Dashboard Layout */}
            <Route path="/analytics/*" element={<Dashboard />}>
              <Route path="pricing" element={<Pricing />} />
              <Route path="city-config" element={<CityConfig />} />
              <Route path="billing" element={<Billing />} />
              <Route path="reports" element={<Reports />} />
              <Route index element={<Navigate to="/analytics/pricing" replace />} />
            </Route>

            {/* Dispatcher Routes without Header and Footer */}
            <Route path="/dispatcher/dashboard" element={<DispatcherDashboard />} />
            <Route path="/dispatcher/route-planner" element={<RoutePlanner />} />
            <Route path="/dispatcher/route-stops" element={<RouteStops />} />
            <Route path="/dispatcher/collector-assignment" element={<CollectorAssignment />} />

            {/* Collector Routes */}
            <Route path="/collector/*" element={<CollectorRoutesWrapper />} />

            {/* Resident Routes */}
            <Route path="/resident/*" element={<ResidentRoutesWrapper />} />

            {/* Redirect unknown paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
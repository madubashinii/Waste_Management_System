import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/common/Home';
import SignUp from './pages/common/SignUp';
import SignIn from './pages/common/SignIn';
import DispatcherDashboard from './pages/dispatcher/dispatcherDashboard';
import RoutePlanner from './pages/dispatcher/routePlanner';
import RouteStops from './pages/dispatcher/routeStops';
import CollectorAssignment from './pages/dispatcher/collectorAssignment';

/**
 * Layout wrapper for common pages with Header and Footer
 */
const CommonLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

/**
 * Main App Component
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* Routes with Header and Footer */}
          <Route path="/" element={<CommonLayout><Home /></CommonLayout>} />
          <Route path="/signup" element={<CommonLayout><SignUp /></CommonLayout>} />
          <Route path="/signin" element={<CommonLayout><SignIn /></CommonLayout>} />
          
          {/* Dispatcher without Header and Footer */}
          <Route path="/dispatcher/dashboard" element={<DispatcherDashboard />} />
          <Route path="/dispatcher/route-planner" element={<RoutePlanner />} />
          <Route path="/dispatcher/route-stops" element={<RouteStops />} />
          <Route path="/dispatcher/collector-assignment" element={<CollectorAssignment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

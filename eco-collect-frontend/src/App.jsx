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

function App() {
    return (
        <AuthProvider>
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

                        {/* Collector Pages */}
                        <Route path="/collector/*" element={<CollectorRoutesWrapper />} />

                        {/* Redirect unknown paths */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;

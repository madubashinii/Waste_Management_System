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
import FollowupManagement from './pages/dispatcher/FollowupManagement';
import Reports from './pages/dispatcher/Reports';
import DispatcherSidebar from './components/dispatcher/DispatcherSidebar';
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

/**
 * Layout wrapper for dispatcher pages with Header and Footer
 */
const DispatcherLayout = ({ children }) => (
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

                        {/* Dispatcher with Sidebar, Header and Footer */}
                        <Route path="/dispatcher/dashboard" element={<DispatcherSidebar><DispatcherDashboard /></DispatcherSidebar>} />
                        <Route path="/dispatcher/route-planner" element={<DispatcherSidebar><RoutePlanner /></DispatcherSidebar>} />
                        <Route path="/dispatcher/route-stops" element={<DispatcherSidebar><RouteStops /></DispatcherSidebar>} />
                        <Route path="/dispatcher/collector-assignment" element={<DispatcherSidebar><CollectorAssignment /></DispatcherSidebar>} />
                        <Route path="/dispatcher/followup-management" element={<DispatcherSidebar><FollowupManagement /></DispatcherSidebar>} />
                        <Route path="/dispatcher/reports" element={<DispatcherSidebar><Reports /></DispatcherSidebar>} />

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

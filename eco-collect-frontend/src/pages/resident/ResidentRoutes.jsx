import { Routes, Route, Outlet } from 'react-router-dom';
import ResidentLayout from './ResidentLayout';
import ResidentSidebar from '../../components/resident/ResidentSidebar';
import ResidentDashboard from './client_dashboard';
import ResidentBins from './BinRecords';
import ResidentBilling from './Billing';
//import ResidentRequests from './Requests';
import RequestForm from './request_form';
import ResidentBinSummary from './Bins';
import ResidentProfile from './Profile';

export default function ResidentRoutes() {
    return (
        <Routes>
              <Route path="/" element={<ResidentLayout />}>
                <Route path="dashboard" element={<ResidentDashboard />} />
                <Route path="billing" element={<ResidentBilling />} />
                <Route path="bins" element={<ResidentBins />} />
                <Route path="profile" element={<ResidentProfile />} />
                <Route path="request-form" element={<RequestForm />} />
              </Route>
            </Routes>
    );
}

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
import Notifications from './Notifications';
import Wasteform from './WasteForm';

export default function ResidentRoutes() {
    return (
        <Routes>
              <Route path="/" element={<ResidentLayout />}>
                <Route path="dashboard" element={<ResidentDashboard />} />
                <Route path="billing" element={<ResidentBilling />} />
                <Route path="bins" element={<ResidentBins />} />
                <Route path="profile" element={<ResidentProfile />} />
                <Route path="request-form" element={<RequestForm />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="wasteform" element={<Wasteform />} />
              </Route>
            </Routes>
    );
}

import { Routes, Route, Outlet } from 'react-router-dom';
import ResidentSidebar from '../../components/resident/ResidentSidebar';
import ResidentDashboard from './client_dashboard';
import ResidentBinSummary from './BinRecords';
import ResidentBilling from './Billing';
//import ResidentRequests from './Requests';
import RequestForm from './request_form';
import ResidentBins from './Bins';
import ResidentProfile from './Profile';

export default function ResidentLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <ResidentSidebar />
      <div style={{ flex: 1, padding: '20px', background: '#f5f5f5' }}>
        <Outlet />
      </div>
    </div>
  );
}

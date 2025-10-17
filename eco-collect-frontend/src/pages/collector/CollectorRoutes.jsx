import {Routes, Route, Outlet} from 'react-router-dom';
import CollectorSidebar from '../../components/collector/CollectorSidebar';
import CollectorDashboard from './CollectorDashboard';
import TodaysRoutes from './TodaysRoutes';
import ReportIssue from './ReportIssue';
import RouteSummary from './RouteSummary';
import BinCollection from './BinCollection';

export default function CollectorRoutes() {
    return (
        <div style={{display: 'flex', minHeight: '100vh'}}>
            <CollectorSidebar/>
            <div style={{flex: 1, padding: '20px', background: '#f5f5f5'}}>
                <Routes>
                    <Route path="dashboard" element={<CollectorDashboard/>}/>
                    <Route path="routes" element={<TodaysRoutes/>}/>
                    <Route path="report" element={<ReportIssue/>}/>
                    <Route path="summary" element={<RouteSummary/>}/>
                    <Route path="collect" element={<BinCollection/>}/>
                </Routes>
                <Outlet/>
            </div>
        </div>
    );
}

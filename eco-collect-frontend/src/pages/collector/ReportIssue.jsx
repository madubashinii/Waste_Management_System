import {useContext, useState, useEffect} from 'react';
import {CollectorContext} from '../../context/CollectorContext';
import {AlertTriangle} from 'lucide-react';
import ReportIssueForm from '../../components/collector/report/ReportIssueForm';
import ReportIssueSidebar from '../../components/collector/report/ReportIssueSidebar';

export default function ReportIssue() {
    const {routes, reportIssue} = useContext(CollectorContext);
    const [selectedRouteId, setSelectedRouteId] = useState(null);
    const [route, setRoute] = useState(null);

    const [binId, setBinId] = useState('');
    const [issueType, setIssueType] = useState('');
    const [note, setNote] = useState('');
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('');

    // Update selected route when routes load or dropdown changes
    useEffect(() => {
        if (routes.length > 0) {
            setSelectedRouteId(routes[0].routeId);
        }
    }, [routes]);

    useEffect(() => {
        const r = routes.find(r => r.routeId === selectedRouteId);
        setRoute(r || null);
    }, [selectedRouteId, routes]);

    const handleReport = () => {
        if (!binId || !issueType || !note) {
            setMsg('Please fill in all required fields');
            setMsgType('error');
            return;
        }

        if (!route || !route.stops) {
            setMsg('No route loaded. Please try again.');
            setMsgType('error');
            return;
        }

        const stop = route.stops.find((s) => s.binId === binId);
        if (!stop) {
            setMsg('Bin not found! Please check the Bin ID');
            setMsgType('error');
            return;
        }

        reportIssue({routeId: route.routeId, binId, status: 'ISSUE', remarks: note});
        setMsg(`Issue reported successfully for ${binId}`);
        setMsgType('success');
        setBinId('');
        setIssueType('');
        setNote('');
    };

    // Show loading if no route yet
    if (!route) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                Loading route data...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-center gap-3">
                    <AlertTriangle className="w-8 h-8 text-orange-600"/>
                    <h2 className="text-3xl font-bold text-gray-900">Report Bin Issue</h2>
                </div>

                {/* Route Selector */}
                {routes.length > 1 && (
                    <div className="mb-6">
                        <label className="text-gray-600 font-medium mr-2">Select Route:</label>
                        <select
                            value={selectedRouteId || ''}
                            onChange={(e) => setSelectedRouteId(Number(e.target.value))}
                            className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                        >
                            {routes.map((r) => (
                                <option key={r.routeId} value={r.routeId}>
                                    {r.routeName} ({r.zoneName})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <ReportIssueForm
                            binId={binId}
                            issueType={issueType}
                            note={note}
                            msg={msg}
                            msgType={msgType}
                            setBinId={setBinId}
                            setIssueType={setIssueType}
                            setNote={setNote}
                            onSubmit={handleReport}
                        />
                    </div>
                    {/*Clear selected issue type when bin changes*/}
                    <ReportIssueSidebar route={route} setBinId={(id) => {
                        setBinId(id);
                        setIssueType('');
                    }}/>

                </div>
            </div>
        </div>
    );
}
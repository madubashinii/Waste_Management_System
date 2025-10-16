import { useContext, useState } from 'react';
import { CollectorContext } from '../../context/CollectorContext';
import { AlertTriangle } from 'lucide-react';
import ReportIssueForm from '../../components/collector/report/ReportIssueForm';
import ReportIssueSidebar from '../../components/collector/report/ReportIssueSidebar';

export default function ReportIssue() {
    const { routes, reportIssue } = useContext(CollectorContext);
    const route = routes[0];

    const [binId, setBinId] = useState('');
    const [issueType, setIssueType] = useState('');
    const [note, setNote] = useState('');
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('');

    const handleReport = () => {
        if (!binId || !issueType || !note) {
            setMsg('Please fill in all required fields');
            setMsgType('error');
            return;
        }

        const stop = route.stops.find((s) => s.bin_id === binId);
        if (!stop) {
            setMsg('Bin not found! Please check the Bin ID');
            setMsgType('error');
            return;
        }

        reportIssue(route.route_id, binId, note);
        setMsg(`Issue reported successfully for ${binId}`);
        setMsgType('success');
        setBinId('');
        setIssueType('');
        setNote('');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-center gap-3">
                    <AlertTriangle className="w-8 h-8 text-orange-600" />
                    <h2 className="text-3xl font-bold text-gray-900">Report Bin Issue</h2>
                </div>

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

                    <ReportIssueSidebar route={route} setBinId={setBinId} />
                </div>
            </div>
        </div>
    );
}

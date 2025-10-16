import { AlertCircle } from 'lucide-react';

export default function ReportIssueSidebar({ route, setBinId }) {
    return (
        <div className="space-y-6">
            {/* Quick Tips */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-blue-900">Quick Tips</h3>
                </div>
                <ul className="space-y-3 text-sm text-blue-800">
                    <li>• Double-check the Bin ID before submitting</li>
                    <li>• Include specific details about the issue</li>
                    <li>• Take a photo if possible</li>
                    <li>• Report urgent issues immediately</li>
                </ul>
            </div>

            {/* Route Bins */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-4">Today's Route Bins</h3>
                <div className="space-y-2">
                    {route?.stops?.map((stop) => (
                        <div
                            key={stop.bin_id}
                            onClick={() => setBinId(stop.bin_id)}
                            className="p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                            <p className="font-semibold text-gray-900 text-sm">{stop.bin_id}</p>
                            {stop.location && <p className="text-xs text-gray-600">{stop.location}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

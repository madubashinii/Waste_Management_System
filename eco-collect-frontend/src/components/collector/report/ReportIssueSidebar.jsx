import {AlertCircle} from 'lucide-react';

export default function ReportIssueSidebar({route, setBinId}) {
    return (
        <div className="space-y-6">
            {/* Quick Tips */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-blue-600"/>
                    <h3 className="font-bold text-blue-900">Quick Tips</h3>
                </div>
                <ul className="space-y-3 text-sm text-blue-800">
                    <li>• Double-check the Bin ID before submitting</li>
                    <li>• Include specific details about the issue</li>
                    <li>• Take a photo if possible</li>
                    <li>• Report urgent issues immediately</li>
                </ul>
            </div>

            {/*Sidebar check for empty stops*/}
            {route?.stops?.length === 0 && (
                <p className="text-gray-500 text-sm">No bins available for this route.</p>
            )}

            {/* Route Bins */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-4">Today's Route Bins</h3>
                <div className="space-y-2">
                    {route?.stops?.map((stop) => (
                        <div
                            key={stop.binId}
                            onClick={() => setBinId(stop.binId)}
                            className="p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer flex justify-between items-center"
                        >
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">{stop.binId}</p>
                                {stop.location && <p className="text-xs text-gray-600">{stop.location}</p>}
                            </div>
                            {stop.issueReported && (
                                <span className="text-xs text-red-600 font-semibold ml-2">Issue Reported</span>
                            )}
                        </div>
                    ))}

                </div>
            </div>

        </div>
    );
}

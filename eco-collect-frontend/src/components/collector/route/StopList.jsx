import {useContext} from 'react';
import {CollectorContext} from '../../../context/CollectorContext';
import {CheckCircle, Clock, Weight, AlertCircle} from 'lucide-react';

export default function StopList({route}) {
    const {markCollected, reportIssue, fetchTodayRoute} = useContext(CollectorContext);

    if (!route || !route.stops) {
        return (
            <div className="min-h-40 flex items-center justify-center text-gray-500">
                Loading stops...
            </div>
        );
    }

    const handleCollect = async (stop) => {
        await markCollected({binId: stop.binId, routeId: route.routeId, weight: stop.weight || 0});
        fetchTodayRoute();
    };

    const handleReportIssue = async (stop, type) => {
        await reportIssue({routeId: route.routeId, binId: stop.binId, status: type, remarks: type});
        fetchTodayRoute();
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-emerald-600"/>
                <h3 className="text-xl font-bold text-gray-900">Stop Details</h3>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
                {route.stops.map((stop, index) => (
                    <div
                        key={stop.stopId}
                        className={`p-4 rounded-lg border-2 transition-all ${
                            stop.collected ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                        }`}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                        stop.collected ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{stop.binId}</p>
                                    {stop.location && <p className="text-xs text-gray-600">{stop.location}</p>}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {!stop.collected && (
                                    <>
                                        <button onClick={() => handleCollect(stop)}
                                                className="text-green-600 hover:text-green-800">
                                            <CheckCircle className="w-5 h-5"/>
                                        </button>
                                        <button onClick={() => handleReportIssue(stop, 'MISSED')}
                                                className="text-yellow-600 hover:text-yellow-800">
                                            <Clock className="w-5 h-5"/>
                                        </button>
                                        <button onClick={() => handleReportIssue(stop, 'OVERFLOW')}
                                                className="text-red-600 hover:text-red-800">
                                            <AlertCircle className="w-5 h-5"/>
                                        </button>
                                    </>
                                )}
                                {stop.collected && <CheckCircle className="w-5 h-5 text-green-500"/>}
                            </div>
                        </div>

                        {stop.collected && stop.weight && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-700">
                                <Weight className="w-4 h-4"/>
                                <span className="font-medium">{stop.weight} kg</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
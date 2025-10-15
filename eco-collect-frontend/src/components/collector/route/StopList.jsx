import { CheckCircle, Clock, Weight } from 'lucide-react';

export default function StopList({ route }) {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-bold text-gray-900">Stop Details</h3>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
                {route.stops.map((stop, index) => (
                    <div
                        key={stop.stop_id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                            stop.collected ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                        }`}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                    stop.collected ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                                }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{stop.bin_id}</p>
                                    {stop.location && <p className="text-xs text-gray-600">{stop.location}</p>}
                                </div>
                            </div>
                            {stop.collected ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                                <Clock className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                        {stop.collected && stop.weight && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-700">
                                <Weight className="w-4 h-4" />
                                <span className="font-medium">{stop.weight} kg</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

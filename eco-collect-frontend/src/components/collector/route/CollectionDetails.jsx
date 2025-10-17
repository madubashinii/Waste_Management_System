import {Package, CheckCircle, Clock, Weight, TrendingUp} from 'lucide-react';

export default function CollectionDetails({route}) {
    if (!route) return null; // prevent errors if route not yet loaded

    const stops = route.stops || [];
    const collected = stops.filter(s => s.collected).length;
    const pending = stops.length - collected;
    const totalWeight = stops.filter(s => s.collected && s.weight)
        .reduce((sum, s) => sum + s.weight, 0);

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
                <Package className="w-6 h-6 text-emerald-600"/>
                <h3 className="text-xl font-bold text-gray-900">Collection Details</h3>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600"/>
                        <span className="font-semibold text-gray-900">Bins Collected</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">{collected}</span>
                </div>

                <div
                    className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                    <div className="flex items-center gap-3">
                        <Clock className="w-6 h-6 text-yellow-600"/>
                        <span className="font-semibold text-gray-900">Bins Pending</span>
                    </div>
                    <span className="text-2xl font-bold text-yellow-600">{pending}</span>
                </div>

                {totalWeight > 0 && (
                    <>
                        <div
                            className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                            <div className="flex items-center gap-3">
                                <Weight className="w-6 h-6 text-purple-600"/>
                                <span className="font-semibold text-gray-900">Total Weight</span>
                            </div>
                            <span className="text-2xl font-bold text-purple-600">{totalWeight.toFixed(1)} kg</span>
                        </div>

                        <div
                            className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-blue-600"/>
                                <span className="font-semibold text-gray-900">Avg Weight/Bin</span>
                            </div>
                            <span className="text-2xl font-bold text-blue-600">
                                {(collected > 0 ? (totalWeight / collected).toFixed(1) : 0)} kg
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

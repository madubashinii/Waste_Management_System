export default function PerformanceSummary({route}) {
    if (!route || !route.stops) {
        return (
            <div className="min-h-40 flex items-center justify-center text-gray-500">
                Loading performance data...
            </div>
        );
    }

    const collected = route.stops.filter(s => s.collected).length;
    const totalWeight = route.stops.filter(s => s.collected && s.weight).reduce((sum, s) => sum + s.weight, 0);
    const completionRate = Math.round((collected / route.stops.length) * 100);

    return (
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Summary</h3>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Efficiency Rating</p>
                    <p className={`text-3xl font-bold ${
                        completionRate >= 80 ? 'text-green-600' :
                            completionRate >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                        {completionRate >= 80 ? 'Excellent' :
                            completionRate >= 50 ? 'Good' : 'Needs Improvement'}
                    </p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Total Collections</p>
                    <p className="text-3xl font-bold text-blue-600">{collected} Bins</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Weight Collected</p>
                    <p className="text-3xl font-bold text-purple-600">{totalWeight > 0 ? totalWeight.toFixed(1) : '0'} kg</p>
                </div>
            </div>
        </div>
    );
}
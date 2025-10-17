import {MapPin, CheckCircle, Clock, TrendingUp} from 'lucide-react';

export default function RouteStats({route}) {
    if (!route) return null;

    const stops = route.stops || [];
    const totalStops = stops.length;
    const collected = stops.filter(s => s.collected).length;
    const pending = totalStops - collected;
    const completionRate = totalStops > 0 ? Math.round((collected / totalStops) * 100) : 0;

    const stats = [
        {
            label: 'Total Stops',
            value: totalStops,
            icon: MapPin,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-200'
        },
        {
            label: 'Collected',
            value: collected,
            icon: CheckCircle,
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            borderColor: 'border-green-200'
        },
        {
            label: 'Pending',
            value: pending,
            icon: Clock,
            bgColor: 'bg-yellow-50',
            iconColor: 'text-yellow-600',
            borderColor: 'border-yellow-200'
        },
        {
            label: 'Completion Rate',
            value: `${completionRate}%`,
            icon: TrendingUp,
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            borderColor: 'border-emerald-200'
        }
    ];

    return (
        <>
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg p-6 mb-8 text-white">
                <div className="grid md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-emerald-100 text-sm mb-1">Route Name</p>
                        <p className="text-xl font-bold">{route.routeName || 'Route ' + route.routeId}</p>
                    </div>
                    <div>
                        <p className="text-emerald-100 text-sm mb-1">Zone</p>
                        <p className="text-xl font-bold">{route.zoneName || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-emerald-100 text-sm mb-1">Date</p>
                        <p className="text-xl font-bold">{route.date ? new Date(route.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        }) : 'Today'}</p>
                    </div>
                    <div>
                        <p className="text-emerald-100 text-sm mb-1">Status</p>
                        <p className="text-xl font-bold">{route.status || 'In Progress'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index}
                             className={`${stat.bgColor} border-2 ${stat.borderColor} rounded-xl shadow-md p-6 transition-transform hover:scale-105`}>
                            <div className="flex items-center justify-between mb-4"><Icon
                                className={`w-8 h-8 ${stat.iconColor}`}/></div>
                            <p className="text-gray-600 text-sm font-semibold mb-1">{stat.label}</p>
                            <p className={`text-3xl font-bold ${stat.iconColor}`}>{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Collection Progress</h3>
                    <span className="text-2xl font-bold text-emerald-600">{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-6 rounded-full transition-all duration-1000 flex items-center justify-end px-3"
                        style={{width: `${completionRate}%`}}
                    >
                        <span className="text-xs text-white font-bold">{collected}/{totalStops}</span>
                    </div>
                </div>
            </div>
        </>
    );
}

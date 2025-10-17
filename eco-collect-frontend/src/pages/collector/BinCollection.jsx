import {useContext, useEffect, useState} from 'react';
import {CollectorContext} from '../../context/CollectorContext';
import {Package, CheckCircle, Clock, Weight, Filter, Search} from 'lucide-react';
import SummaryCard from "../../components/collector/SummaryCard";
import BinCard from "../../components/collector/BinCard";

export default function BinCollection() {
    const {routes, fetchTodayRoute} = useContext(CollectorContext);
    const [currentRoute, setCurrentRoute] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all', 'collected', 'pending'
    const [searchTerm, setSearchTerm] = useState('');

    // Set the current route when routes are loaded
    useEffect(() => {
        if (routes.length > 0) setCurrentRoute(routes[0]);
    }, [routes]);

    // Show loading while route is not ready
    if (!currentRoute) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading route data...
            </div>
        );
    }

    // Use empty array if stops is undefined
    const stops = currentRoute.stops || [];

    // Calculate summary data
    const collectedCount = stops.filter(s => s.collected).length;
    const totalWeight = stops
        .filter(s => s.collected && s.weight)
        .reduce((sum, stop) => sum + stop.weight, 0);

    // Filter and search stops
    const filteredStops = stops.filter(stop => {
        const matchesFilter =
            filter === 'all' ||
            (filter === 'collected' && stop.collected) ||
            (filter === 'pending' && !stop.collected);

        const matchesSearch =
            (stop.binId && stop.binId.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (stop.location && stop.location.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Package className="w-8 h-8 text-emerald-600"/>
                        <h2 className="text-3xl font-bold text-gray-900">Collected Bins Summary</h2>
                    </div>
                    <p className="text-gray-600">View all bins collected during today's route</p>
                </div>

                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <SummaryCard title="Total Collected" value={collectedCount} color="green" icon={CheckCircle}/>
                    <SummaryCard title="Pending" value={stops.length - collectedCount} color="yellow" icon={Clock}/>
                    <SummaryCard title="Total Weight" value={`${totalWeight.toFixed(1)} kg`} color="purple"
                                 icon={Weight}/>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 w-full md:max-w-md">
                            <input
                                type="text"
                                placeholder="Search by Bin ID or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                            />
                            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"/>
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex gap-2 w-full md:w-auto">
                            <button
                                onClick={() => setFilter('all')}
                                className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-medium transition-all ${
                                    filter === 'all'
                                        ? 'bg-emerald-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                All ({stops.length})
                            </button>
                            <button
                                onClick={() => setFilter('collected')}
                                className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-medium transition-all ${
                                    filter === 'collected'
                                        ? 'bg-green-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Collected ({collectedCount})
                            </button>
                            <button
                                onClick={() => setFilter('pending')}
                                className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-medium transition-all ${
                                    filter === 'pending'
                                        ? 'bg-yellow-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Pending ({stops.length - collectedCount})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bins List */}
                <div className="space-y-4">
                    {filteredStops.length > 0 ? (
                        filteredStops.map((stop, index) => (
                            <BinCard key={stop.stopId} stop={stop} index={index} routeId={currentRoute.routeId}/>
                        ))
                    ) : (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No bins found</h3>
                            <p className="text-gray-500">Try adjusting your filters or search term</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

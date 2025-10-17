import {useContext, useEffect, useState} from 'react';
import {CollectorContext} from '../../context/CollectorContext';
import {BarChart3} from 'lucide-react';
import RouteStats from '../../components/collector/route/RouteStats';
import CollectionDetails from '../../components/collector/route/CollectionDetails';
import StopList from '../../components/collector/route/StopList';
import PerformanceSummary from '../../components/collector/route/PerformanceSummary';

export default function RouteSummary() {
    const {routes, fetchTodayRoute} = useContext(CollectorContext);
    const [route, setRoute] = useState(null);

    useEffect(() => {
        if (routes.length > 0) {
            setRoute(routes[0]);
        }
    }, [routes]);

    if (!route) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                Loading route data...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex items-center gap-3">
                    <BarChart3 className="w-8 h-8 text-emerald-600"/>
                    <h2 className="text-3xl font-bold text-gray-900">Route Summary</h2>
                </div>

                <RouteStats route={route}/>
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <CollectionDetails route={route}/>
                    <StopList route={route}/>
                </div>
                <PerformanceSummary route={route}/>
            </div>
        </div>
    );
}
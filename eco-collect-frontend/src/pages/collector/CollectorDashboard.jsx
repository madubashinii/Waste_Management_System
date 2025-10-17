import {useContext} from 'react';
import {markNotificationRead} from '../../services/collector/collectorService';
import {CollectorContext} from '../../context/CollectorContext';
import {MapPin, Bell, CheckCircle, Clock, AlertCircle, TrendingUp} from 'lucide-react';

export default function CollectorDashboard() {
    const {routes, notifications, fetchNotifications, setNotifications} = useContext(CollectorContext);
    const todayRoute = routes[0];
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userName = storedUser?.name || "Collector";

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'in progress':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500"/>;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-500"/>;
            case 'info':
                return <Bell className="w-5 h-5 text-blue-500"/>;
            default:
                return <Bell className="w-5 h-5 text-gray-500"/>;
        }
    };

    const handleNotificationClick = async (notificationId) => {
        if (!notificationId) return;
        const success = await markNotificationRead(notificationId);
        if (success) {
            setNotifications(prev =>
                prev.map(n =>
                    n.notificationId === notificationId ? {...n, read_status: true} : n
                )
            );
        }
    };

    // Calculate completed bins and total bins dynamically
    const totalBins = todayRoute?.stops?.length || 0;
    const completedBins = todayRoute?.stops?.filter(stop => stop.collected)?.length || 0;

    // Calculate progress safely
    const progress = totalBins > 0 ? (completedBins / totalBins) * 100 : 0;


    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
                    <p className="text-gray-600">
                        Welcome back, <span className="font-semibold text-emerald-600">{userName}</span>! Here's your
                        collection overview.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Today's Route Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-600 uppercase">Today's Route</h3>
                            <MapPin className="w-6 h-6 text-emerald-500"/>
                        </div>
                        {todayRoute ? (
                            <>
                                <p className="text-2xl font-bold text-gray-900 mb-2">{todayRoute.routeName}</p>
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(todayRoute.status)}`}>
                                    {todayRoute.status}
                                </span>
                            </>
                        ) : (
                            <p className="text-gray-500">No route assigned</p>
                        )}
                    </div>

                    {/* Progress Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-600 uppercase">Progress</h3>
                            <TrendingUp className="w-6 h-6 text-blue-500"/>
                        </div>
                        {todayRoute ? (
                            <>
                                <p className="text-2xl font-bold text-gray-900 mb-3">
                                    {completedBins}/{totalBins}
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                                        style={{width: `${progress}%`}}
                                    ></div>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500">No data</p>
                        )}
                    </div>

                    {/* Notifications Count */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-600 uppercase">Notifications</h3>
                            <Bell className="w-6 h-6 text-yellow-500"/>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-2">
                            {notifications.filter(n => !n.read_status).length}
                        </p>
                        <p className="text-sm text-gray-600">Unread messages</p>
                    </div>
                </div>

                {/* Route Status Section */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-emerald-600"/>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Today's Route Status</h3>
                            <p className="text-sm text-gray-600">Track your collection progress</p>
                        </div>
                    </div>

                    {todayRoute ? (
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Current Status</p>
                                    <p className="text-2xl font-bold text-emerald-700">{todayRoute.status}</p>
                                </div>
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-sm text-gray-600">Zone</p>
                                        <p className="text-lg font-semibold text-gray-900">{todayRoute.zoneName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Completion</p>
                                        <p className="text-lg font-semibold text-gray-900">{Math.round(progress)}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No route assigned for today
                        </div>
                    )}
                </div>

                {/* Notifications Section */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
                        <span className="text-sm text-gray-600">
                            {notifications.filter(n => !n.read_status).length} unread
                        </span>
                    </div>

                    {notifications.length > 0 ? (
                        <ul className="space-y-3">
                            {notifications.map((n, index) => (
                                <li
                                    key={n.notificationId ?? index}
                                    onClick={() => handleNotificationClick(n.notificationId)}
                                    className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                                        n.read_status
                                            ? 'bg-gray-50 border-gray-200'
                                            : 'bg-blue-50 border-blue-200 shadow-sm'
                                    }`}
                                >
                                    <div className="flex-shrink-0 mt-0.5">
                                        {getNotificationIcon(n.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm ${n.read_status ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                                            {n.message}
                                        </p>
                                        {n.timestamp && <p className="text-xs text-gray-500 mt-1">{n.timestamp}</p>}
                                    </div>
                                    <div className="flex-shrink-0">
                                        {!n.read_status && (
                                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-12">
                            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3"/>
                            <p className="text-gray-500">No notifications</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
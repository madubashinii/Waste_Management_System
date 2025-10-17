import { useState } from 'react';
import DispatcherSidebar from '../../components/dispatcher/DispatcherSidebar';
import {
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineChartBar,
  HiOutlineBell,
  HiOutlineMap,
  HiOutlineEye,
} from 'react-icons/hi';

// Constants
const ALERT_COLORS = {
  urgent: 'bg-red-100 border-red-200 text-red-800',
  warning: 'bg-amber-100 border-amber-200 text-amber-800',
  info: 'bg-blue-100 border-blue-200 text-blue-800',
  default: 'bg-gray-100 border-gray-200 text-gray-800',
};

const STATUS_COLORS = {
  completed: 'bg-emerald-100 text-emerald-800',
  active: 'bg-blue-100 text-blue-800',
  pending: 'bg-gray-100 text-gray-800',
  delayed: 'bg-red-100 text-red-800',
};

const PROGRESS_COLORS = [
  { min: 80, color: 'bg-emerald-600' },
  { min: 50, color: 'bg-blue-600' },
  { min: 25, color: 'bg-amber-600' },
  { min: 0, color: 'bg-red-600' },
];

const SUMMARY_WIDGETS = [
  { key: 'totalRoutes', label: 'Total Routes', icon: HiOutlineLocationMarker, color: 'emerald', subKey: 'activeRoutes', subLabel: 'active', subIcon: HiOutlineTruck },
  { key: 'completionRate', label: 'Completion Rate', icon: HiOutlineChartBar, color: 'blue', suffix: '%', subKey: 'completedToday', subLabel: 'completed today', subIcon: HiOutlineCheckCircle },
  { key: 'activeAlerts', label: 'Active Alerts', icon: HiOutlineBell, color: 'red', subLabel: 'Requires attention', subIcon: HiOutlineExclamationCircle },
  { key: 'pendingCollections', label: 'Pending Collections', icon: HiOutlineClock, color: 'amber', subLabel: 'Awaiting dispatch', subIcon: HiOutlineClock },
];

const QUICK_ACTIONS = [
  { path: '/dispatcher/route-planner', label: 'Route Planner', description: 'Generate routes', icon: HiOutlineLocationMarker, color: 'emerald' },
  { path: '/dispatcher/live-monitor', label: 'Live Monitor', description: 'Track in real-time', icon: HiOutlineEye, color: 'blue' },
  { path: '/dispatcher/schedules', label: 'Schedules', description: 'Recurring rules', icon: HiOutlineCalendar, color: 'purple' },
  { path: '/dispatcher/alerts', label: 'Alerts', description: 'View notifications', icon: HiOutlineBell, color: 'rose' },
  { path: '/dispatcher/reports', label: 'Reports', description: 'Analytics', icon: HiOutlineChartBar, color: 'indigo' },
];

// Helper functions
const getColorClass = (type, colorMap) => colorMap[type] || colorMap.default;
const getProgressColor = (progress) => PROGRESS_COLORS.find(p => progress >= p.min)?.color || 'bg-red-600';

const widgetColorClasses = {
  emerald: { border: 'border-emerald-600', text: 'text-emerald-600', bg: 'bg-emerald-100' },
  blue: { border: 'border-blue-600', text: 'text-blue-600', bg: 'bg-blue-100' },
  red: { border: 'border-red-600', text: 'text-red-600', bg: 'bg-red-100' },
  amber: { border: 'border-amber-600', text: 'text-amber-600', bg: 'bg-amber-100' },
};

const actionColorClasses = {
  emerald: { hover: 'hover:bg-emerald-50', border: 'hover:border-emerald-600', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600', iconHover: 'group-hover:bg-emerald-600' },
  blue: { hover: 'hover:bg-blue-50', border: 'hover:border-blue-600', iconBg: 'bg-blue-100', iconText: 'text-blue-600', iconHover: 'group-hover:bg-blue-600' },
  purple: { hover: 'hover:bg-purple-50', border: 'hover:border-purple-600', iconBg: 'bg-purple-100', iconText: 'text-purple-600', iconHover: 'group-hover:bg-purple-600' },
  rose: { hover: 'hover:bg-rose-50', border: 'hover:border-rose-600', iconBg: 'bg-rose-100', iconText: 'text-rose-600', iconHover: 'group-hover:bg-rose-600' },
  indigo: { hover: 'hover:bg-indigo-50', border: 'hover:border-indigo-600', iconBg: 'bg-indigo-100', iconText: 'text-indigo-600', iconHover: 'group-hover:bg-indigo-600' },
};

// Reusable Components
const SummaryWidget = ({ data, widget }) => {
  const { key, label, icon: Icon, color, suffix = '', subKey, subLabel, subIcon: SubIcon } = widget;
  const colors = widgetColorClasses[color];
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${colors.border}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{data[key]}{suffix}</p>
          <p className={`text-sm ${colors.text} mt-2 flex items-center`}>
            <SubIcon className="mr-1" />
            {subKey ? `${data[subKey]} ${subLabel}` : subLabel}
          </p>
        </div>
        <div className={`${colors.bg} rounded-full p-3`}>
          <Icon className={`text-3xl ${colors.text}`} />
        </div>
      </div>
    </div>
  );
};

const QuickActionButton = ({ action }) => {
  const { path, label, description, icon: Icon, color } = action;
  const colors = actionColorClasses[color];
  
  return (
    <a
      href={path}
      className={`bg-white ${colors.hover} rounded-lg shadow-md p-4 text-center transition-colors duration-200 border border-gray-200 ${colors.border} group block`}
    >
      <div className="flex flex-col items-center">
        <div className={`${colors.iconBg} rounded-full p-3 mb-2 ${colors.iconHover} transition-colors`}>
          <Icon className={`text-2xl ${colors.iconText} group-hover:text-white`} />
        </div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-xs text-gray-500 mt-1">{description}</span>
      </div>
    </a>
  );
};

const RouteCard = ({ route }) => (
  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{route.name}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getColorClass(route.status, STATUS_COLORS)}`}>
            {route.status.toUpperCase()}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span className="flex items-center"><HiOutlineTruck className="mr-1" />{route.vehicle}</span>
          <span className="flex items-center"><HiOutlineUserGroup className="mr-1" />{route.collector}</span>
          <span className="flex items-center"><HiOutlineMap className="mr-1" />{route.completedStops}/{route.totalStops} stops</span>
        </div>
      </div>
      <span className="text-2xl font-bold text-gray-900">{route.progress}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className={`h-2.5 rounded-full transition-all duration-300 ${getProgressColor(route.progress)}`}
        style={{ width: `${route.progress}%` }}
      />
    </div>
  </div>
);

const AlertCard = ({ alert }) => (
  <div className={`border rounded-lg p-4 ${getColorClass(alert.type, ALERT_COLORS)} hover:shadow-md transition-shadow duration-200`}>
    <div className="flex items-start mb-2">
      <HiOutlineExclamationCircle className="text-lg mr-2 flex-shrink-0 mt-0.5" />
      <p className="text-sm font-medium flex-1">{alert.message}</p>
    </div>
    <div className="flex justify-between items-center text-xs ml-6">
      <span className="flex items-center"><HiOutlineMap className="mr-1" />{alert.location}</span>
      <span className="flex items-center"><HiOutlineClock className="mr-1" />{alert.time}</span>
    </div>
  </div>
);

// Mock data
const mockData = {
  summary: { totalRoutes: 32, activeRoutes: 14, completionRate: 72, activeAlerts: 4, completedToday: 52, pendingCollections: 6 },
  alerts: [
    { id: 1, type: 'urgent', message: 'Route CMB-15: Vehicle breakdown reported', time: '5 min ago', location: 'Colombo 07' },
    { id: 2, type: 'warning', message: 'Route NEG-08: Behind schedule by 30 minutes', time: '15 min ago', location: 'Negombo' },
    { id: 3, type: 'info', message: 'Route KDY-03: Completed ahead of schedule', time: '28 min ago', location: 'Kandy' },
    { id: 4, type: 'warning', message: 'Heavy traffic reported on Galle Road', time: '45 min ago', location: 'Colombo 03' },
  ],
  todayRoutes: [
    { id: 'CMB-001', name: 'Colombo Fort Circuit', status: 'completed', progress: 100, collector: 'Nimal Perera', vehicle: 'WM-101', completedStops: 18, totalStops: 18 },
    { id: 'CMB-007', name: 'Cinnamon Gardens Loop', status: 'active', progress: 75, collector: 'Kumari Silva', vehicle: 'WM-207', completedStops: 15, totalStops: 20 },
    { id: 'NEG-012', name: 'Negombo Town Route', status: 'active', progress: 52, collector: 'Kamal Fernando', vehicle: 'WM-312', completedStops: 13, totalStops: 25 },
    { id: 'KDY-008', name: 'Kandy City Center', status: 'active', progress: 38, collector: 'Sunil Bandara', vehicle: 'WM-408', completedStops: 8, totalStops: 21 },
    { id: 'GAL-015', name: 'Galle Fort Area', status: 'pending', progress: 0, collector: 'Ranjith Mendis', vehicle: 'WM-515', completedStops: 0, totalStops: 16 },
    { id: 'CMB-023', name: 'Dehiwala - Mt. Lavinia', status: 'delayed', progress: 28, collector: 'Sanduni Jayasinghe', vehicle: 'WM-623', completedStops: 5, totalStops: 18 },
  ],
};

const DispatcherDashboard = () => {
  const [dashboardData] = useState(mockData);

  return (
    <div className="min-h-screen bg-gray-50">
      <DispatcherSidebar />
      
      <div className="lg:pl-72">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-8 pb-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dispatcher Dashboard</h1>
            <p className="mt-2 text-gray-600">Monitor and manage waste collection operations across Sri Lanka</p>
          </div>

          {/* Summary Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {SUMMARY_WIDGETS.map(widget => (
              <SummaryWidget key={widget.key} data={dashboardData.summary} widget={widget} />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {QUICK_ACTIONS.map(action => (
                <QuickActionButton key={action.path} action={action} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Routes */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Today's Routes</h2>
                  <p className="text-sm text-gray-600 mt-1">Monitor active collection routes</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {dashboardData.todayRoutes.map(route => (
                      <RouteCard key={route.routeId} route={route} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Recent Alerts</h2>
                  <p className="text-sm text-gray-600 mt-1">Latest notifications</p>
                </div>
                <div className="p-4">
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {dashboardData.alerts.map(alert => (
                      <AlertCard key={alert.id} alert={alert} />
                    ))}
                  </div>
                </div>
                <div className="px-6 py-3 border-t border-gray-200">
                  <button className="w-full text-center text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                    View All Alerts
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispatcherDashboard;

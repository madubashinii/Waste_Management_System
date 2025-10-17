import { useState, useEffect } from 'react';
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
import { routeService, truckService, followupService } from '../../services/dispatcher';
import userService from '../../services/userService';

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
  { key: 'totalRoutes', label: 'Total Routes', icon: HiOutlineLocationMarker, color: 'emerald', subKey: 'activeRoutes', subLabel: 'active today', subIcon: HiOutlineTruck },
  { key: 'totalCollectors', label: 'Available Collectors', icon: HiOutlineUserGroup, color: 'blue', subKey: 'assignedCollectors', subLabel: 'assigned', subIcon: HiOutlineCheckCircle },
  { key: 'totalTrucks', label: 'Available Trucks', icon: HiOutlineTruck, color: 'purple', subKey: 'assignedTrucks', subLabel: 'assigned', subIcon: HiOutlineCheckCircle },
  { key: 'pendingFollowups', label: 'Pending Followups', icon: HiOutlineBell, color: 'red', subKey: 'overdueFollowups', subLabel: 'overdue', subIcon: HiOutlineExclamationCircle },
];

const QUICK_ACTIONS = [
  { path: '/dispatcher/route-planner', label: 'Route Planner', description: 'Generate routes', icon: HiOutlineLocationMarker, color: 'emerald' },
  { path: '/dispatcher/route-stops', label: 'Route Stops', description: 'Manage stops', icon: HiOutlineMap, color: 'blue' },
  { path: '/dispatcher/followup-management', label: 'Followups', description: 'Handle missed pickups', icon: HiOutlineBell, color: 'rose' },
];

// Helper functions
const getColorClass = (type, colorMap) => colorMap[type] || colorMap.default;
const getProgressColor = (progress) => PROGRESS_COLORS.find(p => progress >= p.min)?.color || 'bg-red-600';

const widgetColorClasses = {
  emerald: { border: 'border-emerald-600', text: 'text-emerald-600', bg: 'bg-emerald-100' },
  blue: { border: 'border-blue-600', text: 'text-blue-600', bg: 'bg-blue-100' },
  red: { border: 'border-red-600', text: 'text-red-600', bg: 'bg-red-100' },
  amber: { border: 'border-amber-600', text: 'text-amber-600', bg: 'bg-amber-100' },
  green: { border: 'border-green-600', text: 'text-green-600', bg: 'bg-green-100' },
  purple: { border: 'border-purple-600', text: 'text-purple-600', bg: 'bg-purple-100' },
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

const RouteCard = ({ route, collectors = [] }) => {
  const progress = route.completionPercentage || 0;
  
  // Find collector name by ID
  const getCollectorName = (collectorId) => {
    if (!collectorId) return 'Unassigned';
    const collector = collectors.find(c => c.userId === collectorId || c.id === collectorId);
    return collector ? `${collector.firstName} ${collector.lastName}` : `Collector #${collectorId}`;
  };
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{route.routeName || 'Unnamed Route'}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getColorClass(route.status?.toLowerCase(), STATUS_COLORS)}`}>
              {route.status?.toUpperCase() || 'UNKNOWN'}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center"><HiOutlineTruck className="mr-1" />Truck ID: {route.assignedTruckId || 'N/A'}</span>
            <span className="flex items-center"><HiOutlineUserGroup className="mr-1" />Collector: {getCollectorName(route.assignedCollectorId)}</span>
            <span className="flex items-center"><HiOutlineMap className="mr-1" />Zone: {route.zoneId || 'N/A'}</span>
          </div>
        </div>
        <span className="text-2xl font-bold text-gray-900">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const FollowupCard = ({ followup }) => {
  const getPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH': return 'bg-red-100 border-red-200 text-red-800';
      case 'NORMAL': return 'bg-amber-100 border-amber-200 text-amber-800';
      case 'LOW': return 'bg-blue-100 border-blue-200 text-blue-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getPriorityColor(followup.priority)} hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start mb-2">
        <HiOutlineExclamationCircle className="text-lg mr-2 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium">Followup Pickup #{followup.id}</p>
          <p className="text-xs mt-1">Reason: {followup.reasonCode || 'N/A'}</p>
        </div>
      </div>
      <div className="flex justify-between items-center text-xs ml-6">
        <span className="flex items-center"><HiOutlineMap className="mr-1" />Ward: {followup.wardId || 'N/A'}</span>
        <span className="flex items-center"><HiOutlineClock className="mr-1" />Priority: {followup.priority || 'NORMAL'}</span>
      </div>
    </div>
  );
};

const DispatcherDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    summary: { totalRoutes: 0, activeRoutes: 0, totalCollectors: 0, assignedCollectors: 0, totalTrucks: 0, assignedTrucks: 0, pendingFollowups: 0, overdueFollowups: 0, completedRoutes: 0, inProgressRoutes: 0 },
    todayRoutes: [],
    followups: [],
    collectors: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setDashboardData(prev => ({ ...prev, loading: true, error: null }));

        // Load all data in parallel
        const [routesResponse, trucksResponse, collectorsResponse, followupsResponse, todayRoutesResponse] = await Promise.all([
          routeService.getAllRoutes().catch((error) => {
            console.error('Error fetching routes:', error);
            return { success: false, data: [] };
          }),
          truckService.getAllTrucks().catch((error) => {
            console.error('Error fetching trucks:', error);
            return { success: false, data: [] };
          }),
          userService.getCollectors().catch((error) => {
            console.error('Error fetching collectors:', error);
            return [];
          }),
          followupService.getPendingFollowups().catch((error) => {
            console.error('Error fetching followups:', error);
            return { success: false, data: [] };
          }),
          routeService.getRoutesForToday().catch((error) => {
            console.error('Error fetching today routes:', error);
            return { success: false, data: [] };
          })
        ]);

        const routes = routesResponse.success ? routesResponse.data : [];
        const trucks = trucksResponse.success ? trucksResponse.data : [];
        const collectors = Array.isArray(collectorsResponse) ? collectorsResponse : [];
        const followups = followupsResponse.success ? followupsResponse.data : [];
        const todayRoutes = todayRoutesResponse.success ? todayRoutesResponse.data : [];

        // Debug logging
        console.log('Collectors response:', collectorsResponse);
        console.log('Collectors array:', collectors);
        console.log('Routes with collector assignments:', routes.map(r => ({ id: r.routeId, collectorId: r.assignedCollectorId })));

        // Get overdue followups
        const overdueResponse = await followupService.getOverdueFollowups().catch(() => ({ success: false, data: [] }));
        const overdueFollowups = overdueResponse.success ? overdueResponse.data : [];

        // Calculate summary statistics
        const activeRoutes = routes.filter(route => route.status === 'IN_PROGRESS').length;
        const completedRoutes = routes.filter(route => route.status === 'COMPLETED').length;
        const inProgressRoutes = routes.filter(route => route.status === 'IN_PROGRESS').length;
        
        // Calculate assigned collectors (collectors who are assigned to routes)
        const assignedCollectorIds = new Set(routes.map(route => route.assignedCollectorId).filter(id => id));
        const assignedCollectors = assignedCollectorIds.size;

        setDashboardData({
          summary: {
            totalRoutes: routes.length,
            activeRoutes,
            totalCollectors: collectors.length,
            assignedCollectors,
            totalTrucks: trucks.length,
            assignedTrucks: trucks.filter(truck => truck.isAssigned).length,
            pendingFollowups: followups.length,
            overdueFollowups: overdueFollowups.length,
            completedRoutes,
            inProgressRoutes
          },
          todayRoutes,
          followups: followups.slice(0, 5), // Show only first 5 followups
          collectors,
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Failed to load dashboard data'
        }));
      }
    };

    loadDashboardData();
  }, []);

  if (dashboardData.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <HiOutlineExclamationCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Error loading dashboard</p>
          <p className="text-gray-600 text-sm">{dashboardData.error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  {dashboardData.todayRoutes.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.todayRoutes.map(route => (
                        <RouteCard key={route.routeId} route={route} collectors={dashboardData.collectors} />
                      ))}
                    </div>
              ) : (
                <div className="text-center py-8">
                  <HiOutlineLocationMarker className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No routes scheduled for today</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Followups */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Recent Followups</h2>
              <p className="text-sm text-gray-600 mt-1">Pending pickup requests</p>
            </div>
            <div className="p-4">
              {dashboardData.followups.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {dashboardData.followups.map(followup => (
                    <FollowupCard key={followup.id} followup={followup} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <HiOutlineCheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-600">No pending followups</p>
                </div>
              )}
            </div>
            <div className="px-6 py-3 border-t border-gray-200">
              <a href="/dispatcher/followup-management" className="w-full text-center text-emerald-600 hover:text-emerald-700 font-medium text-sm block">
                View All Followups
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DispatcherDashboard;

import { useState, useEffect } from 'react';
import {
  HiOutlineChartBar,
  HiOutlineTruck,
  HiOutlineLocationMarker,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineCalendar,
  HiOutlineDownload,
  HiOutlineEye,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineRefresh,
} from 'react-icons/hi';
import { reportsService } from '../../services/dispatcher';

// Default data structure
const defaultReportData = {
  summary: {
    totalRoutes: 0,
    completedRoutes: 0,
    activeRoutes: 0,
    pendingRoutes: 0,
    totalTrucks: 0,
    activeTrucks: 0,
    pendingFollowups: 0,
    overdueFollowups: 0,
    totalWasteCollected: 0,
    averageCollectionTime: 0,
    efficiency: 0,
  },
  trends: {
    routesCompleted: { current: 0, previous: 0, change: 0 },
    wasteCollected: { current: 0, previous: 0, change: 0 },
    efficiency: { current: 0, previous: 0, change: 0 },
    responseTime: { current: 0, previous: 0, change: 0 },
  },
  recentActivity: [],
};

const STATUS_COLORS = {
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  info: 'bg-blue-100 text-blue-800',
  error: 'bg-red-100 text-red-800',
};

// This will be dynamically generated based on real data
const getSummaryCards = (reportData) => [
  {
    title: 'Routes Today',
    value: reportData.summary.totalRoutes,
    subtitle: `${reportData.summary.completedRoutes} completed`,
    icon: HiOutlineLocationMarker,
    color: 'emerald',
    trend: reportData.trends.routesCompleted,
  },
  {
    title: 'Waste Collected',
    value: `${reportData.summary.totalWasteCollected} kg`,
    subtitle: 'Estimated total',
    icon: HiOutlineTruck,
    color: 'blue',
    trend: reportData.trends.wasteCollected,
  },
  {
    title: 'Active Trucks',
    value: reportData.summary.activeTrucks,
    subtitle: `of ${reportData.summary.totalTrucks} total`,
    icon: HiOutlineUserGroup,
    color: 'purple',
    trend: null,
  },
  {
    title: 'Efficiency Rate',
    value: `${reportData.summary.efficiency}%`,
    subtitle: 'Average performance',
    icon: HiOutlineChartBar,
    color: 'green',
    trend: reportData.trends.efficiency,
  },
];

const TrendIndicator = ({ trend }) => {
  if (!trend) return null;
  
  const isPositive = trend.change > 0;
  const TrendIcon = isPositive ? HiOutlineTrendingUp : HiOutlineTrendingDown;
  const colorClass = isPositive ? 'text-emerald-600' : 'text-red-600';
  
  return (
    <div className={`flex items-center space-x-1 ${colorClass}`}>
      <TrendIcon className="h-4 w-4" />
      <span className="text-sm font-medium">
        {Math.abs(trend.change)}%
      </span>
    </div>
  );
};

const SummaryCard = ({ card }) => {
  const Icon = card.icon;
  const colorClasses = {
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg ${colorClasses[card.color]}`}>
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
          </div>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            {card.trend && <TrendIndicator trend={card.trend} />}
          </div>
          <p className="text-sm text-gray-500 mt-1">{card.subtitle}</p>
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ activity }) => {
  const getStatusIcon = (type) => {
    switch (type) {
      case 'route_completed':
      case 'collection_completed':
        return HiOutlineCheckCircle;
      case 'route_delayed':
        return HiOutlineExclamationCircle;
      case 'followup_assigned':
        return HiOutlineClock;
      default:
        return HiOutlineEye;
    }
  };

  const StatusIcon = getStatusIcon(activity.type);

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`p-2 rounded-full ${STATUS_COLORS[activity.status]}`}>
        <StatusIcon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{activity.message}</p>
        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
      </div>
    </div>
  );
};

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [reportData, setReportData] = useState(defaultReportData);
  const [error, setError] = useState(null);

  // Load report data when component mounts or period changes
  useEffect(() => {
    loadReportData();
  }, [selectedPeriod]);

  const loadReportData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [summaryStats, trendData, recentActivity] = await Promise.all([
        reportsService.getSummaryStats(selectedPeriod),
        reportsService.getTrendData(selectedPeriod),
        reportsService.getRecentActivity(10)
      ]);

      if (summaryStats.success && trendData.success && recentActivity.success) {
        setReportData({
          summary: summaryStats.data,
          trends: trendData.data,
          recentActivity: recentActivity.data
        });
      } else {
        throw new Error('Failed to load report data');
      }
    } catch (error) {
      console.error('Error loading report data:', error);
      setError(error.message);
      // Keep default data on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      const result = await reportsService.exportReport(selectedPeriod, 'csv');
      if (result.success) {
        // In a real app, you would trigger a download
        alert(`Report exported successfully! Filename: ${result.data.filename}`);
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewDetailedReport = (type) => {
    alert(`Opening detailed ${type} report...`);
  };

  const handleRefresh = () => {
    loadReportData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Monitor performance and track key metrics</p>
          {error && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                Error loading data: {error}
                <button 
                  onClick={handleRefresh}
                  className="ml-2 text-red-700 hover:text-red-800 underline"
                >
                  Retry
                </button>
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            disabled={isLoading}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiOutlineRefresh className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportReport}
            disabled={isLoading || isExporting}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiOutlineDownload className="h-4 w-4" />
            <span>{isExporting ? 'Exporting...' : 'Export Report'}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          ))
        ) : (
          getSummaryCards(reportData).map((card, index) => (
            <SummaryCard key={index} card={card} />
          ))
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        {isLoading ? (
          <div className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-start space-x-3 animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : reportData.recentActivity.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {reportData.recentActivity.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <HiOutlineClock className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>No recent activity found</p>
          </div>
        )}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
            View all activity
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => handleViewDetailedReport('collector')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <HiOutlineUserGroup className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Collector Reports</span>
          </button>
          <button
            onClick={() => handleViewDetailedReport('vehicle')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <HiOutlineTruck className="h-6 w-6 text-purple-600" />
            <span className="text-sm font-medium text-gray-900">Vehicle Reports</span>
          </button>
          <button
            onClick={() => handleViewDetailedReport('waste')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <HiOutlineChartBar className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium text-gray-900">Waste Analytics</span>
          </button>
          <button
            onClick={() => handleViewDetailedReport('schedule')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <HiOutlineCalendar className="h-6 w-6 text-amber-600" />
            <span className="text-sm font-medium text-gray-900">Schedule Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;

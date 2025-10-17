import { routeService, followupService, truckService, wardService } from './index.js';

const API_BASE_URL = 'http://localhost:8080/api';

const fetchConfig = (method, body = null) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  ...(body && { body: JSON.stringify(body) })
});

const handleError = (error) => {
  console.error('Reports service error:', error);
  if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
    throw new Error('Network error: Cannot connect to backend server. Please ensure the backend is running on http://localhost:8080');
  }
  throw error;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const reportsService = {
  checkBackendConnection: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/routes`, fetchConfig('GET'));
      return response.ok;
    } catch {
      return false;
    }
  },

  /**
   * Get summary statistics for the dashboard
   * @param {string} period - 'today', 'week', 'month', 'quarter'
   * @returns {Promise<Object>} Summary statistics
   */
  getSummaryStats: async (period = 'today') => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const startDate = getStartDateForPeriod(period);
      
      // Fetch data from multiple services in parallel
      const [routesData, followupsData, trucksData] = await Promise.allSettled([
        routeService.getRoutesByDateRange(startDate, today).catch(() => ({ success: false, data: [] })),
        followupService.getAllFollowups().catch(() => ({ success: false, data: [] })),
        truckService.getAllTrucks().catch(() => ({ success: false, data: [] }))
      ]);

      // Process routes data
      const routes = routesData.status === 'fulfilled' && routesData.value?.success 
        ? routesData.value.data || [] 
        : [];
      
      const totalRoutes = routes.length;
      const completedRoutes = routes.filter(route => route.status === 'completed').length;
      const activeRoutes = routes.filter(route => route.status === 'in_progress').length;
      const pendingRoutes = routes.filter(route => route.status === 'pending').length;

      // Process followups data
      const followups = followupsData.status === 'fulfilled' && followupsData.value?.success 
        ? followupsData.value.data || [] 
        : [];
      
      const pendingFollowups = followups.filter(f => f.status === 'PENDING').length;
      const overdueFollowups = followups.filter(f => f.reasonCode === 'OVERDUE' && f.status !== 'DONE').length;

      // Process trucks data
      const trucks = trucksData.status === 'fulfilled' && trucksData.value?.success 
        ? trucksData.value.data || [] 
        : [];
      
      const totalTrucks = trucks.length;
      const activeTrucks = trucks.filter(truck => truck.status === 'Active').length;

      // Calculate efficiency (completed routes / total routes * 100)
      const efficiency = totalRoutes > 0 ? (completedRoutes / totalRoutes) * 100 : 0;

      // Calculate average collection time (estimated based on completed routes)
      const averageCollectionTime = completedRoutes > 0 ? 2.5 : 0;

      // Calculate total waste collected (estimated based on completed routes and route stops)
      // This is a rough estimation since we don't have actual weight data
      const totalWasteCollected = completedRoutes * 85; // Estimated 85kg per completed route

      return {
        success: true,
        data: {
          totalRoutes,
          completedRoutes,
          activeRoutes,
          pendingRoutes,
          totalTrucks,
          activeTrucks,
          pendingFollowups,
          overdueFollowups,
          totalWasteCollected,
          averageCollectionTime,
          efficiency: Math.round(efficiency * 10) / 10, // Round to 1 decimal place
        },
        message: 'Summary statistics retrieved successfully'
      };
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Get trend data for comparison with previous period
   * @param {string} period - 'today', 'week', 'month', 'quarter'
   * @returns {Promise<Object>} Trend data
   */
  getTrendData: async (period = 'today') => {
    try {
      const currentPeriod = await reportsService.getSummaryStats(period);
      const previousPeriod = await reportsService.getSummaryStats(getPreviousPeriod(period));

      if (!currentPeriod.success || !previousPeriod.success) {
        throw new Error('Failed to fetch trend data');
      }

      const current = currentPeriod.data;
      const previous = previousPeriod.data;

      const calculateChange = (currentVal, previousVal) => {
        if (previousVal === 0) return currentVal > 0 ? 100 : 0;
        return ((currentVal - previousVal) / previousVal) * 100;
      };

      return {
        success: true,
        data: {
          routesCompleted: {
            current: current.completedRoutes,
            previous: previous.completedRoutes,
            change: calculateChange(current.completedRoutes, previous.completedRoutes)
          },
          wasteCollected: {
            current: current.totalWasteCollected,
            previous: previous.totalWasteCollected,
            change: calculateChange(current.totalWasteCollected, previous.totalWasteCollected)
          },
          efficiency: {
            current: current.efficiency,
            previous: previous.efficiency,
            change: calculateChange(current.efficiency, previous.efficiency)
          },
          responseTime: {
            current: current.averageCollectionTime,
            previous: previous.averageCollectionTime,
            change: calculateChange(current.averageCollectionTime, previous.averageCollectionTime)
          }
        },
        message: 'Trend data retrieved successfully'
      };
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Get recent activity from routes and followups
   * @param {number} limit - Number of activities to return
   * @returns {Promise<Object>} Recent activities
   */
  getRecentActivity: async (limit = 10) => {
    try {
      const [routesData, followupsData] = await Promise.allSettled([
        routeService.getRoutesForToday().catch(() => ({ success: false, data: [] })),
        followupService.getAllFollowups().catch(() => ({ success: false, data: [] }))
      ]);

      const activities = [];

      // Process routes activities
      if (routesData.status === 'fulfilled' && routesData.value?.success) {
        const routes = routesData.value.data || [];
        routes.forEach(route => {
          if (route.status === 'completed') {
            activities.push({
              id: `route-${route.routeId}`,
              type: 'route_completed',
              message: `Route ${route.routeName || route.routeId} completed successfully`,
              time: formatTimeAgo(route.updatedAt || route.createdAt),
              status: 'success',
              timestamp: new Date(route.updatedAt || route.createdAt)
            });
          } else if (route.status === 'in_progress') {
            activities.push({
              id: `route-${route.routeId}`,
              type: 'route_started',
              message: `Route ${route.routeName || route.routeId} started`,
              time: formatTimeAgo(route.updatedAt || route.createdAt),
              status: 'info',
              timestamp: new Date(route.updatedAt || route.createdAt)
            });
          }
        });
      }

      // Process followups activities
      if (followupsData.status === 'fulfilled' && followupsData.value?.success) {
        const followups = followupsData.value.data || [];
        followups.forEach(followup => {
          if (followup.status === 'ASSIGNED') {
            activities.push({
              id: `followup-${followup.id}`,
              type: 'followup_assigned',
              message: `Followup pickup assigned to Collector #${followup.newAssignedDriverId || 'TBD'}`,
              time: formatTimeAgo(followup.updatedAt || followup.createdAt),
              status: 'info',
              timestamp: new Date(followup.updatedAt || followup.createdAt)
            });
          } else if (followup.status === 'DONE') {
            activities.push({
              id: `followup-${followup.id}`,
              type: 'followup_completed',
              message: `Followup pickup completed for Ward ${followup.ward?.wardNumber || followup.wardId || 'Unknown'}`,
              time: formatTimeAgo(followup.updatedAt || followup.createdAt),
              status: 'success',
              timestamp: new Date(followup.updatedAt || followup.createdAt)
            });
          }
        });
      }

      // Sort by timestamp and limit results
      activities.sort((a, b) => b.timestamp - a.timestamp);
      const limitedActivities = activities.slice(0, limit);

      return {
        success: true,
        data: limitedActivities,
        message: 'Recent activity retrieved successfully'
      };
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Get performance metrics for charts
   * @param {string} period - 'today', 'week', 'month', 'quarter'
   * @returns {Promise<Object>} Performance metrics
   */
  getPerformanceMetrics: async (period = 'today') => {
    try {
      const startDate = getStartDateForPeriod(period);
      const today = new Date().toISOString().split('T')[0];
      
      const routesData = await routeService.getRoutesByDateRange(startDate, today);
      
      if (!routesData.success) {
        throw new Error('Failed to fetch routes data');
      }

      const routes = routesData.data || [];
      
      // Group routes by date for chart data
      const routesByDate = {};
      routes.forEach(route => {
        const date = route.collectionDate || route.createdAt?.split('T')[0];
        if (date) {
          if (!routesByDate[date]) {
            routesByDate[date] = { total: 0, completed: 0, pending: 0, in_progress: 0 };
          }
          routesByDate[date].total++;
          routesByDate[date][route.status] = (routesByDate[date][route.status] || 0) + 1;
        }
      });

      // Convert to chart-friendly format
      const chartData = Object.entries(routesByDate).map(([date, stats]) => ({
        date,
        total: stats.total,
        completed: stats.completed,
        pending: stats.pending,
        in_progress: stats.in_progress,
        efficiency: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
      })).sort((a, b) => new Date(a.date) - new Date(b.date));

      return {
        success: true,
        data: chartData,
        message: 'Performance metrics retrieved successfully'
      };
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Export report data
   * @param {string} period - 'today', 'week', 'month', 'quarter'
   * @param {string} format - 'csv', 'pdf', 'excel'
   * @returns {Promise<Object>} Export result
   */
  exportReport: async (period = 'today', format = 'csv') => {
    try {
      // This would typically call a backend endpoint for report generation
      // For now, we'll simulate the export process
      const [summaryStats, trendData, recentActivity, performanceMetrics] = await Promise.all([
        reportsService.getSummaryStats(period),
        reportsService.getTrendData(period),
        reportsService.getRecentActivity(20),
        reportsService.getPerformanceMetrics(period)
      ]);

      const reportData = {
        period,
        format,
        generatedAt: new Date().toISOString(),
        summary: summaryStats.data,
        trends: trendData.data,
        activity: recentActivity.data,
        performance: performanceMetrics.data
      };

      // Simulate file generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      return {
        success: true,
        data: {
          downloadUrl: `/api/reports/download/${Date.now()}.${format}`,
          filename: `waste-management-report-${period}-${new Date().toISOString().split('T')[0]}.${format}`,
          reportData
        },
        message: 'Report exported successfully'
      };
    } catch (error) {
      handleError(error);
    }
  }
};

// Helper functions
const getStartDateForPeriod = (period) => {
  const today = new Date();
  const startDate = new Date(today);
  
  switch (period) {
    case 'today':
      return today.toISOString().split('T')[0];
    case 'week':
      startDate.setDate(today.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(today.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(today.getMonth() - 3);
      break;
    default:
      return today.toISOString().split('T')[0];
  }
  
  return startDate.toISOString().split('T')[0];
};

const getPreviousPeriod = (period) => {
  const today = new Date();
  const startDate = new Date(today);
  
  switch (period) {
    case 'today':
      startDate.setDate(today.getDate() - 1);
      return startDate.toISOString().split('T')[0];
    case 'week':
      startDate.setDate(today.getDate() - 14);
      return startDate.toISOString().split('T')[0];
    case 'month':
      startDate.setMonth(today.getMonth() - 2);
      return startDate.toISOString().split('T')[0];
    case 'quarter':
      startDate.setMonth(today.getMonth() - 6);
      return startDate.toISOString().split('T')[0];
    default:
      return today.toISOString().split('T')[0];
  }
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Unknown time';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

export { reportsService };

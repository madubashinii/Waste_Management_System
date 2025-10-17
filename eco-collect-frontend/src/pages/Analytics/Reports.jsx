import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

function Reports() {
  const [selectedReport, setSelectedReport] = useState('waste-by-zone');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  const reportTypes = [
    {
      value: 'waste-by-zone',
      label: 'Waste by Zone',
      description: 'Total waste collected by geographic zone',
      icon: '🗺️'
    },
    {
      value: 'recycling-rate',
      label: 'Recycling Rate',
      description: 'Recycling effectiveness across different areas',
      icon: '♻️'
    },
    {
      value: 'missed-pickups',
      label: 'Missed Pickups',
      description: 'Collection efficiency and missed pickups',
      icon: '⏱️'
    },
    {
      value: 'invoiced-vs-paid',
      label: 'Invoiced vs Paid',
      description: 'Revenue collection performance',
      icon: '💰'
    },
    {
      value: 'financial',
      label: 'Financial Summary',
      description: 'Overall financial performance',
      icon: '📊'
    },
    {
      value: 'operational',
      label: 'Operational Efficiency',
      description: 'Collection routes and truck performance',
      icon: '🚛'
    }
  ];

  // Set default dates to last month
  useEffect(() => {
    const now = new Date();
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    setDateRange({
      start: firstDayLastMonth.toISOString().split('T')[0],
      end: lastDayLastMonth.toISOString().split('T')[0]
    });
  }, []);

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      loadReportData();
    }
  }, [selectedReport, dateRange]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getReport(selectedReport, dateRange);
      setReportData(data);
    } catch (error) {
      console.log('Error loading report:', error.message);
      // Fallback to mock data for demonstration
      setReportData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const getMockData = () => {
    switch (selectedReport) {
      case 'waste-by-zone':
        return [
          { zone: 'North Zone', total_waste: 1500, recycled: 900, general: 600, organic: 400, recycling: 500 },
          { zone: 'South Zone', total_waste: 1200, recycled: 800, general: 400, organic: 350, recycling: 450 },
          { zone: 'East Zone', total_waste: 1800, recycled: 1200, general: 600, organic: 500, recycling: 700 },
          { zone: 'West Zone', total_waste: 900, recycled: 600, general: 300, organic: 250, recycling: 350 }
        ];
      case 'recycling-rate':
        return [
          { zone: 'North Zone', recycling_rate: '60%', total_waste: 1500, recycled: 900 },
          { zone: 'South Zone', recycling_rate: '67%', total_waste: 1200, recycled: 800 },
          { zone: 'East Zone', recycling_rate: '67%', total_waste: 1800, recycled: 1200 },
          { zone: 'West Zone', recycling_rate: '67%', total_waste: 900, recycled: 600 }
        ];
      case 'missed-pickups':
        return [
          { zone: 'North Zone', total_pickups: 450, missed: 3, completion_rate: '99.3%' },
          { zone: 'South Zone', total_pickups: 380, missed: 1, completion_rate: '99.7%' },
          { zone: 'East Zone', total_pickups: 520, missed: 2, completion_rate: '99.6%' },
          { zone: 'West Zone', total_pickups: 290, missed: 0, completion_rate: '100%' }
        ];
      case 'invoiced-vs-paid':
        return [
          { period: 'Jan 2024', invoiced: 18540, paid: 17220, collection_rate: '93%' },
          { period: 'Feb 2024', invoiced: 19200, paid: 18050, collection_rate: '94%' },
          { period: 'Mar 2024', invoiced: 18750, paid: 17580, collection_rate: '94%' },
          { period: 'Apr 2024', invoiced: 19420, paid: 18250, collection_rate: '94%' }
        ];
      default:
        return [];
    }
  };

  const handleExport = () => {
    if (reportData.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = Object.keys(reportData[0]);
    const csvData = reportData.map(row =>
      headers.map(header => row[header])
    );

    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedReport}-${dateRange.start}-to-${dateRange.end}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatValue = (key, value) => {
    if (typeof value === 'number') {
      if (key.includes('rate') || key.includes('percentage')) {
        return value + '%';
      }
      if (key.includes('amount') || key.includes('revenue') || key.includes('invoiced') || key.includes('paid')) {
        return '$' + value.toLocaleString();
      }
      return value.toLocaleString();
    }
    return value;
  };

  const getReportTitle = () => {
    return reportTypes.find(r => r.value === selectedReport)?.label || 'Report';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📊 Analytics Reports</h1>
          <p className="text-gray-600 mt-2">Monitor waste management performance and financial metrics</p>
        </div>

        {/* Report Selection Card */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Report Configuration</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {reportTypes.map(report => (
                    <option key={report.value} value={report.value}>
                      {report.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600">
                {reportTypes.find(r => r.value === selectedReport)?.description}
              </p>
            </div>
          </div>

          <div className="p-6">
            <button
              onClick={handleExport}
              disabled={reportData.length === 0}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              📥 Download CSV
            </button>
          </div>
        </div>

        {/* Report Preview */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">
              {getReportTitle()} Report
            </h2>
            <p className="text-gray-600 mt-1">
              Period: {dateRange.start} to {dateRange.end}
            </p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading report data...</p>
              </div>
            ) : reportData.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
                <p className="text-gray-600">Select a different report type or date range.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      {reportData.length > 0 && Object.keys(reportData[0]).map(key => (
                        <th
                          key={key}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {key.split('_').map(word =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {Object.values(row).map((value, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          >
                            {formatValue(Object.keys(row)[cellIndex], value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        {reportData.length > 0 && !loading && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-800">Total Records</h3>
              <p className="text-2xl font-semibold text-blue-900">{reportData.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="text-sm font-medium text-green-800">Data Period</h3>
              <p className="text-lg font-semibold text-green-900">
                {dateRange.start} to {dateRange.end}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="text-sm font-medium text-purple-800">Last Updated</h3>
              <p className="text-lg font-semibold text-purple-900">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
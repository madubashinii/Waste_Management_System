import React, { useState } from 'react';

function Reports() {
  const [selectedReport, setSelectedReport] = useState('waste-by-zone');

  const reportTypes = [
    { value: 'waste-by-zone', label: 'Waste by Zone' },
    { value: 'recycling-rate', label: 'Recycling Rate' },
    { value: 'missed-pickups', label: 'Missed Pickups' },
    { value: 'invoiced-vs-paid', label: 'Invoiced vs Paid' }
  ];

  const handleExport = () => {
    alert(`Exporting ${selectedReport} report as CSV`);
  };

  const getReportData = () => {
    switch (selectedReport) {
      case 'waste-by-zone':
        return [
          { zone: 'North Zone', waste: 1500, recycled: 900 },
          { zone: 'South Zone', waste: 1200, recycled: 800 },
          { zone: 'East Zone', waste: 1800, recycled: 1200 }
        ];
      case 'recycling-rate':
        return [
          { zone: 'North Zone', rate: '60%' },
          { zone: 'South Zone', rate: '67%' },
          { zone: 'East Zone', rate: '67%' }
        ];
      case 'missed-pickups':
        return [
          { zone: 'North Zone', missed: 3 },
          { zone: 'South Zone', missed: 1 },
          { zone: 'East Zone', missed: 2 }
        ];
      default:
        return [];
    }
  };

  const reportData = getReportData();

  return (
    <div className="page-container">
      <h2>Analytics Reports</h2>

      <div className="report-selection">
        <label>Select Report: </label>
        <select
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
        >
          {reportTypes.map(report => (
            <option key={report.value} value={report.value}>
              {report.label}
            </option>
          ))}
        </select>
        <button className="btn-secondary" onClick={handleExport}>
          Download CSV
        </button>
      </div>

      <div className="report-preview">
        <h3>Report Preview - {reportTypes.find(r => r.value === selectedReport)?.label}</h3>
        <div className="chart-placeholder">
          <table className="data-table">
            <thead>
              <tr>
                {reportData.length > 0 && Object.keys(reportData[0]).map(key => (
                  <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, cellIndex) => (
                    <td key={cellIndex}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;
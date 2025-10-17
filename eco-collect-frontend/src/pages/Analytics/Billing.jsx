import React, { useState, useEffect } from 'react';
import adminService  from '../../services/adminService';

function Billing() {
  const [period, setPeriod] = useState({
    start: '',
    end: ''
  });
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    approved: 0,
    sent: 0,
    paid: 0,
    totalAmount: 0
  });

  // Set default dates to current month
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setPeriod({
      start: firstDay.toISOString().split('T')[0],
      end: lastDay.toISOString().split('T')[0]
    });

    loadRecentInvoices();
  }, []);

  const loadRecentInvoices = async () => {
    try {
      setLoading(true);
      const data = await adminService.getInvoices();
      setInvoices(data);
      calculateStats(data);
    } catch (error) {
      console.log('Error loading invoices:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (invoiceData) => {
    const stats = {
      total: invoiceData.length,
      draft: 0,
      approved: 0,
      sent: 0,
      paid: 0,
      totalAmount: 0
    };

    invoiceData.forEach(invoice => {
      stats[invoice.status]++;
      if (invoice.amount) {
        stats.totalAmount += invoice.amount;
      }
    });

    setStats(stats);
  };

  const handleRunBilling = async () => {
    if (!period.start || !period.end) {
      alert('Please select both start and end dates');
      return;
    }

    try {
      setProcessing(true);
      const result = await adminService.runBilling(period.start, period.end);
      setInvoices(result.invoices);
      calculateStats(result.invoices);
      alert(`✅ Billing completed! Generated ${result.invoices.length} invoices totaling $${result.invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0).toFixed(2)}`);
    } catch (error) {
      alert('❌ Error running billing: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleApproveAll = async () => {
    if (!window.confirm('Approve all draft invoices?')) return;

    try {
      setProcessing(true);
      await adminService.approveAllInvoices();
      await loadRecentInvoices();
      alert('✅ All invoices approved!');
    } catch (error) {
      alert('❌ Error approving invoices: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleSendInvoices = async () => {
    if (!window.confirm('Send all approved invoices to residents?')) return;

    try {
      setProcessing(true);
      await adminService.sendAllInvoices();
      await loadRecentInvoices();
      alert('✅ All invoices sent to residents!');
    } catch (error) {
      alert('❌ Error sending invoices: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleApproveInvoice = async (invoiceId) => {
    try {
      await adminService.updateInvoice(invoiceId, { status: 'approved' });
      await loadRecentInvoices();
    } catch (error) {
      alert('Error approving invoice: ' + error.message);
    }
  };

  const handleSendInvoice = async (invoiceId) => {
    try {
      await adminService.updateInvoice(invoiceId, { status: 'sent' });
      await loadRecentInvoices();
    } catch (error) {
      alert('Error sending invoice: ' + error.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { class: 'bg-yellow-100 text-yellow-800', label: 'DRAFT' },
      approved: { class: 'bg-blue-100 text-blue-800', label: 'APPROVED' },
      sent: { class: 'bg-orange-100 text-orange-800', label: 'SENT' },
      paid: { class: 'bg-green-100 text-green-800', label: 'PAID' },
      unpaid: { class: 'bg-red-100 text-red-800', label: 'UNPAID' },
      overdue: { class: 'bg-red-100 text-red-800', label: 'OVERDUE' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const canApproveAll = invoices.some(inv => inv.status === 'draft');
  const canSendAll = invoices.some(inv => inv.status === 'approved');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🧾 Billing Management</h1>
          <p className="text-gray-600 mt-2">Generate, approve, and send invoices to residents</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">💰</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-semibold text-gray-900">${stats.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600">📝</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.draft}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600">📧</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sent</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.sent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Period Card */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Run Billing for Period</h2>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  value={period.start}
                  onChange={(e) => setPeriod({...period, start: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  value={period.end}
                  onChange={(e) => setPeriod({...period, end: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleRunBilling}
                disabled={processing}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Run Billing'}
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              The system will automatically calculate invoices based on waste collections during this period.
            </p>
          </div>
        </div>

        {/* Invoices Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold">Generated Invoices</h2>
              <div className="flex gap-3">
                <button
                  onClick={handleApproveAll}
                  disabled={!canApproveAll || processing}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  Approve All Drafts
                </button>
                <button
                  onClick={handleSendInvoices}
                  disabled={!canSendAll || processing}
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50"
                >
                  Send All Approved
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading invoices...</p>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">🧾</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices generated</h3>
                <p className="text-gray-600">Run billing for a period to generate invoices.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resident
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map(invoice => (
                      <tr key={invoice.invoice_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            INV-{invoice.invoice_id.toString().padStart(6, '0')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(invoice.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {invoice.resident_name || `Resident ${invoice.resident_id}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {invoice.resident_id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.billing_period_start} to {invoice.billing_period_end}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${invoice.amount?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(invoice.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            {invoice.status === 'draft' && (
                              <button
                                onClick={() => handleApproveInvoice(invoice.invoice_id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                            )}
                            {invoice.status === 'approved' && (
                              <button
                                onClick={() => handleSendInvoice(invoice.invoice_id)}
                                className="text-orange-600 hover:text-orange-900"
                              >
                                Send
                              </button>
                            )}
                            <button className="text-blue-600 hover:text-blue-900">
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Billing;
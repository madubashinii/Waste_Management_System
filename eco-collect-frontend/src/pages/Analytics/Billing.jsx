import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { useAsync } from '../../hooks/useAsync';

const Billing = () => {
  const [period, setPeriod] = useState({ start: '', end: '' });
  const [processing, setProcessing] = useState(false);

  // Use custom hook for async operations
  const {
    data: invoices,
    loading: invoicesLoading,
    error: invoicesError,
    execute: loadInvoices
  } = useAsync(() => adminService.getInvoices(), true);

  // Set default dates to current month
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setPeriod({
      start: firstDay.toISOString().split('T')[0],
      end: lastDay.toISOString().split('T')[0]
    });
  }, []);

  // Calculate statistics using useMemo for performance - FIXED NULL CHECK
  const stats = useMemo(() => {
    const initialStats = {
      total: 0,
      draft: 0,
      approved: 0,
      sent: 0,
      paid: 0,
      totalAmount: 0
    };

    // Handle null or undefined invoices
    if (!invoices || !Array.isArray(invoices)) {
      return initialStats;
    }

    return invoices.reduce((acc, invoice) => {
      acc.total++;
      acc[invoice.status]++;
      if (invoice.amount) {
        acc.totalAmount += invoice.amount;
      }
      return acc;
    }, { ...initialStats });
  }, [invoices]);

  // Action handlers with proper error handling
  const handleRunBilling = async () => {
    if (!period.start || !period.end) {
      alert('Please select both start and end dates');
      return;
    }

    try {
      setProcessing(true);
      const result = await adminService.runBilling(period.start, period.end);
      await loadInvoices();

      const totalAmount = result.invoices?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;
      alert(`✅ Billing completed! Generated ${result.invoices?.length || 0} invoices totaling $${totalAmount.toFixed(2)}`);
    } catch (error) {
      alert('❌ Error running billing: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkAction = async (action, confirmMessage, successMessage) => {
    if (!window.confirm(confirmMessage)) return;

    try {
      setProcessing(true);
      await action();
      await loadInvoices();
      alert(`✅ ${successMessage}`);
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleApproveAll = () =>
    handleBulkAction(
      adminService.approveAllInvoices,
      'Approve all draft invoices?',
      'All invoices approved!'
    );

  const handleSendInvoices = () =>
    handleBulkAction(
      adminService.sendAllInvoices,
      'Send all approved invoices to residents?',
      'All invoices sent to residents!'
    );

  const handleInvoiceAction = async (invoiceId, action, status) => {
    try {
      await adminService.updateInvoice(invoiceId, { status });
      await loadInvoices();
    } catch (error) {
      alert(`Error ${action} invoice: ${error.message}`);
    }
  };

  // Derived state with null checks
  const canApproveAll = invoices?.some(inv => inv.status === 'draft') || false;
  const canSendAll = invoices?.some(inv => inv.status === 'approved') || false;

  if (invoicesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Invoices</h3>
          <p className="text-gray-600">{invoicesError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🧾 Billing Management</h1>
          <p className="text-gray-600 mt-2">Generate, approve, and send invoices to residents</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon="📊"
            label="Total Invoices"
            value={stats.total}
            color="blue"
          />
          <StatCard
            icon="💰"
            label="Total Amount"
            value={`$${stats.totalAmount.toFixed(2)}`}
            color="green"
          />
          <StatCard
            icon="📝"
            label="Draft"
            value={stats.draft}
            color="yellow"
          />
          <StatCard
            icon="📧"
            label="Sent"
            value={stats.sent}
            color="orange"
          />
        </div>

        {/* Billing Period Card */}
        <BillingPeriodCard
          period={period}
          onPeriodChange={setPeriod}
          onRunBilling={handleRunBilling}
          processing={processing}
        />

        {/* Invoices Section */}
        <InvoicesSection
          invoices={invoices || []} // Ensure we always pass an array
          loading={invoicesLoading}
          canApproveAll={canApproveAll}
          canSendAll={canSendAll}
          processing={processing}
          onApproveAll={handleApproveAll}
          onSendAll={handleSendInvoices}
          onApproveInvoice={(id) => handleInvoiceAction(id, 'approving', 'approved')}
          onSendInvoice={(id) => handleInvoiceAction(id, 'sending', 'sent')}
        />
      </div>
    </div>
  );
};

// Extracted components for better maintainability
const StatCard = ({ icon, label, value, color = 'blue' }) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' }
  };

  const { bg, text } = colorClasses[color];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 ${bg} rounded-full flex items-center justify-center`}>
            <span className={text}>{icon}</span>
          </div>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

const BillingPeriodCard = ({ period, onPeriodChange, onRunBilling, processing }) => (
  <div className="bg-white rounded-lg shadow-sm border mb-8">
    <div className="p-6 border-b">
      <h2 className="text-xl font-semibold mb-4">Run Billing for Period</h2>
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <DateInput
          label="From Date"
          value={period.start}
          onChange={(value) => onPeriodChange({...period, start: value})}
        />
        <DateInput
          label="To Date"
          value={period.end}
          onChange={(value) => onPeriodChange({...period, end: value})}
        />
        <BulkActionButton
          onClick={onRunBilling}
          disabled={processing}
          label={processing ? 'Processing...' : 'Run Billing'}
          color="blue"
        />
      </div>
      <p className="text-sm text-gray-600 mt-3">
        The system will automatically calculate invoices based on waste collections during this period.
      </p>
    </div>
  </div>
);

const DateInput = ({ label, value, onChange }) => (
  <div className="flex-1">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    />
  </div>
);

const InvoicesSection = ({
  invoices,
  loading,
  canApproveAll,
  canSendAll,
  processing,
  onApproveAll,
  onSendAll,
  onApproveInvoice,
  onSendInvoice
}) => (
  <div className="bg-white rounded-lg shadow-sm border">
    <div className="p-6 border-b">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Generated Invoices</h2>
        <div className="flex gap-3">
          <BulkActionButton
            onClick={onApproveAll}
            disabled={!canApproveAll || processing}
            label="Approve All Drafts"
            color="green"
          />
          <BulkActionButton
            onClick={onSendAll}
            disabled={!canSendAll || processing}
            label="Send All Approved"
            color="orange"
          />
        </div>
      </div>
    </div>

    <div className="p-6">
      {loading ? (
        <LoadingSpinner text="Loading invoices..." />
      ) : invoices.length === 0 ? (
        <EmptyState
          icon="🧾"
          title="No invoices generated"
          description="Run billing for a period to generate invoices."
        />
      ) : (
        <InvoicesTable
          invoices={invoices}
          onApproveInvoice={onApproveInvoice}
          onSendInvoice={onSendInvoice}
        />
      )}
    </div>
  </div>
);

// Renamed to avoid conflict
const BulkActionButton = ({ onClick, disabled, label, color = 'blue' }) => {
  const colorClasses = {
    green: 'bg-green-600 hover:bg-green-700',
    orange: 'bg-orange-600 hover:bg-orange-700',
    blue: 'bg-blue-600 hover:bg-blue-700'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${colorClasses[color]}`}
    >
      {label}
    </button>
  );
};

const EmptyState = ({ icon, title, description }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <span className="text-gray-400 text-2xl">{icon}</span>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const InvoicesTable = ({ invoices, onApproveInvoice, onSendInvoice }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <TableHeader>Invoice</TableHeader>
          <TableHeader>Resident</TableHeader>
          <TableHeader>Period</TableHeader>
          <TableHeader>Amount</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Actions</TableHeader>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {invoices.map(invoice => (
          <InvoiceRow
            key={invoice.invoice_id}
            invoice={invoice}
            onApproveInvoice={onApproveInvoice}
            onSendInvoice={onSendInvoice}
          />
        ))}
      </tbody>
    </table>
  </div>
);

const TableHeader = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const InvoiceRow = ({ invoice, onApproveInvoice, onSendInvoice }) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-gray-900">
        INV-{invoice.invoice_id?.toString().padStart(6, '0') || 'N/A'}
      </div>
      <div className="text-sm text-gray-500">
        {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : 'N/A'}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-gray-900">
        {invoice.resident_name || `Resident ${invoice.resident_id || 'N/A'}`}
      </div>
      <div className="text-sm text-gray-500">ID: {invoice.resident_id || 'N/A'}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {invoice.billing_period_start || 'N/A'} to {invoice.billing_period_end || 'N/A'}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      ${invoice.amount?.toFixed(2) || '0.00'}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <StatusBadge status={invoice.status || 'draft'} />
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <InvoiceActions
        status={invoice.status}
        invoiceId={invoice.invoice_id}
        onApproveInvoice={onApproveInvoice}
        onSendInvoice={onSendInvoice}
      />
    </td>
  </tr>
);

const InvoiceActions = ({ status, invoiceId, onApproveInvoice, onSendInvoice }) => (
  <div className="flex gap-2">
    {status === 'draft' && (
      <InlineActionButton
        onClick={() => onApproveInvoice(invoiceId)}
        label="Approve"
        color="green"
      />
    )}
    {status === 'approved' && (
      <InlineActionButton
        onClick={() => onSendInvoice(invoiceId)}
        label="Send"
        color="orange"
      />
    )}
    <InlineActionButton
      onClick={() => {/* View logic */}}
      label="View"
      color="blue"
    />
  </div>
);

// Separate component for inline actions (text buttons)
const InlineActionButton = ({ onClick, label, color = 'blue' }) => {
  const colorClasses = {
    green: 'text-green-600 hover:text-green-900',
    orange: 'text-orange-600 hover:text-orange-900',
    blue: 'text-blue-600 hover:text-blue-900'
  };

  return (
    <button
      onClick={onClick}
      className={`hover:underline transition-colors ${colorClasses[color]}`}
    >
      {label}
    </button>
  );
};

export default Billing;
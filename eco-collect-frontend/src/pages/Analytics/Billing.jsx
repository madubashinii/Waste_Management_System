import React, { useState } from 'react';

function Billing() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [invoices, setInvoices] = useState([
    { id: 1, resident: 'John Doe', amount: 150.00, status: 'draft' },
    { id: 2, resident: 'Jane Smith', amount: 200.00, status: 'draft' },
    { id: 3, resident: 'Bob Wilson', amount: 180.00, status: 'draft' }
  ]);

  const handleRunBilling = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }
    alert(`Running billing from ${startDate} to ${endDate}`);
    // In real app, this would fetch invoices from API
  };

  const handleApproveAll = () => {
    setInvoices(invoices.map(invoice => ({ ...invoice, status: 'approved' })));
    alert('All invoices approved!');
  };

  const handleSendInvoices = () => {
    setInvoices(invoices.map(invoice => ({ ...invoice, status: 'sent' })));
    alert('All invoices sent to residents!');
  };

  const handleApproveInvoice = (id) => {
    setInvoices(invoices.map(invoice =>
      invoice.id === id ? { ...invoice, status: 'approved' } : invoice
    ));
  };

  return (
    <div className="page-container">
      <h2>Billing Management</h2>

      <div className="billing-period">
        <h3>Pick Billing Period</h3>
        <div className="date-inputs">
          <label>From: </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label>To: </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={handleRunBilling}>
          Run Billing
        </button>
      </div>

      <div className="invoices-section">
        <h3>Draft Invoices</h3>
        <div className="invoice-actions">
          <button className="btn-success" onClick={handleApproveAll}>Approve All</button>
          <button className="btn-secondary" onClick={handleSendInvoices}>Send Invoices</button>
          <button className="btn-info">Download CSV</button>
        </div>

        <div className="list-container">
          <table className="invoices-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Resident</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.resident}</td>
                  <td>${invoice.amount.toFixed(2)}</td>
                  <td>
                    <span className={`status-${invoice.status}`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {invoice.status === 'draft' && (
                      <button
                        className="btn-small btn-success"
                        onClick={() => handleApproveInvoice(invoice.id)}
                      >
                        Approve
                      </button>
                    )}
                    <button className="btn-small btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Billing;
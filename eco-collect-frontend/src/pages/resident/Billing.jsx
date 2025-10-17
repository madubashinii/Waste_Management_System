import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BillingList = ({ residentId }) => {
  const [billings, setBillings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all"); // all, processed, unpaid, paid
  const navigate = useNavigate();

  useEffect(() => {
    let url = `/api/billing/resident/${residentId}`;
    if (filterStatus !== "all") url += `?status=${filterStatus}`;
    fetch(url)
      .then(res => res.json())
      .then(data => setBillings(data));
  }, [residentId, filterStatus]);

  const handlePay = (invoiceId) => {
    navigate(`/payment/${invoiceId}`);
  };

  const processedStatuses = ["draft", "approved", "sent"];

  return (
    <div>
      <h4>Billing Records</h4>

      <div className="mb-3">
        <button className="btn btn-outline-primary me-2" onClick={() => setFilterStatus("all")}>All</button>
        <button className="btn btn-outline-secondary me-2" onClick={() => setFilterStatus("processed")}>Processed</button>
        <button className="btn btn-outline-success me-2" onClick={() => setFilterStatus("unpaid")}>Unpaid</button>
        <button className="btn btn-outline-info me-2" onClick={() => setFilterStatus("paid")}>Paid</button>
      </div>

      {billings.length === 0 ? (
        <p>No billing records found.</p>
      ) : (
        <ul className="list-group">
          {billings.map(bill => (
            <li key={bill.invoiceId} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{bill.invoiceId}</strong> — {bill.residentName} — {bill.status} — ${bill.amount}
              </div>
              {bill.status === "unpaid" && (
                  <div>
                  <strong>{bill.dueDate}</strong>
                <button className="btn btn-sm btn-warning" onClick={() => handlePay(bill.invoiceId)}>
                  Pay Now
                </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BillingList;

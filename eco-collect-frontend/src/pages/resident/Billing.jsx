import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BillingList = ({ residentId }) => {
  const [billings, setBillings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    let url = `/api/billing/resident/${residentId}`;
    if (filterStatus !== "all") url += `?status=${filterStatus}`;
    fetch(url)
      .then(res => res.json())
      .then(data => setBillings(data));
  }, [residentId, filterStatus]);

  const handlePay = (invoiceId) => {
    navigate(`/billing/${invoiceId}`);
  };

  return (
    <div>
      <h4>Billing Records</h4>

      <div className="mb-3">
        {["all","processed","unpaid","paid"].map(s => (
          <button key={s} className="btn btn-outline-primary me-2" onClick={() => setFilterStatus(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {billings.length === 0 ? <p>No billing records found.</p> :
        <ul className="list-group">
          {billings.map(bill => (
            <li key={bill.invoiceId} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{bill.invoiceId}</strong> — {bill.residentName} — {bill.status} — ${bill.amount}
              </div>
              {bill.status === "unpaid" &&
                <button className="btn btn-sm btn-warning" onClick={() => handlePay(bill.invoiceId)}>Pay Now</button>
              }
            </li>
          ))}
        </ul>
      }
    </div>
  );
};

export default BillingList;

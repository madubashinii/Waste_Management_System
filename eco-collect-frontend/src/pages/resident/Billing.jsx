import React, { useEffect, useState } from "react";
import InvoicePage from "./InvoicePage";

const Billing = () => {
  const [paidRequests, setPaidRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetch("/api/requests/paid")
      .then(res => res.json())
      .then(data => setPaidRequests(data));
  }, []);

  const handleView = (requestId) => {
    fetch(`/api/requests/${requestId}`)
      .then(res => res.json())
      .then(data => setSelectedRequest(data));
  };

  if (selectedRequest) {
    return (
      <div>
        <button
          className="btn btn-outline-secondary mb-3"
          onClick={() => setSelectedRequest(null)}
        >
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
        <InvoicePage
          invoiceId={selectedRequest.invoiceId}
          userName={selectedRequest.userName}
          address={selectedRequest.address}
          itemTypes={selectedRequest.itemTypes}
          quantities={selectedRequest.quantities}
          totals={selectedRequest.totals}
          grandTotal={selectedRequest.grandTotal}
        />
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-4">Paid Requests</h4>
      {paidRequests.length === 0 ? (
        <p>No paid requests found.</p>
      ) : (
        <ul className="list-group">
          {paidRequests.map((req) => (
            <li key={req.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{req.invoiceId}</strong> &mdash; {new Date(req.date).toLocaleDateString()}
              </div>
              <button className="btn btn-sm btn-success" onClick={() => handleView(req.id)}>
                View
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Billing;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";

const BillingDetail = () => {
  const { invoiceId } = useParams();
  const [billing, setBilling] = useState(null);
  const [payment, setPayment] = useState({ transactionId: "", paymentDate: "", amount: "", bank: "" });

  useEffect(() => {
    fetch(`/api/billing/${invoiceId}`)
      .then(res => res.json())
      .then(data => setBilling(data));
  }, [invoiceId]);

  const handleChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/billing/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payment, invoiceId: billing.invoiceId })
    }).then(() => alert("Payment submitted successfully!"));
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Invoice #${billing.invoiceId}`, 20, 20);
    doc.text(`Resident: ${billing.residentName}`, 20, 30);
    doc.text(`Amount: $${billing.amount}`, 20, 40);
    doc.text(`Status: ${billing.status}`, 20, 50);
    doc.save(`Invoice_${billing.invoiceId}.pdf`);
  };

  if (!billing) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h4>Invoice #{billing.invoiceId}</h4>
      <p><strong>Resident:</strong> {billing.residentName}</p>
      <p><strong>Amount:</strong> ${billing.amount}</p>
      <p><strong>Status:</strong> {billing.status}</p>
      <p><strong>Billing Period:</strong> {billing.billingPeriodStart} - {billing.billingPeriodEnd}</p>

      <button className="btn btn-primary mb-3" onClick={downloadPDF}>Download PDF</button>

      {billing.status !== "paid" && (
        <form onSubmit={handleSubmit}>
          <h5>Submit Payment</h5>
          <input type="text" name="transactionId" placeholder="Transaction ID" className="form-control mb-2" onChange={handleChange} required/>
          <input type="date" name="paymentDate" className="form-control mb-2" onChange={handleChange} required/>
          <input type="number" name="amount" placeholder="Amount" className="form-control mb-2" onChange={handleChange} required/>
          <input type="text" name="bank" placeholder="Bank" className="form-control mb-2" onChange={handleChange} required/>
          <button className="btn btn-success mt-2" type="submit">Submit Payment</button>
        </form>
      )}
    </div>
  );
};

export default BillingDetail;

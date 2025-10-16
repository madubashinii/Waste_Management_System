import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const InvoicePage = ({
  invoiceId = "INV-001",
  userName = "John Doe",
  address = "123 Main Street, Colombo",
  itemTypes = ["Plastic", "Organic", "Paper"],
  quantities = [10, 5, 7],
  totals = [500, 250, 350],
  grandTotal = 1100,
  onSlipUpload, // optional handler for upload
  onDownload, // optional handler for download
}) => {
  const handleUpload = (e) => {
    e.preventDefault();
    if (onSlipUpload) onSlipUpload(e);
  };

  return (
    <div
      className="invoice-container"
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        background: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <h4 className="text-success mb-4">Invoice</h4>

      <p>
        <strong>Invoice ID:</strong> {invoiceId}
      </p>
      <p>
        <strong>Name:</strong> {userName}
      </p>
      <p>
        <strong>Address:</strong> {address}
      </p>

      <hr />

      {/* Table Section */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Item Type</th>
            <th>Quantity (kg)</th>
            <th>Total (Rs)</th>
          </tr>
        </thead>
        <tbody>
          {itemTypes.map((type, index) => (
            <tr key={index}>
              <td>{type}</td>
              <td>{quantities[index]}</td>
              <td>Rs. {totals[index]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-end fs-5 fw-semibold text-success">
        Grand Total: Rs. {grandTotal}
      </div>

      <hr />

      {/* Upload Payment Slip */}
      <h5 className="mt-4">Upload Payment Slip</h5>
      <form
        onSubmit={handleUpload}
        encType="multipart/form-data"
      >
        <input type="hidden" name="invoiceId" value={invoiceId} />
        <div className="mb-3">
          <input
            type="file"
            name="slipFile"
            className="form-control"
            accept="image/*,.pdf"
            required
          />
        </div>
        <button type="submit" className="btn btn-success">
          Upload Slip
        </button>
      </form>

      <div className="mt-3">
        <button
          className="btn btn-outline-success"
          onClick={onDownload || (() => alert("Download PDF"))}
        >
          <i className="fa-solid fa-file-pdf"></i> Download Invoice PDF
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;

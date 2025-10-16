import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const prices = {
  Plastic: 20,
  Metal: 50,
  Paper: 15,
  Glass: 25,
  "E-waste": 70,
};

const RequestPickup = ({ userName = "" }) => {
  const [address, setAddress] = useState("");
  const [items, setItems] = useState([
    { type: "", quantity: "", price: "", total: "" },
  ]);

  // Update item price and total when quantity/type changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    const type = updatedItems[index].type;
    const qty = parseFloat(updatedItems[index].quantity) || 0;
    const price = prices[type] || 0;
    const total = price * qty;

    updatedItems[index].price = price ? price.toFixed(2) : "";
    updatedItems[index].total = total ? total.toFixed(2) : "";

    setItems(updatedItems);
  };

  const addRow = () => {
    setItems([...items, { type: "", quantity: "", price: "", total: "" }]);
  };

  const grandTotal = items.reduce(
    (sum, item) => sum + (parseFloat(item.total) || 0),
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Pickup request submitted!");
    // You can send `items`, `userName`, and `address` to backend here
  };

  return (
    <div
      className="form-container"
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
      <h4 className="mb-4 text-success">
        <i className="fa-solid fa-truck"></i> Request Pickup
      </h4>

      <form onSubmit={handleSubmit}>
        {/* User Info */}
        <div className="mb-3">
          <label htmlFor="userName" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            className="form-control"
            value={userName}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Pickup Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className="form-control"
            placeholder="Enter your pickup address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <hr />

        {/* Item Rows */}
        <div id="itemContainer">
          {items.map((item, index) => (
            <div className="row g-3 mb-3 item-row" key={index}>
              <div className="col-md-3">
                <label className="form-label">Item Type</label>
                <select
                  className="form-select item-type"
                  name="itemType[]"
                  value={item.type}
                  onChange={(e) =>
                    handleItemChange(index, "type", e.target.value)
                  }
                  required
                >
                  <option value="">Select</option>
                  <option value="Plastic">Plastic</option>
                  <option value="Metal">Metal</option>
                  <option value="Paper">Paper</option>
                  <option value="Glass">Glass</option>
                  <option value="E-waste">E-waste</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">Quantity (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  className="form-control qty"
                  name="quantity[]"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">Price/kg (Rs)</label>
                <input
                  type="text"
                  className="form-control price"
                  name="price[]"
                  value={item.price}
                  readOnly
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">Total (Rs)</label>
                <input
                  type="text"
                  className="form-control total"
                  name="itemTotal[]"
                  value={item.total}
                  readOnly
                />
              </div>

              <div className="col-md-3 d-flex align-items-end">
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={addRow}
                >
                  <i className="fa-solid fa-plus"></i> Add
                </button>
              </div>
            </div>
          ))}
        </div>

        <hr />

        {/* Total Display */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="fs-5 fw-semibold">Grand Total:</span>
          <span className="fs-5 fw-semibold text-success">
            Rs. {grandTotal.toFixed(2)}
          </span>
        </div>

        {/* Submit */}
        <div className="text-end">
          <button type="submit" className="btn btn-success">
            <i className="fa-solid fa-paper-plane"></i> Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestPickup;

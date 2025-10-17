import React, { useState, useContext } from "react";
import { ResidentContext } from "../../context/ResidentContext";

const binTypes = ["General", "Recyclable", "Organic"];
const pickupTypes = ["Regular", "Bulky", "Emergency"];

const RequestPickup = ({ userId = 1 }) => {
  const { bins, addPickupRequest } = useContext(ResidentContext);

  // Mock zones derived from bins
  const zones = [...new Map(bins.map((b) => [b.zoneId, { zone_id: b.zoneId, zone_name: `Zone ${b.zoneId}` }])).values()];

  const [zoneId, setZoneId] = useState("");
  const [ward, setWard] = useState("");
  const [pickupType, setPickupType] = useState("Regular");
  const [items, setItems] = useState([{ type: "", quantity: "" }]);
  const [address, setAddress] = useState("");

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addRow = () => setItems([...items, { type: "", quantity: "" }]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { userId, zoneId, ward, address, pickupType, items };
    addPickupRequest(payload); // add to context
    alert("Pickup request submitted!");
    setItems([{ type: "", quantity: "" }]);
    setZoneId("");
    setWard("");
    setAddress("");
    setPickupType("Regular");
  };

  return (
    <div className="form-container" style={{ maxWidth: "800px", margin: "40px auto", padding: "30px", background: "white", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <h4 className="mb-4 text-success">
        <i className="fa-solid fa-truck"></i> Request Pickup
      </h4>

      <form onSubmit={handleSubmit}>
        {/* Pickup Type */}
        <div className="mb-3">
          <label className="form-label">Pickup Type</label>
          <select className="form-select" value={pickupType} onChange={(e) => setPickupType(e.target.value)}>
            {pickupTypes.map((pt) => (
              <option key={pt} value={pt}>{pt}</option>
            ))}
          </select>
        </div>

        {/* Zone & Ward */}
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label">Zone</label>
            <select className="form-select" value={zoneId} onChange={(e) => setZoneId(e.target.value)} required>
              <option value="">Select Zone</option>
              {zones.map((z) => (
                <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Ward</label>
            <input type="text" className="form-control" value={ward} onChange={(e) => setWard(e.target.value)} required />
          </div>
        </div>

        {/* Address */}
        <div className="mb-3">
          <label className="form-label">Pickup Address</label>
          <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>

        <hr />

        {/* Items */}
        {items.map((item, index) => (
          <div className="row g-3 mb-3" key={index}>
            <div className="col-md-6">
              <label className="form-label">Item Type</label>
              <select className="form-select" value={item.type} onChange={(e) => handleItemChange(index, "type", e.target.value)} required>
                <option value="">Select</option>
                {binTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Quantity (kg)</label>
              <input type="number" step="0.1" min="0" className="form-control" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} required />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button type="button" className="btn btn-outline-success" onClick={addRow}>
                <i className="fa-solid fa-plus"></i> Add
              </button>
            </div>
          </div>
        ))}

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

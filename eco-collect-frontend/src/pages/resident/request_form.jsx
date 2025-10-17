import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const regularWasteTypes = ["Plastic", "Paper", "Glass", "Polythene"];
const specialWasteTypes = ["Electronics", "Appliances", "Batteries"];

const RequestPickup = ({ userName = "" }) => {
  const [pickupType, setPickupType] = useState("Regular");
  const [address, setAddress] = useState("");
  const [zoneId, setZoneId] = useState(""); // Selected zone
  const [zones, setZones] = useState([]); // Available zones
  const [items, setItems] = useState([{ type: "", quantity: "" }]);

  useEffect(() => {
    // Fetch zones from backend
    fetch("http://localhost:8080/api/zones")
      .then((res) => res.json())
      .then((data) => setZones(data))
      .catch((err) => console.error(err));
  }, []);

  const wasteOptions =
    pickupType === "Regular" ? regularWasteTypes : specialWasteTypes;

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItemCard = () => setItems([...items, { type: "", quantity: "" }]);
  const removeItemCard = (index) =>
    setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!zoneId) {
      alert("Please select a zone/ward.");
      return;
    }

    const payload = {
      userName,
      address,
      pickupType,
      zoneId,
      items,
    };

    try {
      const res = await fetch("http://localhost:8080/api/pickups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("Pickup request submitted!");
        setItems([{ type: "", quantity: "" }]);
        setAddress("");
        setZoneId("");
      } else {
        alert("Failed to submit request");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting request");
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-4">Request Pickup</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input className="form-control" value={userName} readOnly />
        </div>

        <div className="mb-3">
          <label className="form-label">Pickup Address</label>
          <input
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Zone/Ward</label>
          <select
            className="form-select"
            value={zoneId}
            onChange={(e) => setZoneId(e.target.value)}
            required
          >
            <option value="">Select Zone/Ward</option>
            {zones.map((zone) => (
              <option key={zone.zoneId} value={zone.zoneId}>
                {zone.zoneName} - {zone.wardName} ({zone.wardNumber})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Pickup Type</label>
          <select
            className="form-select"
            value={pickupType}
            onChange={(e) => {
              setPickupType(e.target.value);
              setItems([{ type: "", quantity: "" }]);
            }}
          >
            <option value="Regular">Regular</option>
            <option value="Special">Special</option>
          </select>
        </div>

        <hr />

        {items.map((item, index) => (
          <div
            key={index}
            className="card mb-3 p-3 shadow-sm"
            style={{ borderRadius: "10px" }}
          >
            <div className="row g-3 align-items-end">
              <div className="col-md-6">
                <label className="form-label">Waste Type</label>
                <select
                  className="form-select"
                  value={item.type}
                  onChange={(e) =>
                    handleItemChange(index, "type", e.target.value)
                  }
                  required
                >
                  <option value="">Select Waste</option>
                  {wasteOptions.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Number of Items</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                  required
                />
              </div>

              <div className="col-md-2 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => removeItemCard(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-outline-success mb-3"
          onClick={addItemCard}
        >
          + Add Another Item
        </button>

        <div className="text-end">
          <button type="submit" className="btn btn-success">
            Submit Pickup Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestPickup;

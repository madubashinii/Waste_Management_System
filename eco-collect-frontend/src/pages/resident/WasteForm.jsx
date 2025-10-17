import React, { useState, useEffect } from "react";

const WasteLogForm = ({ residentId }) => {
  const [wasteTypes, setWasteTypes] = useState([]);
  const [entries, setEntries] = useState([{ wasteTypeId: "", quantity: "" }]);

  useEffect(() => {
    fetch("/api/waste-types")
      .then(res => res.json())
      .then(setWasteTypes);
  }, []);

  const addEntry = () => setEntries([...entries, { wasteTypeId: "", quantity: "" }]);
  const removeEntry = (index) => setEntries(entries.filter((_, i) => i !== index));
  const handleChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const entry of entries) {
      await fetch("/api/waste-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...entry, residentId }),
      });
    }
    alert("Waste logged successfully!");
  };

  return (
    <form onSubmit={handleSubmit}>
      {entries.map((entry, index) => (
        <div key={index} className="d-flex gap-2 mb-2">
          <select value={entry.wasteTypeId} onChange={e => handleChange(index, "wasteTypeId", e.target.value)} required>
            <option value="">Select Waste Type</option>
            {wasteTypes.map(w => <option key={w.wasteTypeId} value={w.wasteTypeId}>{w.name}</option>)}
          </select>
          <input type="number" min="0" step="0.1" value={entry.quantity} onChange={e => handleChange(index, "quantity", e.target.value)} required placeholder="Quantity (kg)" />
          <button type="button" onClick={() => removeEntry(index)}>−</button>
        </div>
      ))}
      <button type="button" onClick={addEntry}>+ Add Another</button>
      <button type="submit">Submit</button>
    </form>
  );
};

export default WasteLogForm;

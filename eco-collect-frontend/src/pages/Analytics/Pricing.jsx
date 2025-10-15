import React, { useState } from 'react';

function Pricing() {
  const [selectedModel, setSelectedModel] = useState('PAYT');
  const [activeTab, setActiveTab] = useState('zones');
  const [zones, setZones] = useState(['North Zone', 'South Zone']);
  const [wasteTypes, setWasteTypes] = useState(['General', 'Organic', 'Recyclable']);

  const handleSavePricing = () => {
    alert(`Pricing model "${selectedModel}" saved successfully!`);
  };

  const handleAddZone = () => {
    const newZone = prompt('Enter zone name:');
    if (newZone) setZones([...zones, newZone]);
  };

  const handleAddWasteType = () => {
    const newType = prompt('Enter waste type:');
    if (newType) setWasteTypes([...wasteTypes, newType]);
  };

  return (
    <div className="page-container">
      <h2>Pricing Configuration</h2>

      <div className="model-selection">
        <label>Select Model: </label>
        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
          <option value="PAYT">PAYT (Pay-As-You-Throw)</option>
          <option value="FLAT">Flat Rate</option>
          <option value="HYBRID">Hybrid</option>
        </select>
      </div>

      <div className="tabs">
        {['Zones', 'Waste Types', 'Pick Period', 'Reports'].map(tab => (
          <button
            key={tab}
            className={activeTab === tab.toLowerCase().replace(' ', '-') ? 'active' : ''}
            onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'zones' && (
          <div>
            <h3>Zone Management</h3>
            <button className="btn-primary" onClick={handleAddZone}>Add Zone</button>
            <div className="list-container">
              <h4>Existing Zones:</h4>
              <ul>
                {zones.map((zone, index) => (
                  <li key={index}>{zone}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'waste-types' && (
          <div>
            <h3>Waste Types</h3>
            <button className="btn-primary" onClick={handleAddWasteType}>Add Waste Type</button>
            <div className="list-container">
              <h4>Existing Waste Types:</h4>
              <ul>
                {wasteTypes.map((type, index) => (
                  <li key={index}>{type}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'pick-period' && (
          <div>
            <h3>Select Billing Period</h3>
            <div className="date-inputs">
              <input type="date" /> to <input type="date" />
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h3>Reports</h3>
            <select>
              <option>Waste by Zone</option>
              <option>Recycling Rate</option>
              <option>Missed Pickups</option>
            </select>
            <button className="btn-secondary">Download CSV</button>
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button className="btn-success" onClick={handleSavePricing}>
          Save Pricing Model
        </button>
      </div>
    </div>
  );
}

export default Pricing;
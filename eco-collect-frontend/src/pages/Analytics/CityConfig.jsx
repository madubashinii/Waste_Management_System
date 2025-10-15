import React, { useState } from 'react';

function CityConfig() {
  const [activeTab, setActiveTab] = useState('zones');
  const [zones, setZones] = useState(['North Zone', 'South Zone', 'East Zone']);
  const [wasteTypes, setWasteTypes] = useState([
    { name: 'General Waste', recyclable: false },
    { name: 'Plastic', recyclable: true },
    { name: 'Organic', recyclable: true }
  ]);
  const [users, setUsers] = useState(['Admin User', 'Collector John']);
  const [trucks, setTrucks] = useState(['Truck A', 'Truck B']);

  const tabs = [
    { id: 'zones', label: 'Zones' },
    { id: 'waste-types', label: 'Waste Types' },
    { id: 'trucks', label: 'Trucks' },
    { id: 'users', label: 'Users' }
  ];

  const handleAddItem = (type) => {
    const itemName = prompt(`Enter new ${type} name:`);
    if (itemName) {
      switch (type) {
        case 'zone':
          setZones([...zones, itemName]);
          break;
        case 'wasteType':
          setWasteTypes([...wasteTypes, { name: itemName, recyclable: false }]);
          break;
        case 'user':
          setUsers([...users, itemName]);
          break;
        case 'truck':
          setTrucks([...trucks, itemName]);
          break;
        default:
          break;
      }
    }
  };

  const toggleRecyclable = (index) => {
    const updatedTypes = [...wasteTypes];
    updatedTypes[index].recyclable = !updatedTypes[index].recyclable;
    setWasteTypes(updatedTypes);
  };

  return (
    <div className="page-container">
      <h2>City Configuration</h2>

      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'zones' && (
          <div>
            <h3>Manage Zones</h3>
            <button className="btn-primary" onClick={() => handleAddItem('zone')}>
              Add New Zone
            </button>
            <div className="list-container">
              <h4>Existing Zones:</h4>
              <ul>
                {zones.map((zone, index) => (
                  <li key={index}>
                    {zone}
                    <button className="btn-small" onClick={() => setZones(zones.filter((_, i) => i !== index))}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'waste-types' && (
          <div>
            <h3>Waste Types</h3>
            <button className="btn-primary" onClick={() => handleAddItem('wasteType')}>
              Add Waste Type
            </button>
            <div className="list-container">
              <h4>Existing Waste Types:</h4>
              <ul>
                {wasteTypes.map((type, index) => (
                  <li key={index}>
                    {type.name}
                    <span className={`recyclable ${type.recyclable ? 'yes' : 'no'}`}>
                      {type.recyclable ? '♻️ Recyclable' : '🚫 Not Recyclable'}
                    </span>
                    <button className="btn-small" onClick={() => toggleRecyclable(index)}>
                      Toggle Recyclable
                    </button>
                    <button className="btn-small btn-danger" onClick={() => setWasteTypes(wasteTypes.filter((_, i) => i !== index))}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h3>User Management</h3>
            <button className="btn-primary" onClick={() => handleAddItem('user')}>
              Create User
            </button>
            <div className="list-container">
              <h4>Existing Users:</h4>
              <ul>
                {users.map((user, index) => (
                  <li key={index}>
                    {user}
                    <button className="btn-small btn-danger" onClick={() => setUsers(users.filter((_, i) => i !== index))}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'trucks' && (
          <div>
            <h3>Truck Management</h3>
            <button className="btn-primary" onClick={() => handleAddItem('truck')}>
              Add Truck
            </button>
            <div className="list-container">
              <h4>Existing Trucks:</h4>
              <ul>
                {trucks.map((truck, index) => (
                  <li key={index}>
                    {truck}
                    <button className="btn-small btn-danger" onClick={() => setTrucks(trucks.filter((_, i) => i !== index))}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CityConfig;
import React, { useState } from 'react';

function Imports() {
  const [selectedImport, setSelectedImport] = useState('households');
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadStatus(`Uploading ${file.name} for ${selectedImport}...`);

      // Simulate upload process
      setTimeout(() => {
        setUploadStatus(`✅ Successfully imported ${selectedImport} from ${file.name}`);
      }, 2000);
    }
  };

  const handleUpload = () => {
    const fileInput = document.getElementById('csv-upload');
    if (fileInput.files.length === 0) {
      alert('Please select a CSV file first');
      return;
    }
    fileInput.click();
  };

  return (
    <div className="page-container">
      <h2>Data Imports</h2>

      <div className="import-selection">
        <label>Select Import Type: </label>
        <select
          value={selectedImport}
          onChange={(e) => setSelectedImport(e.target.value)}
        >
          <option value="households">Households CSV</option>
          <option value="bins">Bins CSV</option>
          <option value="users">Users CSV</option>
        </select>

        <div className="upload-section">
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button className="btn-primary" onClick={handleUpload}>
            Upload CSV
          </button>
          <span style={{ marginLeft: '10px', fontSize: '14px' }}>
            Select {selectedImport} CSV file
          </span>
        </div>
      </div>

      <div className="import-status">
        <h3>Import Status</h3>
        <div className="status-message">
          {uploadStatus || 'No uploads yet. Select a file to begin import.'}
        </div>

        <div className="import-instructions">
          <h4>Expected CSV Format for {selectedImport}:</h4>
          {selectedImport === 'households' && (
            <ul>
              <li>Column 1: Household ID</li>
              <li>Column 2: Address</li>
              <li>Column 3: Zone</li>
              <li>Column 4: Resident Name</li>
            </ul>
          )}
          {selectedImport === 'bins' && (
            <ul>
              <li>Column 1: Bin ID</li>
              <li>Column 2: Household ID</li>
              <li>Column 3: Waste Type</li>
              <li>Column 4: Location</li>
            </ul>
          )}
          {selectedImport === 'users' && (
            <ul>
              <li>Column 1: User ID</li>
              <li>Column 2: Name</li>
              <li>Column 3: Email</li>
              <li>Column 4: Role</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Imports;
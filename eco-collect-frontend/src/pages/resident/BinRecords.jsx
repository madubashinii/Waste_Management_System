import React, { useEffect, useState, useContext } from "react";
import { ResidentContext } from "../../context/ResidentContext";

const BinRecords = () => {
  //const [bins, setBins] = useState([]);
  const { bins } = useContext(ResidentContext);

  useEffect(() => {
    fetch("/api/bins") // backend endpoint that returns binId and status
      .then((res) => res.json())
      .then((data) => setBins(data))
      .catch((err) => console.error("Error fetching bins:", err));
  }, []);

  return (
    <div className="container mt-4">
      <h4 className="mb-3">My Bins</h4>
      {bins.length === 0 ? (
        <p>No bins available.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Bin ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bins.map((bin) => (
              <tr key={bin.binId}>
                <td>{bin.binId}</td>
                <td>{bin.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BinRecords;

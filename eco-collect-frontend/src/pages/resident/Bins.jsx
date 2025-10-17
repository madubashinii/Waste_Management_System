import React, { useEffect, useState } from "react";

const Bins = () => {
  const [bins, setBins] = useState({
    plasticCount: 0,
    organicCount: 0,
    generalCount: 0,
  });

  useEffect(() => {
    fetch("/api/client_dashboard")
      .then(res => res.json())
      .then(data => {
        setBins(data.binSummary);
      });
  }, []);

  const binData = [
    { type: "Plastic", count: bins.plasticCount, color: "#4caf50" },
    { type: "Organic", count: bins.organicCount, color: "#ff9800" },
    { type: "General", count: bins.generalCount, color: "#2196f3" },
  ];

  return (
    <div className="d-flex gap-4">
      {binData.map((bin) => (
        <div key={bin.type} style={{ textAlign: "center" }}>
          <div
            style={{
              width: "80px",
              height: "120px",
              border: "3px solid #555",
              borderRadius: "5px 5px 0 0",
              backgroundColor: "#eee",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                height: `${Math.min(bin.count * 5, 100)}%`, // scale count for display
                backgroundColor: bin.color,
              }}
            ></div>
          </div>
          <div style={{ marginTop: "8px", fontWeight: 600 }}>{bin.type}</div>
          <div>{bin.count} items</div>
        </div>
      ))}
    </div>
  );
};

export default Bins;

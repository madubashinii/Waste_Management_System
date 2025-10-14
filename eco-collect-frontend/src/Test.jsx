import React, { useEffect, useState } from "react";

function Test() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/api/test")
            .then((res) => res.text())
            .then((data) => setMessage(data))
            .catch((err) => console.error("Error:", err));
    }, []);

    return (
        <div style={{ marginTop: "20px" }}>
            <p>{message}</p>
        </div>
    );
}

export default Test;
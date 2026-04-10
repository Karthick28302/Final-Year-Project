import React from "react";
import useAuth from "../hooks/useAuth";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

function LiveMonitoring() {
  useAuth();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Live Monitoring</h2>
        <img
          src={`${API_URL}/video_feed?view=monitor`}
          alt="Live camera feed"
          style={styles.camera}
        />
      </div>
    </div>
  );
}

export default LiveMonitoring;

const styles = {
  page: {
    padding: "30px",
    background: "#f4f6f9",
    minHeight: "100vh",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  title: {
    margin: "0 0 16px",
    color: "#1e293b",
    fontSize: "20px",
    fontWeight: 600,
  },
  camera: {
    width: "100%",
    maxWidth: "900px",
    borderRadius: "10px",
    border: "2px solid #e2e8f0",
    display: "block",
  },
};

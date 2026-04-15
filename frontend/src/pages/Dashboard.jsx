import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import useAttendance from "../hooks/useAttendance";
import { formatDateTime } from "../utils/formatDate";
import { calcDuration, durationColor } from "../utils/calcDuration";
import { videoFeedUrl } from "../services/cameraService";
import { exportUrl } from "../services/attendanceService";

const Dashboard = () => {
  useAuth();

  const { records, stats, loading, error, refresh } = useAttendance({ interval: 5000 });
  const [cameraError, setCameraError]   = useState(false);
  const [cameraLoaded, setCameraLoaded] = useState(false);

  const downloadExcel = () => window.open(exportUrl());

  const totalEmployees   = new Set(records.map((r) => r.name)).size;
  const currentlyPresent = stats.currently_present;
  const absentToday      = Math.max(0, totalEmployees - currentlyPresent);

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Smart Attendance Dashboard</h1>

      {/* ── Stat cards ── */}
      <div style={styles.cardRow}>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Total Employees</p>
          <p style={styles.cardValue}>{totalEmployees}</p>
        </div>
        <div style={{ ...styles.card, borderTop: "4px solid #16a34a" }}>
          <p style={styles.cardLabel}>Currently Present</p>
          <p style={{ ...styles.cardValue, color: "#16a34a" }}>{currentlyPresent}</p>
        </div>
        <div style={{ ...styles.card, borderTop: "4px solid #dc2626" }}>
          <p style={styles.cardLabel}>Absent Today</p>
          <p style={{ ...styles.cardValue, color: "#dc2626" }}>{absentToday}</p>
        </div>
      </div>

      {/* ── Live Camera ── */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Live Camera</h2>

        {cameraError ? (
          /* Retry button shown when stream fails */
          <div style={styles.cameraError}>
            <p style={{ color: "#dc2626", marginBottom: "12px" }}>
              Camera stream unavailable. Make sure the backend is running.
            </p>
            <button
              style={styles.btnSecondary}
              onClick={() => setCameraError(false)}
            >
              Retry
            </button>
          </div>
        ) : (
          <div style={styles.cameraWrap}>
            {/* Loading placeholder shown until stream is ready */}
            {!cameraLoaded && (
              <div style={styles.cameraPlaceholder}>
                <p style={{ color: "#94a3b8" }}>Connecting to camera...</p>
              </div>
            )}
            <img
              src={videoFeedUrl("view=dashboard")}
              alt="Live camera feed"
              style={{
                ...styles.camera,
                display: cameraLoaded ? "block" : "none",
              }}
              onLoad={()  => setCameraLoaded(true)}
              onError={() => setCameraError(true)}
            />
          </div>
        )}
      </div>

      {/* ── Attendance table ── */}
      <div style={styles.card}>
        <div style={styles.tableHeader}>
          <h2 style={styles.sectionTitle}>Today's Attendance</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={refresh}       style={styles.btnSecondary}>Refresh</button>
            <button onClick={downloadExcel} style={styles.btnPrimary}>Download Excel</button>
          </div>
        </div>

        {error && <p style={{ color: "#dc2626" }}>{error}</p>}

        {loading ? (
          <p style={{ color: "#64748b" }}>Loading...</p>
        ) : records.length > 0 ? (
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Login</th>
                <th style={styles.th}>Logout</th>
                <th style={styles.th}>Duration</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i} style={styles.row}>
                  <td style={{ ...styles.td, textTransform: "capitalize", fontWeight: 600 }}>{r.name}</td>
                  <td style={styles.td}>{formatDateTime(r.login_time)}</td>
                  <td style={styles.td}>{formatDateTime(r.logout_time)}</td>
                  <td style={{ ...styles.td, color: durationColor(r.login_time, r.logout_time), fontWeight: 500 }}>
                    {r.duration || calcDuration(r.login_time, r.logout_time)}
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      padding: "3px 10px", borderRadius: "12px",
                      fontSize: "12px", fontWeight: 600,
                      background: r.logout_time ? "#fee2e2" : "#dcfce7",
                      color:      r.logout_time ? "#dc2626" : "#16a34a",
                    }}>
                      {r.logout_time ? "Offline" : "Present"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "#64748b" }}>No attendance records yet today.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

const styles = {
  page:             { padding: "30px", background: "#f4f6f9", minHeight: "100vh" },
  heading:          { margin: "0 0 24px", color: "#1e293b", fontSize: "24px", fontWeight: 600 },
  cardRow:          { display: "flex", gap: "20px", marginBottom: "24px", flexWrap: "wrap" },
  card:             { background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", flex: 1, minWidth: "200px", marginBottom: "20px" },
  cardLabel:        { margin: "0 0 8px", color: "#64748b", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em" },
  cardValue:        { margin: 0, fontSize: "32px", fontWeight: 700, color: "#1e293b" },
  sectionTitle:     { margin: "0 0 16px", fontSize: "18px", fontWeight: 600, color: "#1e293b" },
  cameraWrap:       { width: "100%", display: "flex", justifyContent: "center" },
  camera:           { width: "100%", maxWidth: "700px", borderRadius: "10px", border: "2px solid #e2e8f0" },
  cameraPlaceholder:{ width: "100%", maxWidth: "700px", height: "300px", background: "#f8fafc", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed #e2e8f0" },
  cameraError:      { textAlign: "center", padding: "40px 0" },
  tableHeader:      { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" },
  table:            { width: "100%", borderCollapse: "collapse" },
  thead:            { background: "#f1f5f9" },
  th:               { padding: "10px 14px", textAlign: "left", fontSize: "13px", fontWeight: 600, color: "#475569" },
  row:              { borderBottom: "1px solid #e2e8f0" },
  td:               { padding: "10px 14px", fontSize: "14px", color: "#334155" },
  btnPrimary:       { padding: "8px 16px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 500 },
  btnSecondary:     { padding: "8px 16px", background: "#e2e8f0", color: "#334155", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 500 },
};

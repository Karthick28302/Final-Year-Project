import { useState } from "react";
import useAuth        from "../hooks/useAuth";
import useAttendance  from "../hooks/useAttendance";
import { formatDateTime, todayISO } from "../utils/formatDate";
import { calcDuration, durationColor } from "../utils/calcDuration";

function Attendance() {
  useAuth();

  const [fromDate, setFromDate] = useState("");
  const [toDate,   setToDate]   = useState("");
  const [search,   setSearch]   = useState("");

  const { records, loading, error, refresh } = useAttendance({
    from: fromDate || null,
    to:   toDate   || null,
    interval: 0,           // no auto-poll on this page; user controls refresh
  });

  const filtered = records.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
    setSearch("");
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Attendance Records</h1>

      {/* Filters */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />
        <input
          type="date"
          value={fromDate}
          max={todayISO()}
          onChange={(e) => setFromDate(e.target.value)}
          style={styles.input}
        />
        <input
          type="date"
          value={toDate}
          max={todayISO()}
          onChange={(e) => setToDate(e.target.value)}
          style={styles.input}
        />
        <button onClick={refresh}      style={styles.btnPrimary}>Apply</button>
        <button onClick={clearFilters} style={styles.btnSecondary}>Clear</button>
      </div>

      {/* Table */}
      <div style={styles.card}>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : filtered.length > 0 ? (
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Login Time</th>
                <th style={styles.th}>Logout Time</th>
                <th style={styles.th}>Duration</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} style={styles.row}>
                  <td style={styles.td}>{i + 1}</td>
                  <td style={{ ...styles.td, fontWeight: 600, textTransform: "capitalize" }}>{r.name}</td>
                  <td style={styles.td}>{formatDateTime(r.login_time)}</td>
                  <td style={styles.td}>{formatDateTime(r.logout_time)}</td>
                  <td style={{ ...styles.td, color: durationColor(r.login_time, r.logout_time), fontWeight: 500 }}>
                    {r.duration || calcDuration(r.login_time, r.logout_time)}
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      padding: "3px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: 600,
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
          <p style={{ color: "#64748b" }}>No records found.</p>
        )}
      </div>
    </div>
  );
}

export default Attendance;

const styles = {
  page:         { padding: "30px", background: "#f4f6f9", minHeight: "100vh" },
  heading:      { margin: "0 0 20px", color: "#1e293b", fontSize: "22px", fontWeight: 600 },
  filters:      { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px", alignItems: "center" },
  input:        { padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", minWidth: "160px" },
  card:         { background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" },
  table:        { width: "100%", borderCollapse: "collapse" },
  thead:        { background: "#f8fafc" },
  th:           { padding: "10px 14px", textAlign: "left", fontSize: "13px", fontWeight: 600, color: "#475569", borderBottom: "2px solid #e2e8f0" },
  row:          { borderBottom: "1px solid #f1f5f9" },
  td:           { padding: "10px 14px", fontSize: "14px", color: "#334155" },
  btnPrimary:   { padding: "9px 18px", background: "#1e293b", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 500 },
  btnSecondary: { padding: "9px 18px", background: "#e2e8f0", color: "#334155", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 500 },
};
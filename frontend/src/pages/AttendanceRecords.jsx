import React, { useMemo, useState } from "react";
import useAuth from "../hooks/useAuth";
import useAttendance from "../hooks/useAttendance";
import { formatDateTime, todayISO } from "../utils/formatDate";
import { calcDuration } from "../utils/calcDuration";
import { exportUrl } from "../services/attendanceService";

function AttendanceRecords() {
  useAuth();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [applied, setApplied] = useState({ from: null, to: null });

  const { records, loading, error, refresh } = useAttendance({
    from: applied.from,
    to: applied.to,
    interval: 0,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter((r) => (r.name || "").toLowerCase().includes(q));
  }, [records, search]);

  const totals = useMemo(() => {
    const total = records.length;
    const present = records.filter((r) => !r.logout_time).length;
    const offline = total - present;
    const employees = new Set(records.map((r) => r.name)).size;
    return { total, present, offline, employees };
  }, [records]);

  const handleApply = () => {
    setApplied({ from: fromDate || null, to: toDate || null });
    refresh();
  };

  const handleClear = () => {
    setFromDate("");
    setToDate("");
    setSearch("");
    setApplied({ from: null, to: null });
  };

  const handleExport = () => {
    window.open(exportUrl({ from: fromDate || undefined, to: toDate || undefined }));
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Attendance Records</h1>

      <div style={styles.statsGrid}>
        <StatCard label="Total Records" value={totals.total} />
        <StatCard label="Currently In" value={totals.present} />
        <StatCard label="Left Today" value={totals.offline} />
        <StatCard label="Employees" value={totals.employees} />
      </div>

      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder="Search by employee name..."
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

        <button style={styles.btnPrimary} onClick={handleApply}>
          Apply
        </button>

        <button style={styles.btnSecondary} onClick={handleClear}>
          Clear
        </button>

        <button style={styles.btnSecondary} onClick={refresh} disabled={loading}>
          Refresh
        </button>

        <button style={styles.btnPrimary} onClick={handleExport}>
          Export Excel
        </button>
      </div>

      <div style={styles.card}>
        {error ? <p style={styles.error}>{error}</p> : null}

        {loading ? (
          <p style={styles.muted}>Loading attendance records...</p>
        ) : filtered.length === 0 ? (
          <p style={styles.muted}>No attendance records found.</p>
        ) : (
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Employee</th>
                <th style={styles.th}>Login Time</th>
                <th style={styles.th}>Logout Time</th>
                <th style={styles.th}>Duration</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const status = r.logout_time ? "Offline" : "Present";
                return (
                  <tr key={i} style={styles.row}>
                    <td style={styles.td}>{i + 1}</td>
                    <td style={{ ...styles.td, textTransform: "capitalize", fontWeight: 600 }}>
                      {r.name || "-"}
                    </td>
                    <td style={styles.td}>{formatDateTime(r.login_time)}</td>
                    <td style={styles.td}>{formatDateTime(r.logout_time)}</td>
                    <td style={styles.td}>{r.duration || calcDuration(r.login_time, r.logout_time)}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          ...(status === "Present" ? styles.badgeSuccess : styles.badgeDanger),
                        }}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={styles.statCard}>
      <p style={styles.statLabel}>{label}</p>
      <p style={styles.statValue}>{value}</p>
    </div>
  );
}

export default AttendanceRecords;

const styles = {
  page: {
    padding: "30px",
    background: "#f4f6f9",
    minHeight: "100vh",
  },
  heading: {
    margin: "0 0 20px",
    color: "#1e293b",
    fontSize: "22px",
    fontWeight: 600,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "12px",
    marginBottom: "20px",
  },
  statCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "14px 16px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  statLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },
  statValue: {
    margin: "8px 0 0",
    color: "#0f172a",
    fontSize: "24px",
    fontWeight: 700,
  },
  toolbar: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "20px",
    alignItems: "center",
  },
  input: {
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    minWidth: "180px",
  },
  btnPrimary: {
    padding: "9px 14px",
    background: "#0ea5e9",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 500,
  },
  btnSecondary: {
    padding: "9px 14px",
    background: "#e2e8f0",
    color: "#334155",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 500,
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thead: {
    background: "#f8fafc",
  },
  th: {
    padding: "10px 14px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: 600,
    color: "#475569",
    borderBottom: "2px solid #e2e8f0",
    whiteSpace: "nowrap",
  },
  row: {
    borderBottom: "1px solid #f1f5f9",
  },
  td: {
    padding: "10px 14px",
    fontSize: "14px",
    color: "#334155",
    verticalAlign: "middle",
  },
  badge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 600,
  },
  badgeSuccess: {
    background: "#dcfce7",
    color: "#166534",
  },
  badgeDanger: {
    background: "#fee2e2",
    color: "#991b1b",
  },
  error: {
    color: "#dc2626",
    marginBottom: "12px",
    fontWeight: 500,
  },
  muted: {
    color: "#64748b",
  },
};

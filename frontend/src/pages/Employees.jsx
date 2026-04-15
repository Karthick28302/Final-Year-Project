import React, { useEffect, useMemo, useState } from "react";
import useAuth from "../hooks/useAuth";
import { getUsers } from "../services/userService";
import { formatDateTime } from "../utils/formatDate";

function Employees() {
  useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => (u.name || "").toLowerCase().includes(q));
  }, [users, search]);

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Employees</h1>

      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />
        <button onClick={fetchUsers} style={styles.btnSecondary} disabled={loading}>
          Refresh
        </button>
      </div>

      <div style={styles.card}>
        {error ? <p style={styles.error}>{error}</p> : null}

        {loading ? (
          <p style={styles.muted}>Loading employees...</p>
        ) : filteredUsers.length === 0 ? (
          <p style={styles.muted}>No employees found.</p>
        ) : (
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, i) => (
                <tr key={u.id ?? i} style={styles.row}>
                  <td style={styles.td}>{u.id ?? "-"}</td>
                  <td style={{ ...styles.td, textTransform: "capitalize", fontWeight: 600 }}>
                    {u.name || "-"}
                  </td>
                  <td style={styles.td}>{formatDateTime(u.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Employees;

const styles = {
  page: { padding: "30px", background: "#f4f6f9", minHeight: "100vh" },
  heading: { margin: "0 0 20px", color: "#1e293b", fontSize: "22px", fontWeight: 600 },
  toolbar: { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" },
  input: {
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    minWidth: "220px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8fafc" },
  th: {
    padding: "10px 14px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: 600,
    color: "#475569",
    borderBottom: "2px solid #e2e8f0",
  },
  row: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "10px 14px", fontSize: "14px", color: "#334155" },
  btnSecondary: {
    padding: "9px 18px",
    background: "#e2e8f0",
    color: "#334155",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 500,
  },
  error: { color: "#dc2626", marginBottom: "12px", fontWeight: 500 },
  muted: { color: "#64748b" },
};

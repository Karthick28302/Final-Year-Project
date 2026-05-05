import React, { useEffect, useMemo, useState } from "react";
import useAuth from "../hooks/useAuth";
import PageWrapper from "../components/layout/PageWrapper";
import {
  getUsers,
  getUserDetails,
  updateCompensation,
  deleteUser,
} from "../services/userService";
import { formatDateTime } from "../utils/formatDate";

function toMoney(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function Employees() {
  useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [salary, setSalary] = useState("0");
  const [pfPercent, setPfPercent] = useState("12");
  const [savingsPercent, setSavingsPercent] = useState("10");
  const [savingComp, setSavingComp] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [actionMsg, setActionMsg] = useState("");
  const [actionErr, setActionErr] = useState("");

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

  const loadUserDetails = async (userId) => {
    setSelectedId(userId);
    setDetailsLoading(true);
    setActionErr("");
    setActionMsg("");
    try {
      const data = await getUserDetails(userId);
      setSelected(data);
      setSalary(String(data?.user?.monthly_salary ?? 0));
      setPfPercent(String(data?.user?.pf_percent ?? 12));
      setSavingsPercent(String(data?.user?.savings_percent ?? 10));
    } catch (err) {
      setActionErr(err?.response?.data?.error || "Failed to load user details.");
      setSelected(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? users.filter((u) => (u.name || "").toLowerCase().includes(q)) : users;
  }, [users, search]);

  const monthlySalary = Number(salary || 0);
  const pfPct = Number(pfPercent || 0);
  const savingsPct = Number(savingsPercent || 0);
  const pfAmount = (monthlySalary * pfPct) / 100;
  const savingsAmount = (monthlySalary * savingsPct) / 100;
  const netMonthly = monthlySalary - pfAmount - savingsAmount;
  const netYearly = netMonthly * 12;

  const onSaveCompensation = async () => {
    if (!selectedId) return;
    setSavingComp(true);
    setActionErr("");
    setActionMsg("");
    try {
      await updateCompensation(selectedId, {
        monthly_salary: monthlySalary,
        pf_percent: pfPct,
        savings_percent: savingsPct,
      });
      setActionMsg("Compensation updated.");
      await fetchUsers();
      await loadUserDetails(selectedId);
    } catch (err) {
      setActionErr(err?.response?.data?.error || "Failed to update compensation.");
    } finally {
      setSavingComp(false);
    }
  };

  const onDeleteUser = async () => {
    if (!selectedId || !selected?.user?.name) return;

    const ok = window.confirm(
      `Delete employee '${selected.user.name}'? This also removes face encoding and attendance history.`
    );
    if (!ok) return;

    setDeleting(true);
    setActionErr("");
    setActionMsg("");
    try {
      await deleteUser(selectedId);
      setActionMsg("Employee deleted.");
      setSelected(null);
      setSelectedId(null);
      await fetchUsers();
    } catch (err) {
      setActionErr(err?.response?.data?.error || "Failed to delete employee.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <PageWrapper
      title="Employees"
      subtitle={`${users.length} registered employee${users.length !== 1 ? "s" : ""}`}
      actions={
        <button className="btn btn-secondary btn-sm" onClick={fetchUsers} disabled={loading}>
          Refresh
        </button>
      }
    >
      <div style={s.layout}>
        <div style={s.leftPane}>
          <div style={s.searchWrap}>
            <input
              className="input"
              type="text"
              placeholder="Search by employee name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {error && <div style={s.error}>{error}</div>}

          <div style={s.tableCard}>
            {loading ? (
              <div style={s.center}>Loading employees...</div>
            ) : filtered.length === 0 ? (
              <div style={s.center}>No employees found.</div>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th style={s.th}>ID</th>
                    <th style={s.th}>Name</th>
                    <th style={s.th}>Salary</th>
                    <th style={s.th}>PF%</th>
                    <th style={s.th}>Savings%</th>
                    <th style={s.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => {
                    const active = selectedId === u.id;
                    return (
                      <tr key={u.id} style={{ ...s.tr, ...(active ? s.trActive : {}) }}>
                        <td style={s.td}>{u.id}</td>
                        <td style={s.td}>{u.name}</td>
                        <td style={s.td}>{toMoney(u.monthly_salary)}</td>
                        <td style={s.td}>{Number(u.pf_percent || 0)}%</td>
                        <td style={s.td}>{Number(u.savings_percent || 0)}%</td>
                        <td style={s.td}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => loadUserDetails(u.id)}
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div style={s.rightPane}>
          <div style={s.panel}>
            <h3 style={s.panelTitle}>Payroll and Admin Actions</h3>

            {!selectedId && <p style={s.muted}>Select an employee to manage salary and delete action.</p>}
            {detailsLoading && <p style={s.muted}>Loading employee details...</p>}

            {selected?.user && !detailsLoading && (
              <>
                <div style={s.userBlock}>
                  <p style={s.userName}>{selected.user.name}</p>
                  <p style={s.muted}>Joined: {formatDateTime(selected.user.created_at)}</p>
                  <p style={s.muted}>
                    Attendance records: {selected.summary?.total_records ?? 0}
                  </p>
                </div>

                <div style={s.formGrid}>
                  <label style={s.label}>
                    Monthly Salary
                    <input
                      className="input"
                      type="number"
                      min="0"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                    />
                  </label>
                  <label style={s.label}>
                    PF (%)
                    <input
                      className="input"
                      type="number"
                      min="0"
                      max="100"
                      value={pfPercent}
                      onChange={(e) => setPfPercent(e.target.value)}
                    />
                  </label>
                  <label style={s.label}>
                    Savings (%)
                    <input
                      className="input"
                      type="number"
                      min="0"
                      max="100"
                      value={savingsPercent}
                      onChange={(e) => setSavingsPercent(e.target.value)}
                    />
                  </label>
                </div>

                <div style={s.calcBox}>
                  <p>PF Amount: Rs {toMoney(pfAmount)}</p>
                  <p>Savings Amount: Rs {toMoney(savingsAmount)}</p>
                  <p>Net Monthly Salary: Rs {toMoney(netMonthly)}</p>
                  <p>Net Yearly Salary: Rs {toMoney(netYearly)}</p>
                </div>

                {actionErr && <div style={s.error}>{actionErr}</div>}
                {actionMsg && <div style={s.success}>{actionMsg}</div>}

                <div style={s.actionsRow}>
                  <button
                    className="btn btn-primary"
                    disabled={savingComp || deleting}
                    onClick={onSaveCompensation}
                  >
                    {savingComp ? "Saving..." : "Save Compensation"}
                  </button>
                  <button
                    className="btn btn-danger"
                    disabled={savingComp || deleting}
                    onClick={onDeleteUser}
                  >
                    {deleting ? "Deleting..." : "Delete Employee"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Employees;

const s = {
  layout: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: "16px",
    alignItems: "start",
  },
  leftPane: { minWidth: 0 },
  rightPane: { minWidth: 0 },
  searchWrap: { marginBottom: "12px" },
  tableCard: {
    background: "var(--surface-1)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-lg)",
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "10px 12px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    background: "var(--surface-2)",
  },
  tr: { borderBottom: "1px solid var(--border)" },
  trActive: { background: "var(--surface-2)" },
  td: { padding: "10px 12px", fontSize: "13px", color: "var(--text-secondary)" },
  center: { padding: "32px", textAlign: "center", color: "var(--text-muted)" },
  panel: {
    background: "var(--surface-1)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-lg)",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  panelTitle: { fontSize: "16px", color: "var(--text-primary)", fontWeight: 700 },
  userBlock: {
    padding: "12px",
    borderRadius: "var(--r-md)",
    border: "1px solid var(--border)",
    background: "var(--surface-2)",
  },
  userName: { fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" },
  muted: { color: "var(--text-muted)", fontSize: "12px" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr", gap: "10px" },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "12px",
    color: "var(--text-muted)",
  },
  calcBox: {
    border: "1px solid var(--border)",
    borderRadius: "var(--r-md)",
    background: "var(--surface-2)",
    padding: "10px 12px",
    display: "grid",
    gap: "6px",
    fontSize: "13px",
    color: "var(--text-secondary)",
  },
  actionsRow: { display: "flex", gap: "8px", flexWrap: "wrap" },
  error: {
    padding: "10px 12px",
    border: "1px solid var(--danger-border)",
    borderRadius: "var(--r-md)",
    background: "var(--danger-dim)",
    color: "var(--danger)",
    fontSize: "13px",
  },
  success: {
    padding: "10px 12px",
    border: "1px solid var(--accent-border)",
    borderRadius: "var(--r-md)",
    background: "var(--accent-dim)",
    color: "var(--accent)",
    fontSize: "13px",
  },
};

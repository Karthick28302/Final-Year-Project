import React, { useState } from "react";
import useAuth           from "../hooks/useAuth";
import useAttendance     from "../hooks/useAttendance";
import { exportUrl }     from "../services/attendanceService";
import { formatDate, todayISO } from "../utils/formatDate";
import { calcDuration }  from "../utils/calcDuration";
import PageWrapper       from "../components/layout/PageWrapper";

/* ── Summary stat ── */
const ReportStat = ({ label, value, sub, color }) => (
  <div style={s.rStat}>
    <div style={{ ...s.rStatVal, color }}>{value}</div>
    <div style={s.rStatLabel}>{label}</div>
    {sub && <div style={s.rStatSub}>{sub}</div>}
  </div>
);

/* ── Main page ── */
const Reports = () => {
  useAuth();

  const [fromDate, setFromDate] = useState("");
  const [toDate,   setToDate]   = useState("");
  const [applied,  setApplied]  = useState({ from: null, to: null });

  const { records, loading } = useAttendance({
    from:     applied.from,
    to:       applied.to,
    interval: 0,
  });

  const handleGenerate = () => setApplied({ from: fromDate || null, to: toDate || null });
  const handleClear    = () => { setFromDate(""); setToDate(""); setApplied({ from: null, to: null }); };

  /* Compute stats */
  const totalSessions = records.length;
  const uniqueNames   = new Set(records.map((r) => r.name)).size;
  const completed     = records.filter((r) => r.logout_time);
  const avgMins = completed.length > 0
    ? Math.round(completed.reduce((acc, r) => {
        return acc + (new Date(r.logout_time) - new Date(r.login_time)) / 60000;
      }, 0) / completed.length)
    : 0;
  const avgHours = `${Math.floor(avgMins / 60)}h ${avgMins % 60}m`;

  /* Per-employee summary */
  const empMap = {};
  records.forEach((r) => {
    if (!empMap[r.name]) empMap[r.name] = { name: r.name, sessions: 0, totalMins: 0 };
    empMap[r.name].sessions++;
    if (r.logout_time) {
      empMap[r.name].totalMins += (new Date(r.logout_time) - new Date(r.login_time)) / 60000;
    }
  });
  const empSummary = Object.values(empMap).sort((a, b) => b.totalMins - a.totalMins);

  const isFiltered = applied.from || applied.to;

  return (
    <PageWrapper
      title="Reports"
      subtitle="Generate and export attendance reports"
      actions={
        <button
          className="btn btn-primary btn-sm"
          onClick={() => window.open(exportUrl({ from: fromDate || undefined, to: toDate || undefined }))}
        >
          ↓ Export Excel
        </button>
      }
    >

      {/* ── Date range picker ── */}
      <div style={s.rangeCard}>
        <div style={s.rangeHead}>
          <span style={s.rangeTitle}>Report Period</span>
          {isFiltered && (
            <span style={s.rangeActive}>
              {formatDate(applied.from)} → {formatDate(applied.to)}
            </span>
          )}
        </div>
        <div style={s.rangeBody}>
          <div style={s.rangeField}>
            <label style={s.fieldLabel}>From</label>
            <input className="input" type="date" value={fromDate} max={todayISO()} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div style={s.rangeDivider}>→</div>
          <div style={s.rangeField}>
            <label style={s.fieldLabel}>To</label>
            <input className="input" type="date" value={toDate}   max={todayISO()} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <div style={s.rangeActions}>
            <button className="btn btn-primary"   onClick={handleGenerate}>Generate Report</button>
            <button className="btn btn-secondary" onClick={handleClear}>Clear</button>
          </div>
        </div>

        {/* Quick range chips */}
        <div style={s.quickRow}>
          <span style={s.quickLabel}>Quick:</span>
          {[
            { label: "Today",      days: 0  },
            { label: "Last 7 days",days: 7  },
            { label: "Last 30 days",days:30 },
          ].map(({ label, days }) => (
            <button key={label} style={s.quickChip} onClick={() => {
              const to   = new Date();
              const from = new Date();
              from.setDate(from.getDate() - days);
              const fmt = (d) => d.toISOString().split("T")[0];
              setFromDate(fmt(from)); setToDate(fmt(to));
              setApplied({ from: fmt(from), to: fmt(to) });
            }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      {!loading && (
        <div style={s.statsGrid}>
          <ReportStat label="Total Sessions"    value={totalSessions} color="var(--info)"    />
          <ReportStat label="Unique Employees"  value={uniqueNames}   color="var(--accent)"  />
          <ReportStat label="Completed Sessions"value={completed.length} color="var(--warning)" sub={`${totalSessions > 0 ? Math.round((completed.length/totalSessions)*100) : 0}% completion rate`} />
          <ReportStat label="Avg Time in Office"value={completed.length > 0 ? avgHours : "—"} color="var(--danger)" />
        </div>
      )}

      {/* ── Per-employee table ── */}
      <div style={s.tableCard}>
        <div style={s.tableHead}>
          <span style={s.tableTitle}>Employee Summary</span>
          <span style={s.tableMeta}>
            {loading ? "Loading..." : `${empSummary.length} employee${empSummary.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        {loading ? (
          <div style={s.loaderWrap}>
            <div style={s.spinner} />
            <span style={s.loaderText}>Generating report...</span>
          </div>
        ) : empSummary.length > 0 ? (
          <table style={s.table}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["#", "Employee", "Sessions", "Total Time", "Avg / Session"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {empSummary.map((emp, i) => {
                const avgM = emp.sessions > 0 ? Math.round(emp.totalMins / emp.sessions) : 0;
                return (
                  <tr key={emp.name} style={s.tr}>
                    <td style={{ ...s.td, ...s.tdMono, color: "var(--text-muted)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td style={s.td}>
                      <div style={s.nameCell}>
                        <div style={s.nameAvatar}>{emp.name.charAt(0).toUpperCase()}</div>
                        <span style={s.nameTxt}>{emp.name}</span>
                      </div>
                    </td>
                    <td style={{ ...s.td, ...s.tdMono }}>{emp.sessions}</td>
                    <td style={{ ...s.td, ...s.tdMono, color: "var(--accent)", fontWeight: 500 }}>
                      {emp.totalMins > 0
                        ? `${Math.floor(emp.totalMins / 60)}h ${Math.round(emp.totalMins % 60)}m`
                        : "—"}
                    </td>
                    <td style={{ ...s.td, ...s.tdMono }}>
                      {avgM > 0 ? `${Math.floor(avgM / 60)}h ${avgM % 60}m` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={s.emptyState}>
            <span style={{ fontSize: "32px", color: "var(--text-muted)", opacity: 0.4 }}>⊟</span>
            <p style={s.emptyTitle}>No data for this period</p>
            <p style={s.emptyDesc}>
              {isFiltered ? "Try a different date range." : "Select a date range and click Generate Report."}
            </p>
          </div>
        )}
      </div>

    </PageWrapper>
  );
};

export default Reports;

const s = {
  /* Range card */
  rangeCard:    { background:"var(--surface-1)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", padding:"20px 22px" },
  rangeHead:    { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px" },
  rangeTitle:   { fontFamily:"var(--font-display)", fontSize:"14px", fontWeight:"700", color:"var(--text-primary)" },
  rangeActive:  { fontFamily:"var(--font-mono)", fontSize:"11.5px", color:"var(--accent)", padding:"3px 10px", background:"var(--accent-dim)", border:"1px solid var(--accent-border)", borderRadius:"var(--r-pill)" },
  rangeBody:    { display:"flex", gap:"12px", flexWrap:"wrap", alignItems:"flex-end" },
  rangeField:   { display:"flex", flexDirection:"column", gap:"5px", flex:1, minWidth:"150px" },
  rangeDivider: { fontFamily:"var(--font-mono)", fontSize:"18px", color:"var(--text-muted)", paddingBottom:"6px", alignSelf:"flex-end" },
  rangeActions: { display:"flex", gap:"8px", alignSelf:"flex-end" },
  fieldLabel:   { fontFamily:"var(--font-display)", fontSize:"10.5px", fontWeight:"600", letterSpacing:"0.07em", textTransform:"uppercase", color:"var(--text-muted)" },
  quickRow:     { display:"flex", alignItems:"center", gap:"8px", marginTop:"14px", paddingTop:"14px", borderTop:"1px solid var(--border)", flexWrap:"wrap" },
  quickLabel:   { fontFamily:"var(--font-display)", fontSize:"10.5px", fontWeight:"600", letterSpacing:"0.06em", textTransform:"uppercase", color:"var(--text-muted)" },
  quickChip:    { background:"var(--surface-2)", border:"1px solid var(--border)", borderRadius:"var(--r-pill)", padding:"4px 12px", fontSize:"12px", color:"var(--text-secondary)", cursor:"pointer", fontFamily:"var(--font-body)", transition:"all 0.15s" },

  /* Stats grid */
  statsGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px,1fr))", gap:"14px" },
  rStat:     { background:"var(--surface-1)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", padding:"18px 20px", display:"flex", flexDirection:"column", gap:"4px" },
  rStatVal:  { fontFamily:"var(--font-display)", fontSize:"34px", fontWeight:"800", lineHeight:1 },
  rStatLabel:{ fontFamily:"var(--font-display)", fontSize:"11px", fontWeight:"600", letterSpacing:"0.07em", textTransform:"uppercase", color:"var(--text-muted)", marginTop:"6px" },
  rStatSub:  { fontFamily:"var(--font-mono)", fontSize:"11px", color:"var(--text-muted)" },

  /* Table */
  tableCard:  { background:"var(--surface-1)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", overflow:"hidden" },
  tableHead:  { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", borderBottom:"1px solid var(--border)" },
  tableTitle: { fontFamily:"var(--font-display)", fontWeight:"700", fontSize:"14px", color:"var(--text-primary)" },
  tableMeta:  { fontFamily:"var(--font-mono)", fontSize:"11px", color:"var(--text-muted)" },
  table:      { width:"100%", borderCollapse:"collapse" },
  th:         { padding:"10px 16px", textAlign:"left", fontFamily:"var(--font-display)", fontSize:"10.5px", fontWeight:"600", letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--text-muted)", background:"var(--surface-2)", whiteSpace:"nowrap" },
  tr:         { borderBottom:"1px solid var(--border)", transition:"background 0.12s" },
  td:         { padding:"12px 16px", fontSize:"13.5px", color:"var(--text-secondary)", verticalAlign:"middle" },
  tdMono:     { fontFamily:"var(--font-mono)", fontSize:"12.5px" },
  nameCell:   { display:"flex", alignItems:"center", gap:"10px" },
  nameAvatar: { width:"30px", height:"30px", borderRadius:"8px", background:"var(--accent-dim)", border:"1px solid var(--accent-border)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--accent)", fontFamily:"var(--font-display)", fontWeight:"700", fontSize:"12px", flexShrink:0 },
  nameTxt:    { fontWeight:"600", color:"var(--text-primary)", textTransform:"capitalize" },

  /* Loader */
  loaderWrap: { display:"flex", flexDirection:"column", alignItems:"center", padding:"50px", gap:"14px" },
  spinner:    { width:"24px", height:"24px", border:"2px solid var(--border)", borderTop:"2px solid var(--accent)", borderRadius:"50%", animation:"spin 0.65s linear infinite" },
  loaderText: { fontSize:"13px", color:"var(--text-muted)", fontFamily:"var(--font-mono)" },

  /* Empty */
  emptyState: { display:"flex", flexDirection:"column", alignItems:"center", padding:"60px 24px", textAlign:"center", gap:"8px" },
  emptyTitle: { fontFamily:"var(--font-display)", fontSize:"15px", fontWeight:"700", color:"var(--text-secondary)" },
  emptyDesc:  { fontSize:"12.5px", color:"var(--text-muted)", maxWidth:"260px", lineHeight:1.6 },
};

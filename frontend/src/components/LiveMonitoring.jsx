import React, { useState } from "react";
import useAuth            from "../hooks/useAuth";
import useAttendance      from "../hooks/useAttendance";
import { videoFeedUrl }   from "../services/cameraService";
import PageWrapper        from "../components/layout/PageWrapper";

/* ── Camera feed component ── */
const LiveFeed = () => {
  const [status,   setStatus]  = useState("connecting");
  const [retryKey, setRetry]   = useState(0);

  return (
    <div style={s.cameraWrap}>
      {/* Status pill */}
      <div style={s.statusPill}>
        <span style={{
          ...s.dot,
          background: status === "live"  ? "var(--accent)"
                    : status === "error" ? "var(--danger)"
                    : "var(--warning)",
          boxShadow: status === "live" ? "0 0 8px var(--accent)" : "none",
          animation: status === "live" ? "pulse-dot 2s ease infinite" : "none",
        }} />
        <span style={s.statusText}>
          {status === "live"  ? "Live · Face Recognition Active"
         : status === "error" ? "Stream Disconnected"
         : "Connecting to camera..."}
        </span>
        {status === "error" && (
          <button style={s.retryBtn}
            onClick={() => { setStatus("connecting"); setRetry(k => k + 1); }}>
            ↻ Retry
          </button>
        )}
      </div>

      {/* Loading state */}
      {status !== "live" && status !== "error" && (
        <div style={s.camPlaceholder}>
          <div style={s.scanLine} />
          <div style={{ textAlign: "center", zIndex: 2 }}>
            <div style={s.camPulse}>◉</div>
            <p style={s.camMsg}>Initialising recognition stream...</p>
            <p style={s.camSub}>Ensure backend is running on port 5000</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div style={s.camError}>
          <span style={{ fontSize: "36px", color: "var(--danger)" }}>⊗</span>
          <p style={s.camErrTitle}>Camera unavailable</p>
          <p style={s.camErrSub}>Start the backend server and retry</p>
        </div>
      )}

      {/* Stream */}
      <img
        key={retryKey}
        src={videoFeedUrl("view=live-monitoring")}
        alt="Live recognition feed"
        style={{ ...s.streamImg, display: status === "live" ? "block" : "none" }}
        onLoad={()  => setStatus("live")}
        onError={() => setStatus("error")}
      />

      {/* Corner brackets */}
      {[
        { top:"10px",    left:"10px",  borderTop:"2px solid var(--accent)", borderLeft:"2px solid var(--accent)"  },
        { top:"10px",    right:"10px", borderTop:"2px solid var(--accent)", borderRight:"2px solid var(--accent)" },
        { bottom:"10px", left:"10px",  borderBottom:"2px solid var(--accent)", borderLeft:"2px solid var(--accent)"  },
        { bottom:"10px", right:"10px", borderBottom:"2px solid var(--accent)", borderRight:"2px solid var(--accent)" },
      ].map((c, i) => (
        <div key={i} style={{ position:"absolute", width:"14px", height:"14px", pointerEvents:"none", ...c }} />
      ))}

      {/* Live label */}
      {status === "live" && (
        <div style={s.livePill}>
          <span style={s.liveDot} /> LIVE
        </div>
      )}
    </div>
  );
};

/* ── Presence card ── */
const PresenceCard = ({ records, loading }) => {
  const present = records.filter((r) => !r.logout_time);
  return (
    <div style={s.presenceCard}>
      <div style={s.presenceHead}>
        <span style={s.presenceTitle}>In Office Now</span>
        <span style={s.presenceCount}>{present.length}</span>
      </div>
      <div style={s.presenceList}>
        {loading ? (
          <div style={{ padding: "24px", display: "flex", justifyContent: "center" }}>
            <div style={s.spinner} />
          </div>
        ) : present.length > 0 ? (
          present.map((r, i) => (
            <div key={i} style={s.presenceItem}>
              <div style={s.pAvatar}>{r.name.charAt(0).toUpperCase()}</div>
              <div style={s.pInfo}>
                <span style={s.pName}>{r.name}</span>
                <span style={s.pTime}>
                  Since {new Date(r.login_time).toLocaleTimeString("en-IN", {
                    hour: "2-digit", minute: "2-digit", hour12: true,
                  })}
                </span>
              </div>
              <span style={s.presentBadge}>
                <span style={{ fontSize: "7px" }}>●</span> Present
              </span>
            </div>
          ))
        ) : (
          <div style={s.emptyPresence}>
            <span style={{ fontSize: "28px", color: "var(--text-muted)", opacity: 0.4 }}>◎</span>
            <p style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "8px" }}>
              No one detected yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Stats row ── */
const StatsRow = ({ records, stats }) => {
  const items = [
    { label: "Currently In",   value: stats.currently_present ?? 0, color: "var(--accent)"  },
    { label: "Left Today",     value: records.filter(r => r.logout_time).length, color: "var(--danger)"  },
    { label: "Total Today",    value: stats.total_today ?? 0,        color: "var(--info)"    },
  ];
  return (
    <div style={s.statsRow}>
      {items.map(({ label, value, color }) => (
        <div key={label} style={s.statItem}>
          <span style={{ ...s.statVal, color }}>{value}</span>
          <span style={s.statLabel}>{label}</span>
        </div>
      ))}
    </div>
  );
};

/* ── Main page ── */
const LiveMonitoring = () => {
  useAuth();
  const { records, stats, loading } = useAttendance({ interval: 3000 });

  return (
    <PageWrapper
      title="Live Monitoring"
      subtitle="Real-time face recognition and attendance tracking"
      actions={
        <div style={s.liveBadge}>
          <span style={s.liveBadgeDot} />
          <span style={s.liveBadgeText}>Recognition Active</span>
        </div>
      }
    >
      {/* Stats row */}
      <StatsRow records={records} stats={stats} />

      {/* Main grid */}
      <div style={s.grid}>
        {/* Camera */}
        <div style={s.cameraCard}>
          <div style={s.cardHead}>
            <span style={s.cardTitle}>Camera Feed</span>
            <span style={s.cardMeta}>127.0.0.1:5000/video_feed</span>
          </div>
          <LiveFeed />
        </div>

        {/* Right column */}
        <div style={s.rightCol}>
          <PresenceCard records={records} loading={loading} />

          {/* Recent log */}
          <div style={s.logCard}>
            <div style={s.cardHead}>
              <span style={s.cardTitle}>Detection Log</span>
              <span style={s.cardMeta}>Last 5 events</span>
            </div>
            <div style={s.logList}>
              {records.slice(0, 5).map((r, i) => (
                <div key={i} style={s.logItem}>
                  <div style={{
                    ...s.logDot,
                    background: r.logout_time ? "var(--danger)" : "var(--accent)",
                    boxShadow:  r.logout_time ? "0 0 6px var(--danger)" : "0 0 6px var(--accent)",
                  }} />
                  <div style={s.logInfo}>
                    <span style={s.logName}>{r.name}</span>
                    <span style={s.logEvent}>
                      {r.logout_time ? "Checked out" : "Checked in"}
                    </span>
                  </div>
                  <span style={s.logTime}>
                    {new Date(r.login_time).toLocaleTimeString("en-IN", {
                      hour: "2-digit", minute: "2-digit", hour12: true,
                    })}
                  </span>
                </div>
              ))}
              {!loading && records.length === 0 && (
                <p style={{ color: "var(--text-muted)", fontSize: "12px", padding: "16px", textAlign: "center" }}>
                  No events yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default LiveMonitoring;

const s = {
  /* Live badge */
  liveBadge:     { display:"flex", alignItems:"center", gap:"7px", padding:"6px 14px", background:"var(--accent-dim)", border:"1px solid var(--accent-border)", borderRadius:"var(--r-pill)" },
  liveBadgeDot:  { width:"7px", height:"7px", borderRadius:"50%", background:"var(--accent)", boxShadow:"0 0 8px var(--accent)", display:"inline-block", animation:"pulse-dot 1.8s ease infinite" },
  liveBadgeText: { fontFamily:"var(--font-mono)", fontSize:"11px", color:"var(--accent)" },

  /* Stats row */
  statsRow:  { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px" },
  statItem:  { background:"var(--surface-1)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", padding:"18px 20px", display:"flex", flexDirection:"column", gap:"6px" },
  statVal:   { fontFamily:"var(--font-display)", fontSize:"36px", fontWeight:"800", lineHeight:1 },
  statLabel: { fontFamily:"var(--font-display)", fontSize:"11px", fontWeight:"600", letterSpacing:"0.07em", textTransform:"uppercase", color:"var(--text-muted)" },

  /* Grid */
  grid:       { display:"grid", gridTemplateColumns:"1fr 300px", gap:"20px", alignItems:"start" },
  cameraCard: { background:"var(--surface-1)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", overflow:"hidden" },
  rightCol:   { display:"flex", flexDirection:"column", gap:"16px" },

  /* Card head */
  cardHead:  { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 18px", borderBottom:"1px solid var(--border)" },
  cardTitle: { fontFamily:"var(--font-display)", fontWeight:"700", fontSize:"14px", color:"var(--text-primary)" },
  cardMeta:  { fontFamily:"var(--font-mono)", fontSize:"10.5px", color:"var(--text-muted)" },

  /* Camera */
  cameraWrap:    { position:"relative", background:"#020810", minHeight:"400px", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" },
  statusPill:    { position:"absolute", top:"12px", left:"50%", transform:"translateX(-50%)", display:"flex", alignItems:"center", gap:"7px", background:"rgba(0,0,0,0.72)", backdropFilter:"blur(10px)", padding:"5px 14px", borderRadius:"var(--r-pill)", border:"1px solid var(--border)", zIndex:10, whiteSpace:"nowrap" },
  dot:           { width:"7px", height:"7px", borderRadius:"50%", flexShrink:0 },
  statusText:    { fontFamily:"var(--font-mono)", fontSize:"11px", color:"var(--text-secondary)" },
  retryBtn:      { background:"var(--danger-dim)", color:"var(--danger)", border:"none", padding:"2px 8px", borderRadius:"4px", fontSize:"11px", cursor:"pointer", fontFamily:"var(--font-body)" },
  camPlaceholder:{ width:"100%", height:"400px", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" },
  scanLine:      { position:"absolute", left:0, width:"100%", height:"2px", background:"linear-gradient(90deg, transparent, var(--accent), transparent)", opacity:0.3, animation:"scan-line 3s linear infinite", zIndex:1 },
  camPulse:      { fontSize:"44px", color:"rgba(0,212,168,0.22)", animation:"glow-pulse 2.5s ease infinite", zIndex:2 },
  camMsg:        { color:"var(--text-muted)", fontSize:"13px", marginTop:"10px", zIndex:2 },
  camSub:        { color:"var(--text-muted)", fontSize:"11px", marginTop:"4px", zIndex:2 },
  camError:      { display:"flex", flexDirection:"column", alignItems:"center", padding:"60px 24px", textAlign:"center" },
  camErrTitle:   { color:"var(--danger)", fontWeight:600, fontSize:"14px", marginTop:"12px" },
  camErrSub:     { color:"var(--text-muted)", fontSize:"12px", marginTop:"4px" },
  streamImg:     { width:"100%", minHeight:"400px", objectFit:"cover", display:"block" },
  livePill:      { position:"absolute", bottom:"12px", left:"12px", display:"flex", alignItems:"center", gap:"6px", background:"rgba(0,0,0,0.75)", backdropFilter:"blur(10px)", padding:"4px 12px", borderRadius:"var(--r-pill)", border:"1px solid var(--border)", fontFamily:"var(--font-mono)", fontSize:"10px", color:"var(--text-secondary)", zIndex:5 },
  liveDot:       { width:"6px", height:"6px", borderRadius:"50%", background:"var(--danger)", boxShadow:"0 0 6px var(--danger)", display:"inline-block", animation:"pulse-dot 1.2s ease infinite" },

  /* Presence card */
  presenceCard:  { background:"var(--surface-1)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", overflow:"hidden" },
  presenceHead:  { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 18px", borderBottom:"1px solid var(--border)" },
  presenceTitle: { fontFamily:"var(--font-display)", fontWeight:"700", fontSize:"14px", color:"var(--text-primary)" },
  presenceCount: { fontFamily:"var(--font-display)", fontWeight:"800", fontSize:"20px", color:"var(--accent)" },
  presenceList:  { display:"flex", flexDirection:"column" },
  presenceItem:  { display:"flex", alignItems:"center", gap:"10px", padding:"10px 16px", borderBottom:"1px solid var(--border)", transition:"background 0.12s" },
  pAvatar:       { width:"32px", height:"32px", borderRadius:"8px", background:"var(--accent-dim)", border:"1px solid var(--accent-border)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--accent)", fontFamily:"var(--font-display)", fontWeight:"700", fontSize:"13px", flexShrink:0 },
  pInfo:         { flex:1, display:"flex", flexDirection:"column", gap:"2px", overflow:"hidden" },
  pName:         { fontSize:"13px", fontWeight:"600", color:"var(--text-primary)", textTransform:"capitalize", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" },
  pTime:         { fontFamily:"var(--font-mono)", fontSize:"10.5px", color:"var(--text-muted)" },
  presentBadge:  { display:"inline-flex", alignItems:"center", gap:"5px", padding:"2px 8px", background:"var(--accent-dim)", color:"var(--accent)", border:"1px solid var(--accent-border)", borderRadius:"var(--r-pill)", fontSize:"11px", fontWeight:"500", flexShrink:0 },
  emptyPresence: { display:"flex", flexDirection:"column", alignItems:"center", padding:"32px 16px", textAlign:"center" },

  /* Log card */
  logCard: { background:"var(--surface-1)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", overflow:"hidden" },
  logList: { display:"flex", flexDirection:"column" },
  logItem: { display:"flex", alignItems:"center", gap:"10px", padding:"10px 16px", borderBottom:"1px solid var(--border)", transition:"background 0.12s" },
  logDot:  { width:"8px", height:"8px", borderRadius:"50%", flexShrink:0 },
  logInfo: { flex:1, display:"flex", flexDirection:"column", gap:"2px", overflow:"hidden" },
  logName: { fontSize:"12.5px", fontWeight:"600", color:"var(--text-primary)", textTransform:"capitalize" },
  logEvent:{ fontSize:"11px", color:"var(--text-muted)" },
  logTime: { fontFamily:"var(--font-mono)", fontSize:"10.5px", color:"var(--text-muted)", flexShrink:0 },

  /* Spinner */
  spinner: { width:"22px", height:"22px", border:"2px solid var(--border)", borderTop:"2px solid var(--accent)", borderRadius:"50%", animation:"spin 0.65s linear infinite" },
};

import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import PageWrapper from "../components/layout/PageWrapper";

/* ── Section wrapper ── */
const Section = ({ title, desc, children }) => (
  <div style={s.section}>
    <div style={s.sectionHead}>
      <div>
        <p style={s.sectionTitle}>{title}</p>
        {desc && <p style={s.sectionDesc}>{desc}</p>}
      </div>
    </div>
    <div style={s.sectionBody}>{children}</div>
  </div>
);

/* ── Setting row ── */
const SettingRow = ({ label, desc, children }) => (
  <div style={s.settingRow}>
    <div style={s.settingInfo}>
      <p style={s.settingLabel}>{label}</p>
      {desc && <p style={s.settingDesc}>{desc}</p>}
    </div>
    <div style={s.settingControl}>{children}</div>
  </div>
);

/* ── Toggle switch ── */
const Toggle = ({ checked, onChange }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    style={{
      ...s.toggle,
      background: checked ? "var(--accent)" : "var(--surface-3)",
    }}
  >
    <span style={{ ...s.toggleThumb, transform: checked ? "translateX(18px)" : "translateX(2px)" }} />
  </button>
);

/* ── Main page ── */
const Settings = () => {
  useAuth();

  const [settings, setSettings] = useState({
    logoutDelay:      5,
    autoRefresh:      true,
    refreshInterval:  5,
    darkMode:         true,
    notifications:    false,
    logUnknown:       false,
    backendUrl:       "http://127.0.0.1:5000",
    tolerance:        0.6,
  });

  const [saved, setSaved] = useState(false);

  const update = (key, val) => setSettings((prev) => ({ ...prev, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <PageWrapper
      title="Settings"
      subtitle="Configure system behaviour and preferences"
      actions={
        <button className="btn btn-primary btn-sm" onClick={handleSave}>
          {saved ? "✓ Saved" : "Save Changes"}
        </button>
      }
    >

      {saved && (
        <div style={s.savedBanner}>
          <span>✓</span> Settings saved successfully
        </div>
      )}

      {/* ── Recognition ── */}
      <Section
        title="Face Recognition"
        desc="Configure the face recognition engine behaviour"
      >
        <SettingRow
          label="Logout delay"
          desc="Seconds before auto-logout when face disappears from frame"
        >
          <div style={s.numberWrap}>
            <input
              className="input"
              style={{ width: "80px", textAlign: "center", fontFamily: "var(--font-mono)" }}
              type="number"
              min={1} max={60}
              value={settings.logoutDelay}
              onChange={(e) => update("logoutDelay", Number(e.target.value))}
            />
            <span style={s.unit}>seconds</span>
          </div>
        </SettingRow>

        <SettingRow
          label="Recognition tolerance"
          desc="Lower = stricter matching. Default 0.6 works for most cases"
        >
          <div style={s.sliderWrap}>
            <input
              type="range"
              min={0.3} max={0.9} step={0.05}
              value={settings.tolerance}
              onChange={(e) => update("tolerance", Number(e.target.value))}
              style={s.slider}
            />
            <span style={s.sliderVal}>{settings.tolerance.toFixed(2)}</span>
          </div>
        </SettingRow>

        <SettingRow
          label="Log unknown faces"
          desc="Record detection attempts for faces that don't match any employee"
        >
          <Toggle checked={settings.logUnknown} onChange={(v) => update("logUnknown", v)} />
        </SettingRow>
      </Section>

      {/* ── Dashboard ── */}
      <Section
        title="Dashboard"
        desc="Control how the dashboard displays and updates"
      >
        <SettingRow
          label="Auto-refresh"
          desc="Automatically poll attendance data at a set interval"
        >
          <Toggle checked={settings.autoRefresh} onChange={(v) => update("autoRefresh", v)} />
        </SettingRow>

        <SettingRow
          label="Refresh interval"
          desc="How often to poll for new attendance data (seconds)"
        >
          <div style={s.numberWrap}>
            <input
              className="input"
              style={{ width: "80px", textAlign: "center", fontFamily: "var(--font-mono)", opacity: settings.autoRefresh ? 1 : 0.4 }}
              type="number"
              min={1} max={60}
              value={settings.refreshInterval}
              onChange={(e) => update("refreshInterval", Number(e.target.value))}
              disabled={!settings.autoRefresh}
            />
            <span style={s.unit}>seconds</span>
          </div>
        </SettingRow>
      </Section>

      {/* ── Connection ── */}
      <Section
        title="Backend Connection"
        desc="URL of the Flask backend server"
      >
        <SettingRow
          label="Backend API URL"
          desc="Change if running the backend on a different host or port"
        >
          <div style={s.urlWrap}>
            <input
              className="input"
              style={{ minWidth: "280px", fontFamily: "var(--font-mono)", fontSize: "13px" }}
              type="text"
              value={settings.backendUrl}
              onChange={(e) => update("backendUrl", e.target.value)}
              placeholder="http://127.0.0.1:5000"
            />
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => window.open(settings.backendUrl + "/")}
            >
              Test
            </button>
          </div>
        </SettingRow>
      </Section>

      {/* ── Appearance ── */}
      <Section
        title="Appearance"
        desc="Interface preferences"
      >
        <SettingRow
          label="Dark mode"
          desc="Use dark theme across the application"
        >
          <Toggle checked={settings.darkMode} onChange={(v) => update("darkMode", v)} />
        </SettingRow>

        <SettingRow
          label="Desktop notifications"
          desc="Show browser notifications when attendance is marked"
        >
          <Toggle checked={settings.notifications} onChange={(v) => update("notifications", v)} />
        </SettingRow>
      </Section>

      {/* ── Danger zone ── */}
      <div style={s.dangerZone}>
        <div style={s.dangerHead}>
          <p style={s.dangerTitle}>Danger Zone</p>
          <p style={s.dangerDesc}>These actions are irreversible. Proceed with caution.</p>
        </div>
        <div style={s.dangerActions}>
          <div style={s.dangerItem}>
            <div>
              <p style={s.dangerItemTitle}>Clear all encodings</p>
              <p style={s.dangerItemDesc}>Deletes all saved face encodings. Employees must be re-registered.</p>
            </div>
            <button className="btn btn-danger btn-sm">Clear Encodings</button>
          </div>
          <div style={s.dangerItem}>
            <div>
              <p style={s.dangerItemTitle}>Reset attendance records</p>
              <p style={s.dangerItemDesc}>Permanently deletes all attendance history from the database.</p>
            </div>
            <button className="btn btn-danger btn-sm">Reset Records</button>
          </div>
        </div>
      </div>

    </PageWrapper>
  );
};

export default Settings;

const s = {
  savedBanner: { display:"flex", alignItems:"center", gap:"8px", padding:"11px 16px", background:"var(--accent-dim)", border:"1px solid var(--accent-border)", borderRadius:"var(--r-md)", color:"var(--accent)", fontSize:"13.5px", fontWeight:"500" },

  /* Section */
  section:     { background:"var(--surface-1)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", overflow:"hidden" },
  sectionHead: { padding:"18px 22px", borderBottom:"1px solid var(--border)", background:"var(--surface-2)" },
  sectionTitle:{ fontFamily:"var(--font-display)", fontWeight:"700", fontSize:"14px", color:"var(--text-primary)" },
  sectionDesc: { fontSize:"12.5px", color:"var(--text-muted)", marginTop:"3px" },
  sectionBody: { display:"flex", flexDirection:"column" },

  /* Setting row */
  settingRow:    { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 22px", borderBottom:"1px solid var(--border)", gap:"24px", flexWrap:"wrap" },
  settingInfo:   { flex:1, minWidth:"200px" },
  settingLabel:  { fontSize:"14px", fontWeight:"500", color:"var(--text-primary)", marginBottom:"3px" },
  settingDesc:   { fontSize:"12px", color:"var(--text-muted)", lineHeight:1.5 },
  settingControl:{ flexShrink:0 },

  /* Toggle */
  toggle:      { width:"38px", height:"22px", borderRadius:"var(--r-pill)", border:"none", cursor:"pointer", position:"relative", transition:"background 0.2s", padding:0, display:"flex", alignItems:"center" },
  toggleThumb: { position:"absolute", width:"16px", height:"16px", borderRadius:"50%", background:"#fff", transition:"transform 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.3)" },

  /* Number input */
  numberWrap: { display:"flex", alignItems:"center", gap:"8px" },
  unit:       { fontFamily:"var(--font-mono)", fontSize:"12px", color:"var(--text-muted)" },

  /* Slider */
  sliderWrap: { display:"flex", alignItems:"center", gap:"10px" },
  slider:     { accentColor:"var(--accent)", width:"140px", cursor:"pointer" },
  sliderVal:  { fontFamily:"var(--font-mono)", fontSize:"13px", color:"var(--accent)", minWidth:"36px" },

  /* URL row */
  urlWrap: { display:"flex", gap:"8px", alignItems:"center", flexWrap:"wrap" },

  /* Danger zone */
  dangerZone:      { background:"var(--surface-1)", border:"1px solid var(--danger-border)", borderRadius:"var(--r-lg)", overflow:"hidden" },
  dangerHead:      { padding:"16px 22px", borderBottom:"1px solid var(--danger-border)", background:"var(--danger-dim)" },
  dangerTitle:     { fontFamily:"var(--font-display)", fontWeight:"700", fontSize:"14px", color:"var(--danger)" },
  dangerDesc:      { fontSize:"12px", color:"var(--danger)", opacity:0.75, marginTop:"3px" },
  dangerActions:   { display:"flex", flexDirection:"column" },
  dangerItem:      { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 22px", borderBottom:"1px solid var(--border)", gap:"20px", flexWrap:"wrap" },
  dangerItemTitle: { fontSize:"14px", fontWeight:"500", color:"var(--text-primary)", marginBottom:"3px" },
  dangerItemDesc:  { fontSize:"12px", color:"var(--text-muted)", lineHeight:1.5 },
};

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { to: "/dashboard",  label: "Dashboard",  icon: "📊" },
  { to: "/employees",  label: "Employees",  icon: "👥" },
  { to: "/register",   label: "Register",   icon: "📸" },
  { to: "/attendance", label: "Attendance", icon: "📋" },
  { to: "/camera",     label: "Camera",     icon: "🎥" },
];

const Sidebar = () => {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  const logout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>Smart Attendance</h2>

      <nav style={{ flex: 1 }}>
        {NAV_LINKS.map(({ to, label, icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              style={{
                ...styles.link,
                background:  active ? "rgba(255,255,255,0.15)" : "transparent",
                borderLeft:  active ? "3px solid #fff" : "3px solid transparent",
                fontWeight:  active ? 600 : 400,
              }}
            >
              <span style={styles.icon}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      <button onClick={logout} style={styles.logout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;

const styles = {
  sidebar: {
    width:          "220px",
    height:         "100vh",
    background:     "#1e293b",
    color:          "white",
    display:        "flex",
    flexDirection:  "column",
    padding:        "24px 16px",
    position:       "fixed",
    boxSizing:      "border-box",
  },
  logo: {
    fontSize:      "15px",
    fontWeight:    700,
    marginBottom:  "32px",
    color:         "#fff",
    letterSpacing: "0.03em",
  },
  link: {
    color:          "rgba(255,255,255,0.85)",
    textDecoration: "none",
    marginBottom:   "6px",
    padding:        "10px 12px",
    borderRadius:   "6px",
    display:        "flex",
    alignItems:     "center",
    fontSize:       "14px",
    transition:     "background 0.15s",
  },
  icon: {
    marginRight: "10px",
    fontSize:    "16px",
  },
  logout: {
    padding:      "10px",
    background:   "#dc2626",
    color:        "white",
    border:       "none",
    borderRadius: "8px",
    cursor:       "pointer",
    fontWeight:   600,
    fontSize:     "14px",
    marginTop:    "auto",
  },
};

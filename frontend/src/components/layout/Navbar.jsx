import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div style={styles.nav}>
      <h2 style={{ color: "white" }}>🎯 Smart Attendance</h2>

      <div>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/register" style={styles.link}>Register</Link>
        <Link to="/attendance" style={styles.link}>Attendance</Link>
        <Link to="/camera" style={styles.link}>Camera</Link>
      </div>
    </div>
  );
};

export default Navbar;

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    background: "#1e293b",
  },
  link: {
    color: "white",
    marginLeft: "15px",
    textDecoration: "none",
  },
};
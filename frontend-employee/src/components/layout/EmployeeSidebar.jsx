import React from "react";
import { Link } from "react-router-dom";

const EmployeeSidebar = ({ onLogout }) => {
  return (
    <aside style={{ minWidth: 220, padding: 16, borderRight: "1px solid #ddd" }}>
      <h3>Employee Panel</h3>
      <nav style={{ display: "grid", gap: 8 }}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/attendance">Attendance</Link>
        <Link to="/salary">Salary</Link>
        <Link to="/events">Events</Link>
        <Link to="/holidays">Holidays</Link>
      </nav>
      <button style={{ marginTop: 16 }} onClick={onLogout} type="button">
        Logout
      </button>
    </aside>
  );
};

export default EmployeeSidebar;

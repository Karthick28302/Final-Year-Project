import React from "react";

const Dashboard = ({ employee }) => {
  return (
    <div className="page">
      <h2 className="page-title">Dashboard</h2>
      <div className="card" style={{ marginBottom: 12 }}>
        <p style={{ marginTop: 0 }}>Welcome {employee?.fullName || employee?.employeeCode || "Employee"}</p>
        <p style={{ marginBottom: 0 }}>Use the left menu to view profile, attendance, salary, events, and holidays.</p>
      </div>
      <div className="dashboard-grid">
        <div className="card">
          <p className="kpi-title">Employee Code</p>
          <p className="kpi-value">{employee?.employeeCode || "-"}</p>
        </div>
        <div className="card">
          <p className="kpi-title">Role</p>
          <p className="kpi-value">{employee?.role || "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

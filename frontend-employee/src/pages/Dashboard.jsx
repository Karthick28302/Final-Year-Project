import React from "react";

const Dashboard = ({ employee }) => {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome {employee?.fullName || employee?.employeeCode || "Employee"}</p>
      <p>Use the left menu to view profile, attendance, salary, events, and holidays.</p>
    </div>
  );
};

export default Dashboard;

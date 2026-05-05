import React, { useEffect, useState } from "react";
import Loader from "../components/common/Loader";
import { getMyAttendance } from "../services/employeeService";
import { formatDate } from "../utils/dateFormat";

const MyAttendance = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setError("");
        const response = await getMyAttendance();
        setRows(response);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load attendance.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const getStatusClass = (status) => {
    const value = (status || "").toLowerCase();
    if (value === "present") return "pill pill-present";
    if (value === "absent") return "pill pill-absent";
    return "pill pill-default";
  };

  return (
    <div className="page">
      <h2 className="page-title">My Attendance</h2>
      <div className="card table-wrap">
        {loading ? (
          <div className="loading-wrap">
            <Loader message="Loading attendance..." />
          </div>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : rows.length === 0 ? (
          <p className="empty-text">No attendance records found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Login Time</th>
                <th>Logout Time</th>
                <th>Total Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{formatDate(row.work_date)}</td>
                  <td>{row.login_time ? new Date(row.login_time).toLocaleTimeString("en-IN") : "-"}</td>
                  <td>{row.logout_time ? new Date(row.logout_time).toLocaleTimeString("en-IN") : "-"}</td>
                  <td>{row.total_hours ?? "-"}</td>
                  <td>
                    <span className={getStatusClass(row.status)}>{row.status || "-"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyAttendance;

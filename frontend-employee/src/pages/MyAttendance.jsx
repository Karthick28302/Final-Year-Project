import React, { useEffect, useState } from "react";
import Loader from "../components/common/Loader";
import { getMyAttendance } from "../services/employeeService";
import { formatDate } from "../utils/dateFormat";

const MyAttendance = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));

  const fetchAttendance = async (filters = {}) => {
    try {
      setLoading(true);
      setError("");
      const response = await getMyAttendance(filters);
      setRows(response);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load attendance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance({ month, year });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusClass = (status) => {
    const value = (status || "").toLowerCase();
    if (value === "present") return "pill pill-present";
    if (value === "absent") return "pill pill-absent";
    return "pill pill-default";
  };

  const handleApplyFilter = (event) => {
    event.preventDefault();
    fetchAttendance({ month, year });
  };

  const handleResetFilter = () => {
    const currentMonth = String(now.getMonth() + 1);
    const currentYear = String(now.getFullYear());
    setMonth(currentMonth);
    setYear(currentYear);
    fetchAttendance({ month: currentMonth, year: currentYear });
  };

  const yearOptions = [];
  for (let y = now.getFullYear(); y >= now.getFullYear() - 5; y -= 1) {
    yearOptions.push(String(y));
  }

  return (
    <div className="page">
      <h2 className="page-title">My Attendance</h2>
      <div className="card" style={{ marginBottom: 12 }}>
        <form onSubmit={handleApplyFilter} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <label htmlFor="attendance-month">Month</label>
          <select id="attendance-month" value={month} onChange={(e) => setMonth(e.target.value)}>
            {Array.from({ length: 12 }, (_, index) => String(index + 1)).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <label htmlFor="attendance-year">Year</label>
          <select id="attendance-year" value={year} onChange={(e) => setYear(e.target.value)}>
            {yearOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <button type="submit">Apply</button>
          <button type="button" onClick={handleResetFilter}>
            Reset
          </button>
        </form>
      </div>
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

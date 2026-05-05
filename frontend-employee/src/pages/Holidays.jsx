import React, { useEffect, useState } from "react";
import Loader from "../components/common/Loader";
import { getMyHolidays } from "../services/employeeService";
import { formatDate } from "../utils/dateFormat";

const Holidays = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        setError("");
        const response = await getMyHolidays();
        setRows(response);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load holidays.");
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  return (
    <div className="page">
      <h2 className="page-title">Holidays</h2>
      <div className="card table-wrap">
        {loading ? (
          <div className="loading-wrap">
            <Loader message="Loading holidays..." />
          </div>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : rows.length === 0 ? (
          <p className="empty-text">No holidays found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Holiday Name</th>
                <th>Date</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.holiday_name}</td>
                  <td>{formatDate(row.holiday_date)}</td>
                  <td>{row.holiday_type || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Holidays;

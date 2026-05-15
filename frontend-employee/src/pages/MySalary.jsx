import React, { useEffect, useState } from "react";
import Loader from "../components/common/Loader";
import { getMySalary } from "../services/employeeService";
import { formatDate } from "../utils/dateFormat";

const MySalary = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));

  const fetchSalary = async (filters = {}) => {
    try {
      setLoading(true);
      setError("");
      const response = await getMySalary(filters);
      setRows(response);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load salary.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalary({ month, year });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  const handleApplyFilter = (event) => {
    event.preventDefault();
    fetchSalary({ month, year });
  };

  const handleResetFilter = () => {
    const currentMonth = String(now.getMonth() + 1);
    const currentYear = String(now.getFullYear());
    setMonth(currentMonth);
    setYear(currentYear);
    fetchSalary({ month: currentMonth, year: currentYear });
  };

  const yearOptions = [];
  for (let y = now.getFullYear(); y >= now.getFullYear() - 5; y -= 1) {
    yearOptions.push(String(y));
  }

  return (
    <div className="page">
      <h2 className="page-title">My Salary</h2>
      <div className="card" style={{ marginBottom: 12 }}>
        <form onSubmit={handleApplyFilter} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <label htmlFor="salary-month">Month</label>
          <select id="salary-month" value={month} onChange={(e) => setMonth(e.target.value)}>
            {Array.from({ length: 12 }, (_, index) => String(index + 1)).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <label htmlFor="salary-year">Year</label>
          <select id="salary-year" value={year} onChange={(e) => setYear(e.target.value)}>
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
            <Loader message="Loading salary..." />
          </div>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : rows.length === 0 ? (
          <p className="empty-text">No salary records found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Year</th>
                <th>Basic</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Paid On</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.month}</td>
                  <td>{row.year}</td>
                  <td>{formatCurrency(row.basic_salary)}</td>
                  <td>{formatCurrency(row.allowances)}</td>
                  <td>{formatCurrency(row.deductions)}</td>
                  <td>{formatCurrency(row.net_salary)}</td>
                  <td>{formatDate(row.paid_on)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MySalary;

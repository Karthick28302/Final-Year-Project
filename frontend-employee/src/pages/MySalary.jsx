import React, { useEffect, useState } from "react";
import Loader from "../components/common/Loader";
import { getMySalary } from "../services/employeeService";
import { formatDate } from "../utils/dateFormat";

const MySalary = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        setError("");
        const response = await getMySalary();
        setRows(response);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load salary.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalary();
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  return (
    <div className="page">
      <h2 className="page-title">My Salary</h2>
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

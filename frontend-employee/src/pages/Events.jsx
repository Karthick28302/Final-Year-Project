import React, { useEffect, useState } from "react";
import Loader from "../components/common/Loader";
import { getMyEvents } from "../services/employeeService";
import { formatDate } from "../utils/dateFormat";

const Events = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setError("");
        const response = await getMyEvents();
        setRows(response);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="page">
      <h2 className="page-title">Events</h2>
      <div className="card">
        {loading ? (
          <div className="loading-wrap">
            <Loader message="Loading events..." />
          </div>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : rows.length === 0 ? (
          <p className="empty-text">No events available.</p>
        ) : (
          <div className="event-list">
            {rows.map((row) => (
              <div className="event-item" key={row.id}>
                <h3 className="event-title">{row.title}</h3>
                <p className="event-meta">
                  {formatDate(row.event_date)}
                  {row.event_time ? `, ${row.event_time}` : ""}
                  {row.location ? ` at ${row.location}` : ""}
                </p>
                <p className="event-meta">{row.description || "No description provided."}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;

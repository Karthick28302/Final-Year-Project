import { useState, useEffect, useCallback } from "react";
import API from "../services/api";

/**
 * Fetches attendance records and polls every `interval` ms.
 * Replaces the duplicated fetch + setInterval logic in
 * Dashboard.js and Attendance.js.
 *
 * Usage:
 *   const { records, stats, loading, error, refresh } = useAttendance();
 *
 * Optional filters:
 *   const { records } = useAttendance({ from: "2026-01-01", to: "2026-01-31", interval: 5000 });
 */
function useAttendance({ from = null, to = null, interval = 5000 } = {}) {
  const [records, setRecords] = useState([]);
  const [stats, setStats]     = useState({ total_today: 0, currently_present: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchRecords = useCallback(async () => {
    try {
      const params = {};
      if (from && to) {
        params.from = from;
        params.to   = to;
      }
      const res = await API.get("/attendance", { params });
      setRecords(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to load attendance records");
      console.error("[useAttendance]", err);
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await API.get("/attendance/stats");
      setStats(res.data);
    } catch (err) {
      console.error("[useAttendance stats]", err);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
    fetchStats();

    if (!interval) return;

    const timer = setInterval(() => {
      fetchRecords();
      fetchStats();
    }, interval);

    return () => clearInterval(timer);
  }, [fetchRecords, fetchStats, interval]);

  return { records, stats, loading, error, refresh: fetchRecords };
}

export default useAttendance;
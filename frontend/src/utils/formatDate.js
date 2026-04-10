/**
 * Shared date/time formatting utilities.
 * Import these instead of calling new Date().toLocaleString() inline everywhere.
 */

/**
 * Format a datetime string or Date to a readable local date+time.
 * e.g.  "13 Apr 2026, 09:05 AM"
 */
export function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day:    "2-digit",
    month:  "short",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format a datetime string to date only.
 * e.g.  "13 Apr 2026"
 */
export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day:   "2-digit",
    month: "short",
    year:  "numeric",
  });
}

/**
 * Format a datetime string to time only.
 * e.g.  "09:05 AM"
 */
export function formatTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString("en-IN", {
    hour:   "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Return today's date as YYYY-MM-DD (for date input default values).
 */
export function todayISO() {
  return new Date().toISOString().split("T")[0];
}
/**
 * Calculate human-readable work duration from login/logout times.
 * Mirrors the backend calculate_duration() in attendance_service.py
 * so the frontend can display duration without an extra API call.
 */

/**
 * @param {string|null} loginTime  - ISO datetime string
 * @param {string|null} logoutTime - ISO datetime string or null (still present)
 * @returns {string}  e.g. "7h 45m", "30m", "Still present"
 */
export function calcDuration(loginTime, logoutTime) {
  if (!loginTime) return "—";
  if (!logoutTime) return "Still present";

  const diffMs      = new Date(logoutTime) - new Date(loginTime);
  const totalMins   = Math.floor(diffMs / 60000);
  const hours       = Math.floor(totalMins / 60);
  const minutes     = totalMins % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Return a CSS colour token based on duration hours worked.
 * Useful for colour-coding rows in the attendance table.
 */
export function durationColor(loginTime, logoutTime) {
  if (!logoutTime) return "green";           // still present

  const diffMs  = new Date(logoutTime) - new Date(loginTime);
  const hours   = diffMs / 3600000;

  if (hours >= 8)  return "#16a34a";          // full day  — green
  if (hours >= 4)  return "#d97706";          // half day  — amber
  return "#dc2626";                           // short day — red
}
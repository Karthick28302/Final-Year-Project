const db = require("../../config/db");

const getMyAttendanceService = async (employeeId, { month, year }) => {
  const values = [employeeId];
  const where = ["user_id = $1"];

  if (month) {
    values.push(month);
    where.push(`EXTRACT(MONTH FROM work_date) = $${values.length}`);
  }

  if (year) {
    values.push(year);
    where.push(`EXTRACT(YEAR FROM work_date) = $${values.length}`);
  }

  const query = `
    SELECT id, work_date, login_time, logout_time, total_hours, status
    FROM attendance
    WHERE ${where.join(" AND ")}
    ORDER BY work_date DESC
  `;

  const { rows } = await db.query(query, values);
  return rows;
};

module.exports = {
  getMyAttendanceService,
};

const db = require("../../config/db");

const getMySalaryService = async (employeeId, { month, year }) => {
  const values = [employeeId];
  const where = ["user_id = $1"];

  if (month) {
    values.push(month);
    where.push(`month = $${values.length}`);
  }

  if (year) {
    values.push(year);
    where.push(`year = $${values.length}`);
  }

  const query = `
    SELECT
      id,
      month,
      year,
      basic_salary,
      allowances,
      deductions,
      net_salary,
      paid_on
    FROM salaries
    WHERE ${where.join(" AND ")}
    ORDER BY year DESC, month DESC
  `;

  const { rows } = await db.query(query, values);
  return rows;
};

module.exports = {
  getMySalaryService,
};

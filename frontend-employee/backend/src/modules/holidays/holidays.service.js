const db = require("../../config/db");

const getHolidaysService = async ({ month, year }) => {
  const values = [];
  const where = [];

  if (month) {
    values.push(month);
    where.push(`EXTRACT(MONTH FROM holiday_date) = $${values.length}`);
  }

  if (year) {
    values.push(year);
    where.push(`EXTRACT(YEAR FROM holiday_date) = $${values.length}`);
  }

  const query = `
    SELECT id, holiday_name, holiday_date, holiday_type
    FROM holidays
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY holiday_date ASC
  `;

  const { rows } = await db.query(query, values);
  return rows;
};

module.exports = {
  getHolidaysService,
};

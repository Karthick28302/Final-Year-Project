const db = require("../../config/db");

const getEventsService = async ({ from, to }) => {
  const values = [];
  const where = [];

  if (from) {
    values.push(from);
    where.push(`event_date >= $${values.length}`);
  }

  if (to) {
    values.push(to);
    where.push(`event_date <= $${values.length}`);
  }

  const query = `
    SELECT id, title, description, event_date, event_time, location
    FROM events
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY event_date ASC, event_time ASC NULLS LAST
  `;

  const { rows } = await db.query(query, values);
  return rows;
};

module.exports = {
  getEventsService,
};

const db = require("../../config/db");
const AppError = require("../../utils/appError");

const getMyProfileService = async (employeeId) => {
  const query = `
    SELECT
      u.id,
      u.employee_code,
      u.full_name,
      u.email,
      u.role,
      ep.department,
      ep.designation,
      ep.join_date,
      ep.phone,
      ep.address
    FROM users u
    LEFT JOIN employee_profiles ep ON ep.user_id = u.id
    WHERE u.id = $1
    LIMIT 1
  `;

  const { rows } = await db.query(query, [employeeId]);
  const profile = rows[0];

  if (!profile) {
    throw new AppError("Employee profile not found.", 404);
  }

  return {
    id: profile.id,
    employeeCode: profile.employee_code,
    fullName: profile.full_name,
    email: profile.email,
    role: profile.role,
    department: profile.department,
    designation: profile.designation,
    joinDate: profile.join_date,
    phone: profile.phone,
    address: profile.address,
  };
};

module.exports = {
  getMyProfileService,
};

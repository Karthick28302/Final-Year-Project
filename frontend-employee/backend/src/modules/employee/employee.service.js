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

const updateMyProfileService = async (employeeId, payload) => {
  const fullName = (payload.fullName || "").trim();
  const phone = (payload.phone || "").trim();
  const address = (payload.address || "").trim();

  if (!fullName) {
    throw new AppError("Full name is required.", 400);
  }

  if (fullName.length > 120) {
    throw new AppError("Full name is too long.", 400);
  }

  if (phone.length > 20) {
    throw new AppError("Phone number is too long.", 400);
  }

  await db.query(
    `
      UPDATE users
      SET full_name = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `,
    [fullName, employeeId]
  );

  const updateProfileResult = await db.query(
    `
      UPDATE employee_profiles
      SET phone = $1, address = $2, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $3
    `,
    [phone || null, address || null, employeeId]
  );

  if (updateProfileResult.rowCount === 0) {
    await db.query(
      `
        INSERT INTO employee_profiles (user_id, phone, address, created_at, updated_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
      [employeeId, phone || null, address || null]
    );
  }

  return getMyProfileService(employeeId);
};

module.exports = {
  getMyProfileService,
  updateMyProfileService,
};

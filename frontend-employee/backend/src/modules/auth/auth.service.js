const bcrypt = require("bcryptjs");
const db = require("../../config/db");
const AppError = require("../../utils/appError");
const { signToken } = require("../../utils/jwt");

const findEmployeeByIdentifier = async (identifier) => {
  const query = `
    SELECT id, employee_code, full_name, email, password_hash, role, status
    FROM users
    WHERE employee_code = $1 OR email = $1
    LIMIT 1
  `;

  const { rows } = await db.query(query, [identifier]);
  return rows[0] || null;
};

const loginEmployeeService = async ({ identifier, password }) => {
  if (!identifier || !password) {
    throw new AppError("Identifier and password are required.", 400);
  }

  const employee = await findEmployeeByIdentifier(identifier);

  if (!employee) {
    throw new AppError("Invalid credentials.", 401);
  }

  if (employee.status !== "active") {
    throw new AppError("Account is inactive. Contact admin.", 403);
  }

  if (employee.role !== "employee") {
    throw new AppError("Only employee login is allowed here.", 403);
  }

  const isMatch = await bcrypt.compare(password, employee.password_hash);
  if (!isMatch) {
    throw new AppError("Invalid credentials.", 401);
  }

  const token = signToken({
    sub: employee.id,
    role: employee.role,
    email: employee.email,
    employeeCode: employee.employee_code,
  });

  return {
    token,
    employee: {
      id: employee.id,
      employeeCode: employee.employee_code,
      fullName: employee.full_name,
      email: employee.email,
      role: employee.role,
      status: employee.status,
    },
  };
};

module.exports = {
  loginEmployeeService,
};

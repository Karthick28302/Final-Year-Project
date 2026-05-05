const { verifyToken } = require("../utils/jwt");
const AppError = require("../utils/appError");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return next(new AppError("Unauthorized. Missing token.", 401));
  }

  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
      employeeCode: payload.employeeCode,
    };
    return next();
  } catch (error) {
    return next(new AppError("Unauthorized. Invalid token.", 401));
  }
};

module.exports = authMiddleware;

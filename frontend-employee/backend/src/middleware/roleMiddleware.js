const AppError = require("../utils/appError");

const roleMiddleware = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return next(new AppError("Forbidden. Insufficient permissions.", 403));
  }
  return next();
};

module.exports = roleMiddleware;

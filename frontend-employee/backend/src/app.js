const express = require("express");
const cors = require("cors");

const env = require("./config/env");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");
const AppError = require("./utils/appError");

const authRoutes = require("./modules/auth/auth.routes");
const employeeRoutes = require("./modules/employee/employee.routes");
const attendanceRoutes = require("./modules/attendance/attendance.routes");
const salaryRoutes = require("./modules/salary/salary.routes");
const eventsRoutes = require("./modules/events/events.routes");
const holidaysRoutes = require("./modules/holidays/holidays.routes");

const app = express();

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "success", message: "Employee backend is running" });
});

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/me", authMiddleware, roleMiddleware("employee"), employeeRoutes);
app.use("/api/v1/me", authMiddleware, roleMiddleware("employee"), attendanceRoutes);
app.use("/api/v1/me", authMiddleware, roleMiddleware("employee"), salaryRoutes);
app.use("/api/v1/me", authMiddleware, roleMiddleware("employee"), eventsRoutes);
app.use("/api/v1/me", authMiddleware, roleMiddleware("employee"), holidaysRoutes);

app.use("/api/v1/employee", authMiddleware, roleMiddleware("employee"), employeeRoutes);
app.use("/api/v1/employee", authMiddleware, roleMiddleware("employee"), attendanceRoutes);
app.use("/api/v1/employee", authMiddleware, roleMiddleware("employee"), salaryRoutes);
app.use("/api/v1/employee", authMiddleware, roleMiddleware("employee"), eventsRoutes);
app.use("/api/v1/employee", authMiddleware, roleMiddleware("employee"), holidaysRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

app.use(errorMiddleware);

module.exports = app;

const asyncHandler = require("../../utils/asyncHandler");
const { loginEmployeeService } = require("./auth.service");

const loginEmployee = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  const data = await loginEmployeeService({ identifier, password });
  res.status(200).json({ status: "success", data });
});

const getCurrentEmployee = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});

module.exports = {
  loginEmployee,
  getCurrentEmployee,
};

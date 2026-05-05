const asyncHandler = require("../../utils/asyncHandler");
const { getMyAttendanceService } = require("./attendance.service");

const getMyAttendance = asyncHandler(async (req, res) => {
  const data = await getMyAttendanceService(req.user.id, {
    month: req.query.month,
    year: req.query.year,
  });

  res.status(200).json({ status: "success", data });
});

module.exports = {
  getMyAttendance,
};

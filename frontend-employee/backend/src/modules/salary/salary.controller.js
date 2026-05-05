const asyncHandler = require("../../utils/asyncHandler");
const { getMySalaryService } = require("./salary.service");

const getMySalary = asyncHandler(async (req, res) => {
  const data = await getMySalaryService(req.user.id, {
    month: req.query.month,
    year: req.query.year,
  });

  res.status(200).json({ status: "success", data });
});

module.exports = {
  getMySalary,
};

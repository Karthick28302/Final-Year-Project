const asyncHandler = require("../../utils/asyncHandler");
const { getHolidaysService } = require("./holidays.service");

const getHolidays = asyncHandler(async (req, res) => {
  const data = await getHolidaysService({
    month: req.query.month,
    year: req.query.year,
  });

  res.status(200).json({ status: "success", data });
});

module.exports = {
  getHolidays,
};

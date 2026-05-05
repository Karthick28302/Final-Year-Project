const asyncHandler = require("../../utils/asyncHandler");
const { getEventsService } = require("./events.service");

const getEvents = asyncHandler(async (req, res) => {
  const data = await getEventsService({
    from: req.query.from,
    to: req.query.to,
  });

  res.status(200).json({ status: "success", data });
});

module.exports = {
  getEvents,
};

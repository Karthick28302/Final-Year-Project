const asyncHandler = require("../../utils/asyncHandler");
const { getMyProfileService } = require("./employee.service");

const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await getMyProfileService(req.user.id);
  res.status(200).json({ status: "success", data: profile });
});

module.exports = {
  getMyProfile,
};

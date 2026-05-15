const asyncHandler = require("../../utils/asyncHandler");
const { getMyProfileService, updateMyProfileService } = require("./employee.service");

const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await getMyProfileService(req.user.id);
  res.status(200).json({ status: "success", data: profile });
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const profile = await updateMyProfileService(req.user.id, req.body || {});
  res.status(200).json({ status: "success", message: "Profile updated successfully.", data: profile });
});

module.exports = {
  getMyProfile,
  updateMyProfile,
};

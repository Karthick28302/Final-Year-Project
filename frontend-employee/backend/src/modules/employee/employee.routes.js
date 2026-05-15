const router = require("express").Router();
const { getMyProfile, updateMyProfile } = require("./employee.controller");

router.get("/profile", getMyProfile);
router.put("/profile", updateMyProfile);

module.exports = router;

const router = require("express").Router();
const { getMyProfile } = require("./employee.controller");

router.get("/profile", getMyProfile);

module.exports = router;

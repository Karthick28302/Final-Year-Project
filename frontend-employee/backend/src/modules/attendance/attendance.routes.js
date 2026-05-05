const router = require("express").Router();
const { getMyAttendance } = require("./attendance.controller");

router.get("/attendance", getMyAttendance);

module.exports = router;

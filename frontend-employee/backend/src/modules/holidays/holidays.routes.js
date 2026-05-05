const router = require("express").Router();
const { getHolidays } = require("./holidays.controller");

router.get("/holidays", getHolidays);

module.exports = router;

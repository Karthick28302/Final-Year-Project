const router = require("express").Router();
const { getEvents } = require("./events.controller");

router.get("/events", getEvents);

module.exports = router;

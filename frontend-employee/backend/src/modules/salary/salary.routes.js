const router = require("express").Router();
const { getMySalary } = require("./salary.controller");

router.get("/salary", getMySalary);

module.exports = router;

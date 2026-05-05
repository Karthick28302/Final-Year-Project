const router = require("express").Router();
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const { loginEmployee, getCurrentEmployee } = require("./auth.controller");

router.post("/login", loginEmployee);
router.get("/me", authMiddleware, roleMiddleware("employee"), getCurrentEmployee);

module.exports = router;

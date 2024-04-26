const {SignIn, SignUp, AuthControl} = require("../Controllers/AuthController");
const router = require("express").Router();

router.post("/", AuthControl);

module.exports = router;
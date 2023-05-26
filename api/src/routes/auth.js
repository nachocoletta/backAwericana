const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/session");
const {
  userRegister,
  userLogin,
  userGet,
  logoutUser,
  loginSuccess,
} = require("../controllers/authController");
const {
  validatorRegisterUser,
  validatorLoginUser,
} = require("../validators/authValidator");
router.get("/", userGet);
router.post("/register", validatorRegisterUser, userRegister);
router.post("/login", validatorLoginUser, userLogin);
router.get("/loginLocal/success", authMiddleware, loginSuccess);
router.get("/logoutLocal", logoutUser);
module.exports = router;

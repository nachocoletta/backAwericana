const express = require("express");
const router = express.Router();
const { body, param } = require('express-validator');
const authMiddleware = require("../middlewares/session");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  userRegister,
  userLogin,
  userGet,
  logoutUser,
  loginSuccess,
  changePassword,
  newPassword,
} = require("../controllers/authController");
const {
  validatorRegisterUser,
  validatorLoginUser,
} = require("../validators/authValidator");
router.get("/", userGet);

//Debe tener 8 caracteres, una mayuscula, un numero y un caracter especial
router.post("/register", validatorRegisterUser, userRegister);

router.post("/login", validatorLoginUser, userLogin);
router.get("/loginLocal/success", authMiddleware, loginSuccess);
router.get("/logoutLocal", logoutUser);
router.post("/resetPassword", changePassword);

router.put("/newPassword", [
  authMiddleware,
  body("email")
    .exists()
    .withMessage("El correo electrónico es requerido")
    .notEmpty()
    .withMessage("El correo electrónico no puede estar vacío")
    .isEmail()
    .withMessage("El correo electrónico no es válido")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .withMessage("El email no cumple con los requisitos"),
  body("password")
    .exists()
    .withMessage("La contraseña es requerida")
    .notEmpty()
    .withMessage("La contraseña no puede estar vacía")
    .isLength({ min: 8, max: 30 })
    .withMessage("La contraseña debe tener entre 8 y 30 caracteres")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .withMessage("La contraseña no cumple con los requisitos"),
  validarCampos
], newPassword);

module.exports = router;

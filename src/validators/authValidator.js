const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorRegisterUser = [
  check("nombre")
    .exists()
    .withMessage("El nombre es requerido")
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ min: 3, max: 99 })
    .withMessage("El nombre debe tener entre 3 y 99 caracteres"),
  check("apellido")
    .exists()
    .withMessage("El apellido es requerido")
    .notEmpty()
    .withMessage("El apellido no puede estar vacío")
    .isLength({ min: 3, max: 99 })
    .withMessage("El apellido debe tener entre 3 y 99 caracteres"),
  check("email")
    .exists()
    .withMessage("El correo electrónico es requerido")
    .notEmpty()
    .withMessage("El correo electrónico no puede estar vacío")
    .isEmail()
    .withMessage("El correo electrónico no es válido")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .withMessage("El email no cumple con los requisitos"),
  check("password")
    .exists()
    .withMessage("La contraseña es requerida")
    .notEmpty()
    .withMessage("La contraseña no puede estar vacía")
    .isLength({ min: 8, max: 30 })
    .withMessage("La contraseña debe tener entre 8 y 30 caracteres")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .withMessage("La contraseña no cumple con los requisitos"),
  check("dni")
    .exists()
    .withMessage("El DNI es requerido")
    .notEmpty()
    .withMessage("El DNI no puede estar vAcío")
    .isLength({ min: 7, max: 15 })
    .withMessage(
      "La longitud del dni no puede ser menor a 7 números ni mayor a 15"
    ),
  check("fechaNacimiento")
    .exists()
    .withMessage("La fecha de nacimiento es requerida")
    .notEmpty()
    .withMessage("La fecha de nacimiento no puede estar vacía")
    .isDate()
    .withMessage("La fecha de nacimiento debe ser válida"),
  check("rol")
    .exists()
    .withMessage("El rol es requerido")
    .notEmpty()
    .withMessage("El rol no puede estar vacío")
    .isIn(["admin", "user"])
    .withMessage("El rol debe ser 'admin' o 'user'"),
  (req, res, next) => validateResults(req, res, next),
];
const validatorLoginUser = [
  check("email")
    .exists()
    .withMessage("El correo electrónico es obligatorio")
    .notEmpty()
    .withMessage("El correo electrónico no puede estar vacío")
    .isEmail()
    .withMessage("El correo electrónico debe tener un formato válido"),
  check("password")
    .exists()
    .withMessage("La contraseña es obligatoria")
    .notEmpty()
    .withMessage("La contraseña no puede estar vacía")
    .isLength({ min: 3, max: 15 })
    .withMessage("La contraseña debe tener entre 3 y 15 caracteres"),
  (req, res, next) => validateResults(req, res, next),
];
module.exports = { validatorRegisterUser, validatorLoginUser };

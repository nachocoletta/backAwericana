const { Router } = require("express");
const { body, param } = require('express-validator');
const router = Router();

const authMiddleware = require("../middlewares/session");
const checkRole = require("../middlewares/role");
const { validarCampos } = require("../middlewares/validar-campos");

const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

router.get("/", getReviews);

router.get("/:id", getReview);

router.post("/", [
  authMiddleware
] , createReview);

router.put("/:id", [
  authMiddleware,
  param('id', 'El id debe ser entero mayor a 0').isInt({min:1}),
  validarCampos
], updateReview);

router.delete("/:id", [
  authMiddleware,
  checkRole(['admin']),
  param('id', 'El id debe ser entero mayor a 0').isInt({min:1}),
  validarCampos
], deleteReview);

module.exports = router;

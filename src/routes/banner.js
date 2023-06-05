const { Router } = require("express");
const { body, param } = require('express-validator');
const { validarCampos } = require("../middlewares/validar-campos");
const {
    obtenerImagenes,
    subirImagen,
    borrarImagen
} = require("../controllers/banner.js");
const authMiddleware = require("../middlewares/session");
const checkRole = require("../middlewares/role");

const router = Router();

router.get('/', obtenerImagenes);

router.post('/', [
    authMiddleware,
    checkRole(['admin'])
], subirImagen);

router.delete('/:id', [
    authMiddleware,
    checkRole(['admin'])
], borrarImagen)

module.exports = router;
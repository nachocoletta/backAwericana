const { Router } = require("express");
const { body, param } = require('express-validator');
const { validarCampos } = require("../middlewares/validar-campos");
const {
    obtenerImagenes,
    subirImagen,
    borrarImagen
} = require("../controllers/banner.js");


const router = Router();

router.get('/', obtenerImagenes)
router.post('/', subirImagen)
router.delete('/:id', borrarImagen)

module.exports = router;
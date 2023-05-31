const { Router } = require("express");
const { body, param } = require('express-validator');
const { validarCampos } = require("../middlewares/validar-campos");
const { obtenerCarrito, agregarAlCarrito, quitarDelCarrito } = require("../controllers/carrito");

const router = Router();

router.get('/:usuarioId' , obtenerCarrito );

router.post('/:usuarioId' , [
    body('publicacionId', 'El id de la publicacion no es valido.').isInt({min:1}),
    validarCampos
] , agregarAlCarrito );

router.delete('/:usuarioId' , [
    body('publicacionId', 'El id de la publicacion no es valido.').optional().isInt({min:1}),
    validarCampos
], quitarDelCarrito );

module.exports = router;
const { Router } = require("express");
const { body, param } = require('express-validator');

const { validarCampos } = require("../middlewares/validar-campos");
const authMiddleware = require("../middlewares/session");

const { obtenerCarrito, agregarAlCarrito, quitarDelCarrito } = require("../controllers/carrito");

const router = Router();

router.get('/:usuarioId' , [
    authMiddleware,
    param('id', 'El id debe ser entero mayor a 0').isInt({min:1}),
    validarCampos
], obtenerCarrito );

router.post('/:usuarioId' , [
    authMiddleware,
    body('publicacionId', 'El id de la publicacion no es valido.').isInt({min:1}),
    param('id', 'El id debe ser entero mayor a 0').isInt({min:1}),
    validarCampos
] , agregarAlCarrito );

router.delete('/:usuarioId' , [
    authMiddleware,
    body('publicacionId', 'El id de la publicacion no es valido.').optional().isInt({min:1}),
    param('id', 'El id debe ser entero mayor a 0').isInt({min:1}),
    validarCampos
], quitarDelCarrito );

module.exports = router;
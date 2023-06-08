const { Router } = require("express");
const { body, param } = require('express-validator');

const { validarCampos } = require("../middlewares/validar-campos");
const authMiddleware = require("../middlewares/session");
const checkRole = require("../middlewares/role");

const {
    crearProducto,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerTodosLosProductos
} = require("../controllers/producto.js");

const router = Router();

router.get('/', obtenerProducto);

router.get('/todos', obtenerTodosLosProductos);

router.post('/', [
    authMiddleware,
    checkRole(['admin']),
    body('nombre', 'El nombre debe tener entre 3 y 50 caracteres').isString().trim().isLength({min:3, max:50}),
    validarCampos
] ,crearProducto);

router.put('/:id', [
    authMiddleware,
    checkRole(['admin']),
    body('nombre', 'El nombre debe tener entre 3 y 50 caracteres').isString().trim().isLength({min:3, max:50}),
    param('id', 'El id debe ser entero mayor a 0').isInt({min:1}),
    validarCampos
], actualizarProducto);

router.delete('/:id', [
    authMiddleware,
    checkRole(['admin']),
    param('id', 'El id debe ser entero mayor a 0').isInt({min:1}),
    validarCampos
], eliminarProducto)

module.exports = router;
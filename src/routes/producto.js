const { Router } = require("express");
const { body, param } = require('express-validator');
const { validarCampos } = require("../middlewares/validar-campos");
const {
    crearProducto,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerTodosLosProductos
} = require("../controllers/producto.js");

const authMiddleware = require("../middlewares/session");
const checkRole = require("../middlewares/role");

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
    validarCampos
], actualizarProducto);

router.delete('/:id', [
    authMiddleware,
    checkRole(['admin']),
], eliminarProducto)


module.exports = router;
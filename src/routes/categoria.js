const { Router } = require("express");
const { body, param } = require('express-validator');

const { validarCampos } = require("../middlewares/validar-campos");
const authMiddleware = require("../middlewares/session");
const checkRole = require("../middlewares/role");

const {
    crearCategoria,
    obtenerCategoria,
    actualizarCategoria,
    eliminarCategoria,
    obtenerProductosCategoria
} = require("../controllers/categoria");

const router = Router();

router.get('/' , obtenerCategoria);

router.get('/productos' , obtenerProductosCategoria);

router.post('/', [
    authMiddleware,
    checkRole(['admin']),
    body('nombre', 'El nombre debe tener entre 3 y 50 caracteres').isString().trim().isLength({min:3, max:50}),
    validarCampos
    ]
    ,crearCategoria);

router.put('/:id', [
    authMiddleware,
    checkRole(['admin']),
    body('nombre', 'El nombre debe tener entre 3 y 50 caracteres').isString().trim().isLength({min:3, max:50}),
    param('id', 'El id debe ser entero mayor a 0').isInt({min:1}),
    validarCampos
], actualizarCategoria);

router.delete('/:id', [
    authMiddleware,
    checkRole(['admin']),
    param('id', 'El id debe ser entero mayor a 0').isInt({min:1}),
    validarCampos
], eliminarCategoria)
module.exports = router;
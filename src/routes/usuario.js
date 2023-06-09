const { Router } = require("express");
const { body, param } = require('express-validator');

const { validarCampos } = require("../middlewares/validar-campos");
const authMiddleware = require("../middlewares/session");
const checkRole = require("../middlewares/role");

const {
    obtenerUsuarios,
    obtenerUsuario,
    actualizarUsuario,
    inhabilitarOHabilitarUsuario,
    obtenerVentas,
    obtenerCompras,
    obtenerPublicaciones,
    obtenerUsuarioLogin,
    obtenerOtrasPublicaciones
} = require("../controllers/usuario");

const router = Router();

router.get('/' , obtenerUsuarios);

router.get('/yo', [
    authMiddleware
], obtenerUsuarioLogin);

router.get('/:id', [
    param('id', 'El id debe ser entero mayor a 0').isInt({min:1}),
    validarCampos
], obtenerUsuario);



router.put('/', [
    authMiddleware,
    body('nombre', 'El nombre debe tener entre 2 y 50 caracteres').isString().isLength({min:2, max:50}),
    body('apellido', 'El apellido debe tener entre 2 y 50 caracteres').isString().isLength({min:2, max:50}),
    validarCampos
] ,actualizarUsuario)

router.put('/:id/inhabilitarOHabilitar', [
    authMiddleware,
    checkRole(['admin', 'user']),
    param('id', 'El id debe ser entero mayor a 0').isInt({min:1}),
    validarCampos
], inhabilitarOHabilitarUsuario);

router.get('/:id/compras' , [
    authMiddleware,
    param('id', 'El id debe ser entero mayor a 0').isInt({min:1}),
    validarCampos
] , obtenerCompras);

router.get('/:id/ventas' , [
    authMiddleware,
    param('id', 'El id debe ser entero mayor a 0').isInt({min:1}),
    validarCampos
] , obtenerVentas);

router.get('/:id/publicaciones' , [
    param('id', 'El id debe ser entero mayor a 0').isInt({min:1}),
    validarCampos
] ,obtenerPublicaciones);

router.get('/:usuarioId/publicaciones/excluir/:publicacionId' , [
    param('usuarioId', 'El publicacionId debe ser entero mayor a 0').isInt({min:1}),
    param('publicacionId', 'publicacionId debe ser entero mayor a 0').isInt({min:1}),
    validarCampos
] ,obtenerOtrasPublicaciones);

module.exports = router;
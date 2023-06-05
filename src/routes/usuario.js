const { Router } = require("express");
const { body, param } = require('express-validator');
const { validarCampos } = require("../middlewares/validar-campos");
const {
    obtenerUsuarios,
    obtenerUsuario,
    actualizarUsuario,
    inhabilitarOHabilitarUsuario,
    obtenerVentas,
    obtenerCompras,
    obtenerPublicaciones
} = require("../controllers/usuario");
const authMiddleware = require("../middlewares/session");


const router = Router();

router.get('/' , obtenerUsuarios);

router.get('/:id', obtenerUsuario);

router.put('/:id', [
    authMiddleware,
    body('nombre', 'El nombre debe tener entre 2 y 50 caracteres').isString().isLength({min:2, max:50}),
    body('apellido', 'El apellido debe tener entre 2 y 50 caracteres').isString().isLength({min:2, max:50}),
   validarCampos
]
 ,actualizarUsuario)

router.put('/:id/inhabilitarOHabilitar', [
    authMiddleware
], inhabilitarOHabilitarUsuario);

router.get('/:id/compras' , [
    authMiddleware
] , obtenerCompras);

router.get('/:id/ventas' , [
    authMiddleware
] , obtenerVentas);

router.get('/:id/publicaciones' , obtenerPublicaciones);



module.exports = router;
const { Router } = require("express");
const { body, param } = require('express-validator');
const { validarCampos } = require("../middlewares/validar-campos");
const {
    // crearTipoProducto,
    obtenerUsuarios,
    obtenerUsuario,
    actualizarUsuario,
    inhabilitarOHabilitarUsuario
    // eliminarTipoProducto
} = require("../controllers/usuario");


const router = Router();

router.get('/' , obtenerUsuarios);
router.get('/:id', obtenerUsuario);
router.put('/:id', [
    body('nombre', 'El nombre debe tener entre 2 y 50 caracteres').isString().isLength({min:2, max:50}),
    body('apellido', 'El apellido debe tener entre 2 y 50 caracteres').isString().isLength({min:2, max:50}),
   validarCampos
]
 ,actualizarUsuario)
router.put('/:id/inhabilitarOHabilitar', inhabilitarOHabilitarUsuario)


module.exports = router;
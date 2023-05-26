const { Router } = require("express");
const { body, param } = require('express-validator');
const { validarCampos } = require("../middlewares/validar-campos");
const {
    crearTipoProducto,
    obtenerTipoProducto,
    actualizarTipoProducto,
    eliminarTipoProducto
} = require("../controllers/tipoProducto");

const router = Router();



router.get('/' , obtenerTipoProducto);

router.post('/', [
    body('nombre', 'El nombre debe tener entre 3 y 50 caracteres').isString().trim().isLength({min:3, max:50}),
    validarCampos
    ]
    ,crearTipoProducto);

router.put('/:id', [
    body('nombre', 'El nombre debe tener entre 3 y 50 caracteres').isString().trim().isLength({min:3, max:50}),
    validarCampos
], actualizarTipoProducto);

router.delete('/:id', eliminarTipoProducto)
module.exports = router;
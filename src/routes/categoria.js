const { Router } = require("express");
const { body, param } = require('express-validator');
const { validarCampos } = require("../middlewares/validar-campos");
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
    body('nombre', 'El nombre debe tener entre 3 y 50 caracteres').isString().trim().isLength({min:3, max:50}),
    validarCampos
    ]
    ,crearCategoria);

router.put('/:id', [
    body('nombre', 'El nombre debe tener entre 3 y 50 caracteres').isString().trim().isLength({min:3, max:50}),
    validarCampos
], actualizarCategoria);

router.delete('/:id', eliminarCategoria)
module.exports = router;
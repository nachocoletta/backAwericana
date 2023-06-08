const { Router } = require("express");
const { body, param } = require('express-validator');

const { validarCampos } = require("../middlewares/validar-campos");
const authMiddleware = require("../middlewares/session");

const {
    obtenerDirecciones,
    eliminarDireccion,
    crearDireccion,
    modificarDireccion,
    obtenerDireccion
} = require("../controllers/direccion.js");


const router = Router();

router.get('/', [ authMiddleware ], obtenerDirecciones);

router.get('/:direccionId', [ 
    authMiddleware,
    param('direccionId', 'El id debe ser entero mayor a 0').isInt({min:1}),
    validarCampos
], obtenerDireccion);

router.post('/', 
    [
        authMiddleware,
        body('calle', 'El nombre de la calle debe tener entre 3 y 50 caracteres').isString().trim().isLength({min: 3, max:50}),
        body('numeracion', 'El campo numeración no debe estar vacío ni tener más de 50 caracteres').isString().trim().isLength({min: 1, max:50}),
        body('codigoPostal', 'El campo código postal no debe estar vacío ni tener más de 10 caracteres').isString().trim().isLength({min: 1, max:10}),
        body('ciudad', 'El campo ciudad debe tener entre 3 y 50 caracteres').isString().trim().isLength({min: 3, max:50}),
        body('provincia', 'El campo provincia debe tener entre 3 y 50 caracteres').isString().trim().isLength({min: 3, max:50}),
        body('idPais', 'El campo id pais no puede ser nulo').isInt().isLength({min: 1}),
        validarCampos
    ],
crearDireccion);

router.put('/:id', [ 
    authMiddleware,
    param('id', 'El id debe ser entero mayor a 0').isInt({min:1}),
    validarCampos
], modificarDireccion);

router.delete('/:id' , [ 
    authMiddleware,
    param('id', 'El id debe ser entero mayor a 0').isInt({min:1}),
    validarCampos
], eliminarDireccion);

module.exports = router;
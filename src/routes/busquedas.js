const { Router } = require("express");
const { query} = require('express-validator');

const { validarCampos } = require("../middlewares/validar-campos");

const { buscar } = require("../controllers/busquedas");

const router = Router();

router.get('/', [
    query('termino', 'Ingrese lo que desee buscar. Maximo 50 caracteres.').optional().isString().isLength({min:1, max: 50}),
    query('precioMin', 'El precio minimo es de 1').optional().isInt({min:1}),
    query('precioMax', 'El precio maximo no puede ser inferior a 1').optional().isInt({min:1}),
    query('oferta', 'El unico valor valido es "si"').optional().isIn('si'),
    query('orden', 'Los valores validos son "asc" , "desc" y "random"').optional().isIn(['asc', 'desc', 'random']),
    query('persona', 'el persona debe ser una cadena de texto').optional().not().isInt(),
    query('categoria', 'la categoria debe ser una cadena de texto').optional().not().isInt(),
    query('talle', 'el talle debe ser una cadena de texto').optional().not().isInt(),
    validarCampos
] , buscar );

module.exports = router; 
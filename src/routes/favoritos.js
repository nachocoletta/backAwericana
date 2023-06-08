const { Router } = require("express");
const { body, param } = require('express-validator');

const { validarCampos } = require("../middlewares/validar-campos");
const authMiddleware = require("../middlewares/session");

const { 
    obtenerFavoritos,
    vaciarFavoritos,
    alternarFavorito,
    verificarFavorito
} = require("../controllers/favoritos");

const router = Router();

router.get('/' , [
    authMiddleware,
    validarCampos
], obtenerFavoritos);

router.get('/:publicacionId' , [
    authMiddleware,
    param('publicacionId', 'El id debe ser entero mayor a 0').isInt({min:1}),
    validarCampos
], verificarFavorito);

router.post('/:publicacionId' , [
    authMiddleware,
    param('publicacionId', 'El id debe ser entero mayor a 0').isInt({min:1}),
    validarCampos
] , alternarFavorito );

router.delete('/', [
    authMiddleware
] , vaciarFavoritos );

module.exports = router;
const { Router } = require("express");
const { body, param } = require('express-validator');
const { validarCampos } = require("../middlewares/validar-campos");
const { 
        obtenerFavoritos,
        vaciarFavoritos,
        alternarFavorito 
} = require("../controllers/favoritos");
const authMiddleware = require("../middlewares/session");

const router = Router();

router.get('/:usuarioId' , [
    authMiddleware
], obtenerFavoritos);

router.post('/:usuarioId' , [
    authMiddleware,
    body('publicacionId', 'El id de la publicacion no es valido.').isInt({min:1}),
    validarCampos
] , alternarFavorito );

router.delete('/:usuarioId', [
    authMiddleware
] , vaciarFavoritos );

module.exports = router;
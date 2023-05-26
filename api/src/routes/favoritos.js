const { Router } = require("express");
const { body, param } = require('express-validator');
const { validarCampos } = require("../middlewares/validar-campos");
const { 
        obtenerFavoritos,
        vaciarFavoritos,
        alternarFavorito 
} = require("../controllers/favoritos");

const router = Router();

router.get('/:usuarioId' , obtenerFavoritos);

router.post('/:usuarioId' , [
    body('publicacionId', 'El id de la publicacion no es valido.').isInt({min:1}),
    validarCampos
] , alternarFavorito );

router.delete('/:usuarioId' , vaciarFavoritos );

module.exports = router;
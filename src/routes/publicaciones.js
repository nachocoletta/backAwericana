const { Router } = require("express");
const { body, param } = require('express-validator');

const { validarCampos } = require("../middlewares/validar-campos");
const authMiddleware = require("../middlewares/session");
const checkRole = require("../middlewares/role");

const {
    actualizarPublicacion,
    configurarDescuento,
    crearPublicacion,
    eliminarPublicacion,
    obtenerPublicacion,
    obtenerPublicaciones
} = require("../controllers/publicaciones");

const router = Router();

router.get('/' , obtenerPublicaciones);

router.get('/:id' , [
    param('id', 'El id de la publicación debe ser entero mayor a 0').isInt({min:1}),
    validarCampos
],
obtenerPublicacion);

router.post('/' , [
    authMiddleware,
    body('precio', 'El valor del precio no es valido.').isDecimal().notEmpty(),
    body('titulo', 'El titulo debe tener entre 1 y 50 caracteres').isString().isLength({min:1, max:50}),
    body('descripcion', 'La descripción debe tener entre 10 y 200 caracteres').isString().isLength({min:10, max:200}),
    body('talleId', 'El id del talle debe ser entero mayor a 0').isInt({min:1}), //a mejorar: debe verificarse que exista en BD
    body('productoId', 'El id del productoId debe ser entero mayor a 0').isInt({min:1}), //a mejorar: debe verificarse que exista en BD
    body('personaId', 'El id del personaId debe ser entero mayor a 0').isInt({min:1}), //a mejorar: debe verificarse que exista en BD
    body('imagenes', 'Las imagenes debe estar en un array de strings').isArray(),
    validarCampos
], crearPublicacion);

router.put('/:id' , [
    authMiddleware,
    param('id', 'El id de la publicación debe ser entero mayor a 0').isInt({min:1}),
    body('precio', 'El valor del precio no es valido.').isDecimal().notEmpty(),
    body('titulo', 'El titulo debe tener entre 1 y 50 caracteres').isString().isLength({min:1, max:50}),
    body('descripcion', 'La descripción debe tener entre 10 y 200 caracteres').isString().isLength({min:10, max:200}),
    body('talleId', 'El id del talle debe ser entero mayor a 0').isInt({min:1}), //a mejorar: debe verificarse que exista en BD
    body('productoId', 'El id del productoId debe ser entero mayor a 0').isInt({min:1}), //a mejorar: debe verificarse que exista en BD
    body('personaId', 'El id del personaId debe ser entero mayor a 0').isInt({min:1}), //a mejorar: debe verificarse que exista en BD
    body('imagenes', 'Las imagenes debe estar en un array de strings').isArray(),
    validarCampos
], actualizarPublicacion);

router.put('/:id/descuento' , [
    authMiddleware,
    param('id', 'El id de la publicación debe ser entero mayor a 0').isInt({min:1}),
    body('descuento', 'El valor del descuento debe ser entero').isInt({min:0}),
    validarCampos
], configurarDescuento);

router.delete('/:id' ,[
    authMiddleware,
    param('id', 'El id de la publicación debe ser entero mayor a 0').isInt({min:1}),
    checkRole(['admin', 'user']),
],  eliminarPublicacion);

module.exports = router;
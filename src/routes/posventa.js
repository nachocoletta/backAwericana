const { Router } = require("express");
const { body, param } = require('express-validator');

const { validarCampos } = require("../middlewares/validar-campos");
const authMiddleware = require("../middlewares/session");

const { 
    iniciarReclamo,
    actualizarEstadoEnvio,
    revelarVendedor,
    chequearReclamo,
    avanzarDevolucion
} = require("../controllers/posventa");


const router = Router();

router.post('/solicitar_devolucion', [
    authMiddleware
], iniciarReclamo );

router.post('/tracking' ,[
    authMiddleware
], actualizarEstadoEnvio );

router.post('/revelar_vendedor' , [
    authMiddleware
]  , revelarVendedor );

router.post('/estado_devolucion' , [
    authMiddleware
] , chequearReclamo );

router.post('/avanzar_devolucion' , [
    authMiddleware
], avanzarDevolucion );

module.exports = router
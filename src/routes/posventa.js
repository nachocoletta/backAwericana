const { Router } = require("express");
const { body, param } = require('express-validator');
const { validarCampos } = require("../middlewares/validar-campos");
const { 
    iniciarReclamo,
    actualizarEstadoEnvio,
    revelarVendedor,
    chequearReclamo,
    avanzarDevolucion
} = require("../controllers/posventa");

const router = Router();

router.post('/solicitar_devolucion' , iniciarReclamo );
router.post('/tracking' , actualizarEstadoEnvio );
router.post('/revelar_vendedor' , revelarVendedor );
router.post('/estado_devolucion' , chequearReclamo );
router.post('/avanzar_devolucion' , avanzarDevolucion );

module.exports = router
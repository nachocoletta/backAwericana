const { Router } = require("express");
const router = Router();

const { getUrlPago, notificarYConfirmarPago, getPrecioEnvio } = require("../controllers/pagosController");

router.get("/url/:userid", getUrlPago)

router.post('/notificar', notificarYConfirmarPago)

router.get("/envio/:userid", getPrecioEnvio)

module.exports = router;

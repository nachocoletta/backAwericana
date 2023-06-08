const { Router } = require("express");

const { obtenerTalles } = require("../controllers/talle.js");

const router = Router();

router.get('/', obtenerTalles)

module.exports = router;
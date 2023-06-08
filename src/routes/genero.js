const { Router } = require("express");

const { obtenerGeneros } = require("../controllers/genero.js");

const router = Router();

router.get('/', obtenerGeneros);

module.exports = router;
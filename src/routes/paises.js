const { Router } = require("express");

const { obtenerPaises } = require("../controllers/paises.js");

const router = Router();

router.get('/', obtenerPaises)

module.exports = router;
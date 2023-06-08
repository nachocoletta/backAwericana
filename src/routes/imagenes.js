const { Router } = require("express");

const { obtenerImagenes } = require("../controllers/imagen.js");

const router = Router();

router.get('/', obtenerImagenes)

module.exports = router;
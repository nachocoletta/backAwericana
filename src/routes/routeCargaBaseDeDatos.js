const { Router } = require("express");

const iniciarBaseDeDatos = require("../controllers/bd");

const router = Router();

router.get('/', iniciarBaseDeDatos)

module.exports = router;
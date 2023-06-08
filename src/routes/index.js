const { Router } = require("express");

const router = Router();

//Importar rutas
const productsRoute = require("./producto");
const publicaciones = require("./publicaciones");
const carrito = require("./carrito");
const rutaBaseDeDatos = require("./routeCargaBaseDeDatos");
const categoria = require("./categoria");
const authRouter = require("./auth");
const favoritos = require("./favoritos");
const authTerceros = require("./authTerceros.js");
const usuario = require("./usuario");
const pagos = require("./pagosRoutes");
const busquedas = require("./busquedas");
const posventa = require("./posventa");
const talle = require("./talle");
const genero = require("./genero");
const banner = require("./banner");
const imagenes = require("./imagenes");
const direcciones = require("./direccion");
const review = require("./review");
const paises = require('./paises');
const fakeRouter = require("../Helpers/fakeGenerator");

//Usarlas
router.use("/producto", productsRoute);
router.use("/auth", authRouter);
router.use("/publicaciones", publicaciones);
router.use("/carrito", carrito);
router.use("/cargaBaseDeDatos", rutaBaseDeDatos);
router.use("/categoria", categoria);
router.use("/favoritos", favoritos);
router.use("/auth", authTerceros);
router.use("/pagos", pagos);
router.use("/busqueda", busquedas);
router.use("/posventa", posventa);
router.use("/usuario", usuario);
router.use("/talle", talle);
router.use("/banner", banner);
router.use("/personas", genero);
router.use("/imagenes", imagenes);
router.use("/direcciones", direcciones);
router.use("/review", review);
router.use('/paises', paises);
router.use("/fake", fakeRouter);

module.exports = router;

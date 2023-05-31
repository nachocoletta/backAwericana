const { Router } = require("express");
const {
  Talle,
  Color,
  Marca,
  Categoria,
  Producto,
  Pais,
  Persona,
  // TipoProducto,

  
} = require("../db.js");

const router = Router();

const { paises } = require("../Helpers/PaisesJson");
const { talles } = require("../Helpers/tallesJson.js");
// const { colores } = require("../Helpers/coloresJson");
const { categorias } = require("../Helpers/categoriasJson");
// const { marcas } = require("../Helpers/marcasJson");
const { tipoPersonas } = require("../Helpers/tipoPersonaJson");
const { tipoProductos } = require("../Helpers/tipoProductoJson");
const { productos } = require('../Helpers/productosJson');

const poblarBaseDeDatos = async () => {
  try {
    await Pais.bulkCreate(paises);
    // await Categoria.bulkCreate(categorias);
    // await Color.bulkCreate(colores);
    await Talle.bulkCreate(talles);
    // await Marca.bulkCreate(marcas);
    await Persona.bulkCreate(tipoPersonas);
    await Categoria.bulkCreate(tipoProductos);
    await Producto.bulkCreate(productos)
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

router.post("/", async (req, res) => {
  if (await poblarBaseDeDatos()) {
    return res.status(200).json({ message: "base de datos inicializada" });
  } else {
    return res.status(400).json({ error: "no se pudo cargar" });
  }
});

module.exports = router;

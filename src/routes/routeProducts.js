const { Router } = require("express");
const { Producto, Talle, Color, Marca, Categoria, conn } = require("../db.js");

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { nombre, descripcion, categoriaId } = req.body;

    if (!nombre || !descripcion || !categoriaId) {
      return res.status(400).send("Debe completar enviar todos los campos");
    }

    const nuevoProducto = await Producto.create({
      nombre,
      descripcion,
    });

    const categoriaProducto = await Categoria.findOne({
      where: {
        id: categoriaId,
      },
    });

    // console.log("categoriaProducto: ", categoriaProducto)
    await nuevoProducto.setCategorium(categoriaProducto);
    // Realiza otras operaciones dentro de la transacción si es necesario

    // Ejemplo: Actualizar otros modelos relacionados

    // Confirma la transacción

    // DESPUES DE CREAR EL PRODUCTO DEBO INGRESAR LAS IMAGENES A LA TABLA DE IMAGNES
    // CORRESOPNDENTES A ESE PRODUCTO

    res.status(200).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/original", async (req, res) => {
  const { nombre, descripcion, talleId, colorId, marcaId, categoriaId } =
    req.body;

  if (
    !nombre ||
    !descripcion ||
    !talleId ||
    !colorId ||
    !marcaId ||
    !categoriaId
  ) {
    return res.status(400).send("Debe completar enviar todos los campos");
  }
  try {
    await conn.transaction(async (t) => {
      const nuevoProducto = await Producto.create(
        {
          nombre,
          descripcion,
        },
        { transaction: t }
      );

      const talleProducto = await Talle.findOne(
        {
          where: {
            id: talleId,
          },
        },
        { transaction: t }
      );

      await nuevoProducto.setTalle(talleProducto);

      const colorProducto = await Color.findOne(
        {
          where: {
            id: colorId,
          },
        },
        { transaction: t }
      );

      await nuevoProducto.setColor(colorProducto);

      const marcaProducto = await Marca.findOne(
        {
          where: {
            id: marcaId,
          },
        },
        { transaction: t }
      );

      await nuevoProducto.setMarca(marcaProducto);

      // const categoriaProducto = await Categoria.findOne({
      //     where: {
      //         id: categoriaId
      //     }
      // }, {transaction: t})

      // await nuevoProducto.setCategoria(categoriaProducto)
      // Realiza otras operaciones dentro de la transacción si es necesario

      // Ejemplo: Actualizar otros modelos relacionados

      // Confirma la transacción

      // DESPUES DE CREAR EL PRODUCTO DEBO INGRESAR LAS IMAGENES A LA TABLA DE IMAGNES
      // CORRESOPNDENTES A ESE PRODUCTO
      await t.commit();

      res.status(200).json(nuevoProducto);
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {});

module.exports = router;

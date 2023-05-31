const { Categoria , Producto} = require("../db");
const { Op } = require("sequelize");

const obtenerCategoria = async (req, res) => {
  const categorias = await Categoria.findAll();

  res.status(200).json({ categorias: categorias });
};


const crearCategoria = async (req, res) => {
    const { nombre, ...resto } = req.body

    try {
        if (!nombre) {
            return res.status(400).json({
              msg: 'El campo "nombre" es requerido.',
            });
          }

        const existeCategoria = await Categoria.findOne({
            where: {
                nombre: {
                    [Op.iLike]: `%${nombre.trim()}%`,
                }
            }
        })

      
        if (existeCategoria) {
            return res.status(400).json({
                msg: `La categoria ${nombre
                .trim()
                .toUpperCase()} ya existe en la base de datos`,
            });
        }
        // console.log('no existe')
        const categoria = await Categoria.create({
            nombre: nombre.trim().toUpperCase(),
            ...resto,
        })

        // await categoria.save();

        res.status(200).json({msg: `La categoria con el nombre ${nombre} fue creada`, categoria});

    }catch (error){
        console.log(error.message);
        res.status(500).json({
          msg: error.message,
        });
    }
}


const actualizarCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre, ...cambios } = req.body;

  try {
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res
        .status(404)
        .json({ msg: `La categoria con el ID: ${id} no existe.` });
    }

    // console.log(cambios);
    await categoria.update({ nombre, cambios });

    res.status(201).json({
      msg: "La categoria fue actualizada.",
      categoria,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarCategoria = async (req, res) => {
  const { id } = req.params;

  const categoria = await Categoria.findByPk(id);

  if (!categoria) {
    return res.status(404).json({
      msg: `La categoria con el ID: ${id} no fue encontrada`,
    });
  } else {
    await categoria.destroy();

    return res.status(200).json({
      msg: `La categoria fue eliminada`,
      categoria,
    });
  }
};

const obtenerProductosCategoria = async (req, res) => {
  const {categoriaId} = req.body;

  const categoria = await Categoria.findByPk(categoriaId);

  if (!categoria) {
    return res.status(404).json({ msg: `La categoria con el ID: ${categoriaId} no existe.` });
  }

  const productos = await Producto.findAll({
    where: {
      categoriumId: categoriaId
    }
  })

  res.json(productos);
}

module.exports = {
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  obtenerProductosCategoria
};

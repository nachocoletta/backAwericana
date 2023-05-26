const { TipoProducto } = require("../db");
const { Op } = require("sequelize");

const obtenerTipoProducto = async (req, res) => {
  const tipoDeProductos = await TipoProducto.findAll();

  res.status(200).json({ tipoProductos: tipoDeProductos });
};


const crearTipoProducto = async (req, res) => {
    const { nombre, ...resto } = req.body

    try {
        if (!nombre) {
            return res.status(400).json({
              msg: 'El campo "nombre" es requerido.',
            });
          }

        const existeTipoProducto = await TipoProducto.findOne({
            where: {
                nombre: {
                    [Op.iLike]: `%${nombre.trim()}%`,
                }
            }
        })

      
        if (existeTipoProducto) {
            return res.status(400).json({
                msg: `El tipo producto ${nombre
                .trim()
                .toUpperCase()} ya existe en la base de datos`,
            });
        }
        // console.log('no existe')
        const tipoProducto = await TipoProducto.create({
            nombre: nombre.trim().toUpperCase(),
            ...resto,
        })

        // await tipoProducto.save();

        res.status(200).json({msg: `El tipo de producto ${nombre} fue creado`, tipoProducto});

    }catch (error){
        console.log(error.message);
        res.status(500).json({
          msg: error.message,
        });
    }
}


const actualizarTipoProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, ...cambios } = req.body;

  try {
    const tipoProducto = await TipoProducto.findByPk(id);

    if (!tipoProducto) {
      return res
        .status(404)
        .json({ msg: `El tipo de producto con el ID: ${id} no existe.` });
    }

    // console.log(cambios);
    await tipoProducto.update({ nombre, cambios });

    res.status(201).json({
      msg: "El tipo de producto fue actualizado.",
      tipoProducto,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarTipoProducto = async (req, res) => {
  const { id } = req.params;

  const tipoProducto = await TipoProducto.findByPk(id);

  if (!tipoProducto) {
    return res.status(404).json({
      msg: `El tipo de producto con ID: ${id} no fue encontrado`,
    });
  } else {
    await tipoProducto.destroy();

    return res.status(200).json({
      msg: `El tipoDeProducto fue eliminado`,
      tipoProducto,
    });
  }
};
module.exports = {
  obtenerTipoProducto,
  crearTipoProducto,
  actualizarTipoProducto,
  eliminarTipoProducto,
};

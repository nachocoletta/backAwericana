const { where } = require("sequelize");
const { Usuario, Publicacion } = require("../db");

const obtenerUsuarios = async (req, res) => {
  const usuarios = await Usuario.findAll();

  try {
    return usuarios.length
      ? res.status(200).json(usuarios)
      : res
          .status(404)
          .json({ msg: `No hay usuarios registrados en la base de datos` });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

const obtenerUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);

    return usuario
      ? res.status(200).json(usuario)
      : res
          .status(400)
          .json({
            msg: `El usuario con ID: ${id} no se encuentra en la base de datos`,
          });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};

const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
//   const { nombre, apellido, email, rol, imagen, fechaNacimiento } = req.body;

  const { nombre, apellido, fechaNacimiento, dni } = req.body;

  try {
    const usuario = await Usuario.findOne({
        where: {
            id
        }
    });

    if (!usuario) {
      return res
        .status(404)
        .json({
          msg: `El usuario con el ID: ${id} no se encuentra en la base de datos`,
        });
    } else {
        const user = await Usuario.update(
            {
              nombre,
              apellido,
              fechaNacimiento,
              dni,
            },
            {
              where: {
                id
              }
            }
          );
        res.status(200).json({msg: `Usuario con ID: ${id} correctamente actualizado`, user})
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

const inhabilitarOHabilitarUsuario = async (req, res) => {
    const { id } = req.params;
    const { habilitado } = req.query
    try {
        const usuario = await Usuario.findByPk(id)

        if(!usuario){
            res.status(404).json({msg: `El usuario con ID: ${id} no se encuentra en la base de datos`})
        }else {
            await Usuario.update({
                habilitado
            },
            {
                where: {
                    id
                }
            })
            res.status(200).json({msg: `Usuario con ID: ${id} correctamente actualizado`})
        }


    }catch(error){
        console.log(error.message);
        return res.status(500).json({error: error.message})
    }
}

const obtenerPublicaciones = async (req, res) => {
  const {id} = req.params;

  const publicaciones = await Publicacion.findAll({
    where: {
      usuarioId: id,
      estado: 'habilitada'
    }
  })

  res.json(publicaciones)
}

const obtenerVentas = async (req, res) => {
  const {id} = req.params;

  const ventasConcretadas = await Publicacion.findAll({
    where: {
      usuarioId: id,
      estado: 'finalizada'
    }
  })

  res.json(ventasConcretadas)
}

const obtenerCompras = async (req, res) => {
  const {id} = req.params;

  const comprasHechas = await Publicacion.findAll({
    where: {
      compradorId: id,
      estado: 'finalizada',
    }
  })

  res.json(comprasHechas)
}

module.exports = {
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  inhabilitarOHabilitarUsuario,
  obtenerPublicaciones,
  obtenerVentas,
  obtenerCompras
};

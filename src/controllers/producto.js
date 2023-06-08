const { Categoria, Producto } = require("../db");

const crearProducto = async (req, res) => {
    const { nombre, idTipoProducto, ...resto} = req.body;

    try {
        if (!nombre) {
            return res.status(400).json({
              msg: 'El campo "nombre" es requerido.',
            });
          }
        
          const existeTipoProducto = await Categoria.findByPk(idTipoProducto)

          if(!existeTipoProducto){
            return res.status(400).json({
                msg: `No existe el tipo de producto`
            })
          }
        const existeProducto = await Producto.findOne({
            where: {
                nombre
            }
        })
        if(!existeProducto){
            const producto = await Producto.create({
                nombre: nombre.trim().toUpperCase(),
                ...resto
            })

            await producto.setCategorium(existeTipoProducto)

            res.status(200).json(producto)
        }else {
            return res.status(400).json({msg: `El prodcuto ${nombre} ya existe en la base de datos`})
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({error: error.message})
    }
}

const obtenerProducto = async (req, res) => {
    const { nombreTipoProducto } = req.query
    try {
        const tipoProducto = await Categoria.findOne({
            where: {
                nombre: nombreTipoProducto
            }
        })

        if(tipoProducto){
            const producto = await Producto.findAll({
                where: {
                    categoriumId: tipoProducto.id
                }
            })
        
            res.status(200).json(producto)
        }else {
            res.status(404).json({msg: `No existe el tipo de producto ${nombreTipoProducto}`})
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({error: error.message})
    }

}

const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, ...cambios } = req.body;
  
    try {
      const producto = await Producto.findByPk(id);
  
      if (!producto) {
        return res
          .status(404)
          .json({ msg: `El tipo de producto con el ID: ${id} no existe.` });
      }
  
      // console.log(cambios);
      await producto.update({ nombre, cambios });
  
      res.status(201).json({
        msg: "El tipo de producto fue actualizado.",
        producto,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    
    const producto = await Producto.findByPk(id);

    if(!producto){
        return res.status(404).json({
            msg: `El producto con ID: ${id} no fue encontrado`,
          });
    }else {
        await producto.destroy();

    return res.status(200).json({
      msg: `El producto fue eliminado`,
      producto,
    });
    }

}

const obtenerTodosLosProductos = async (req, res) => {

    const productos = await Producto.findAll()

    return productos.length ? 
        res.status(200).json(productos) :
        res.status(404).json({msg: `No hay productos`})
}


module.exports = {
    crearProducto,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerTodosLosProductos
  };
  
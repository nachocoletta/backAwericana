const {Carrito, Publicacion,Usuario } = require("../db");

//Función para sumar los precios de un array de productos
const calcularMonto = (carrito) => {
    let monto = 0;
    
    //Acumular los precios en la variable 'monto'
    carrito.forEach(item => {
        if(item.publicacion.estado === 'habilitada' ){
            monto = monto + item.publicacion.precio;
        }       
    });

    //Devolver el monto con los decimales recortados
    return Number((monto).toFixed(2));
}

//Controlador para obtener el carrito del usuario logueado
const obtenerCarrito = async(req, res) => {
    //Obtener Id del usuario logueado
    const {id : usuarioId} = req.user;

    try {
        //Buscar en la tabla carrito las publicaciones que coincidan con el id del usuario
        const carrito = await Carrito.findAll({
            include:[Publicacion],
            where:{usuarioId}
        });

        //Sumar el costo de las publicaciones obtenidas
        const montoTotal = calcularMonto(carrito);

        //Devolver el monto y la lista de publicaciones que se encuentran en el carrito
        res.status(200).json({montoTotal, carrito});

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Error en el servidor.'});
    }
    
}

//Controlador para agregar publicaciones al carrito
const agregarAlCarrito = async(req, res) => {
    //Obtener el id del usuario logueado y datos recibidos
    const {id : usuarioId} = req.user;
    const {publicacionId} = req.body;

    try {
        //Buscar la publicación 
        const publicacion = await Publicacion.findOne({
            where: {
                id: publicacionId,
                estado: 'habilitada'
            } 
        });

        //Retornar si la publicación no existe
        if( !publicacion ){
            return res.status(404).json({msg: `La publicación no existe.`})
        }

        //Verificar si la publicación que se quiere agregar es del propio usuario
        const esPubliPropia = await Publicacion.findOne({
            where: {
                id: publicacionId,
                usuarioId
            }
        });

        //Retornar si la publicación es del propio usuario
        if(esPubliPropia){
            return res.status(200).json({msg: 'No puede agregar al carrito su propia publicación'});
        }

        //Verificar si la publicación existe en el carrito 
        const existe = await Carrito.findOne({where: {
            usuarioId,
            publicacionId
        }});

        //Retornar si la publicación existe en el carrito
        if(existe){
            return res.status(200).json('La publicación ya se encuentra en el carrito de compra.');
        }

        //Agregar al carrito
        const itemDeCarrito = await Carrito.create({usuarioId, publicacionId});
        await itemDeCarrito.save();

        //Devolver mensaje
        res.status(200).json({msg: 'La publicación fue agregada al carrito.'});

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Error en el servidor.'});
    }
}

const quitarDelCarrito = async(req, res) => {
    //Obtener el id del usuario logueado y los datos recibidos
    const { id : usuarioId  } = req.user;
    const { publicacionId = 0 } = req.body;

    try {
        //Si no se recibio el id de una publicación
        if(publicacionId === 0){
             //Vaciar el carrito
            await Carrito.destroy({
                where:{usuarioId}
            });

            //Devolver mensaaje
            res.status(200).json({msg: 'Se han quitado todas las publicaciones del carrito.'});
        
        }else{
            //Buscar la publicación
            const publicacion = await Publicacion.findByPk(publicacionId);

            //Retornar si no existe
            if( !publicacion ){
                return res.status(404).json({msg: `La publicación no existe.`})
            }

            //Quitar publicación del carrito
            await Carrito.destroy({
                where:{
                    usuarioId,
                    publicacionId
                }
            });

            //Devolver mensaje
            res.status(200).json({msg: 'La publicación fue removida del carrito.'});
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Error en el servidor.'});
    }
}

module.exports = {
    obtenerCarrito,
    agregarAlCarrito,
    quitarDelCarrito,
}
const {Carrito, Publicacion,Usuario } = require("../db");

const calcularMonto = (carrito) => {
    let monto = 0;
    
    carrito.forEach(item => {
        if(item.publicacion.estado === 'habilitada' ){
            monto = monto + item.publicacion.precio;
        }       
    });

    return monto;
}

const obtenerCarrito = async(req, res) => {
    const {usuarioId} = req.params;

    try {
        const usuario = await Usuario.findByPk(usuarioId);

        if(!usuario){
            return res.status(404).json({msg: `El usuario con el ID ${usuarioId} no existe.`})
        } 

        const carrito = await Carrito.findAll({
            include:[Publicacion],
            where:{usuarioId}
        });

        const montoTotal = calcularMonto(carrito);

        res.json({montoTotal, carrito});

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Error en el servidor.'});
    }
    
}

const agregarAlCarrito = async(req, res) => {
    const {usuarioId} = req.params;
    const {publicacionId} = req.body;

    try {

        const usuario = await Usuario.findByPk(usuarioId);
        const publicacion = await Publicacion.findByPk(publicacionId);

        if( !usuario || !publicacion ){
            return res.status(404).json({msg: `El usuario o publicación no existen.`})
        }

        const existe = await Carrito.findOne({where: {
            usuarioId,
            publicacionId
        }});

        if(existe){
            return res.json('La publicación ya se encuentra en el carrito de compra.');
        }

        const itemDeCarrito = await Carrito.create({usuarioId, publicacionId});
        await itemDeCarrito.save();

        res.json({msg: 'La publicación fue agregada al carrito.'});

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Error en el servidor.'});
    }
}

const quitarDelCarrito = async(req, res) => {
    const {usuarioId} = req.params;
    const {publicacionId = 0} = req.body;

    try {
        const usuario = await Usuario.findByPk(usuarioId);
        

        if( !usuario ){
            return res.status(404).json({msg: `El usuario no existe.`})
        }

        if(publicacionId === 0){
            await Carrito.destroy({
                where:{usuarioId}
            });
            res.json({msg: 'Se han quitado todas las publicaciones del carrito.'});

        }else{
            const publicacion = await Publicacion.findByPk(publicacionId);
            if( !publicacion ){
                return res.status(404).json({msg: `La publicación no existe.`})
            }
            await Carrito.destroy({
                where:{
                    usuarioId,
                    publicacionId
                }
            });
            res.json({msg: 'La publicación fue removida del carrito.'});
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
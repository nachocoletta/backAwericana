const {Carrito, Favoritos, Publicacion} = require("../db");

const quitarPublicacionDeListas = async (publicacionId) =>{
    try {
        await Carrito.destroy({
            where: {
                publicacionId
            }
        });

        await Favoritos.destroy({
            where: {
                publicacionId
            }
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error en el servidor.'
        })
    }
}

const quitarPublicaciones = async (usuarioId) =>{
    try {
        const publisDelUsuario = await Publicacion.findAll({
            where: {
                usuarioId
            }
        });
  
        publisDelUsuario.forEach((publi) => {
            quitarPublicacionDeListas(publi.id);
        });

  
        await Publicacion.destroy({
            where: {
                usuarioId
            }
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error en el servidor.'
        })
    }
}

module.exports = {
    quitarPublicacionDeListas,
    quitarPublicaciones
}
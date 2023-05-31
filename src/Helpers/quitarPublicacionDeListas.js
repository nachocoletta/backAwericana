const {Carrito, Favoritos} = require("../db");

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

module.exports = {
    quitarPublicacionDeListas
}
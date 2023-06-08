const {Imagen, Publicacion} = require("../db");

const obtenerImagenes = async(req, res) => {
    const {publicacionId} = req.body;

    const publicacion = await Publicacion.findByPk(publicacionId);

    if(!publicacion){
        res.status(404).json({msg: `No existe la publicación con el ID: ${publicacionId}`});
    }

    const imagenes = await Imagen.findAll({
        where: {
            publicacionId
        },
        order: [['id', 'asc']]
    });

    res.json(imagenes);
}

module.exports = {
    obtenerImagenes
}
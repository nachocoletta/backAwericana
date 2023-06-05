const {Favoritos, Publicacion,Usuario } = require("../db");

const obtenerFavoritos = async(req, res) => {
    const {id : usuarioId} = req.user;

    try {
        const favoritos = await Favoritos.findAll({
            include:[Publicacion],
            where:{usuarioId}
        });

        res.json(favoritos);

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Error en el servidor.'});
    }

}

const agregarAFavoritos = async (usuarioId, publicacionId) => {
    const itemDeFavoritos = await Favoritos.create({usuarioId, publicacionId});
    await itemDeFavoritos.save();
}

const quitarDeFavoritos = async(usuarioId, publicacionId) => {
    await Favoritos.destroy({
        where:{
            usuarioId,
            publicacionId
        }
    });
}

const alternarFavorito = async(req , res) =>{
    const {id : usuarioId} = req.user;
    const {publicacionId} = req.body;

    try {
        const publicacion = await Publicacion.findOne({
            where: {
                id: publicacionId,
                estado: 'habilitada'
            } 
        });

        if(  !publicacion ){
            return res.status(404).json({msg: `La publicación no existe.`})
        }

        const esPubliPropia = await Publicacion.findOne({
            where: {
                id: publicacionId,
                usuarioId
            }
        });

        if(esPubliPropia){
            return res.json({msg: 'No puede agregar a favoritos su propia publicación'});
        }

        const existe = await Favoritos.findOne({where: {
            usuarioId,
            publicacionId
        }});

        if(existe){
           quitarDeFavoritos(usuarioId, publicacionId);
           res.json({msg: 'La publicación fue removida de Favoritos.'});
        }else{
            agregarAFavoritos(usuarioId, publicacionId);
            res.json({msg: 'La publicación fue agregada a Favoritos.'});
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Error en el servidor.'});
    }
}

const vaciarFavoritos = async(req, res) => {
    const {id : usuarioId} = req.user;

    try {
        await Favoritos.destroy({
            where:{usuarioId}
        });

        res.json({msg: 'Se han quitado todas las publicaciones de Favoritos.'});

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Error en el servidor.'});
    }
}

module.exports = {
    obtenerFavoritos,
    alternarFavorito,
    vaciarFavoritos,
}
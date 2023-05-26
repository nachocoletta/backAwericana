const {Favoritos, Publicacion,Usuario } = require("../db");

const obtenerFavoritos = async(req, res) => {
    const {usuarioId} = req.params;

    try {
        const usuario = await Usuario.findByPk(usuarioId);

        if(!usuario){
            return res.status(404).json({msg: `El usuario con el ID ${usuarioId} no existe.`})
        } 

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
    const {usuarioId} = req.params;
    const {publicacionId} = req.body;

    try {

        const usuario = await Usuario.findByPk(usuarioId);
        const publicacion = await Publicacion.findByPk(publicacionId);

        if( !usuario || !publicacion ){
            return res.status(404).json({msg: `El usuario o publicación no existen.`})
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
    const {usuarioId} = req.params;

    try {
        const usuario = await Usuario.findByPk(usuarioId);


        if( !usuario ){
            return res.status(404).json({msg: `El usuario no existe.`})
        }

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
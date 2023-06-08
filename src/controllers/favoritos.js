const {Favoritos, Publicacion } = require("../db");

//Controlador para obtener la lista de las publicaciones favoritas del usuario
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

//Controlador para saber si una publicación ya se encuentra como favorito
const verificarFavorito = async(req, res) => {
    const {id : usuarioId} = req.user;
    const {publicacionId} = req.params;

    try {
        const existeEnFavoritos = await Favoritos.findOne({
            where:{
                publicacionId,
                usuarioId
            }
        });

        if(existeEnFavoritos){
            res.json({enFavoritos: true});
        }else{
            res.json({enFavoritos: false});
        }
       

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Error en el servidor.'});
    }
}

//Función para agregar una publicación a la lista de favoritos del usuario
const agregar = async (usuarioId, publicacionId) => {
    const itemDeFavoritos = await Favoritos.create({usuarioId, publicacionId});
    await itemDeFavoritos.save();
}

//Función para quitar una publicación de la lista de favoritos del usuario
const quitar = async(usuarioId, publicacionId) => {
    await Favoritos.destroy({
        where:{
            usuarioId,
            publicacionId
        }
    });
}

//Controlador para que cada vez que se ejecute, agregue o quite de favoritos una publicación
const alternarFavorito = async(req , res) =>{
    const {id : usuarioId} = req.user;
    const {publicacionId} = req.params;

    try {
        //Buscar la publicación
        const publicacion = await Publicacion.findOne({
            where: {
                id: publicacionId,
                estado: 'habilitada'
            } 
        });

        //Retornar si no existe
        if(  !publicacion ){
            return res.status(404).json({msg: `La publicación no existe.`})
        }

        //Retornar si la publicación es del propio usuario
        if(publicacion.usuarioId === usuarioId){
            return res.json({msg: 'No puede agregar a favoritos su propia publicación'});
        }

        //Buscar publicación en los favoritos del usuario
        const existe = await Favoritos.findOne({where: {
            usuarioId,
            publicacionId
        }});

        //Agregar si no existe, quitar si ya estaba
        if(existe){
           quitar(usuarioId, publicacionId);
           res.json({enFavoritos: false});
        }else{
            agregar(usuarioId, publicacionId);
            res.json({enFavoritos: true});
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Error en el servidor.'});
    }
}

//Controlador para borrar todas las publicaciones de la lista de favoritos
const vaciarFavoritos = async(req, res) => {
    const {id : usuarioId} = req.user;

    try {
        //Eliminar todas las filas que contengan el id del usuario logueado en la tabla de favoritos
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
    verificarFavorito
}
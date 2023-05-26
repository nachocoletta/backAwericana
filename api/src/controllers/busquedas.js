const { Op } = require("sequelize");
const {Publicacion, Talle, TipoPersona, TipoProducto} = require("../db");

const buscar = async(req, res) => {
    const {
        orden = 'DESC',
        genero,
        categoria,
        precioMin,
        precioMax,
        talle,
        termino,
        oferta,
    } = req.query;

    const filtroPublicacion = {};

    //si la variable es True se agregara el campo al filtro   
    
    termino     &&  (filtroPublicacion.titulo = {[Op.iLike]: '%' + termino + '%'}); // busqueda insensible   
    oferta      &&  (filtroPublicacion.oferta = true);

    if(precioMin && precioMax ){
        filtroPublicacion.precio = { [Op.between]: [precioMin, precioMax] };
    }else if(precioMax){
        filtroPublicacion.precio = { [Op.lte]: precioMax }; //$lte: menor o igual que
    }else if(precioMin){
        filtroPublicacion.precio = { [Op.gte]: precioMin }; //$gto: mayor o igual que
    } 

    let filtrosRelaciones = [];

    talle       &&  (filtrosRelaciones = [...filtrosRelaciones, {model: Talle, where: {nombre: talle}}]);
    genero      &&  (filtrosRelaciones = [...filtrosRelaciones, {model: TipoPersona, where: {nombre: genero}}]);
    categoria   &&  (filtrosRelaciones = [...filtrosRelaciones, {model: TipoProducto, where: {nombre: categoria}}]);
    
    const publicaciones = await Publicacion.findAll({
       where: filtroPublicacion,
       include: filtrosRelaciones,
       order: [['precio', orden]]
    }); 

    res.json(publicaciones);
}

module.exports = {
    buscar
}
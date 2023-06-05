const { Op, literal } = require("sequelize");
const {Publicacion, Talle, Persona, Producto, Categoria} = require("../db");

const buscar = async(req, res) => {
    const {
        orden = 'DESC',
        persona,
        producto,
        categoria,
        precioMin,
        precioMax,
        talle,
        termino,
        oferta,
        limit,
        offset
    } = req.query;

    const filtroPublicacion = {
        estado: 'habilitada'
    };

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

    talle       &&  (filtrosRelaciones = [...filtrosRelaciones, {   
                                                                    model: Talle,
                                                                    where: {nombre: talle}
                                                                }
                                         ]);

    persona      &&  (filtrosRelaciones = [...filtrosRelaciones, {
                                                                    model: Persona, 
                                                                    where: {nombre: persona}
                                                                 }
                                          ]);

    producto   &&  (filtrosRelaciones = [...filtrosRelaciones, {
                                                                    model: Producto,
                                                                    where: {nombre: producto}
                                                                }
                                          ]);

    categoria   &&  (filtrosRelaciones = [...filtrosRelaciones, {
                                                                    model: Producto,
                                                                    include: [{
                                                                                model: Categoria,
                                                                                where:{nombre: categoria}
                                                                            }]
                                                                }
                                          ]);

    let tipoOrden = null;

    if(orden === 'random' ){
        tipoOrden =  [[literal('RANDOM()')]];
    }else{
        tipoOrden = [['precio', orden]];
    }  

    const {rows, count} = await Publicacion.findAndCountAll({
       where: filtroPublicacion,
       include: filtrosRelaciones,
       offset,
       limit,
       order: tipoOrden
    }); 

    res.json({coincidencias: count, publicaciones: rows, });
}

module.exports = {
    buscar
}
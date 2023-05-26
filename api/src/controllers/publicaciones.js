const {Publicacion, Talle , TipoPersona, TipoProducto} = require("../db");

const obtenerPublicaciones = async(req, res) => {

    const { limit = 25, offset= 0 } = req.query;
    
    const { rows } = await Publicacion.findAndCountAll({
        include:[Talle, TipoPersona, TipoProducto],
        where:{
            estado: 'habilitada'
        },
        offset,
        limit
    });

    res.json( {publicaciones: rows} );
}

const obtenerPublicacion= async(req, res) => {

    const {id} = req.params;

    const publicacion = await Publicacion.findByPk(id, {
        include:[Talle, TipoPersona, TipoProducto]
    });

    if(!publicacion){
        return res.status(404).json({msg: `La publicación con el id:${id} no existe.`})
    }

    res.json(publicacion);
}

const crearPublicacion = async(req, res) => {

    const {fecha, precioOferta, descuento, expiracionOferta, estado, ...resto} = req.body;    

    try {
        const publicacion = await Publicacion.create(resto);
        await publicacion.save();

        res.status(201).json({
            msg: "La publicación fue creada.",
            publicacion
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error en el servidor.'
        })  
    }
    
}

const actualizarPublicacion = async(req, res) => {

    const {id} = req.params;
    const {fecha, precioOferta, descuento, expiracionOferta, usuarioId , estado, ...cambios} = req.body;
    
    try {
        const publicacion = await Publicacion.findByPk(id);

        if(!publicacion){
            return res.status(404).json({msg: `La publicación con el ID: ${id} no existe.`})
        }

        await publicacion.update(cambios);       
       
        res.status(201).json({
            msg: "La publicación fue actualizada.",
            publicacion
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error en el servidor.'
        })   
    }

}

const configurarDescuento = async( req, res) =>{
    const {id} = req.params;
    const {descuento = 0} = req.body;
    
    try {
        const publicacion = await Publicacion.findByPk(id);

        if(!publicacion){
            return res.status(404).json({msg: `La publicación con el id:${id} no existe.`})
        }

        if(descuento !== 0){
            const precioCopia = publicacion.precio;

            const cambios = {
                precio : publicacion.precio - (publicacion.precio * (descuento / 100)),
                precioOriginal: precioCopia,
                oferta: true,
                descuento
            }

            await publicacion.update(cambios); 
        
            res.status(201).json({
                msg: "El descuento fue aplicado.",
                publicacion
            })
        }else{
            const cambios = {
                precio: publicacion.precioOriginal,
                oferta: false,
                precioOriginal: null,
                descuento: 0
            }
            
            await publicacion.update(cambios); 
        
            res.status(201).json({
                msg: "El descuento fue quitado.",
                publicacion
            })
        } 

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error en el servidor.'
        })  
    }

}

const eliminarPublicacion = async(req, res) => {

    const {id} = req.params;
    const publicacion = await Publicacion.findByPk(id);

    if(!publicacion){
        return res.status(404).json({msg: `La publicación con el id:${id} no existe.`})
    }

    await publicacion.destroy();

    res.json({
        msg: "La publicación fue eliminada.",
        publicacion
    })
}

module.exports ={
    configurarDescuento,
    obtenerPublicaciones,
    obtenerPublicacion,
    crearPublicacion,
    actualizarPublicacion,
    eliminarPublicacion
}
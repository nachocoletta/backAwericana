
const {Publicacion, Talle , Persona, Producto, Imagen, Pago} = require("../db");

const { quitarPublicacionDeListas } = require("../Helpers/quitarPublicacionDeListas");

const obtenerPublicaciones = async(req, res) => {

    const { limit = 25, offset= 0 } = req.query;
    
    const { rows } = await Publicacion.findAndCountAll({
        include:[Talle, Persona, Producto, Pago],
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
        include:[Talle, Persona, Producto],
        where:{
            estado: 'habilitada'
        },
    });

    if(!publicacion){
        return res.status(404).json({msg: `La publicación con el id:${id} no existe.`})
    }

    res.json(publicacion);
}

const crearPublicacion = async(req, res) => {

    let {fecha, precioOriginal, descuento, expiracionOferta, estado, talleId, personaId, productoId, imagenes, ...resto} = req.body;    
    const limiteImagenes = 10;
    try {
        const talle = await Talle.findByPk(talleId);

        if(!talle){
            return res.status(400).json({msg: `No existe el talle con el ID: ${talleId}`});
        }

        const persona = await Persona.findByPk(personaId);

        if(!persona){
            return res.status(400).json({msg: `No existe la persona con el ID: ${personaId}`});
        }

        const producto = await Producto.findByPk(productoId);

        if(!producto){
            return res.status(400).json({msg: `No existe el producto con el ID: ${productoId}`});
        }

        if(imagenes.length === 0){
            return res.status(400).json({msg: `Debe incluir por lo menos una imagen`});
        }

        const imagenPortada = imagenes[0];
        //imagenes.shift();

        const body = {...resto, talleId, personaId, productoId, imagenPortada}

        const publicacion = await Publicacion.create(body);
        await publicacion.save();

        const subirImagen = async (imagen) => {
            const imagenParaSubir = await Imagen.create({link: imagen, publicacionId: publicacion.id});
            await imagenParaSubir.save();
        }

        if(imagenes.length > limiteImagenes ){
            imagenes = imagenes.slice(0, 10);
        }

        if(imagenes.length < limiteImagenes ){
            for (let i = 0; i < (limiteImagenes  - imagenes.length) ; index++) {
                imagenes = [...imagenes, ''];
            }
        }

        for (let i = 0; i < imagenes.length; i++) {
            subirImagen(imagenes[i]);
        }
            
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
    let {fecha, precioOriginal, descuento, expiracionOferta, usuarioId , estado, talleId, personaId, productoId, imagenes, ...cambios} = req.body;
    const limiteImagenes = 10;

    try {
        const publicacion = await Publicacion.findOne({
            where:{
                id,
                estado: 'habilitada',
                usuarioId
            },
        });

        if(!publicacion){
            return res.status(404).json({msg: `La publicación con el ID: ${id} no existe.`})
        }

        const talle = await Talle.findByPk(talleId);

        if(!talle){
            return res.status(400).json({msg: `No existe el talle con el ID: ${talleId}`});
        }

        const persona = await Persona.findByPk(personaId);

        if(!persona){
            return res.status(400).json({msg: `No existe la persona con el ID: ${personaId}`});
        }

        const producto = await Producto.findByPk(productoId);

        if(!producto){
            return res.status(400).json({msg: `No existe el producto con el ID: ${productoId}`});
        }

        const imagenPortada = imagenes[0].link;

        const body = {...cambios, talleId, personaId, productoId, imagenPortada};

        await publicacion.update(body); 
        
        if(imagenes.length > limiteImagenes ){
            imagenes = imagenes.slice(0, 10);
        }

        imagenes.forEach(async(imagen) => {
            let imagenAModificar = await Imagen.findOne({
                where: {
                    publicacionId: id,
                    id: imagen.id
                }
            });

            if(imagenAModificar){
                imagenAModificar.update({link: imagen.link});
            }

        });
       
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
    const {descuento = 0, expiracion} = req.body;
        
    try {
        const publicacion = await Publicacion.findByPk(id, {
            where:{
                estado: 'habilitada'
            },
        });

        if(!publicacion){
            return res.status(404).json({msg: `La publicación con el id:${id} no existe.`})
        }

        if(descuento !== 0 && expiracion){
            const precioCopia = publicacion.precio;
            const expiracionOferta = new Date(Date.parse(expiracion));
            
            const cambios = {
                precio : publicacion.precio - (publicacion.precio * (descuento / 100)),
                precioOriginal: precioCopia,
                oferta: true,
                expiracionOferta,
                descuento
            }

            await publicacion.update(cambios); 
        
            res.status(201).json({
                msg: "El descuento fue aplicado.",
                publicacion
            })
        }else{
            const cambios = { 
                oferta: false,
                precioOriginal: null,
                descuento: 0,
                expiracionOferta: null
            }
           
            publicacion.precioOriginal && (cambios.precio = publicacion.precioOriginal);
            
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

    quitarPublicacionDeListas(id);

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
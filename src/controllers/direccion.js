const { Direccion, Usuario, Pais } = require("../db");
const axios = require('axios');

// obtenerDirecciones,
//     obtenerDireccion,
//     crearDireccion,
//     modificarDireccion
const obtenerDirecciones = async (req, res) => {
    const { id } = req.user;

    const direcciones = await Direccion.findAll({
        include: [
            {
                model: Usuario,
                where: {
                    id: id
                }
            },
            {
                model: Pais
            }
        ],
    })

    return direcciones.length ? 
        res.status(200).json(direcciones) :
        res.status(404).json({msg: `El usuario con ID ${id} no tiene direcciones asociadas`}) 
}

const obtenerDireccion = async (req, res) => {
    const { id } = req.user;
    const {direccionId} = req.params;

    try {
        const direccion = await Direccion.findOne({
            where: {
                id: direccionId,
                usuarioId: id
            }
        });

        if(!direccion){
            return res.status(404).json({msg: `La dirección con el ID: ${direccionId} no existe.`});
        }
    
        res.status(200).json(direccion);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error en el servidor.'
        })  
    }

    
}

const eliminarDireccion = async (req, res) => {
    const { id } = req.params
    
    try {
        const direccion = await Direccion.findByPk(id)
        
        if(direccion){
            await Direccion.destroy({
                where: {
                    id: id
                }
            })
            res.status(200).json({msg: `Dirección correctamente eliminada`, direccion})
        }else{
            res.status(404).json({msg: `La direccion con ID: ${id} no se encontró en la base de datos`})
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const crearDireccion = async (req, res) => {
    // const { idUsuario } = req.query
    const { id } = req.user
    let { calle, numeracion, codigoPostal, ciudad, provincia, idPais} = req.body
    // idPais
    try {
        const usuario = await Usuario.findByPk(id)

        if(!usuario){
            return res.status(404).json({msg: `Usuario con ID: ${id} no encontrado`})
        }

        calle = calle.toLowerCase()
        ciudad = ciudad.toLowerCase()
        provincia = provincia.toLowerCase()
        


        const apiKey = 'AIzaSyAwTdbSN0Fg920LnRkk2zxw-c2C_TupLZc';
        const direccionCompleta = `${calle} ${numeracion}, ${codigoPostal} ${ciudad}, ${provincia}`;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(direccionCompleta)}&key=${apiKey}`;

        const response = await axios.get(url);
        const { status, results } = response.data;

        // console.log( status, results )
        const { lat, lng } = results[0].geometry.location;
        
        const direccion = await Direccion.create({
            calle,
            numeracion,
            codigoPostal,
            ciudad,
            provincia,
            latitud: lat,
            longitud: lng
        })


        // console.log('coordenadas', lat, lng )

        const pais = await Pais.findByPk(idPais)

        // console.log(pais)
        await direccion.setUsuario(usuario)
        await direccion.setPai(pais)

        res.status(200).json(direccion)

    } catch (error) {
        console.log(error.message)
        res.status(500).json({error: error.message})
    }
}

const modificarDireccion = async (req, res) => {
    const { id } = req.params
    
    const { calle, numeracion, codigoPostal, ciudad, provincia, idPais} = req.body

    try {
        const direccionSeleccionada = await Direccion.findOne({
            where: {
                id: id
            }
        })

        const pais = await Pais.findByPk(idPais)
        // console.log(direccionSeleccionada)
        // return true
        if(direccionSeleccionada){
            direccionSeleccionada.calle = calle;
            direccionSeleccionada.numeracion = numeracion;
            direccionSeleccionada.codigoPostal = codigoPostal;
            direccionSeleccionada.ciudad = ciudad;
            direccionSeleccionada.provincia = provincia
            
            await direccionSeleccionada.save()
            await direccionSeleccionada.setPai(pais)
            
            res.status(200).json(direccionSeleccionada)
        }else {
            res.status(404).json({msg: `No se encuentra la dirección con ID: ${id}`})
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({error: error.message})
    }
}

module.exports = { obtenerDirecciones, eliminarDireccion, crearDireccion, modificarDireccion, obtenerDireccion}
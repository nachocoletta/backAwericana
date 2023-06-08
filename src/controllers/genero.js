const { Persona } = require("../db");

const obtenerGeneros = async (req, res) => {

    const generos = await Persona.findAll()

    return generos.length ? 
        res.status(200).json(generos) :
        res.status(404).json({msg: `No hay generos`})
}


module.exports = { obtenerGeneros }

const { Pais } = require("../db");

const obtenerPaises = async (req, res) => {

    const paises = await Pais.findAll()

    return paises.length ? 
        res.status(200).json(paises) :
        res.status(404).json({msg: `No hay paises`})
}


module.exports = { obtenerPaises }

const { Talle } = require("../db");

const obtenerTalles = async (req, res) => {

    const talles = await Talle.findAll()

    return talles.length ? 
        res.status(200).json(talles) :
        res.status(404).json({msg: `No hay talles`})
}


module.exports = { obtenerTalles}

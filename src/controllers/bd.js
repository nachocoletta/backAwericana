const poblarBaseDeDatos = require("../seeders/cargaBaseDeDatos");

const iniciarBaseDeDatos = async (req, res) =>{
    poblarBaseDeDatos();
    res.json({msg: 'Se ha completado la carga en la base de datos.'});
}

module.exports = iniciarBaseDeDatos;
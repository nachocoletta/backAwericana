const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('direccion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    calle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numeracion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    codigoPostal: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ciudad: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    provincia: {
        type: DataTypes.STRING,
        allowNull: false
    },
    latitud: {
        type: DataTypes.STRING,
        allowNull: false
    },
    longitud: {
        type: DataTypes.STRING,
        allowNull: false
    },
  });
};

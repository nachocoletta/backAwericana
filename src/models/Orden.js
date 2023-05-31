const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('orden', {
    id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
      autoIncrement: true
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
    monto: {
      type: DataTypes.FLOAT,
      allowNull: false,

    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'enviada', 'cancelada', 'recibida'),
      allowNull: false
    },
  });
};

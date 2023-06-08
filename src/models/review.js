const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("review", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    puntaje: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    estadoCumpleExpectativas: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("publicacion", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    descuento:{
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    oferta: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    precioOriginal:{
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    expiracionOferta:{
      type: DataTypes.DATE,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM("habilitada", "pausada", "finalizada"),
      defaultValue: "habilitada"
    }   
  });
};



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
    },
    compradorId:{
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fechaEntrega:{
      type: DataTypes.DATE,
      allowNull: true
    },
    estadoEntrega: {
      type: DataTypes.ENUM("Empacando", "En camino", "Esperando retiro", "Entregado"),
      allowNull: true
    },
    tipoEntrega: {
      type: DataTypes.ENUM("Retiro", "Envio", "Convenir"),
      defaultValue: "Envio"
    },
    imagenPortada:{
      type: DataTypes.STRING,
      allowNull: false
    },
    estadoReclamo: {
      type: DataTypes.ENUM("devuelto", "rechazado","aceptado","procesando", "permitido", "bloqueado"),
      allowNull: true
    },
    fechaCompra:{
      type: DataTypes.DATE,
      allowNull: true 
    }

  }/*,
  {
    hooks: {
      afterUpdate: async (publicacion, options) => {

        if (publicacion.changed('expiracionOferta')) {
          const ahora = new Date();
          const sieteDias = new Date(ahora.getTime() + (7 * 24 * 60 * 60 * 1000)); 
                     
          const cambios = { 
            oferta: false,
            precioOriginal: null,
            descuento: 0,
            expiracionOferta: null
          }
        
          publicacion.precioOriginal && (cambios.precio = publicacion.precioOriginal);
        
          await publicacion.update(cambios);
            
          
        }

      }
    }
  } */);
};



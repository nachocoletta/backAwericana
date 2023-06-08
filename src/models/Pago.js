const { DataTypes, Sequelize } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("Pago", {
    ultimosdigitos: {
      type: DataTypes.STRING,
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("approved", "pending", "rejected"),
      allowNull: false,
    },
    tipoDeOperacion: {
      type: DataTypes.ENUM(
        "credit_card",
        "rapipago",
        "pagofacil",
        "account_money"
      ),
      allowNull: false,
    },
    userId:{
      type: DataTypes.STRING,
    },
    transaccionId:{
      type: DataTypes.STRING,
    },
    precioTotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    precioDeEnvio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });
};

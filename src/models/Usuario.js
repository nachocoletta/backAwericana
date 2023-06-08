const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Usuario = sequelize.define("usuario", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
      allowNull: false,
    },
    resetpasswordcode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    habilitado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fechaNacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    calificacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    dni: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    external_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    external_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Usuario.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password; // Excluir el campo de contraseña
    return values;
  };

  return Usuario;
};

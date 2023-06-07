require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, URL, URL_DB } = process.env;

// const sequelize = new Sequelize(
//   `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
//   {
//     logging: false, // set to console.log to see the raw SQL queries
//     native: false, // lets Sequelize know we can use pg-native for ~30% more speed
//   }
// );

// const sequelize = new Sequelize(URL, {
//   logging: false, // set to console.log to see the raw SQL queries
//   native: false, // lets Sequelize know we can use pg-native for ~30% more speed
// }); //

const sequelize = new Sequelize(URL_DB, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
}); //

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring

const {
  // Categoria,
  Direccion,
  Imagen,
  Producto,
  Talle,
  // Carrito,
  Publicacion,
  Usuario,
  Persona,
  Categoria,
  Pago,
  Banner,
  Pais,
  Review,
} = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);
//*DEFINIEDO RELACIONES Productos
/*Publicacion.belongsTo(Marca);
Marca.hasMany(Publicacion);*/

Publicacion.belongsTo(Talle);
Talle.hasMany(Publicacion);

Producto.belongsTo(Categoria);
Categoria.hasMany(Producto);

Imagen.belongsTo(Publicacion);
Publicacion.hasMany(Imagen, { order: [["id", "DESC"]] });

Usuario.hasMany(Publicacion);
Publicacion.belongsTo(Usuario);

Usuario.hasMany(Direccion);
Direccion.belongsTo(Usuario);

Pais.hasMany(Direccion);
Direccion.belongsTo(Pais);

Pago.belongsToMany(Publicacion, { through: "PagoPublicacion" });
Publicacion.belongsToMany(Pago, { through: "PagoPublicacion" });

Usuario.belongsToMany(Publicacion, { through: "Carrito" });
Publicacion.belongsToMany(Usuario, { through: "Carrito" });
const { Carrito } = sequelize.models;
Carrito.belongsTo(Publicacion);
Carrito.belongsTo(Usuario);

Talle.hasMany(Publicacion);
Publicacion.belongsTo(Talle);

Persona.hasMany(Publicacion);
Publicacion.belongsTo(Persona);

Producto.hasMany(Publicacion);
Publicacion.belongsTo(Producto);

Usuario.belongsToMany(Publicacion, { through: "Favoritos" });
Publicacion.belongsToMany(Usuario, { through: "Favoritos" });
const { Favoritos } = sequelize.models;
Favoritos.belongsTo(Publicacion);
Favoritos.belongsTo(Usuario);

Usuario.hasMany(Review, { foreignKey: "usuario_id" });
Usuario.hasMany(Review, { foreignKey: "usuario_admin_id" });
Review.belongsTo(Usuario, { foreignKey: "usuario_id" });
Review.belongsTo(Usuario, { foreignKey: "usuario_admin_id" });

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};

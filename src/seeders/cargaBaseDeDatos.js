//Importar modelos
const {
  Talle,
  Categoria,
  Producto,
  Pais,
  Persona,
  Usuario,
  Publicacion,
  Imagen
} = require("../db.js"); 

//importar datos que permaneceran en producción
const { paises } = require("./paises.js");
const { talles } = require("./talles.js");
const { personas } = require("./personas.js");
const { categorias } = require("./categorias.js");
const { productos } = require('./productos.js');
const { admin } = require('./admin.js');

//Importar datos que solo se usaran en el desarrollo
const { usuarios } = require('./usuarios.js');
const { publicaciones } = require('./publicaciones.js');

//Rellenar la base de datos con los datos de los archivos seeders
const poblarBaseDeDatos = async () => {
  try {
    const existeUsuarios = await Usuario.findOne(); 
    if(!existeUsuarios){
      await Usuario.bulkCreate(admin);
      
      //Cargar usuarios para pruebas
      await Usuario.bulkCreate(usuarios); 
    }

    const existenDatosPais = await Pais.findOne();
    if(!existenDatosPais){
      await Pais.bulkCreate(paises);
    }
    
    const existenDatosTalles = await Talle.findOne();    
    if(!existenDatosTalles){
      await Talle.bulkCreate(talles);
    }
    
    const existenDatosPersonas = await Persona.findOne();    
    if(!existenDatosPersonas){
      await Persona.bulkCreate(personas);
    }

    const existenDatosCategorias = await Categoria.findOne();    
    if(!existenDatosCategorias){
      await Categoria.bulkCreate(categorias);
    }  

    const existenDatosProductos = await Producto.findOne();    
    if(!existenDatosProductos){
      await Producto.bulkCreate(productos);
    }
    
    //cargar publicaciones para pruebas
    const existenDatosPublicaciones = await Publicacion.findOne();    
    if(!existenDatosPublicaciones){
      //Por cada publicación: cargar en la tabla publicaciones con los datos del campo 'body'
      // y luego cargar la tabla de imagenes con los datos del campo 'images'
      publicaciones.forEach(async(publicacion) => {
        let publicacionASubir = await Publicacion.create(publicacion.body);
        await publicacionASubir.save();

        publicacion.images.forEach(async(imagen) => {
          let imagenParaSubir = await Imagen.create({
            link: imagen.link,
            publicacionId : publicacionASubir.id //id que se obtuvo al cargar la publicación
          });
          await imagenParaSubir.save(); 
        });

      });    
    }  
  
    return true;
    
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

module.exports = poblarBaseDeDatos;

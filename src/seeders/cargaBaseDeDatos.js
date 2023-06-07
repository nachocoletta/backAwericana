//const { Router } = require("express");
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

//const router = Router();

//importar datos que permaneceran en producción
const { paises } = require("./paises.js");
const { talles } = require("./talles.js");
const { personas } = require("./personas.js");
const { categorias } = require("./categorias.js");
const { productos } = require('./productos.js');
const { admin } = require('./admin.js');
const { publicaciones } = require('./publicaciones.js');

//Importar usuarios de prueba para el desarrollo
const { usuarios } = require('./usuarios.js');
const { crearPublicacion } = require("../controllers/publicaciones.js");

//Volcar datos de los seeders en la Base de datos
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
    
    const existenDatosPublicaciones = await Publicacion.findOne();    
    if(!existenDatosPublicaciones){

      publicaciones.forEach(async(publicacion) => {
        let publicacionASubir = await Publicacion.create(publicacion.body);
        await publicacionASubir.save();

        publicacion.images.forEach(async(imagen) => {
          let imagenParaSubir = await Imagen.create({
            link: imagen.link,
            publicacionId : publicacionASubir.id
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

/*router.post("/", async (req, res) => {
  if (await poblarBaseDeDatos()) {
    return res.status(200).json({ message: "base de datos inicializada" });
  } else {
    return res.status(400).json({ error: "no se pudo cargar" });
  }
}); */

module.exports = poblarBaseDeDatos;

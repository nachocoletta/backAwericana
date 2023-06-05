const { Banner } = require("../db");

const { uploadImage, deleteImage } = require("../utils/cloudinary");

const fs = require("fs-extra")

const subirImagen = async (req, res) => {
  try {
    const { nombre, url } = req.body;
    // const image = req.files;

    // console.log("nombre: ", nombre)
    // console.log("req.files: ", req.files.image)

    if (req.files?.image) {
      const result = await uploadImage(req.files.image.tempFilePath);
      // console.log(result )

      const nuevoImagenDeBanner = await Banner.create({
        url: url,
        imagen: result.secure_url,
        urlCloudinaryParaBorrar: result.public_id
      });

      await fs.unlink(req.files.image.tempFilePath)

      res.status(200).json(nuevoImagenDeBanner);
    } else {
      res.status(404).json({ msg: `No se pudo subir la imagen` });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

const obtenerImagenes = async (req, res) => {
  const imagenesDelBanner = await Banner.findAll();

  return imagenesDelBanner.length
    ? res.status(200).json(imagenesDelBanner)
    : res.status(404).json({ msg: `No hay imagenes` });
};

const borrarImagen = async (req, res) => {

    const { id } = req.params

    const imagen = await Banner.findByPk(id)

    if(!imagen){
        return res.status(404).json({
            msg: `La imagen con ID: ${id} no existe en la base de datos`
        })
    }else {
        await deleteImage(imagen.urlCloudinaryParaBorrar)
        await imagen.destroy()
        
    }

    return res.status(200).json({
        msg: `La imagen fue eliminada`,
        imagen
    })
}

module.exports = { obtenerImagenes, subirImagen, borrarImagen};

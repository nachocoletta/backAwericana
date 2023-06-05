const { faker } = require("@faker-js/faker");
const express = require("express");
const router = express.Router();



router.get("/all", (req, res) => {
  const prendas = generarPrendas(20);
  res.json(prendas);
});

function generarPrendas(cantidad) {
  const publicaciones = [];

  for (let i = 0; i < cantidad; i++) {
    const prenda = {
      nombre: faker.commerce.productName(),
      descripion: faker.commerce.productDescription(),
      talle: faker.Helpers.arrayElement(["S", "M", "L", "XL"]),
      color: faker.vehicle.color(),
      marca: faker.commerce.productAdjective(),
      imagen: [
        faker.image.urlLoremFlickr({ category: "fashion" }),
        faker.image.urlLoremFlickr({ category: "fashion" }),
        faker.image.urlLoremFlickr({ category: "fashion" }),
      ],
    };

    const publicacion = {
      fecha: faker.date.anytime(),
      precio: faker.commerce.price(),
      estado: "habilitada",
      user: faker.internet.userName(),
      producto: prenda,
    };

    publicaciones.push(publicacion);
  }

  return publicaciones;
}


module.exports = router;

// Ejemplo de uso: generar 5 prendas de ropa

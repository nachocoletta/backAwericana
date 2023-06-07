const { Usuario, Review } = require("../db");

const { Sequelize } = require("sequelize");

Review.afterCreate(async (review, options) => {
  const usuarioAdminId = review.usuario_admin_id;

  // Obtener el promedio de calificaciones de los reviews para el usuario administrador
  const averageRating = await Review.findOne({
    attributes: [
      [Sequelize.fn("AVG", Sequelize.col("puntaje")), "averageRating"],
    ],
    where: {
      usuario_admin_id: usuarioAdminId,
    },
  });

  const average = averageRating.dataValues.averageRating;

  // Actualizar el campo calificacion en el modelo Usuario para el usuario administrador
  await Usuario.update(
    { calificacion: average },
    { where: { id: usuarioAdminId, rol: "admin" } }
  );

  console.log(
    "Campo calificacion actualizado para el usuario administrador:",
    average
  );
});

module.exports = Review;

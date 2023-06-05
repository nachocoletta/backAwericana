const { Usuario, Review } = require("../db");
const { handleHttpError } = require("../utils/handleError");
const getReviews = async (req, res) => {
  try {
    const data = await Review.findAll({
      include: [
        {
          model: Usuario,
          where: { rol: "admin" },
          attributes: ["nombre", "apellido", "email", "rol", "calificacion"],
        },
      ],
      attributes: {
        exclude: ["usuarioId"],
      },
    });

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    handleHttpError(res, { error: error.message });
  }
};
const getReview = async (req, res) => {
  res.send("hello");
};
const createReview = async (req, res) => {
  try {
    const { body } = req;

    const newReview = await Review.create(body);

    if (Object.keys(newReview).length === 0) {
      handleHttpError(res, "Error al crear review", 404);
      return;
    }
    res.status(200).json(newReview);
  } catch (error) {
    handleHttpError(res, { error: error.message }, 500);
  }
};
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const review = await Review.findByPk(id);

    if (!review) {
      return handleHttpError(res, `Review con id ${id} no encontrada`, 404);
    }

    // Actualizar los campos necesarios de la review
    review.comentario = body.comentario;
    review.puntaje = body.puntaje;
    review.fecha = body.fecha;

    await review.save();

    res.status(200).json(review);
  } catch (error) {
    handleHttpError(res, { error: error.message }, 500);
  }
};
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);

    if (!review) {
      return handleHttpError(res, `review con id ${id} no encontrada`, 404);
    }
    await review.destroy();

    res.status(200).json({ message: "review eliminada" });
  } catch (error) {
    handleHttpError(res, { error: error.message }, 404);
  }
};

module.exports = {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
};

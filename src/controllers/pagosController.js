const mercadopago = require("mercadopago");
const { Publicacion, Carrito } = require("../db");
const { finalizarPublicacion } = require("../Helpers/finalizarPublicacion");
const { ACCESS_TOKEN_MP, URL } = process.env;
const { createPago } = require("../Helpers/pagos.Helper");

mercadopago.configure({
  access_token: ACCESS_TOKEN_MP,
});

async function getUrlPago(req, res) {
  const { userid } = req.params;

  // verificar que no te puedas comprar a vos mismo.
  // implementar que en la funcion que aniade al carrito, no pueda si el id del usuario que quiere agregar al carrito
  // es igual al del duenio la publicacion.

  const carrito = await Carrito.findAll({
    include: [Publicacion],
    where: { usuarioId: userid },
  });

  // console.log(carrito[0].publicacion)

  if (!carrito || carrito.length === 0)
    return res.status(404).json({
      Error:
        "No se ha encontrado un carrito con publicaciones para el usuario enviado!",
    });
  let carritoMapeado = carrito.map((p) => {
    return {
      currency_id: "ARS",
      title: p.publicacion.titulo,
      unit_price: p.publicacion.precio,
      quantity: 1,
      description: p.publicacion.descripcion,
      picture_url: p.publicacion.imagenPortada,
    };
  });

  try {
    const result = await mercadopago.preferences.create({
      back_urls: {
        success: `${URL}/pagos/success`,
        pending: `${URL}/pagos/pending`,
        failure: `${URL}/pagos/failure`,
      },
      items: carritoMapeado,
      notification_url: `https://1f29-179-41-145-110.ngrok-free.app/pagos/notificar?userid=${userid}`,
    });

    res.send(`<a href=${result.body.init_point}> pagar <a/>`);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
}

async function notificarYConfirmarPago(req, res) {
  try {
    const payment = req.query;
    // console.log(payment.userid);
    const body = req.body;
    if (payment.type === "payment") {
      const data = await mercadopago.payment.findById(payment["data.id"]);
      // console.log(data.response);
      // pago rechazado ---> status = rejected
      // pago pagofacil ---> status = pending / in_progess
      // pago aprobado ---> status = aproved


      // busco el carrito en la db

      const carrito = await Carrito.findAll({
        include: [Publicacion],
        where: { usuarioId: payment.userid },
      });

      // creo un array con los ids de las publicaciones del carrito

      let carritoIds = carrito.map((p) => {
        return p.publicacion.id;
      });

      switch (data.response.status) {
        case "approved":

          // finalizo las publicaciones del carrito
          for (let i = 0; i < carritoIds.length; i++) {
            finalizarPublicacion(carritoIds[i], payment.userid);
          }

          // creo un pago con al informacion de la transaccion
          await createPago(
            (ultimosdigitos = data.response.card.last_four_digits),
            (estado = data.response.status),
            (tipoDeOperacion = data.response.payment_type_id),
            (precio = data.response.transaction_amount),
            (publicaciones = carritoIds),
            (userId = payment.userid),
            (transaccionId =  data.response.id),
          );

          // vacio el carrito
          await Carrito.destroy({
            where: { usuarioId: payment.userid },
          });
          break;
        case "pending":
          // await createPago(
          //   (ultimosdigitos = data.response.card.last_four_digits),
          //   (estado = data.response.status),
          //   (tipoDeOperacion = data.response.payment_type_id),
          //   (precio = data.response.transaction_amount),
          //   (publicaciones = carritoIds),
          //   (userId = payment.userid),
          //   (transaccionId =  data.response.id),

          // );

          break;
        case "rejected":
          await createPago(
            (ultimosdigitos = data.response.card.last_four_digits),
            (estado = data.response.status),
            (tipoDeOperacion = data.response.payment_type_id),
            (precio = data.response.transaction_amount),
            (publicaciones = carritoIds),
            (userId = payment.userid),
            (transaccionId =  data.response.id),

          );

          break;
        default:
          console.log("Estado desconocido.");

          break;
      }
    }

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something goes wrong" });
  }
}

module.exports = {
  getUrlPago,
  notificarYConfirmarPago,
};

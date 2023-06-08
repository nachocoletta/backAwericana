const mercadopago = require("mercadopago");
const { Publicacion, Carrito, Usuario, Direccion } = require("../db");
const { finalizarPublicacion } = require("../Helpers/finalizarPublicacion");
const { ACCESS_TOKEN_MP, URL_FRONT, URL,  URL_NOTIFICATION } = process.env;
const { createPago } = require("../Helpers/pagos.Helper");
const calcularDistancia = require("../Helpers/calcularEnvio");

mercadopago.configure({
  access_token: ACCESS_TOKEN_MP,
});

async function getPrecioEnvio(req, res){
  try {
    
  const { userid } = req.params;

  let carrito = await Carrito.findAll({
   include: [Publicacion],
   where: { usuarioId: userid },
 });
 
 if (!carrito || carrito.length === 0){
   return res.status(404).json({
     Error:
       "No se ha encontrado un carrito con publicaciones para el usuario enviado!",
   });
 }
 
 const compradorUser = await Usuario.findOne({
   where: { id: userid },
   include: [Direccion],
 });
 
 const vendedorUser = await Usuario.findOne({
   where: { id: carrito[0].publicacion.usuarioId },
   include: [Direccion],
 });
 
 // const carritoData = carrito.get({plain:true})
 const compradorUserData = compradorUser.get({plain:true})
 const vendedorUserData = vendedorUser.get({plain:true})

 // console.log( 'ashee', compradorUserData,"olaf",  vendedorUserData)
  
 // console.log(compradorUser, vendedorUser)
 // console.log(compradorUserData)
 let latitudOrigen = compradorUserData.direccions[0].latitud
 let longitudOrigen = compradorUserData.direccions[0].longitud
 let latitudDestino = vendedorUserData.direccions[0].latitud
 let longitudDestino = vendedorUserData.direccions[0].longitud

 // let latitudDestino = -34.660324
 // let longitudDestino = -58.551241

 // console.log(latitudOrigen, longitudOrigen, latitudDestino, longitudDestino)
   
 const cost = await calcularDistancia(latitudOrigen, longitudOrigen, latitudDestino, longitudDestino);
 res.json(cost)
  } catch (error) {
    console.log(error)
    res.status(404).json({Error:error})
  }


}

async function getUrlPago(req, res) {
  try {

    const { userid } = req.params;
    const {direccionId } = req.query
    // verificar que no te puedas comprar a vos mismo.
    // implementar que en la funcion que aniade al carrito, no pueda si el id del usuario que quiere agregar al carrito
    // es igual al del duenio la publicacion.
    
    const compradorUser = await Usuario.findOne({
      where: { id: userid },
      include: [Direccion],
    });
    
    
    
    
    const compradorUserData = compradorUser.get({plain:true})


    let carrito = await Carrito.findAll({
      include: [Publicacion],
      where: { usuarioId: userid },
    });
  
    if(!carrito) return res.status(404).json({Error: "Error, no se pudo encontrar su carrito o su carrito esta vacio"})
  


    const vendedorUser = await Usuario.findOne({
      where: { id: carrito[0].publicacion.usuarioId },
      include: [Direccion],
    });


    const vendedorUserData = vendedorUser.get({plain:true})

    
    if(!vendedorUser || !compradorUser) return res.status(404).json({Error: "Error, no se encontro a uno o ninguno de los usuarios."}) 
  
    // const carritoData = carrito.get({plain:true})
  
    if(compradorUserData.direccions.length === 0 || vendedorUserData.direccions.length === 0) return res.status(404).json({Error: "Error, uno o ninguno de los usuario tiene direcciones registradas."})  
  
    // console.log(compradorUser, vendedorUser)
    // console.log(compradorUserData)
    let latitudOrigen = compradorUserData.direccions[0].latitud
    let longitudOrigen = compradorUserData.direccions[0].longitud
    let latitudDestino = vendedorUserData.direccions[0].latitud
    let longitudDestino = vendedorUserData.direccions[0].longitud
  
    // let latitudDestino = -34.660324
    // let longitudDestino = -58.551241
  
    // console.log(latitudOrigen, longitudOrigen, latitudDestino, longitudDestino)
      
    const cost = await calcularDistancia(latitudOrigen, longitudOrigen, latitudDestino, longitudDestino);
      
    let UrlNotification = URL_NOTIFICATION ? URL_NOTIFICATION : URL;
  
    // console.log(UrlNotification);
  
    // console.log(carrito[0].publicacion)
  
    if (!carrito || carrito.length === 0){
      return res.status(404).json({
        Error:
          "No se ha encontrado un carrito con publicaciones para el usuario enviado!",
      });
    }
  
    let carritoMapeado = carrito?.map((p) => {
      return {
        currency_id: "ARS",
        title: p.publicacion.titulo,
        unit_price: p.publicacion.precio,
        quantity: 1,
        description: p.publicacion.descripcion,
        picture_url: p.publicacion.imagenPortada,
      };
    });
    const result = await mercadopago.preferences.create({
      back_urls: {
        success: `${URL_FRONT}/cart/payment-ponfirmed`,
        pending: `${URL_FRONT}/pagos/pending`,
        failure: `${URL_FRONT}/cart/error-payment`,
      },
      items: carritoMapeado,
      shipments: {
        cost,
        mode: "not_specified",
      },
      notification_url: `${UrlNotification}/pagos/notificar?userid=${userid}`,
    });

    res.send(result.body.init_point);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `Something goes wrong, ${error}` });
  }
}

async function notificarYConfirmarPago(req, res) {
  try {
    const payment = req.query;
    if (payment.type === "payment") {
      const data = await mercadopago.payment.findById(payment["data.id"]);

      // busco el carrito en la db

      const carrito = await Carrito.findAll({
        include: [Publicacion],
        where: { usuarioId: payment.userid },
      });

      // creo un array con los ids de las publicaciones del carrito

      let carritoIds = carrito.map((p) => {
        return p.publicacion.id;
      });

      console.log(data.response)

      switch (data.response.status) {
        case "approved":


          for (let i = 0; i < carritoIds.length; i++) {
            finalizarPublicacion(carritoIds[i], payment.userid);
          }

          await createPago(
            (ultimosdigitos = data.response.card.last_four_digits),
            (estado = data.response.status),
            (tipoDeOperacion = data.response.payment_type_id),
            (precioTotal = data.response.transaction_details.total_paid_amount),
            (publicaciones = carritoIds),
            (userId = payment.userid),
            (transaccionId =  data.response.id),
            (precioDeEnvio =  data.response.shipping_amount),
          );

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
            (transaccionId = data.response.id)
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
  getPrecioEnvio,

};

const transporter = require("../config/mailer");
const {Usuario, Publicacion} = require("../db");

const enviarMail = async ({correo, subject, message }) => {
   transporter.sendMail({
        from: `"Awericana" <awericana@gmail.com>'`, 
        to: `${correo}`, 
        subject, 
        text: `${message}` 
        //html: "<b>Hello world?</b>", // html body
      });

}

const notificarCompraVenta = async (usuarioId, publicacionId) => {
    const comprador = await Usuario.findByPk(usuarioId);
    const publicacion = await Publicacion.findByPk(publicacionId);
    const vendedor = await Usuario.findByPk(publicacion.usuarioId);

    const camposParaEmailaVendedor = {
        nombre: comprador.nombre,
        apellido: comprador.apellido,
        correo: comprador.email,
        subject: `Ha realizado una venta`,
        message: `${comprador.nombre} ${comprador.apellido} ha vendido su/s ${publicacion.titulo} .
        Pongase en contacto con el comprador a travez de ${comprador.email} . `
    }

    const camposParaEmailaComprador = {
        nombre: vendedor.nombre,
        apellido: vendedor.apellido,
        correo: vendedor.email,
        subject: `Ha realizado una compra`,
        message: `Usted ha comprado ${publicacion.titulo} a ${vendedor.nombre} ${vendedor.apellido}.
        Pongase en contacto con el vendedor a travez de ${vendedor.email} . `
    }
    
    enviarMail(camposParaEmailaVendedor);
    enviarMail(camposParaEmailaComprador);
}

module.exports = {
    notificarCompraVenta
}
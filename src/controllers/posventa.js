const { simularTracking } = require("../Helpers/simularTracking");
const transporter = require("../config/mailer");
const {Publicacion, Usuario} = require("../db");

const verificarDisponibilidadReclamo= async (publicacionId, compradorId) => {
    let estado = null;
    const publicacion = await Publicacion.findOne({
        where: {
            id: publicacionId,
            compradorId,
            estado: 'finalizada',
            estadoEntrega: 'Entregado'
        }
    });   
    
    if(!publicacion){
        return '';
    }

    estado = publicacion.estadoReclamo;

    if(publicacion.estadoReclamo !== 'procesando' && publicacion.estadoReclamo !== 'bloqueado' && publicacion.estadoReclamo !== 'devuelto' ){
         
        const fechaInicio = new Date(publicacion.fechaEntrega); // fecha inicial
        const fechaActual = new Date(); // fecha actual
        const limite = 60000; // 7 dias , 60000 milisegundos para pruebas

        const tiempoTranscurrido = fechaActual.getTime() - fechaInicio.getTime(); // diferencia de tiempo en milisegundos
       // const diasTranscurridos = Math.floor(tiempoTranscurrido / (1000 * 60 * 60 * 24)); // diferencia de tiempo en días
        const diasTranscurridos = tiempoTranscurrido; //Solo para pruebas

        if( diasTranscurridos <= limite ){
            publicacion.update({ estadoReclamo: 'permitido' })
            estado = 'permitido';
        }
        if( diasTranscurridos > limite ){
            publicacion.update({ estadoReclamo: 'bloqueado' })
            estado = 'bloqueado';
        } 
    }
    
    return estado;
}



const enviarReclamo = ({name, mail, subject, message, image, compradorId, publicacionId }) => {
    transporter.sendMail({
        from: `"${name}" <${mail}>'`, 
        to: 'awericana@gmail.com', 
        subject, 
        text: `[ Comprador: ${compradorId} ] [ reclamo sobre:  ${publicacionId} ] ${message}` ,
        html: `<img src = ${image} width = "500" height = "500" />`, 
      });

      return true;
}

const chequearReclamo = async (req, res) => {
    const {id : compradorId} = req.user;
    const {publicacionId} = req.body;

    const estado = await verificarDisponibilidadReclamo(publicacionId, compradorId);

    res.json({estado});
}

const iniciarReclamo = async (req, res) => {
    const {id : compradorId} = req.user;
    const {nombre, correo, subject, message, image, publicacionId} = req.body;

    if(await verificarDisponibilidadReclamo(publicacionId, compradorId) === 'permitido'){

        const exito = await enviarReclamo({nombre, correo, subject, message, image, compradorId, publicacionId });

        if(exito){
            
            const publicacion = await Publicacion.findOne({
                where: {
                    id: publicacionId,
                    compradorId,
                    estado: 'finalizada',
                    estadoEntrega: 'Entregado'
                }
            });

            await publicacion.update({ estadoReclamo: 'procesando' });

            res.json({msg: "El reclamo ha sido enviado"});
        }else{
            res.json({msg: "No se ha podido enviar el reclamo"});
        }
        
    }else{
        res.json({msg: "No permitido"});
    }

}

const actualizarEstadoEnvio = async (req, res) => {
    const {id : compradorId} = req.user;
    const {publicacionId} = req.body;
    
    await simularTracking(publicacionId, compradorId);

    res.json({msg: 'Estado actualizado'});
}

const revelarVendedor = async (req, res) => {
    const {id : compradorId} = req.user;
    const {publicacionId} = req.body;

    const publicacion = await Publicacion.findOne({
        where: {
            id: publicacionId,
            compradorId
        }
    })

    if(publicacion){
        const vendedor = await Usuario.findByPk(publicacion.usuarioId);

        res.json({email: vendedor.email});

    }else{
        res.json('');
    }

}

const avanzarDevolucion = async (req, res) => {
    const {id : compradorId} = req.user;
    const {publicacionId} = req.body;

    const publicacion = await Publicacion.findOne({
        where: {
            id: publicacionId,
            compradorId
        }
    })

    if(!publicacion){
        return res.status(400).json({msg: 'El usuario no ha realizado la compra que se indica.'});
    }

    if(publicacion.estadoReclamo === 'procesando'){
        let resolucion = 0;

        const numeroAzar = Math.floor(Math.random() * 2) + 1; //Math.random retorna numero entre 0 y 1, Math.floor redondea hacia abajo

        if(numeroAzar === 1){
            resolucion = 'aceptado'
        }
        
        if(numeroAzar === 2){
            resolucion = 'rechazado'
        }

        publicacion.update({estadoReclamo : resolucion});
       
    }else if(publicacion.estadoReclamo === 'aceptado'){
        publicacion.update({estadoReclamo : 'devuelto'});
    }

    res.json({msg:'Estado actualizado.'});
}

module.exports = {
    actualizarEstadoEnvio,
    iniciarReclamo,
    revelarVendedor,
    chequearReclamo,
    avanzarDevolucion
}
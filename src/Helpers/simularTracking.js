const {Publicacion} = require("../db");

const simularTracking = async (publicacionId, compradorId) => {
    const publicacion = await Publicacion.findOne({
        where: {
            id: publicacionId,
            compradorId
        }
    });

    if(!publicacion){
        return console.log("No se encontró la compra hecha por el usuario.");
    }

    if(publicacion.estadoEntrega !== 'Entregado'){

        if(publicacion.tipoEntrega === 'Retiro'|| publicacion.tipoEntrega === 'Convenir'){
            if(publicacion.estadoEntrega === 'Empacando'){
                const cambios = {
                    estadoEntrega: 'Esperando retiro'
                }

                await publicacion.update(cambios);

            }else if(publicacion.estadoEntrega === "Esperando retiro" ){
                const cambios = {
                    estadoEntrega: 'Entregado',
                    fechaEntrega: new Date()
                }
    
                await publicacion.update(cambios);
            }
        
        }

        if(publicacion.tipoEntrega === 'Envio'){
            if(publicacion.estadoEntrega === 'Empacando'){
                const cambios = {
                    estadoEntrega: 'En camino'
                }

                await publicacion.update(cambios);
                
            }else if(publicacion.estadoEntrega === "En camino" ){
                const cambios = {
                    estadoEntrega: 'Entregado',
                    fechaEntrega: new Date()
                }
    
                await publicacion.update(cambios);
            }
        }

    
        
       
    }
    

}

module.exports = {
     simularTracking
}

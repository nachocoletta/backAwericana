const { API_KEY_GOOGLE_CLOUD } = process.env;


const googleMapsClient = require("@google/maps").createClient({
  key: API_KEY_GOOGLE_CLOUD, 
});

async function calcularDistancia(lat1, lon1, lat2, lon2) {
    try {
    //   const { lat1, lon1, lat2, lon2 } = req.body;
      console.log(lat1, lon1, lat2, lon2);
      const origen = `${lat1},${lon1}`;
      const destino = `${lat2},${lon2}`;
  
      const response = await new Promise((resolve, reject) => {
        googleMapsClient.distanceMatrix(
          {
            origins: [origen],
            destinations: [destino],
          },
          (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response);
            }
          }
        );
      });
  
  
      if (response.json.status === "OK") {
        // const distancia = response.json.rows[0].elements[0].distance.value;
        const distanciaMetros = response.json.rows[0].elements[0].distance.value;
        const distanciaKilometros = Math.round(distanciaMetros / 1000);
        return distanciaKilometros
      } else {
        throw new Error("No se pudo calcular la distancia");
      }
    } catch (error) {
      console.log(error);
      return error
    }
  }
 
  
  function calcularCostoDeEnvio(distancia){

    
  }
  
  
  
  
  

// Ejemplo de uso:
const lat1 = 52.52; 
const lon1 = 13.405; 
const lat2 = 48.8566; 
const lon2 = 2.3522; 



module.exports = calcularDistancia;

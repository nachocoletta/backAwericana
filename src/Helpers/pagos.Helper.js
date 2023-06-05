const { Pago } = require("../db");

// Obtener todos los pagos
const getAllPagos = async (req, res) => {
  try {
    const pagos = await Pago.findAll();
    res.json(pagos);
  } catch (error) {
    console.error("Error al obtener los pagos:", error);
    res.status(500).json({ error: "Ocurrió un error al obtener los pagos" });
  }
};

// Obtener un pago por su ID
const getPagoById = async (req, res) => {
  const pagoId = req.params.id;
  try {
    const pago = await Pago.findByPk(pagoId);
    if (!pago) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }
    res.json(pago);
  } catch (error) {
    console.error("Error al obtener el pago:", error);
    res.status(500).json({ error: "Ocurrió un error al obtener el pago" });
  }
};

// Crear un nuevo pago
async function createPago(ultimosdigitos, estado, tipoDeOperacion, precioTotal, publicaciones, userId, transaccionId, precioDeEnvio){
  try {
    const nuevoPago = await Pago.create({
      ultimosdigitos,
      estado,
      tipoDeOperacion,
      precioTotal,
      userId,
      transaccionId,
      precioDeEnvio
    });

    console.log(nuevoPago)
    // if (publicaciones && Array.isArray(publicaciones)) {
    await nuevoPago.addPublicacion(publicaciones);
    //   }
    return nuevoPago
  } catch (error) {
    console.log(error)
    return error
  }
};

// Actualizar un pago existente
const updatePago = async (req, res) => {
  const pagoId = req.params.id;
  const { ultimosdigitos, status, tipoDeOperacion, precio } = req.body;
  try {
    const pago = await Pago.findByPk(pagoId);
    if (!pago) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }
    pago.ultimosdigitos = ultimosdigitos;
    pago.status = status;
    pago.tipoDeOperacion = tipoDeOperacion;
    pago.precio = precio;
    await pago.save();
    res.json(pago);
  } catch (error) {
    console.error("Error al actualizar el pago:", error);
    res.status(500).json({ error: "Ocurrió un error al actualizar el pago" });
  }
};

// Eliminar un pago
const deletePago = async (req, res) => {
  const pagoId = req.params.id;
  try {
    const pago = await Pago.findByPk(pagoId);
    if (!pago) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }
    await pago.destroy();
    res.json({ message: "Pago eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el pago:", error);
    res.status(500).json({ error: "Ocurrió un error al eliminar el pago" });
  }
};

module.exports = {
  getAllPagos,
  getPagoById,
  createPago,
  updatePago,
  deletePago,
};
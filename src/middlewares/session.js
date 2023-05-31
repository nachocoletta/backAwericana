const { Usuario } = require("../db");
const { handleHttpError } = require("../utils/handleError");
const { verifyToken } = require("../utils/handleJwt");

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.cookies) {
      handleHttpError(res, "Necesita iniciar sesion", 401);
      return;
    }

    const dataToken = await verifyToken(req.cookies.sessionLocal);

    if (!dataToken.id) {
      handleHttpError(res, "ERROR_ID_TOKEN", 401);
      return;
    }

    const user = await Usuario.findByPk(dataToken.id);
    const userJson = user.toJSON();
    delete userJson.password;
    req.user = userJson;
    next();
  } catch (error) {
    handleHttpError(res, "NOT_SESSION", 401);
  }
};

module.exports = authMiddleware;

const { handleHttpError } = require("../utils/handleError");

const checkRole = (roles) => async (req, res, next) => {
  try {
    const { rol } = req.user;
    const rolesByUser = rol;
    const checkValueRol = roles.some((rolSingle) =>
      rolesByUser.includes(rolSingle)
    );

    if (!checkValueRol) {
      handleHttpError(res, "USER_NOT_PERMISSIONS", 403);
      return;
    }
    next();
  } catch (e) {
    handleHttpError(res, "ERROR_PERMISSIONS", 403);
  }
};

module.exports = checkRole;

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
console.log(JWT_SECRET);

const tokenSign = async (user) => {
  const sign = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );
  return sign;
};

//Se debe pasar el token de session JWT
const verifyToken = async (tokenJwt) => {
  try {
    return jwt.verify(tokenJwt, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { tokenSign, verifyToken };

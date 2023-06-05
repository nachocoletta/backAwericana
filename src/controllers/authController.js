const { matchedData } = require("express-validator");
const { Usuario } = require("../db");
const { tokenSign } = require("../utils/handleJwt");
const { encrypt, compare } = require("../utils/handlePassword");
const { handleHttpError } = require("../utils/handleError");
const transporter = require("../config/mailer");

const CLIENT_URL = "http://localhost:3000/";

const userGet = async (req, res) => {
  try {
    const data = await Usuario.findAll();
    if (!data || data.length === 0) {
      return handleHttpError(res, "USUARIOS_NO_ENCONTRADOS");
    }
    res.status(200).json(data);
  } catch (error) {
    handleHttpError(res, "ERROR_OBTENER_USUARIOS");
  }
};
const userRegister = async (req, res) => {
  try {
    req = matchedData(req);

    // Check if email is already registered
    const user = await Usuario.findOne({ where: { email: req.email } });
    if (user) {
      return res.status(409).json({ error: "EMAIL_ALREADY_REGISTERED" });
    }
    const password = await encrypt(req.password);
    const body = { ...req, password };
    const dataUser = await Usuario.create(body);

    //Enviar correo electrónico de confirmación o bienvenida al usuario

    await transporter.sendMail({
      from: '"Awericana" <awericana@gmail.com>', // sender address
      to: req.email, // list of receivers
      subject: "¡Bienvenido a Awericana!", // Subject line
      text: "Gracias por registrarte en nuestra aplicación. Esperamos que disfrutes de tu experiencia.", // plain text body
      //html: "<b>Hello world?</b>", // html body
    });

    res.status(201).json(dataUser);
  } catch (error) {
    handleHttpError(res, error.message, 500);
  }
};

const userLogin = async (req, res) => {
  try {
    req = matchedData(req);
    console.log(req);
    const user = await Usuario.findOne({
      where: { email: req.email },
      attributes: [
        "id",
        "nombre",
        "apellido",
        "email",
        "password",
        "rol",
        "fechaNacimiento",
        "habilitado",
      ],
    });
    if (!user) {
      handleHttpError(res, "USER_NO_REGISTRADO", 404);
      return;
    }
    const hashPassword = user.password;
    const check = await compare(req.password, hashPassword);
    if (!check) {
      handleHttpError(res, "PASSWORD_INVALID", 401);
      return;
    }
    const data = {
      token: await tokenSign(user),
      user,
    };

    const expirationTime = 24 * 60 * 60 * 1000;
    res.cookie("sessionLocal", data.token, {
      expires: new Date(Date.now() + expirationTime),
      httpOnly: true,
    });
    res.status(200).json(data);
  } catch (error) {
    handleHttpError(res, error.message, 500);
  }
};

const logoutUser = (req, res) => {
  try {
    res.clearCookie("sessionLocal");
    // res.send("Logged out successfully");
    res.redirect(CLIENT_URL);
  } catch (error) {
    handleHttpError(res, error.message, 500);
  }
};
const loginSuccess = (req, res) => {
  try {
    if (req.user) {
      res.status(200).json({
        success: true,
        message: "successfull",
        user: req.user,
      });
    }
  } catch (error) {
    handleHttpError(res, "Necesitas iniciar Sesion", 404);
  }
};

module.exports = { userRegister, userLogin, userGet, logoutUser, loginSuccess };

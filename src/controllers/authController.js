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

    if (!user.habilitado) {
      handleHttpError(res, "USER_BANEADO", 400);
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

const changePassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Usuario.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: "No se encontró ningún usuario con ese correo electrónico.",
      });
    }

    const resetPasswordLink = `${process.env.URL_FRONT}/new-password`;

    const mailOptions = {
      from: '"Awericana" <awericana@gmail.com>',
      to: user.email,
      subject: "Cambio de contraseña",
      html: `Haz clic en el siguiente enlace para restablecer tu contraseña:<br/><a href="${resetPasswordLink}">${resetPasswordLink}</a>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message:
        "Pronto recibirás un correo electrónico para restablecer tu contraseña. Si no lo encuentras, comprueba la carpeta de correo no deseado y la papelera",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Debes ingresar tu correo electrónico." });
  }
};

const newPassword = async (req, res) => {
  const {id} = req.user;
  try {
    const { email, password } = req.body;

    // Validar que el correo electrónico y la contraseña no estén vacíos
    if (!email || !password) {
      return res.status(400).json({
        msg: "Por favor, proporciona tanto el correo electrónico como la contraseña.",
      });
    }

    const newPassword = await encrypt(password);

    await Usuario.update(
      { password: newPassword,
        email
      },
      { where: { id } }
    );

    res.json({ msg: "¡Tu contraseña ha sido cambiado exitosamente!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  userRegister,
  userLogin,
  userGet,
  logoutUser,
  loginSuccess,
  changePassword,
  newPassword,
};

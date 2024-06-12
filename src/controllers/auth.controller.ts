import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import ContactoModel from "../models/contacto.model";
import generateJWT from "../helpers/jwt";
import { CustomRequest } from "../middlewares/validate-jwt";
import sendEmail from "../helpers/email";
import path from "path";
import fs from "fs";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Verificar el email
    const contacto = await ContactoModel.findOne({ email: email });

    if (!contacto) {
      return res.status(401).json({
        ok: false,
        msg: "Las credenciales no son válidas",
      });
    }

    //Verificar el password
    const validarPassword = bcrypt.compareSync(password, contacto.password);
    if (!validarPassword) {
      return res.status(401).json({
        ok: false,
        msg: "Las credenciales no son válidas",
      });
    }

    // Generar Token
    const token = await generateJWT(contacto._id, contacto.email);

    return res.status(200).json({
      ok: true,
      contacto: contacto,
      token,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
      msg: "Hable con el administrador",
    });
  }
};

export const renewToken = async (req: CustomRequest, res: Response) => {
  const id = req._id;

  try {
    if (typeof id === "undefined") {
      throw new Error("No existe el ID");
    }

    const contacto = await ContactoModel.findById(id);
    //Generar el token
    const token = await generateJWT(id.toString());

    res.json({
      ok: true,
      token,
      contacto,
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({
      ok: false,
      error,
      msg: "Hable con el adminsitrador",
    });
  }
};

export const olvidoContrasena = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const existeContacto = await ContactoModel.findOne({
      email,
    });

    if (!existeContacto) {
      return res.status(400).json({
        ok: false,
        msg: "Los datos no coinciden",
      });
    }
    const id = existeContacto?._id;

    if (id) {
      //Generar token
      const token = await generateJWT(
        id,
        email,
        "5m",
        process.env.JWT_SECRET_PASS
      );

      //Guardar el token
      existeContacto.token = token;
      await existeContacto.save();

      const nombre = existeContacto.nombre;
      const apellido = existeContacto.apellido;

      const templatePath = path.join(
        __dirname,
        "../templates/olvidoContrasena.html"
      );

      const emailTemplate = fs.readFileSync(templatePath, "utf8");

      const personalizarEmail = emailTemplate
        .replace("{{ firstname }}", nombre)
        .replace("{{ lastname }}", apellido)
        .replace("{{ token }}", existeContacto.token);

      sendEmail(
        "gepsupirza@gufum.com",
        "Cambio de contraseña",
        personalizarEmail
      );

      return res.status(200).json({
        ok: true,
        msg: "Proceso exitoso",
        contacto: existeContacto,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      ok: false,
      msg: "No se logró validar sus datos",
    });
  }
};

export const cambioContrasena = async (req: CustomRequest, res: Response) => {
  const id = req._id;
  const { password } = req.body;
  const tokenPass = req.header("x-token-pass");

  try {
    if (!password || !tokenPass) {
      return res.status(400).json({
        ok: false,
        msg: "Valores invalidos",
      });
    }

    const contacto = await ContactoModel.findOne({ token: tokenPass });

    if (!contacto) {
      return res.status(400).json({
        ok: false,
        msg: "El token ya fue utilizado",
      });
    }

    const newPassword = bcrypt.hashSync(password, 10);

    const actualizarPassword = await ContactoModel.findByIdAndUpdate(
      id,
      {
        password: newPassword,
        token: "",
      },
      { new: true }
    );

    if (!actualizarPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Error al actualizar la constraseña",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Contraseña actualizada",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Error al actualizar la contraseña, hable con el administrador",
    });
  }
};

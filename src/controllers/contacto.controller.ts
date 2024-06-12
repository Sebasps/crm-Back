import { Request, Response } from "express";
import ContactoModel from "../models/contacto.model";
import bcrypt from "bcryptjs";

export const crearContacto = async (req: Request, res: Response) => {
  const { body } = req;
  const { email, password } = body;

  try {
    const existeEmail = await ContactoModel.findOne({ email: email });

    if (existeEmail) {
      return res.status(409).json({
        ok: false,
        msg: `Ya existe el mail: $(email)`,
      });
    }

    const newContacto = new ContactoModel({
      ...body,
    });
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      newContacto.password = bcrypt.hashSync(password, salt);
    }
    const contactoCreado = await newContacto.save();

    res.status(200).json({
      ok: true,
      msg: "Contacto creado satisfactoriamente",
      contacto: contactoCreado,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      ok: false,
      error,
      msg: "Error al crear el contacto, comuniquese con el administrador",
    });
  }
};

export const getContactos = async (req: Request, res: Response) => {
  try {
    const contactos = await ContactoModel.find();

    res.json({
      ok: true,
      contactos,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Error al consultar los contactos",
    });
  }
};

export const getUnContacto = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const contacto = await ContactoModel.findById({ _id: id });

    res.json({
      ok: true,
      contacto,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Error al consultar el contacto",
    });
  }
};

export const updateContacto = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { body } = req;
    const contactoActualizado = await ContactoModel.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
      }
    );

    res.json({
      ok: true,
      msg: "Contacto actualizado",
      contacto: contactoActualizado,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Error al actualizar el contacto",
    });
  }
};

export const eliminarContacto = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const contactoEliminado = await ContactoModel.findByIdAndDelete({
      _id: id,
    });

    res.json({
      ok: true,
      msg: "Contacto eliminado",
      contacto: contactoEliminado,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Error al eliminar el contacto",
    });
  }
};

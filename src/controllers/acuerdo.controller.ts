import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/validate-jwt";
import { AcuerdoModel } from "../models/acuerdo.model";

export const crearAcuerdo = async (req: CustomRequest, res: Response) => {
  const id = req._id;
  const { body } = req;
  const { descripcion, etapa, cliente } = body;

  try {
    const acuerdo = new AcuerdoModel({
      usuario: id,
      descripcion,
      etapa,
      cliente,
    });

    const newAcuerdo = await acuerdo.save();

    res.status(200).json({
      ok: true,
      msg: "Acuerdo creado",
      acuerdo: newAcuerdo,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      ok: false,
      error,
      msg: "Error al crear el acuerdo, comuniquese con el administrador",
    });
  }
};

export const getAcuerdos = async (req: Request, res: Response) => {
  try {
    const acuerdos = await AcuerdoModel.find()
      .populate({
        path: "usuario",
        select: "nombre apellido email numeroCelular",
      })
      .populate({
        path: "cliente",
        select: "nombre apellido email numeroCelular",
      });

    res.json({
      ok: true,
      acuerdos: acuerdos,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Error al consultar los acuerdos",
    });
  }
};

export const getUnAcuerdo = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const acuerdo = await AcuerdoModel.findById({ _id: id });

    res.json({
      ok: true,
      acuerdo: acuerdo,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Error al consultar el acuerdo",
    });
  }
};

export const updateAcuerdo = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { body } = req;
    const acuerdoActualizado = await AcuerdoModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    res.json({
      ok: true,
      msg: "Acuerdo actualizado",
      acuerdo: acuerdoActualizado,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Error al actualizar el acuerdo",
    });
  }
};

export const eliminarAcuerdo = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const acuerdoEliminado = await AcuerdoModel.findByIdAndDelete({
      _id: id,
    });

    res.json({
      ok: true,
      msg: "Interaccion eliminada",
      acuerdo: acuerdoEliminado,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Error al eliminar el acuerdo",
    });
  }
};

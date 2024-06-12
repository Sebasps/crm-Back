import { Model, Schema, model } from "mongoose";

const AcuerdoSchema = new Schema({
  descripcion: {
    type: String,
    required: true,
  },
  etapa: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  usuario: { type: Schema.Types.ObjectId, ref: "contacto", required: true },
  cliente: { type: Schema.Types.ObjectId, ref: "contacto", required: false },
});

export const AcuerdoModel: Model<any> = model("acuerdo", AcuerdoSchema);

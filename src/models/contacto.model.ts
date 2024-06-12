import { Model, Schema, model } from "mongoose";

const ContactoSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  numeroCelular: {
    type: Number,
  },
  cargo: {
    type: String,
    default: "USER",
  },
  password: {
    type: String,
  },
  token: {
    type: String,
    require: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const ContactoModel: Model<any> = model("contacto", ContactoSchema);
export default ContactoModel;

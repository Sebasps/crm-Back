import nodemailer from "nodemailer";
import { config } from "./config";

const enviroment = config[process.env.NODE_ENV || "desarrollo"];
const { host, port, email, password } = enviroment.email;

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure: false,
  auth: {
    user: email,
    pass: password,
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
});

transporter
  .verify()
  .then(() => {
    console.log("Puede enviar correos electrónicos");
  })
  .catch((error) => {
    console.log("Error al enviar correos", error);
  });

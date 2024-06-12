import { config } from "../config/config";
import { transporter } from "../config/mailer";

const enviroment = config[process.env.NODE_ENV || "desarrollo"];
const { email, from } = enviroment.email;

export const sendEmail = (to: string, subject: string, html: string) => {
  transporter.sendMail(
    {
      from: `"${from}" <${email}>`,
      to,
      subject,
      html,
    },
    (error: any, info: any) => {
      if (error) {
        console.log("Error al enviar el correo", error);
      } else {
        console.log("Correo enviado");
        console.info(info.envelope);
      }
    }
  );
};

export default sendEmail;

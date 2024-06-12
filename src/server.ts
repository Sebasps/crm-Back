import express, { Application, Request, Response } from "express";
import { dbConnection } from "./database/connection";
import cors from "cors";
import contactoRoutes from "./routes/contacto.route";
import authRoutes from "./routes/auth.route";
import acuerdoRoutes from "./routes/acuerdo.route";

class Server {
  private app: Application;
  private port: string;
  private apiPaths = {
    contacto: "/api/v1/contacto",
    login: "/api/v1/login",
    acuerdo: "/api/v1/acuerdo",
  };

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "3000";

    //Base de datos
    dbConnection();

    //Metodos iniciales
    this.middlewares();

    //Rutas
    this.routes();
  }

  miPrimerApi() {
    this.app.get("/", (req: Request, res: Response) =>
      res.status(200).json({ msg: "Api funcionando" })
    );
  }

  middlewares() {
    this.app.use(cors());

    //Lectura del Body
    this.app.use(express.json());

    this.miPrimerApi();
  }

  routes(): void {
    this.app.use(this.apiPaths.contacto, contactoRoutes);
    this.app.use(this.apiPaths.login, authRoutes);
    this.app.use(this.apiPaths.acuerdo, acuerdoRoutes);
  }

  listen(): void {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo por el puerto", this.port);
    });
  }
}

export default Server;

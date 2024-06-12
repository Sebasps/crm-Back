import { Router } from "express";
import {
  crearContacto,
  eliminarContacto,
  getContactos,
  getUnContacto,
  updateContacto,
} from "./../controllers/contacto.controller";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validate-fields";
import { validateJWT } from "../middlewares/validate-jwt";

//Path /api/v1/contacto

const router = Router();

router.post(
  "/",
  validateJWT,
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido", "El apellido es obligatorio").not().isEmpty(),
    check("email", "El correo electrónico es obligatorio")
      .not()
      .isEmpty()
      .isEmail(),
    validateFields,
  ],
  crearContacto
);
router.get("/", validateJWT, getContactos);
router.get("/:id", validateJWT, getUnContacto);
router.put("/:id", validateJWT, updateContacto);
router.delete("/:id", validateJWT, eliminarContacto);

export default router;

import { Router } from "express";
import {
  crearAcuerdo,
  eliminarAcuerdo,
  getAcuerdos,
  getUnAcuerdo,
  updateAcuerdo,
} from "../controllers/acuerdo.controller";
import { validateJWT } from "../middlewares/validate-jwt";
import { check } from "express-validator";

const router = Router();

router.post(
  "/",
  validateJWT,
  [
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    check("etapa", "La etapa es obligatoria").not().isEmpty(),
  ],
  crearAcuerdo
);

router.get("/", validateJWT, getAcuerdos);
router.get("/:id", validateJWT, getUnAcuerdo);
router.put("/:id", validateJWT, updateAcuerdo);
router.delete("/:id", validateJWT, eliminarAcuerdo);

export default router;

//Path /api/v1/login

import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validate-fields";
import {
  login,
  olvidoContrasena,
  cambioContrasena,
  renewToken,
} from "../controllers/auth.controller";
import { validateJWT } from "../middlewares/validate-jwt";

const router = Router();

router.post(
  "/",
  [
    check("email", "El email es obligatorio").not().isEmpty().isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validateFields,
  ],
  login
);

router.post(
  "/olvidocontrasena",
  [
    check("email", "El email es obligatorio").not().isEmpty().isEmail(),
    validateFields,
  ],
  olvidoContrasena
);

router.put(
  "/cambiocontrasena",
  validateJWT,
  [
    check("password", "El password es obligatorio").not().isEmpty(),
    validateFields,
  ],
  cambioContrasena
);

router.get("/", validateJWT, renewToken);

export default router;

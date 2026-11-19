import { Router } from "express";
import { health, listarBases } from "../controllers/basesController.js";

const router = Router();

router.get("/health", health);
router.get("/bases", listarBases);

export default router;

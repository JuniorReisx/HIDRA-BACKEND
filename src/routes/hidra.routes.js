import { Router } from "express";
import { contagemDireta, perguntar } from "../controllers/hidra.controller.js";

const router = Router();

router.post("/hidra/perguntar", perguntar);
router.get("/hidra/pocos/contagem", contagemDireta);

export default router;

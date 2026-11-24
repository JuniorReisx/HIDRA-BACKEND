import { Router } from "express";
import { configuracaoPocos } from "../config/arcgis.config.js";

const router = Router();

router.get("/diagnostico/arcgis-pocos", diagnosticarPocos);

export default router;

async function diagnosticarPocos(_req, res) {
  const inicio = Date.now();
  let hostname = null;
  try {
    const config = configuracaoPocos();
    hostname = hostnameDe(config.url);
    const corpo = new URLSearchParams({
      where: "1=1",
      returnCountOnly: "true",
      f: "json",
    });
    if (config.token) corpo.set("token", config.token);

    const response = await fetch(`${config.url}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: corpo,
      signal: AbortSignal.timeout(config.timeoutMs),
    });
    const duracaoMs = Date.now() - inicio;
    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    const count = typeof data?.count === "number" ? data.count : null;
    const sucesso = response.ok && count != null && !data?.error;
    const causa = data?.error?.message || null;
    registrar({ hostname, status: response.status, duracaoMs, tipo: sucesso ? null : "RespostaArcGis", causa });
    return res.status(200).json({
      sucesso,
      hostname,
      status: response.status,
      duracaoMs,
      ...(sucesso ? { count } : { erro: "RespostaArcGis", causa }),
    });
  } catch (error) {
    const duracaoMs = Date.now() - inicio;
    const tipo = error.name || "Error";
    const causa = error.cause?.code || error.cause?.name || error.codigo || "rede";
    registrar({ hostname, status: null, duracaoMs, tipo, causa });
    return res.status(200).json({
      sucesso: false,
      hostname,
      status: null,
      duracaoMs,
      erro: tipo,
      causa,
    });
  }
}

function registrar(info) {
  console.log("[diagnostico] arcgis pocos", info);
}

function hostnameDe(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

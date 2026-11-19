import { statusDaBase } from "../services/baseDados.js";
import { listarCamadas } from "../services/webmapQuery.js";

export function listarBases(_req, res) {
  const institucionais = listarCamadas().map((camada) => ({
    id: camada.id,
    nome: camada.label,
    conectada: true,
    origem: "arcgis",
  }));

  return res.json({
    bases: [...institucionais, statusDaBase()],
  });
}

export function health(_req, res) {
  const base = statusDaBase();
  return res.json({
    ok: true,
    nome: "HIDRA",
    baseDados: {
      configurada: Boolean(process.env.DATABASE_URL?.trim()),
      tipo: base.tipo,
    },
  });
}

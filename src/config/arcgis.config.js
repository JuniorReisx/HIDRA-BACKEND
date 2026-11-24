import dotenv from "dotenv";

dotenv.config();

export function configuracaoPocos() {
  const url = String(process.env.ARCGIS_POCOS_URL || "").trim();
  if (!url) {
    throw Object.assign(new Error("ARCGIS_POCOS_URL não configurada."), { codigo: "FONTE_INDISPONIVEL" });
  }

  const timeout = Number(process.env.ARCGIS_TIMEOUT_MS || 15000);
  return {
    url: url.replace(/\/$/, ""),
    token: String(process.env.ARCGIS_TOKEN || "").trim(),
    timeoutMs: Number.isFinite(timeout) && timeout > 0 ? timeout : 15000,
  };
}

export function configuracaoMunicipios() {
  const base = configuracaoPocos();
  const url = String(process.env.ARCGIS_MUNICIPIOS_URL || "").trim();
  if (!url) {
    throw Object.assign(new Error("ARCGIS_MUNICIPIOS_URL não configurada."), { codigo: "FONTE_INDISPONIVEL" });
  }
  const campo = String(process.env.ARCGIS_CAMPO_NOME_MUNICIPIO || "nome_do_municipio").trim();
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(campo)) {
    throw Object.assign(new Error("Campo do limite municipal inválido."), { codigo: "CONFIGURACAO_INVALIDA" });
  }
  return { ...base, url: url.replace(/\/$/, ""), campo };
}

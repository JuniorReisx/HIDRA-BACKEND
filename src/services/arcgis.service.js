import { configuracaoPocos } from "../config/arcgis.config.js";
import { CAMPOS_LISTAGEM, CATALOGO_POCOS } from "../config/pocos.catalogo.js";
import { montarWhere } from "../utils/arcgis.utils.js";

export async function contarPocos({ filtros, geometria }) {
  const config = configuracaoPocos();
  const data = await consultar(config, {
    where: montarWhere({ filtros }),
    ...parametrosEspaciais(geometria),
    returnCountOnly: "true",
    f: "json",
  });
  if (typeof data.count !== "number") {
    throw indisponivel("A contagem não retornou um número.");
  }
  return data.count;
}

export async function listarPocos({ filtros, geometria, limite }) {
  const config = configuracaoPocos();
  const data = await consultar(config, {
    where: montarWhere({ filtros }),
    ...parametrosEspaciais(geometria),
    outFields: CAMPOS_LISTAGEM.join(","),
    returnGeometry: "false",
    resultRecordCount: String(limite),
    f: "json",
  });
  if (!Array.isArray(data.features)) {
    throw indisponivel("A listagem não retornou registros.");
  }
  return data.features.map((feature) => registro(feature.attributes || {}));
}

async function consultar(config, params) {
  const corpo = new URLSearchParams(params);
  if (config.token) corpo.set("token", config.token);

  let response;
  try {
    response = await fetch(`${config.url}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: corpo,
      signal: AbortSignal.timeout(config.timeoutMs),
    });
  } catch (error) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      throw indisponivel("Tempo esgotado ao consultar o ArcGIS.");
    }
    throw indisponivel("Falha de rede ao consultar o ArcGIS.");
  }

  if (response.status === 401 || response.status === 403) {
    throw indisponivel("Acesso negado à camada de poços.");
  }
  if (!response.ok) {
    throw indisponivel("A camada de poços não respondeu.");
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw indisponivel("Resposta inválida da camada de poços.");
  }

  if (data?.error) {
    const codigo = Number(data.error.code);
    console.warn("[arcgis] consulta recusada", { codigo, mensagem: data.error.message || "erro" });
    if (codigo === 498 || codigo === 499 || codigo === 401 || codigo === 403) {
      throw indisponivel("Token do ArcGIS ausente, expirado ou sem permissão.");
    }
    throw indisponivel("A camada de poços recusou a consulta.");
  }

  return data;
}

function parametrosEspaciais(geometria) {
  if (!geometria) return {};
  return {
    geometry: JSON.stringify(geometria),
    geometryType: "esriGeometryPolygon",
    inSR: "4674",
    spatialRel: "esriSpatialRelIntersects",
  };
}

function registro(attrs) {
  return {
    codigo: texto(attrs.codigo),
    localidade: texto(attrs.localidade),
    municipio: texto(attrs[CATALOGO_POCOS.municipio.campoArcgis]),
    condicao: texto(attrs[CATALOGO_POCOS.condicao.campoArcgis]),
    vazao: numero(attrs[CATALOGO_POCOS.vazao.campoArcgis]),
    profundidade: numero(attrs[CATALOGO_POCOS.profundidade.campoArcgis]),
    finalidade: texto(attrs[CATALOGO_POCOS.finalidade.campoArcgis]),
    aquifero: texto(attrs[CATALOGO_POCOS.aquifero.campoArcgis]),
    estado_qualitativo: texto(attrs[CATALOGO_POCOS.estadoQualitativo.campoArcgis]),
  };
}

function texto(valor) {
  if (valor == null) return "";
  return String(valor).trim();
}

function numero(valor) {
  if (valor == null || valor === "") return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

function indisponivel(mensagem) {
  return Object.assign(new Error(mensagem), { codigo: "FONTE_INDISPONIVEL" });
}

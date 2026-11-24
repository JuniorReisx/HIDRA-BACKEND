import { configuracaoMunicipios } from "../config/arcgis.config.js";
import { escaparValorArcGis, limparEspacos } from "../utils/arcgis.utils.js";

let nomesOficiais = null;

export async function resolverMunicipio(nome) {
  const texto = limparEspacos(nome);
  if (!texto) return null;

  const oficial = await nomeOficial(texto);
  if (!oficial) {
    throw Object.assign(new Error("Município sem limite geográfico."), {
      codigo: "MUNICIPIO_NAO_ENCONTRADO",
      resposta: `Não encontrei o limite geográfico de ${texto} para localizar os poços pelas coordenadas.`,
    });
  }

  const geometria = await geometriaDoMunicipio(oficial);
  if (!geometria?.rings?.length) {
    throw Object.assign(new Error("Limite municipal sem geometria."), { codigo: "FONTE_INDISPONIVEL" });
  }
  return { nome: oficial, geometria };
}

async function nomeOficial(nome) {
  const nomes = await carregarNomes();
  const exato = nomes.get(chave(nome));
  return exato || null;
}

async function carregarNomes() {
  if (nomesOficiais) return nomesOficiais;
  const config = configuracaoMunicipios();
  const data = await consultarMunicipios(config, {
    where: "1=1",
    outFields: config.campo,
    returnDistinctValues: "true",
    returnGeometry: "false",
    f: "json",
  });
  const mapa = new Map();
  for (const feature of data.features || []) {
    const valor = limparEspacos(feature.attributes?.[config.campo]);
    if (valor) mapa.set(chave(valor), valor);
  }
  if (!mapa.size) {
    throw Object.assign(new Error("A camada de municípios não retornou nomes."), { codigo: "FONTE_INDISPONIVEL" });
  }
  nomesOficiais = mapa;
  return mapa;
}

async function geometriaDoMunicipio(nome) {
  const config = configuracaoMunicipios();
  const data = await consultarMunicipios(config, {
    where: `${config.campo} = '${escaparValorArcGis(nome)}'`,
    outFields: config.campo,
    returnGeometry: "true",
    outSR: "4674",
    f: "json",
  });
  return data.features?.[0]?.geometry || null;
}

async function consultarMunicipios(config, params) {
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
  } catch {
    throw Object.assign(new Error("Falha ao consultar o limite municipal."), { codigo: "FONTE_INDISPONIVEL" });
  }
  if (!response.ok) {
    throw Object.assign(new Error("A camada de municípios não respondeu."), { codigo: "FONTE_INDISPONIVEL" });
  }
  const data = await response.json();
  if (data?.error) {
    console.warn("[arcgis] limite municipal recusado", { codigo: data.error.code, mensagem: data.error.message || "erro" });
    throw Object.assign(new Error("A camada de municípios recusou a consulta."), { codigo: "FONTE_INDISPONIVEL" });
  }
  return data;
}

function chave(valor) {
  return limparEspacos(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleUpperCase("pt-BR");
}

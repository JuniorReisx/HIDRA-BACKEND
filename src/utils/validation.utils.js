import { CATALOGO_POCOS } from "../config/pocos.catalogo.js";
import { limparEspacos, normalizarTextoCatalogo, validarLimite } from "./arcgis.utils.js";

const ACOES = new Set(["contar", "listar"]);
const OPERADORES_TEXTO = new Set(["igual"]);
const OPERADORES_NUMERO = new Set(["igual", "maior_que", "maior_ou_igual", "menor_que", "menor_ou_igual"]);

const CLASSIFICACOES_AUSENTES = {
  inativo: "INATIVO",
  inativa: "INATIVO",
  inativos: "INATIVO",
  inativas: "INATIVO",
  operacional: "OPERACIONAL",
  operacionais: "OPERACIONAL",
  paralisado: "PARALISADO",
  paralisada: "PARALISADO",
  paralisados: "PARALISADO",
  paralisadas: "PARALISADO",
};

export function perguntaOperacionalDePocos(pergunta) {
  const texto = limparEspacos(pergunta)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const sobrePocos = /\bpocos?\b/.test(texto);
  const pedeDado = /quantos|quantas|liste|lista|quais|mostre|quantidade/.test(texto);
  return sobrePocos && pedeDado;
}

export function classificacaoPedida(pergunta) {
  const texto = limparEspacos(pergunta)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const termo = texto.match(/\b(inativ[oa]s?|operacionais|operacional|paralisad[oa]s?)\b/);
  return termo ? CLASSIFICACOES_AUSENTES[termo[1]] : null;
}

export function instrucaoDireta(pergunta) {
  return /\bignore\b|\bwhere\b|\bselect\b|\bdrop\b|\bsql\b|\bsenha\b|outfields|feature\s*server|=\s*'/i.test(
    pergunta,
  );
}

export function validarIntencao(bruta) {
  if (!bruta || typeof bruta !== "object" || Array.isArray(bruta)) {
    throw erro("PERGUNTA_FORA_DO_ESCOPO");
  }

  const acao = limparEspacos(bruta.acao ?? bruta.action).toLowerCase();
  const ativo = limparEspacos(bruta.ativo).toLowerCase();
  if (!ACOES.has(acao) || ativo !== "pocos") {
    throw erro("PERGUNTA_FORA_DO_ESCOPO");
  }

  const municipioInformado = bruta.municipio;
  let municipio = null;
  if (municipioInformado != null && municipioInformado !== "") {
    if (typeof municipioInformado !== "string") throw erro("PERGUNTA_FORA_DO_ESCOPO");
    municipio = limparEspacos(municipioInformado);
    if (!municipio) throw erro("PERGUNTA_INCOMPLETA");
  } else if (municipioInformado === "") {
    throw erro("PERGUNTA_INCOMPLETA");
  }

  if (bruta.filtros != null && !Array.isArray(bruta.filtros)) {
    throw erro("PERGUNTA_FORA_DO_ESCOPO");
  }

  const filtros = (bruta.filtros || []).map(validarFiltro);
  return {
    acao,
    ativo: "pocos",
    municipio,
    filtros,
    limite: acao === "listar" ? validarLimite(bruta.limite) : null,
  };
}

export function extrairJson(texto) {
  const limpo = String(texto || "")
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  const inicio = limpo.indexOf("{");
  const fim = limpo.lastIndexOf("}");
  if (inicio < 0 || fim <= inicio) {
    throw erro("PERGUNTA_FORA_DO_ESCOPO");
  }
  try {
    return JSON.parse(limpo.slice(inicio, fim + 1));
  } catch {
    throw erro("PERGUNTA_FORA_DO_ESCOPO");
  }
}

function validarFiltro(filtro) {
  if (!filtro || typeof filtro !== "object" || Array.isArray(filtro)) {
    throw erro("PERGUNTA_FORA_DO_ESCOPO");
  }

  const atributo = limparEspacos(filtro.atributo);
  const definicao = CATALOGO_POCOS[atributo];
  if (!definicao || atributo === "municipio") throw erro("PERGUNTA_FORA_DO_ESCOPO");

  const operador = limparEspacos(filtro.operador).toLowerCase();
  if (definicao.tipo === "numero") {
    if (!OPERADORES_NUMERO.has(operador)) throw erro("PERGUNTA_FORA_DO_ESCOPO");
    const valor = typeof filtro.valor === "number" ? filtro.valor : Number(limparEspacos(filtro.valor));
    if (!Number.isFinite(valor)) throw erro("PERGUNTA_FORA_DO_ESCOPO");
    return { atributo, operador, valor };
  }

  if (!OPERADORES_TEXTO.has(operador)) throw erro("PERGUNTA_FORA_DO_ESCOPO");
  return { atributo, operador, valor: valorTextual(definicao, filtro.valor) };
}

function valorTextual(definicao, valor) {
  if (typeof valor !== "string") throw erro("PERGUNTA_FORA_DO_ESCOPO");
  const chave = normalizarTextoCatalogo(valor);
  const ausente = CLASSIFICACOES_AUSENTES[
    limparEspacos(valor)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
  ];
  if (ausente) throw Object.assign(erro("CLASSIFICACAO_INEXISTENTE"), { termo: ausente });
  if (!definicao.valoresPermitidos) return limparEspacos(valor);
  const encontrado = definicao.valoresPermitidos.find((item) => normalizarTextoCatalogo(item) === chave);
  if (!encontrado) throw erro("VALOR_NAO_CADASTRADO");
  return encontrado;
}

function erro(codigo) {
  return Object.assign(new Error(codigo), { codigo });
}

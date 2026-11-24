import { CATALOGO_POCOS } from "../config/pocos.catalogo.js";

const OPERADORES = {
  igual: "=",
  maior_que: ">",
  maior_ou_igual: ">=",
  menor_que: "<",
  menor_ou_igual: "<=",
};

export function limparEspacos(valor) {
  return String(valor ?? "").replace(/\s+/g, " ").trim();
}

export function normalizarMunicipio(valor) {
  const texto = limparEspacos(valor);
  if (!texto) return null;
  return texto.toLocaleUpperCase("pt-BR");
}

export function normalizarTextoCatalogo(valor) {
  return limparEspacos(valor).toLocaleUpperCase("pt-BR");
}

export function escaparValorArcGis(valor) {
  return String(valor ?? "").replace(/'/g, "''");
}

export function validarLimite(valor) {
  if (valor == null || valor === "") return 5;
  const numero = Number(valor);
  if (!Number.isInteger(numero)) return 5;
  return Math.min(20, Math.max(1, numero));
}

export function valorArmazenado(definicao, valor) {
  const texto = limparEspacos(valor);
  if (!definicao.larguraArmazenada) return texto;
  return texto.padEnd(definicao.larguraArmazenada, " ");
}

export function montarWhere({ filtros }) {
  const partes = [];
  for (const filtro of filtros || []) {
    const definicao = CATALOGO_POCOS[filtro.atributo];
    const operador = OPERADORES[filtro.operador];
    if (!definicao || !operador) {
      throw Object.assign(new Error("Filtro inválido."), { codigo: "PERGUNTA_FORA_DO_ESCOPO" });
    }
    if (definicao.tipo === "numero") {
      partes.push(`${definicao.campoArcgis} ${operador} ${filtro.valor}`);
      continue;
    }
    const armazenado = valorArmazenado(definicao, filtro.valor);
    partes.push(`${definicao.campoArcgis} ${operador} '${escaparValorArcGis(armazenado)}'`);
  }

  return partes.length ? partes.join(" AND ") : "1=1";
}

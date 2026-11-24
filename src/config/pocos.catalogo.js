const CAMPO = /^[A-Za-z_][A-Za-z0-9_]*$/;

const CONDICOES = [
  "SECA NOS PERÍODOS DE ESTIAGEM",
  "SECOU POSTERIORMENTE",
  "A SER AVALIADO",
  "FURO PENDENTE",
  "ÁGUA COM PROBLEMA",
  "SUBSTITUÍDO",
  "ABANDONADO",
  "FURO DE MONITORAMENTO",
  "POÇO PIEZOMÉTRICO",
  "FURO PERDIDO",
  "VAZÃO APROVEITÁVEL",
  "ABANDONADO POSTERIORMENTE",
  "COM QUEDA DE VAZÃO",
  "POÇO COM PROBLEMA",
  "DESATIVADO",
  "VAZÃO INSUFICIENTE",
  "POÇO PARA REBAIXAMENTO DE LENÇOL FREÁTICO",
  "DESMORONOU",
  "OBSTRUÍDO",
  "SECO",
  "SEM INFORMAÇÃO",
  "POÇO PARA PESQUISA HIDROGEOLÓGICA",
  "SUJEITO A CONTAMINAÇÃO",
];

const FINALIDADES = [
  "PESQUISA",
  "ABASTECIMENTO AGROPECUÁRIO",
  "NÃO INFORMADO",
  "ABASTECIMENTO AGRÍCOLA",
  "ABASTECIMENTO ANIMAL",
  "ABASTECIMENTO HUMANO",
];

const AQUIFEROS = [
  "LIVRE / CONFINADO",
  "NÃO INFORMADO",
  "CÁRSTICO / FISSURAL",
  "CONFINADO",
  "MISTO",
  "SEMI-CONFINADO",
  "CONFINADO / CÁRSTICO",
  "FISSURAL",
  "LIVRE",
  "CÁRSTICO",
  "INEXISTENTE",
  "LIVRE / FISSURAL",
  "FISSURAL / CONFINADO",
  "LIVRE / CÁRSTICO",
  "SEMI-CONFINADO / FISSURAL",
];

const ESTADOS_QUALITATIVOS = [
  "ACONSELHÁVEL NOVA AMOSTRAGEM",
  "UTILIZÁVEL SOB CIRCUNSTÂNCIAS ESPECIAIS",
  "NÃO INFORMADO",
  "PARÂMETROS INSUFICIENTES PARA CLASSIFICAÇÃO",
  "UTILIZÁVEL APÓS TRATAMENTO",
  "INADEQUADA PARA CONSUMO HUMANO",
  "ADEQUADA PARA CONSUMO HUMANO",
  "VIDE PARECER",
];

export const CATALOGO_POCOS = {
  municipio: { campoArcgis: "municipio", tipo: "texto" },
  localidade: { campoArcgis: "localidade", tipo: "texto" },
  condicao: { campoArcgis: "condicao", tipo: "texto", valoresPermitidos: CONDICOES },
  finalidade: {
    campoArcgis: "finalidade",
    tipo: "texto",
    larguraArmazenada: 50,
    valoresPermitidos: FINALIDADES,
  },
  aquifero: {
    campoArcgis: "aquifero",
    tipo: "texto",
    larguraArmazenada: 50,
    valoresPermitidos: AQUIFEROS,
  },
  estadoQualitativo: {
    campoArcgis: "estado_qualitativo",
    tipo: "texto",
    larguraArmazenada: 50,
    valoresPermitidos: ESTADOS_QUALITATIVOS,
  },
  vazao: { campoArcgis: "vazao", tipo: "numero" },
  profundidade: { campoArcgis: "profundidade", tipo: "numero" },
};

export const CAMPOS_LISTAGEM = [
  "codigo",
  "localidade",
  "municipio",
  "condicao",
  "vazao",
  "profundidade",
  "finalidade",
  "aquifero",
  "estado_qualitativo",
];

for (const definicao of Object.values(CATALOGO_POCOS)) {
  if (!CAMPO.test(definicao.campoArcgis)) {
    throw new Error("Catálogo de poços com nome de campo inválido.");
  }
}
for (const campo of CAMPOS_LISTAGEM) {
  if (!CAMPO.test(campo)) throw new Error("Campo de listagem inválido.");
}

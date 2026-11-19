const WEBMAP_ID = "4a1ab975bc5249c8abe91c90252e92ce";

const TERRITORIOS = [
  "Irecê",
  "Sertão do São Francisco",
  "Bacia do Rio Grande",
  "Bacia do Paramirim",
  "Sertão Produtivo",
  "Piemonte do Paraguaçu",
  "Bacia do Jacuípe",
  "Piemonte da Diamantina",
  "Semiárido Nordeste II",
  "Litoral Norte e Agreste Baiano",
  "Portal do Sertão",
  "Velho Chico",
  "Sudoeste Baiano",
  "Recôncavo",
  "Médio Rio de Contas",
  "Bacia do Rio Corrente",
  "Itaparica",
  "Piemonte Norte do Itapicuru",
  "Metropolitano de Salvador",
  "Costa do Descobrimento",
  "Chapada Diamantina",
  "Sisal",
  "Litoral Sul",
  "Baixo Sul",
  "Extremo Sul",
  "Médio Sudoeste da Bahia",
  "Vale do Jiquiriçá",
];

const LAYERS = {
  reservatorios: {
    id: "reservatorios",
    label: "reservatórios e barragens",
    modo: "lista",
    url: "https://maps.sihs.ba.gov.br/server/rest/services/Reservatorios_SNISB_2026/FeatureServer/0",
    municipalityFields: ["municipio"],
    nameFields: ["barragem", "n_secund"],
    rotulos: {
      uso_princ: "Uso principal",
      empreendedor: "Empreendedor",
      capacidade_t: "Capacidade",
      dominio: "Domínio",
      nvl_perigo: "Nível de perigo",
    },
  },
  pocos: {
    id: "pocos",
    label: "poços",
    modo: "lista",
    url: "https://maps.sihs.ba.gov.br/server/rest/services/Pocos/Pocos/FeatureServer/0",
    municipalityFields: ["municipio"],
    nameFields: ["localidade", "localizacao", "codigo"],
    rotulos: {
      profundidade: "Profundidade (m)",
      vazao: "Vazão",
      aquifero: "Aquífero",
      finalidade: "Finalidade",
      condicao: "Condição",
    },
  },
  sistemas: {
    id: "sistemas",
    label: "sistemas de abastecimento geolocalizados",
    modo: "lista",
    url: "https://maps.sihs.ba.gov.br/server/rest/services/Sistemas/Sistemas/FeatureServer/0",
    municipalityFields: ["municipio_oficial", "municipio"],
    nameFields: ["localidade", "codigo", "tipo_sistema"],
    rotulos: {
      tipo_sistema: "Tipo",
      captacao: "Captação",
      populacao_atendida: "População atendida",
    },
  },
  totalSistemas: {
    id: "total-sistemas",
    label: "total de sistemas de abastecimento por município",
    modo: "indicador",
    url: "https://maps.sihs.ba.gov.br/server/rest/services/Hosted/Camada_Teste/FeatureServer/0",
    municipalityFields: ["municipio"],
    nameFields: ["municipio"],
    rotulos: {
      frequency: "Total de sistemas",
      nm_ti: "Território de identidade",
      semiarido: "Semiárido",
      atend_embasa: "Atendimento Embasa",
    },
  },
  indicadores: {
    id: "indicadores",
    label: "indicadores de abastecimento e esgotamento do município",
    modo: "indicador",
    url: "https://maps.sihs.ba.gov.br/server/rest/services/DPA_Indicadores_Censo_2022/FeatureServer/0",
    municipalityFields: ["nome_do_municipio"],
    nameFields: ["nome_do_municipio"],
    rotulos: {
      "população__2022_": "População 2022",
      estimativa_pop_2026: "População estimada 2026",
      territorio_de_indentidade: "Território de identidade",
      "região_do_semiarida": "Está no semiárido",
      abastecimento_agua: "Tem dado de abastecimento",
      esgotamento_sanitario: "Tem dado de esgotamento",
      aa_l_r_g_p: "Abastecimento por rede geral (%)",
      aa_pp_a_p: "Abastecimento por poço ou nascente (%)",
      aa_cp_p: "Abastecimento por carro-pipa (%)",
      aa_aca_p: "Abastecimento por água de chuva (%)",
      aa_racli_p: "Abastecimento por rio, açude ou lago (%)",
      esgrrpflgp: "Esgoto em rede geral ou pluvial (%)",
      esg_fr_b_p: "Fossa séptica (%)",
      esg_vala_p: "Vala (%)",
      esg_ntbs_p: "Sem banheiro ou sanitário (%)",
      "densidade_demografica_hab_km__2": "Densidade demográfica (hab/km²)",
    },
  },
  semiarido: {
    id: "semiarido",
    label: "Região Semiárida da Bahia",
    modo: "indicador",
    escopo: "regiao",
    url: "https://maps.sihs.ba.gov.br/server/rest/services/DVPA_BAHIA/Região_Semiárida_BA/FeatureServer/0",
    municipalityFields: [],
    nameFields: [],
    rotulos: {
      mun: "Municípios na região",
      pop_2022: "População 2022",
      pop_est_2026: "População estimada 2026",
      aba_total: "Domicílios com forma de abastecimento informada",
      aba_lrg: "Domicílios com rede geral de água",
      aba_ppa: "Domicílios com poço ou nascente",
      aba_cp: "Domicílios com carro-pipa",
      esg_total: "Domicílios com esgotamento informado",
      esg_rrpflg: "Domicílios com rede de esgoto",
      esg_fffnlg: "Domicílios com fossa ligada à rede",
      esg_fr_b: "Domicílios com fossa séptica",
    },
  },
  territorio: {
    id: "territorio",
    label: "território de identidade",
    modo: "indicador",
    escopo: "territorio",
    url: "https://maps.sihs.ba.gov.br/server/rest/services/Hosted/Território_de_indentidade/FeatureServer/0",
    placeField: "nom_ti",
    nameFields: ["nom_ti"],
    municipalityFields: [],
    rotulos: {
      tot_mun: "Municípios no território",
      pop_total: "População",
      tot_regiao_semiarida: "Municípios no semiárido",
      mun_atendido_embasa: "Municípios atendidos pela Embasa",
      ligacao_rede_geral_forma_princi: "Forma principal: rede geral de água (%)",
      esgotamento_sanitario: "Esgotamento por rede (%)",
      densi_demografica_2022: "Densidade demográfica 2022",
    },
  },
  bahia: {
    id: "bahia",
    label: "Bahia",
    modo: "indicador",
    escopo: "estado",
    url: "https://maps.sihs.ba.gov.br/server/rest/services/DVPA_BAHIA/LIMITE_BAHIA/FeatureServer/0",
    municipalityFields: [],
    nameFields: [],
    rotulos: {
      pop_2022: "População 2022",
      pop_est_2026: "População estimada 2026",
      pop_urb_perc_2022: "População urbana (%)",
      pop_rural_perc_2022: "População rural (%)",
      r_semiaridas: "Municípios no semiárido",
      mun_at_embasa_aa: "Municípios com água atendida pela Embasa",
      mun_at_embasa_e: "Municípios com esgoto atendido pela Embasa",
      rd_geral_a_perc: "Abastecimento por rede geral (%)",
      poco_p_perc: "Abastecimento por poço profundo (%)",
      carro_pipa_perc: "Abastecimento por carro-pipa (%)",
      rede_esgoto_perc: "Esgoto em rede (%)",
      fossa_septica_perc: "Fossa séptica (%)",
      sem_banheiro_perc: "Sem banheiro (%)",
    },
  },
};

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function escapeSql(value) {
  return String(value || "").replace(/'/g, "''");
}

function has(text, words) {
  return words.some((word) => text.includes(normalize(word)));
}

function parece(text, raizes) {
  const tokens = text.split(/[^a-z0-9]+/).filter((token) => token.length >= 4);
  return raizes.some((raiz) => {
    const normal = normalize(raiz);
    if (text.includes(normal)) return true;
    const inicio = normal.slice(0, Math.min(6, normal.length));
    if (inicio.length < 4) return false;
    return tokens.some((token) => token.startsWith(inicio));
  });
}

function detectTerritory(text) {
  const n = normalize(text);
  return TERRITORIOS.find((nome) => n.includes(normalize(nome))) || null;
}

function cortarLugar(place) {
  return String(place || "")
    .replace(/\b(quant[oa]s?|quais|qual|tem|t[eê]m|existe[m]?|h[aá]|possu[ie]|fica[m]?|s[aã]o|est[aã]o|po[cç]os?|barrage(?:m|ns)|reservat[oó]rios?|represas?|sistemas?)\b.*$/i, "")
    .replace(/\b(bahia|ba|estado|semi[aá]rid[oa]|regi[aã]o)\b/gi, "")
    .replace(/[?!.,;]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function lugarValido(place) {
  const normal = normalize(place);
  if (place.length < 3) return false;
  if (["bahia", "estado", "semiarido", "semiarida", "municipio", "municpio"].includes(normal)) return false;
  if (normal.startsWith("municip")) return false;
  if (TERRITORIOS.some((nome) => normalize(nome) === normal)) return false;
  return true;
}

function detectMunicipality(text) {
  const cleaned = String(text || "")
    .replace(/[?!.,;]+$/g, "")
    .trim();
  const n = normalize(cleaned);
  const known = [
    "feira de santana",
    "vitoria da conquista",
    "lauro de freitas",
    "salvador",
    "camacari",
    "itabuna",
    "juazeiro",
    "ilheus",
    "jequie",
    "alagoinhas",
    "abaira",
  ];
  const knownHit = known.find((name) => n.includes(name));
  if (knownHit && !detectTerritory(knownHit)) return knownHit;

  const patterns = [
    /munic[ií]?pio\s+de\s+(.+)$/i,
    /(?:\bem\b|\bno\b|\bna\b)\s+(.+)$/i,
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    const place = cortarLugar(match?.[1] || "");
    if (!lugarValido(place)) continue;
    return place;
  }

  return null;
}

function detectQuestion(message) {
  const text = normalize(message);
  const territory = detectTerritory(message);
  const municipality = detectMunicipality(message);
  const pedeTerritorio = text.includes("territorio");
  const pedeSemiarido = text.includes("semiarid");
  const pedeEstado = /\b(bahia|estado)\b/.test(text);
  const pedeIndicador = has(text, [
    "abastec",
    "esgot",
    "esgoto",
    "fossa",
    "rede geral",
    "censo",
    "populac",
    "carro pipa",
    "carro-pipa",
    "embasa",
    "saneamento",
    "banheiro",
  ]);
  const pedeSistemas = parece(text, ["sistema", "sistemas"]);
  const pedeTotalSistemas = pedeSistemas && /quantos|quantas|numero de|quantidade|totais|total/.test(text);
  const pedeListaSistemas = pedeSistemas && !pedeTotalSistemas;
  const pedePoco = parece(text, ["poco", "pocos"]);
  const pedeBarragem = parece(text, ["reservatorio", "barragem", "represa"]);
  const somenteTotal = /quantos|quantas|numero de|quantidade|totais|total de|no total/.test(text);
  const camadaDoEstado = pedeEstado && !municipality;

  if (pedePoco && camadaDoEstado) return { layer: LAYERS.pocos, estado: true, somenteTotal: true };
  if (pedeBarragem && camadaDoEstado) return { layer: LAYERS.reservatorios, estado: true, somenteTotal: true };
  if (pedeTotalSistemas && camadaDoEstado) return { layer: LAYERS.totalSistemas, estado: true, somenteTotal: true };
  if (pedePoco && municipality) return { layer: LAYERS.pocos, municipality, somenteTotal };
  if (pedeBarragem && municipality) return { layer: LAYERS.reservatorios, municipality, somenteTotal };
  if (pedeTotalSistemas && municipality) return { layer: LAYERS.totalSistemas, municipality, somenteTotal: true };
  if (pedeListaSistemas && municipality) return { layer: LAYERS.sistemas, municipality, somenteTotal };
  if (pedeTerritorio && territory) return { layer: LAYERS.territorio, territory };
  if (pedeSemiarido && !municipality) return { layer: LAYERS.semiarido };
  if ((pedeIndicador || pedeSemiarido) && municipality) return { layer: LAYERS.indicadores, municipality };
  if (pedeIndicador && pedeEstado && !municipality) return { layer: LAYERS.bahia };

  console.log(`[webmap] sem consulta — texto="${message}"`);
  return null;
}

const fieldCache = new Map();

async function layerFieldNames(url) {
  if (fieldCache.has(url)) return fieldCache.get(url);
  const meta = await fetch(`${url}?f=json`).then((res) => res.json());
  const names = new Set((meta.fields || []).map((field) => String(field.name || "")));
  fieldCache.set(url, names);
  return names;
}

function existingFields(available, candidates) {
  return candidates.filter((name) => available.has(name));
}

const nomesCache = new Map();

async function nomesDoCampo(url, field) {
  const chave = `${url}|${field}`;
  if (nomesCache.has(chave)) return nomesCache.get(chave);
  const params = new URLSearchParams({
    where: "1=1",
    outFields: field,
    returnDistinctValues: "true",
    returnGeometry: "false",
    f: "json",
  });
  const json = await fetch(`${url}/query?${params}`).then((res) => res.json());
  const nomes = (json.features || [])
    .map((feature) => String(feature.attributes?.[field] || "").trim())
    .filter(Boolean);
  nomesCache.set(chave, nomes);
  return nomes;
}

async function municipiosOficiais(layer, pedido) {
  const alvo = normalize(pedido);
  const encontrados = [];
  for (const field of layer.municipalityFields || []) {
    const nomes = await nomesDoCampo(layer.url, field);
    for (const nome of nomes) {
      const normal = normalize(nome);
      if (normal === alvo || normal.includes(alvo)) encontrados.push({ field, nome });
    }
  }
  return encontrados.length ? encontrados : [{ field: null, nome: pedido }];
}

function whereDaConsulta(layer, available, detected) {
  if (detected.estado || layer.escopo === "estado" || layer.escopo === "regiao") return "1=1";
  if (layer.escopo === "territorio") {
    return `${layer.placeField} = '${escapeSql(detected.territory)}'`;
  }
  const fields = existingFields(available, layer.municipalityFields);
  const pares = (detected.municipiosOficiais || []).filter((item) => !item.field || fields.includes(item.field));
  if (!pares.length || !fields.length) return "1=0";
  return pares
    .flatMap((item) => {
      const campo = item.field || fields[0];
      const valor = escapeSql(item.nome);
      return [`UPPER(${campo}) = '${escapeSql(item.nome.toUpperCase())}'`, `${campo} = '${valor}'`];
    })
    .join(" OR ");
}

function queryErrorMessage(payload) {
  const err = payload?.error;
  if (!err) return "";
  const details = Array.isArray(err.details) ? err.details.join(" ") : "";
  return [err.message, details].filter(Boolean).join(" — ");
}

function rotuloDe(layer, field) {
  return layer.rotulos?.[field] || field;
}

function valorLegivel(rotulo, value) {
  if (value == null || String(value).trim() === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) {
    const casas = rotulo.includes("%") ? 2 : 0;
    return value.toLocaleString("pt-BR", { maximumFractionDigits: casas, minimumFractionDigits: casas });
  }
  return String(value).trim();
}

async function queryLayer(layer, detected) {
  if (detected.municipality && !detected.estado) {
    detected.municipiosOficiais = await municipiosOficiais(layer, detected.municipality);
    detected.municipioOficial = detected.municipiosOficiais[0]?.nome || detected.municipality;
  }
  const available = await layerFieldNames(layer.url);
  const nameFields = existingFields(available, layer.nameFields || []);
  const munFields = existingFields(available, layer.municipalityFields || []);
  const extraFields = existingFields(available, Object.keys(layer.rotulos || {}));
  const where = whereDaConsulta(layer, available, detected);
  const outFields = [...new Set([...nameFields, ...munFields, ...extraFields])].join(",") || "*";
  const limit = layer.id === "total-sistemas" && detected.estado ? 500 : layer.modo === "lista" ? 40 : 5;

  const countParams = new URLSearchParams({
    where,
    returnCountOnly: "true",
    f: "json",
  });
  const countJson = await fetch(`${layer.url}/query?${countParams}`).then((res) => res.json());
  const countError = queryErrorMessage(countJson);
  if (countError) throw new Error(countError);

  let listJson = { features: [] };
  if (!detected.somenteTotal || layer.id === "total-sistemas") {
    const params = new URLSearchParams({
      where,
      outFields,
      returnGeometry: "false",
      resultRecordCount: String(limit),
      f: "json",
    });
    listJson = await fetch(`${layer.url}/query?${params}`).then((res) => res.json());
    const listError = queryErrorMessage(listJson);
    if (listError) throw new Error(listError);
  }

  const features = listJson.features || [];
  const itens = features.map((feature) => {
    const attrs = feature.attributes || {};
    const nomeBruto = (nameFields.length ? nameFields : [])
      .map((field) => attrs[field])
      .find((value) => value != null && String(value).trim());
    const nome = layer.escopo === "estado"
      ? "Bahia"
      : layer.escopo === "regiao"
        ? "Região Semiárida"
        : String(nomeBruto || layer.label).trim();
    const municipioNome =
      munFields.map((field) => attrs[field]).find((value) => value != null && String(value).trim()) ||
      detected.municipality ||
      detected.territory ||
      (layer.escopo === "regiao" ? "Região Semiárida" : "Bahia");
    const extras = {};
    for (const field of extraFields) {
      const legivel = valorLegivel(rotuloDe(layer, field), attrs[field]);
      if (legivel) extras[rotuloDe(layer, field)] = legivel;
    }
    return { nome: String(nome).trim(), municipio: String(municipioNome).trim(), ...extras };
  });

  let total = Number.isFinite(Number(countJson.count)) ? Number(countJson.count) : itens.length;
  if (layer.id === "total-sistemas") {
    const soma = features.reduce((acc, feature) => acc + Number(feature.attributes?.frequency || 0), 0);
    if (soma > 0) total = soma;
  }
  return {
    tipo: layer.id,
    label: layer.label,
    modo: layer.modo,
    municipio: detected.estado ? "Bahia" : detected.municipioOficial || detected.municipality || detected.territory || (layer.escopo === "regiao" ? "Região Semiárida" : "Bahia"),
    somenteTotal: Boolean(detected.somenteTotal),
    total,
    mostrados: itens.length,
    itens,
    webmap: WEBMAP_ID,
  };
}

export function listarCamadas() {
  return Object.values(LAYERS).map((layer) => ({
    id: layer.id,
    label: layer.label,
  }));
}

export function detectWebmapQuestion(message) {
  return detectQuestion(message);
}

export async function consultarWebmap(message) {
  const detected = detectQuestion(message);
  if (!detected) return null;

  try {
    const result = await queryLayer(detected.layer, detected);
    console.log(`[webmap] ${detected.layer.id} em ${result.municipio}: ${result.total} registro(s)`);
    return result;
  } catch (error) {
    console.warn("[webmap] consulta falhou:", error.message);
    return {
      tipo: detected.layer.id,
      label: detected.layer.label,
      modo: detected.layer.modo,
      municipio: detected.municipality || detected.territory || (detected.layer.escopo === "regiao" ? "Região Semiárida" : "Bahia"),
      erro: error.message,
      total: 0,
      mostrados: 0,
      itens: [],
    };
  }
}

export function formatWebmapContext(result) {
  if (!result) return "";
  if (result.erro) {
    return `CONSULTA AO WEB MAP FALHOU (${result.label} em ${result.municipio}): ${result.erro}`;
  }

  const linhas = result.itens.map((item, index) => {
    const extra = Object.entries(item)
      .filter(([key]) => key !== "nome" && key !== "municipio")
      .map(([key, value]) => `${key}: ${value}`)
      .join("; ");
    return `${index + 1}. ${item.nome} (${item.municipio})${extra ? ` — ${extra}` : ""}`;
  });

  const corte = !result.somenteTotal && result.total > result.mostrados
    ? ` Foram listados ${result.mostrados} de ${result.total}.`
    : "";

  const instrucao = result.somenteTotal
    ? "A pessoa perguntou a quantidade. Responda com o total encontrado e o município. Não liste os nomes. Não invente outro número. Diga que a fonte é a camada consultada no web map da SIHS."
    : result.modo === "indicador"
      ? "Interprete esses números para a pessoa, em texto simples. Não invente percentual, população ou município que não esteja aqui. Diga que a fonte é o web map institucional da SIHS."
      : "Responda começando pelo total encontrado. Liste os nomes que couberem. Não invente nomes. Diga que a fonte é o web map institucional da SIHS.";

  return [
    `DADOS CONSULTADOS NO WEB MAP AGORA (camada de ${result.label}, recorte ${result.municipio}).`,
    `Total encontrado: ${result.total}.${corte}`,
    result.somenteTotal
      ? "A consulta pediu só a quantidade, então os nomes não foram listados."
      : result.itens.length
        ? linhas.join("\n")
        : "Nenhum registro encontrado nesse recorte.",
    instrucao,
  ].join("\n");
}

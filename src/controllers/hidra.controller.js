import { contarPocos, listarPocos } from "../services/arcgis.service.js";
import { interpretarPergunta } from "../services/groq.service.js";
import { resolverMunicipio } from "../services/municipio.service.js";
import { classificacaoPedida, instrucaoDireta, validarIntencao } from "../utils/validation.utils.js";

const RESPOSTAS = {
  PERGUNTA_FORA_DO_ESCOPO:
    "No Protótipo 1, consigo responder perguntas de contagem e listagem de poços por município, condição, finalidade, aquífero, estado qualitativo, vazão e profundidade.",
  PERGUNTA_INCOMPLETA:
    "Informe o município que deseja consultar ou indique que a consulta deve considerar toda a Bahia.",
  FONTE_INDISPONIVEL: "Não foi possível consultar a base de poços neste momento.",
  CONFIGURACAO_AUSENTE: "A interpretação da pergunta não está configurada neste momento.",
  INTERPRETACAO_INDISPONIVEL: "Não foi possível interpretar a pergunta neste momento.",
  REQUISICAO_INVALIDA: "Informe a pergunta no campo pergunta.",
  VALOR_NAO_CADASTRADO: "O valor informado não existe no catálogo da camada de poços.",
  MUNICIPIO_NAO_ENCONTRADO: "Não encontrei o limite geográfico desse município para localizar os poços pelas coordenadas.",
  CONSULTA_NAO_PERMITIDA:
    "Não aceito nomes de campos, SQL ou instruções para montar a consulta. Pergunte em linguagem natural sobre os poços cadastrados.",
};

const CLASSIFICACOES = {
  INATIVO:
    "A camada de poços não possui a classificação 'INATIVO'. As condições cadastradas incluem, entre outras, 'DESATIVADO', 'ABANDONADO', 'SECO' e 'VAZÃO APROVEITÁVEL'. Informe qual condição deseja consultar.",
  OPERACIONAL:
    "A camada consultada não possui a classificação 'OPERACIONAL'. Posso consultar as condições efetivamente cadastradas, como 'VAZÃO APROVEITÁVEL', 'DESATIVADO', 'ABANDONADO' e 'SECO'.",
  PARALISADO:
    "A camada de poços não possui a classificação 'PARALISADO'. As condições cadastradas incluem, entre outras, 'DESATIVADO', 'ABANDONADO', 'SECO' e 'VAZÃO APROVEITÁVEL'. Informe qual condição deseja consultar.",
};

export async function perguntar(req, res) {
  const pergunta = req.body?.pergunta;
  if (typeof pergunta !== "string" || !pergunta.trim()) {
    return responder(res, 400, "REQUISICAO_INVALIDA");
  }

  const resultado = await executarPergunta(pergunta.trim());
  return res.status(resultado.status).json(resultado.body);
}

export async function executarPergunta(texto) {
  const termo = classificacaoPedida(texto);
  if (termo) return recusa(200, "CLASSIFICACAO_INEXISTENTE", CLASSIFICACOES[termo]);
  if (instrucaoDireta(texto)) return recusa(200, "CONSULTA_NAO_PERMITIDA");

  const inicio = Date.now();
  try {
    const intencao = validarIntencao(await interpretarPergunta(texto));
    console.log("[hidra] consulta", {
      acao: intencao.acao,
      municipio: intencao.municipio,
      filtros: intencao.filtros.map((filtro) => filtro.atributo),
    });
    const payload = await executar(texto, intencao);
    console.log("[hidra] sucesso", { acao: intencao.acao, ms: Date.now() - inicio });
    return { status: 200, body: payload };
  } catch (error) {
    console.warn("[hidra] falha", { codigo: error.codigo || "ERRO", mensagem: error.message, ms: Date.now() - inicio });
    if (error.codigo === "CLASSIFICACAO_INEXISTENTE") {
      return recusa(200, error.codigo, CLASSIFICACOES[error.termo] || CLASSIFICACOES.INATIVO);
    }
    if (error.resposta) return recusa(200, error.codigo || "FONTE_INDISPONIVEL", error.resposta);
    const codigo = RESPOSTAS[error.codigo] ? error.codigo : "FONTE_INDISPONIVEL";
    const status = codigo === "FONTE_INDISPONIVEL" || codigo === "INTERPRETACAO_INDISPONIVEL" || codigo === "CONFIGURACAO_AUSENTE"
      ? 503
      : 200;
    return recusa(status, codigo);
  }
}

export async function contagemDireta(req, res) {
  const municipio = typeof req.query.municipio === "string" ? req.query.municipio.trim() : "";
  const inicio = Date.now();
  try {
    const recorte = municipio ? await resolverMunicipio(municipio) : null;
    const quantidade = await contarPocos({ filtros: [], geometria: recorte?.geometria || null });
    console.log("[hidra] contagem direta", { municipio: recorte?.nome || null, espacial: Boolean(recorte), ms: Date.now() - inicio });
    return res.status(200).json({
      sucesso: true,
      dados: { quantidade, municipio: recorte?.nome || null },
      fonte: fonte(Boolean(recorte)),
    });
  } catch (error) {
    console.warn("[hidra] contagem direta falhou", { codigo: error.codigo || "ERRO", ms: Date.now() - inicio });
    if (error.resposta) return responder(res, 200, error.codigo, error.resposta);
    return responder(res, 503, "FONTE_INDISPONIVEL");
  }
}

async function executar(pergunta, intencao) {
  const recorte = intencao.municipio ? await resolverMunicipio(intencao.municipio) : null;
  const consulta = {
    ...intencao,
    municipio: recorte?.nome || null,
    geometria: recorte?.geometria || null,
  };

  if (consulta.acao === "contar") {
    const quantidade = await contarPocos(consulta);
    return {
      sucesso: true,
      pergunta,
      intencao: {
        acao: consulta.acao,
        ativo: consulta.ativo,
        municipio: consulta.municipio,
        filtros: consulta.filtros,
      },
      dados: {
        quantidade,
        municipio: consulta.municipio,
        filtrosAplicados: consulta.filtros.map((filtro) => ({
          atributo: filtro.atributo,
          operador: filtro.operador,
          valor: filtro.valor,
        })),
      },
      resposta: textoContagem(quantidade, consulta),
      fonte: fonte(Boolean(recorte)),
    };
  }

  const registros = await listarPocos(consulta);
  return {
    sucesso: true,
    pergunta,
    intencao: consulta.acao ? {
      acao: consulta.acao,
      ativo: consulta.ativo,
      municipio: consulta.municipio,
      filtros: consulta.filtros,
      limite: consulta.limite,
    } : consulta,
    dados: { totalRetornado: registros.length, registros },
    resposta: `Encontrei ${registros.length} poços localizados para a consulta realizada.`,
    fonte: fonte(Boolean(recorte)),
  };
}

function textoContagem(quantidade, intencao) {
  if (quantidade === 0) {
    return "Não foram encontrados poços com os filtros informados na base consultada.";
  }
  const numero = quantidade.toLocaleString("pt-BR");
  if (!intencao.filtros?.length) {
    if (!intencao.municipio) {
      return `Foram encontrados ${numero} poços cadastrados na base consultada da Bahia.`;
    }
    return `Foram encontrados ${numero} poços localizados em ${intencao.municipio}.`;
  }
  const complemento = descreverFiltros(intencao.filtros);
  if (!intencao.municipio) {
    return `Foram encontrados ${numero} poços${complemento} cadastrados na base consultada da Bahia.`;
  }
  return `Foram encontrados ${numero} poços${complemento} localizados em ${intencao.municipio}.`;
}

function descreverFiltros(filtros) {
  if (!filtros?.length) return "";
  const partes = filtros.map((filtro) => {
    if (filtro.atributo === "condicao" && filtro.operador === "igual") {
      return ` com a condição “${filtro.valor}”`;
    }
    const nomes = {
      vazao: "vazão",
      profundidade: "profundidade",
      finalidade: "finalidade",
      aquifero: "aquífero",
      estadoQualitativo: "estado qualitativo",
      localidade: "localidade",
    };
    const operadores = {
      igual: "igual a",
      maior_que: "maior que",
      maior_ou_igual: "maior ou igual a",
      menor_que: "menor que",
      menor_ou_igual: "menor ou igual a",
    };
    return ` com ${nomes[filtro.atributo] || filtro.atributo} ${operadores[filtro.operador]} ${filtro.valor}`;
  });
  return partes.join(" e");
}

function fonte(espacial = false) {
  return {
    sistema: "ArcGIS Enterprise da SIHS",
    camada: "Poços",
    recorte: espacial ? "limite geográfico do município" : "Bahia",
    consultadoEm: new Date().toISOString(),
  };
}

function recusa(status, codigo, resposta) {
  return {
    status,
    body: {
      sucesso: false,
      codigo,
      resposta: resposta || RESPOSTAS[codigo],
    },
  };
}

function responder(res, status, codigo, resposta) {
  const resultado = recusa(status, codigo, resposta);
  return res.status(resultado.status).json(resultado.body);
}

import { executarPergunta } from "./hidra.controller.js";
import { generateResponse } from "../services/hidraService.js";
import { consultarWebmap } from "../services/webmapQuery.js";
import { perguntaOperacionalDePocos } from "../utils/validation.utils.js";

export async function sendMessage(req, res) {
  try {
    const { message, historico } = req.body ?? {};

    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ error: "A mensagem é obrigatória." });
    }

    const pergunta = message.trim();
    if (perguntaOperacionalDePocos(pergunta)) {
      const resultado = await executarPergunta(pergunta);
      return res.status(200).json({
        response: textoDoChat(resultado.body),
        consulta: resumirPocos(resultado.body),
      });
    }

    const consulta = await consultarWebmap(pergunta);
    const response = await generateResponse({
      message: pergunta,
      historico,
      contexto: consulta,
    });

    return res.status(200).json({
      response,
      consulta: resumirConsulta(consulta),
    });
  } catch (error) {
    console.error("Erro ao gerar resposta:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

function textoDoChat(body) {
  const registros = body?.dados?.registros;
  if (!Array.isArray(registros) || registros.length === 0) return body.resposta;
  const nomes = registros.map((item) => item.localidade || item.codigo).filter(Boolean);
  if (!nomes.length) return body.resposta;
  return `${body.resposta} ${nomes.join(", ")}.`;
}

function resumirPocos(body) {
  if (!body?.sucesso) return { tipo: "pocos", erro: body?.codigo || null, total: null };
  return {
    tipo: "pocos",
    label: "poços",
    municipio: body.dados?.municipio ?? body.intencao?.municipio ?? null,
    total: body.dados?.quantidade ?? body.dados?.totalRetornado ?? null,
    erro: null,
  };
}

function resumirConsulta(consulta) {
  if (!consulta) return null;
  return {
    tipo: consulta.tipo,
    label: consulta.label,
    municipio: consulta.municipio,
    total: consulta.total,
    erro: consulta.erro || null,
  };
}

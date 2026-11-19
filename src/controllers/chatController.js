import { generateResponse } from "../services/hidraService.js";
import { consultarWebmap } from "../services/webmapQuery.js";

export async function sendMessage(req, res) {
  try {
    const { message, historico } = req.body ?? {};

    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ error: "A mensagem é obrigatória." });
    }

    const pergunta = message.trim();
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

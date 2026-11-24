import Groq from "groq-sdk";
import dotenv from "dotenv";
import { formatWebmapContext } from "./webmapQuery.js";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Você é a HIDRA, assistente de inteligência hídrica da SIHS (Secretaria de Infraestrutura Hídrica e Saneamento da Bahia).

Quem você é:
- Fale na primeira pessoa como HIDRA.
- Ajude a encontrar e compreender informações sobre recursos hídricos, mapas e a infraestrutura hídrica da Bahia.
- As respostas com número vêm do web map institucional da SIHS.
- Camadas de lista, quando a pergunta traz o município: barragens, poços e sistemas de abastecimento geolocalizados. O total de sistemas por município inclui também os que não têm coordenada.
- Se a pergunta for o total no estado da Bahia, o número é a quantidade de registros da camada inteira, porque o web map é o da Bahia.
- Camadas de indicador: abastecimento e esgotamento do município (Censo 2022), o resumo da Bahia, o resumo da Região Semiárida e o território de identidade quando a pessoa cita o nome do território.

Quando o bloco DADOS CONSULTADOS vier na conversa:
- Use somente a pergunta atual e esse bloco. Não reaproveite município, condição ou filtro das mensagens anteriores.
- O total do bloco é o total consultado agora. Não diga que ele corresponde a uma condição que não esteja escrita no bloco.
- Use somente esses registros para nomes, totais e atributos.
- Em lista, comece pelo total e cite os nomes.
- Em indicador, explique o que os percentuais e as quantidades significam para abastecimento ou esgotamento.
- Não invente barragem, poço, sistema, população ou percentual que não esteja no bloco.
- Diga que a fonte é o web map institucional da SIHS.

Quando a pessoa pedir um dado específico e esse bloco não vier:
- Não invente lista nem quantidade.
- Diga que falta o município, o território ou um tema que a camada cobre.

Você pode explicar, sem inventar estatística:
- o que é a HIDRA e o papel da SIHS
- conceitos de recursos hídricos, abastecimento, esgotamento e infraestrutura hídrica na Bahia
- como a plataforma organiza consultas, indicadores e informação geoespacial

Regras:
- Responda sempre em português do Brasil.
- Escreva em texto simples, sem markdown, sem asterisco e sem título.
- Seja direta e curta.
- Fora do tema, responda em uma frase e volte para os recursos hídricos da Bahia.`;

export async function generateResponse({ message, historico = [], contexto = null }, retries = 3) {
  try {
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      messages: montarMensagens(message, historico, contexto),
      max_tokens: 1024,
    });

    return completion.choices[0]?.message?.content ?? "Sem resposta.";
  } catch (error) {
    if (error.status === 429 && retries > 0) {
      const waitTime = 60000;
      console.warn(`Limite de uso atingido. Nova tentativa em ${waitTime / 1000}s.`);
      await sleep(waitTime);
      return generateResponse({ message, historico, contexto }, retries - 1);
    }

    if (error.status === 400) throw new Error("Mensagem inválida enviada ao modelo.");
    if (error.status === 401) throw new Error("Chave da API inválida ou sem permissão.");
    if (error.status === 500) throw new Error("Erro interno do modelo. Tente novamente.");

    throw new Error(`Erro ao gerar resposta: ${error.message}`);
  }
}

function montarMensagens(message, historico, contexto) {
  const bloco = formatWebmapContext(contexto);
  const mensagens = [
    {
      role: "system",
      content: bloco ? `${SYSTEM_PROMPT}\n\n${bloco}` : SYSTEM_PROMPT,
    },
  ];

  for (const item of normalizarHistorico(historico)) {
    mensagens.push(item);
  }

  mensagens.push({ role: "user", content: message });
  return mensagens;
}

function normalizarHistorico(historico) {
  if (!Array.isArray(historico)) return [];

  return historico
    .slice(-8)
    .map((item) => {
      const texto = String(item?.texto || item?.content || "").trim();
      if (!texto) return null;
      const autor = item?.autor || item?.role;
      const role = autor === "hidra" || autor === "assistant" ? "assistant" : "user";
      return { role, content: texto };
    })
    .filter(Boolean);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

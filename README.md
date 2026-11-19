# HIDRA — API

Backend da assistente HIDRA, da Secretaria de Infraestrutura Hídrica e Saneamento da Bahia.

A conversa usa o modelo via Groq. Perguntas sobre barragens, poços ou sistemas de abastecimento, quando trazem o município, consultam as camadas institucionais antes da resposta. A base SQL entra por `DATABASE_URL`.

## Variáveis

```env
PORT=3002
GROQ_API_KEY=
GROQ_MODEL=openai/gpt-oss-120b
DATABASE_URL=
```

## Executar

```bash
npm install
npm run dev
```

API: `http://localhost:3002`

## Endpoints

### GET `/api/health`

Estado da API.

### GET `/api/bases`

Camadas institucionais ligadas e o estado da base SQL.

### POST `/api/chat`

```json
{
  "message": "Quais barragens tem em Feira de Santana?",
  "historico": [
    { "autor": "usuario", "texto": "pergunta anterior" },
    { "autor": "hidra", "texto": "resposta anterior" }
  ]
}
```

`historico` é opcional e guarda só os turnos anteriores.

```json
{
  "response": "Encontrei 2 reservatórios em Feira de Santana.",
  "consulta": {
    "tipo": "reservatorios",
    "label": "reservatórios / barragens",
    "municipio": "Feira de Santana",
    "total": 2,
    "erro": null
  }
}
```

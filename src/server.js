import dns from "node:dns";
import dotenv from "dotenv";
import app from "./app.js";

dns.setDefaultResultOrder("ipv4first");

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log("[hidra] arcgis municipios", resumoMunicipios());
});

function resumoMunicipios() {
  const url = String(process.env.ARCGIS_MUNICIPIOS_URL || "").trim();
  const esperada = "https://maps.sihs.ba.gov.br/server/rest/services/DPA_Indicadores_Censo_2022/FeatureServer/0";
  let hostname = null;
  let urlEsperada = false;
  if (url) {
    try {
      const parsed = new URL(url);
      hostname = parsed.hostname;
      urlEsperada = `${parsed.origin}${parsed.pathname.replace(/\/$/, "")}` === esperada;
    } catch {
      hostname = "invalida";
    }
  }
  return {
    urlDefinida: Boolean(url),
    hostname,
    urlEsperada,
    ARCGIS_CAMPO_MUNICIPIO: process.env.ARCGIS_CAMPO_MUNICIPIO || null,
    campoUsado: process.env.ARCGIS_CAMPO_NOME_MUNICIPIO || "nome_do_municipio",
    ARCGIS_TIMEOUT_MS: process.env.ARCGIS_TIMEOUT_MS || "15000",
  };
}

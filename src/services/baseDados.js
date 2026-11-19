export function statusDaBase() {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    return {
      id: "sql",
      nome: "Base de dados",
      conectada: false,
      tipo: null,
      detalhe: "Defina DATABASE_URL para ligar uma base SQL.",
    };
  }

  return {
    id: "sql",
    nome: "Base de dados",
    conectada: false,
    tipo: tipoDaUrl(url),
    detalhe: "O endereço está configurado. O driver dessa base entra na ligação.",
  };
}

function tipoDaUrl(url) {
  const valor = url.toLowerCase();
  if (valor.startsWith("postgres")) return "postgresql";
  if (valor.startsWith("mysql")) return "mysql";
  if (valor.startsWith("mssql") || valor.startsWith("sqlserver")) return "sqlserver";
  return "sql";
}

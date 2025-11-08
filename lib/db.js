// lib/db.js
// Faz a conexão com o banco PostgreSQL da AWS
import pkg from 'pg';
const { Pool } = pkg;

// Cria um pool de conexões (melhor desempenho)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Função que executa consultas SQL
export async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}

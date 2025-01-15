import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'salon_fryzjerski',
  password: 'barbud',
  port: 5432,
});

function query(text, params) {
  return pool.query(text, params);
}

export { query };
const pg = require('pg');
const dotenv = require('dotenv');
dotenv.config();

console.log('Connecting to database at', process.env.DATABASE_URL);
// Create a PostgreSQL pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// funktion til at oprette forbindelse når express appen starter
async function connectToDatabase() {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database');
    client.release();
  } catch (err) {
    console.error('Error connecting to PostgreSQL database', err);
    process.exit(1); // afslut appen hvis der er fejl
  }
}

module.exports = {
  pool,
  connectToDatabase
};

import express from 'express';
import pg from 'pg';
import fetch from 'node-fetch';
import dotenv from 'dotenv';


dotenv.config();

const { Pool } = pg;

const app = express();
const port = 3000;

// PostgreSQL connection using environment variables
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

app.use(express.static('public'));

// Route to serve the home page
app.get('/', (req, res) => {
    res.send('Welcome to the Crypto Data API');
});

async function fetchAndStoreData() {
    try {
        const response = await fetch('https://api.wazirx.com/api/v2/tickers');
        const data = await response.json();

        const top10 = Object.values(data).slice(0, 10);

        await pool.query('DELETE FROM cryptos');

        for (const crypto of top10) {
            const { name, last, buy, sell, volume, base_unit } = crypto;
            await pool.query(
                'INSERT INTO cryptos (name, last, buy, sell, volume, base_unit) VALUES ($1, $2, $3, $4, $5, $6)',
                [name, last, buy, sell, volume, base_unit]
            );
        }

        console.log('Data stored successfully');
    } catch (error) {
        console.error('Error fetching or storing data', error);
    }
}

// API route to get the stored data
app.get('/api/cryptos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cryptos');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Start the server and fetch data on startup
app.listen(port, async () => {
    console.log(`Server running on http://localhost:${port}`);
    await fetchAndStoreData();
});

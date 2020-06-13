const express = require('express');
const path = require('path');
const {Pool} = require('pg')

const PORT = process.env.PORT || 8080;
const PG_CONNECTION_STRING = process.env.DATABASE_URL || 'postgresql://postgres:Adzisace123@localhost:5432/react-running-app';
const pool = new Pool({
    connectionString: PG_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
});

express()
    .use(express.static(__dirname))
    .use(express.static(path.join(__dirname, 'build')))
    .get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    })
    .get('/ping', function (req, res) {
        return res.send('pong');
    })
    .get('/db', async (req, res) => {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT * FROM test_table');
            const results = { 'results': (result) ? result.rows : null};
            res.render('pages/db', results );
            client.release();
        } catch (err) {
            console.error(err);
            res.send("Error " + err);
        }
    })
    .listen(PORT, () => console.log(`Listening on port: ${PORT}`));

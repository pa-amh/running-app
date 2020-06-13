const express = require('express');
const path = require('path');
const {Pool} = require('pg')

const PORT = process.env.PORT || 8080;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

express()
    .use(express.static(__dirname))
    .use(express.static(path.join(__dirname, 'build')))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render(path.join(__dirname, 'build', 'index.html')))
    .get('/ping', (req, res) => res.send('<h1>pong</h1>'))
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
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

// express()
//     .use(express.static(__dirname))
//     .use(express.static(path.join(__dirname, 'build')))
//     .get('/', function (req, res) {
//         res.sendFile(path.join(__dirname, 'build', 'index.html'));
//     })
//     .get('/ping', function (req, res) {
//         return res.send('pong');
//     })
//     .get('/db', async (req, res) => {
//         try {
//             const client = await pool.connect();
//             const result = await client.query('SELECT * FROM test_table');
//             const results = { 'results': (result) ? result.rows : null};
//             res.render('pages/db', results );
//             client.release();
//         } catch (err) {
//             console.error(err);
//             res.send("Error " + err);
//         }
//     })
//     .listen(port, () => console.log(`Listening on port: ${port}`));

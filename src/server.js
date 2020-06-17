const express = require('express');
const path = require('path');
const {Pool} = require('pg')
const {getData, putData, postData, deleteData} = require('./db-utils');

const PORT = process.env.PORT || 8080;
const TABLE_NAME = process.env.TABLE_NAME || 'running_t';
const LOCAL_CLIENT = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};
const HEROKU_CLIENT = {
    connectionString: process.env.DATABASE_URL || process.env.LOCAL_DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const db = new Pool(process.env.DATABASE_URL ? HEROKU_CLIENT : LOCAL_CLIENT);

express()
    .use(express.static(__dirname))
    .use(express.static(path.join(__dirname, '../', 'build')))
    .set('view engine', 'ejs')
    .get('/', (req, res) => {
        res.sendFile('index');
    })
    .get('/ping', (req, res) => {
        return res.send('pong blah');
    })
    .get('/db', async (req, res) => {
        try {
            const client = await db.connect();
            const result = await client.query(`SELECT * FROM ${TABLE_NAME}`);

            res.send(result.rows);
            client.release();
        } catch (err) {
            res.send(err);
        }
    })
    .get('/data', (req, res) => getData(req, res, db))
    .post('/data', (req, res) => postData(req, res, db))
    .put('/data', (req, res) => putData(req, res, db))
    .delete('/data', (req, res) => deleteData(req, res, db))
    .listen(PORT, () => console.log(`Listening on port: ${PORT}`));

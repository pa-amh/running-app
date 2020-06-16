const express = require('express');
const path = require('path');
const {Pool} = require('pg')
const {getData, putData, postData, deleteData} = require('./db-utils');

const PORT = process.env.PORT || 8080;
const TABLE_NAME = process.env.TABLE_NAME;
const db = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.LOCAL_DB_URL,
    ssl: process.env.DATABASE_URL ? true : false
});

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
            const results = {'results': (result) ? result.rows : null};
            res.send(results);
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

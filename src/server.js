require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const {Pool} = require('pg');
const {getData, putData, postData, deleteData, resetDb} = require('./db-utils');

const PORT = process.env.PORT || 8080;
const DB_URL = process.env.DATABASE_URL || process.env.LOCAL_DB_URL;
const SSL_OPTIONS = process.env.DATABASE_URL ? {rejectUnauthorized: false} : false;

const HEROKU_CLIENT = {
    connectionString: DB_URL,
    ssl: SSL_OPTIONS
};

const db = new Pool(HEROKU_CLIENT);

express()
    .use(express.static(__dirname))
    .use(express.static(path.join(__dirname, '../', 'build')))
    .use(bodyParser.json())
    .set('view engine', 'ejs')
    .get('/', (req, res) => {
        res.sendFile('index');
    })
    .get('/ping', (req, res) => {
        return res.send('pong');
    })
    // Get
    .get('/data', (req, res) => getData(req, res, db))
    .get('/reset/test', (req, res) => resetDb(req, res, db, 'test'))
    .get('/reset/full', (req, res) => resetDb(req, res, db, 'full'))
    // Create
    .post('/data', (req, res) => postData(req, res, db))
    // Update
    .put('/data', (req, res) => putData(req, res, db))
    // Delete
    .delete('/data', (req, res) => deleteData(req, res, db))
    .listen(PORT, () => console.log(`Listening on port: ${PORT}`));

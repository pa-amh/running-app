const express = require('express');
const bodyParser = require('body-parser')

const port = 3030;


express()
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))
    .get('/', function (req, res) {
        res.json(200, {msg: 'hello world'});
    })
    .get('/api', function (req, res) {
        res.json(200, {msg: 'OK' });
    })
    .listen(process.env.PORT || port);

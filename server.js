const express = require('express');
const path = require('path');

const port = process.env.PORT || 8080;


express()
    .use(express.static(__dirname))
    .use(express.static(path.join(__dirname, 'build')))
    .get('/ping', function (req, res) {
        return res.send('pong');
    })
    .get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    })
    .listen(port, () => console.log(`Listening on port: ${port}`));

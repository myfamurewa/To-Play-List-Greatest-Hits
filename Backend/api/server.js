const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const server = express();
server.use(helmet());
server.use(cors());
server.use(express.json());



server.get('/', (req, res) => {
    res.send(`<h1>Welcome to the To Game List/ My favoirtes API </h1>`)
})

module.exports = server;

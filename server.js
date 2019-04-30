const express = require('express');
const helmet = require('helmet');

const server = express();

// Import Routers

const zoosRouter = require('./zoos/zoos-router');

// Middleware

server.use(express.json());
server.use(helmet());

// Configure Routes

server.get('/', (req, res) => {
     res.send('Hi there!');
})

server.use('/api/zoos', zoosRouter);

module.exports = server;
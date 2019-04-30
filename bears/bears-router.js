const express = require('express');

const router = express.Router();

// Import Knex

const knex = require('knex');

// Configure Knex

const knexConfig = {
    client: 'sqlite3',
    connection: {
        filename: './data/bears.sqlite3'
    },
    useNullAsDefault: true
}

const db = knex(knexConfig);

// GET bears

router.get('/', (req, res) => {
    db('bears')
        .then(bears => {
            res.status(201).json(bears)
        })
        .catch(err => {
            res.status(500).json({ errorMessage: 'Bear data could not be retrieved.' })
        })
})

module.exports = router;
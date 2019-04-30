const express = require('express');

const router = express.Router();

// Import Knex

const knex = require('knex');

// Configure Knex

const knexConfig = {
    client: 'sqlite3',
    connection: {
        filename: './data/lambda.sqlite3'
    },
    useNullAsDefault: true
}

const db = knex(knexConfig);

// GET zoos

router.get('/', (req, res) => {
    db('zoos')
        .then(zoos => {
            res.status(201).json(zoos)
        })
        .catch(err => {
            res.status(500).json({ error: err, message: 'Data could not be retrieved.' })
        })
})

module.exports = router;
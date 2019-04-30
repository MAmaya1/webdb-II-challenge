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

// GET zoos by id

router.get('/:id', (req, res) => {
    db('zoos')
        .where({ id: req.params.id })
        .first()
        .then(zoo => {
            if (zoo) {
                res.status(201).json(zoo)
            } else {
                res.status(404).json({ errorMessage: 'A zoo with the specified ID does not exist.' })
            }
        })
        .catch(err => {
            res.status(500).json({ error: err, message: 'Zoo data could not be retrieved.' })
        })
})

// POST (add new zoo)

router.post('/', (req, res) => {
    if (!req.body.name) {
        res.status(400).json({ errorMessage: 'Zoo requires a name.' })
    } else {
        db('zoos')
            .insert(req.body, 'id')
            .then(zoo => {
                res.status(201).json(zoo)
            })
            .catch(err => {
                res.status(500).json({ error: err, message: 'Zoo could not be added to the database.' })
            })
    }
})

module.exports = router;
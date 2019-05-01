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

// GET bears by id

router.get('/:id', (req, res) => {
    db('bears')
        .where({ id: req.params.id })
        .first()
        .then(bear => {
            if (bear) {
                res.status(201).json(bear)
            } else {
                res.status(404).json({ errorMessage:  'Bear species with the specified ID does not exist.' })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: 'Bear data could not be retrieved.' })
        })
        
})

// POST (add new bear)

router.post('/', (req, res) => {
    if (!req.body.species) {
        res.status(400).json({ errorMessage: 'Bear data requires a species.' })
    } else {
        db('bears')
            .insert(req.body, 'id')
            .then(ids => {
                db('bears')
                    .where({ id: ids[0] })
                    .first()
                    .then(zoo => {
                        res.status(201).json(zoo)
                    })
                    .catch(err => {
                        res.status(500).json({ error: err, message: 'Bear could not be added to the database.' })
                    })
            })
            .catch(err => {
                res.status(500).json({ error: err, message: 'A bear species with this name already exists in the database.' })
            })
    }
})

// PUT (update bear)

router.put('/:id', (req, res) => {
    if (!req.body.species) {
        res.status(400).json({ errorMessage: 'Bear data requires a species.' })
    } else {
        db('bears')
        .where({ id: req.params.id })
        .update(req.body)
        .then(count => {
            if (count > 0) {
                res.status(201).json({ message: `${count} ${count > 1 ? 'records' : 'record'} updated.` })
            } else {
                res.status(404).json({ errorMessage: 'A bear species with the specified ID does not exist.' })
            }
        })
        .catch(err => {
            res.status(500).json({ error: err, message: 'Bear data could not be updated.'})
        })
    }
})

// DELETE bear

router.delete('/:id', (req, res) => {
    db('bears')
        .where({ id: req.params.id })
        .del(req.body)
        .then(count => {
            if (count) {
                res.status(200).json({ message: `${count} ${count > 1 ? 'records' : 'record'} deleted.` })
            } else {
                res.status(404).json({ message: 'A bear species with the specified ID does not exist.' })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: 'Bear data could not be deleted from the database.' })
        })
})

module.exports = router;
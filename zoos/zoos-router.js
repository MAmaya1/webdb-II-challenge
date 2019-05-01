const express = require('express');

const router = express.Router();

// Import Knex

const knex = require('knex');

// Configure Knex

const knexConfig = { //configuration object
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
            .then(ids => { //ids are coming back from the .insert returning method above
                db('zoos')
                    .where({ id: ids[0] })
                    .first()
                    .then(zoo => {
                        res.status(201).json(zoo)
                    })
                    .catch(err => {
                        res.status(500).json({ error: err, message: 'Zoo could not be added to the database.' })
                    })
            })
            .catch(err => {
                res.status(500).json({ error: err, message: 'A zoo with this name already exists in the database.' })
            })
    }
})

// PUT (update zoo )

router.put('/:id', (req, res) => {
    if (!req.body.name) {
        res.status(400).json({ errorMessage: 'Zoo requires a name.' })
    } else {
        db('zoos')
        .where({ id: req.params.id })
        .update(req.body)
        .then(count => {
            if (count > 0) {
                res.status(201).json({ message: `${count} ${count > 1 ? 'records' : 'record'} updated.` })
            } else {
                res.status(404).json({ errorMessage: 'A zoo with the specified ID does not exist.' })
            }
        })
        .catch(err => {
            res.status(500).json({ error: err, message: 'Could not add changes to database.' })
        })
    }
})

// DELETE zoo

router.delete('/:id', (req, res) => {
    db('zoos')
        .where({ id: req.params.id })
        .del(req.body)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: `${count} ${count > 1 ? 'records' : 'record'} deleted.` })
            } else {
                res.status(404).json({ errorMessage: 'A zoo with the specified ID does not exist.' })
            }
        })
        .catch(err => {
            res.status(500).json({ error: err, message: 'Zoo could not be deleted from the database.' })
        })
})

module.exports = router;
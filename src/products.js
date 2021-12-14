const express = require('express')
const router = express.Router();

const pool = require('./db')

router.get("/", (req, res) => {
    pool.query('SELECT * FROM users ORDER BY id ASC')
        .then(results => res.json(results.rows))
        .catch(err => res.json(err))
})

router.get("/:id", (req, res) => {
    // res.json(Object.keys(req.params.id))
    const {id} = req.params
    // res.json({id: id})
    pool.query('SELECT * FROM users WHERE id = $1', [id])
        .then(results => res.json(results.rows))
        .catch(err => res.json(err))
})

module.exports = router
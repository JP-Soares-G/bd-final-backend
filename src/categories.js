const express = require('express')
const router = express.Router()
const async = require('async')

const pool = require('./db');

// lista todas as categorias
router.get('/', (req, res) => {
    pool.query('SELECT * FROM categories')
        .then(table => res.json(table.rows))
        .catch(err => res.json(err))
})

// adiciona uma nova categoria
router.post('/', (req, res) => {
    const name = req.body.name

    pool.query('INSERT INTO categories(name) VALUES ($1) RETURNING *', [name])
        .then(table => res.json({message: 'Categoria inserida com sucesso', ...table.rows[0]}))
        .catch(err => res.json({message: 'Algo inexperado ocorreu!', ...err}))
})

// retornar todos os produtos da categoria de id utilizado como parametro
router.get('/:id', (req, res) => {
    const id = req.params.id

    pool.query(`SELECT id, name, amount, sales_avg, description, catg_id FROM prod_categories pc 
	                JOIN products p ON (pc.prod_id = p.id)
	                WHERE pc.catg_id = $1`, [id])
        .then(results => res.json(results.rows || []))
        .catch(err => res.json(err))
})

// deleta categoria de id utilizado como parametro
router.delete('/:id', (req, res) => {
    const id = req.params.id
    
    async.series([
        function(callback){
            pool.query("DELETE FROM prod_categories WHERE catg_id = $1", [id])
            callback()
        }, 
        function(callback){
            pool.query("DELETE FROM categories WHERE id = $1", [id])
            callback()
        }
    ], 
    function(err, results) {
        if(err) return res.json({message: "Categoria não se encontra na lista de categorias!", ...err})
        return res.json({message: "Categoria removida com sucesso!"})
    })

})

//atualiza categoria de id utilizado como parametro
router.put('/:id', (req, res) => {
    const name = req.body.name
    const id = req.params.id

    pool.query("UPDATE categories SET name = $1 WHERE id = $2 RETURNING *", [name, id])
        .then(results => res.json(results.rows[0]))
        .catch(err => res.json(err))
})

module.exports = router
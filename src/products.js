const express = require('express')
const router = express.Router();
const async = require('async')
const pool = require('./db');

router.get("/", (req, res) => {
    pool.query('SELECT * FROM products ORDER BY id ASC')
        .then(results => res.json(results.rows))
        .catch(err => res.json(err))
})

router.get("/:id", (req, res) => {
    // res.json(Object.keys(req.params.id))
    const {id} = req.params
    // res.json({id: id})
    pool.query(`SELECT p.id, p.name, p.amount, p.sales_avg, p.description,
                    c.name as categoria
                    FROM products p
                    JOIN prod_categories pc ON (p.id = pc.prod_id)
                    JOIN categories c ON (c.id = pc.catg_id)
                    WHERE p.id = $1`, [id])
        .then(results => {
            let categories = [];
            for(let i = 0; i < results.rows.length; i++){
                categories.push(results.rows[i].categoria)
            }
            let finalResult = {
                id: results.rows[0].id,
                name: results.rows[0].name,
                amount: results.rows[0].amount,
                sales_avg: results.rows[0].sales_avg,
                description: results.rows[0].description,
                categories
            }
            res.json(finalResult)
        })
        .catch(err => res.json(err))
})

const insertCategoriesIntoProducts = (categories, product, cb) => {
    let prod_categories = []
    const insertCat = (category, callback) => {
        pool.query("INSERT INTO prod_categories(prod_id, catg_id) VALUES ($1, $2) RETURNING *", [product.id, category])
            .then(res => {
                prod_categories.push(res.rows[0].catg_id)
                callback()
            })
            .catch(err => console.log(err))
    }

    async.each(categories, insertCat)
        .then(() => cb(null, {...product, categories: prod_categories}))
        .catch(err => console.log(err))
}

router.post("/", (req, res) => {
    async.waterfall([
        function(callback){
            const {name, amount, sales_avg, description} = req.body

            pool.query("INSERT INTO products(name, amount, sales_avg, description) VALUES ($1, $2, $3, $4) RETURNING *", 
                [name, amount, sales_avg, description])
                .then(table => callback(null, table.rows[0]))
                .catch(err => res.json({message: "Ocorreu algum erro com a inserção do produto", ...err}))         
        },
        function(product, callback){

            const categories = req.body.categories
            insertCategoriesIntoProducts(categories, product, callback)
        }
    ], 
    
    function (err, results) {
        // console.log(results)
        if(err) return res.json({message: "Ocorreu algum erro com a inserção do produto", ...err})
        return res.json({message: "Produto inserido com sucesso!", ...results})
    })
    
})

router.delete("/:id", (req, res) => {
    const {id} = req.params
    async.series([
        function(callback){
            pool.query("DELETE FROM prod_categories WHERE prod_id = $1", [id])
            callback()
        }, 
        function(callback){
            pool.query("DELETE FROM products WHERE id = $1", [id])
            callback()
        }
    ], 
    function(err, results) {
        if(err) res.json({message: "Produto não se encontra na lista de produtos!", ...err})
        res.json("Produto removido com sucesso!")
    })
})

router.put("/:id", (req, res) => {
    const {id} = req.params
    const {name, amount, sales_avg, description} = req.body

    async.series([
        function(callback){
            pool.query("UPDATE products SET name = $1, amount = $2, sales_avg = $3, description = $4 WHERE id = $5 RETURNING *", [name, amount, sales_avg, description,id])
            callback()
        }, 
        function(callback){
            pool.query("DELETE FROM prod_categories WHERE prod_id = $1", [id])
            callback()
        },
        function(callback) {
            const categories = req.body.categories
            // console.log(categories)
            
            const insertCat = (category, cb) => {
                pool.query("INSERT INTO prod_categories(prod_id, catg_id) VALUES ($1, $2)", [id, category])
                    .then(_ => cb())
                    .catch(err => console.log(err))
            }

            async.each(categories, insertCat)
                .then(() => callback())
                .catch(err => console.log(err))
        }

    ], 
    function(err, results) {
        if(err) res.json({message: "Ocorreu algo inesperado!", ...err})
        res.json("Produto atualizado com sucesso!")
    })

})

// UPDATE products SET name = 'Relógio Escuro', amount = 67 WHERE id = 37; to update

module.exports = router
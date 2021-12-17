const express = require('express')
const app = express()

const products = require('./src/products')

const bodyParser = require('body-parser')
const cors = require('cors')



app.use(cors())
app.use(bodyParser.json())

//route
app.use("/products", products)

app.get('/', (req, res) => {
    res.redirect("/products")  
})

const port = process.env.PORT || 3000

app.listen(port, console.log('Backend is running at port ' + port))

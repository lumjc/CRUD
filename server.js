
require('dotenv').config()

const express = require('express')
const app = express ()
const expressLayouts = require ('express-ejs-layouts')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')


const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')


app.set ('view engine','ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb' , extended:false}))

const mongoose = require ('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true , useUnifiedTopology: true })
console.log(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error' , err => console.log(err))
db.once('open',() => console.log('Connected to Mongoose'))

app.use('/' , indexRouter)
app.use('/', authorRouter)
app.use('/', bookRouter)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

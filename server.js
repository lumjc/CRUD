/* eslint-disable semi */

require('dotenv').config()

const express = require('express')
const app = express ()
const session = require('express-session')
const expressLayouts = require ('express-ejs-layouts')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const { setUserVarMiddleware } = require('./middleware/auth')
const flash = require ('connect-flash')



const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')
const userRouter = require('./routes/user')


app.set ('view engine','ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))

app.use(session({
  key:'user_sid',
  secret:'secret',
  cookie:{maxAge : 600000},
  resave:false,
  saveUninitialized: false
}));

app.use(flash());


app.use(express.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '20mb' , extended:true}))


// setting up middleware to support session
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: 'user_session',
  resave: false,
  saveUninitialized: false,
  cookie: { path: '/', secure: false, maxAge: 3600000 } 
}))

// setting middleware to ensure global template user variable
app.use(setUserVarMiddleware)

const mongoose = require ('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true , useUnifiedTopology: true })
console.log(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error' , err => console.log(err))
db.once('open',() => console.log('Connected to Mongoose'))

app.use('/' , indexRouter)
app.use('/', authorRouter)
app.use('/', bookRouter)
app.use('/', userRouter);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

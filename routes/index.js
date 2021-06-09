const express = require ('express')
const author = require('../models/author')
const router = express.Router()
const Book = require('../models/book')


router.get('/', async (req, res) => {
    let books = []
    
    try {
        books = await Book.find().populate('author').sort({createdAt: 'desc'}).limit(5).exec()
        books.forEach(book => {
        })
    } catch {
        books = []
      
    }
    res.render('index', {
        books: books,
    })
})

module.exports = router
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');
const imgType = ['image/jpeg', 'image/png', 'images/gif', 'images/jpg'];


// All Books Route
router.get('/books', async (req, res) => {
  let query = Book.find();
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'));
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter);
  }
  try {
    const books = await query.exec();
    res.render('books/index', {
      books: books,
      searchOptions: req.query,
    });
  } catch {
    res.redirect('/books');
  }
});

// New Books Route
router.get('/books/new', async (req, res) => {
  createNewPage(res, new Book());
});

// Create Book Route
router.post('/books', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
  });
  saveCover(book, req.body.cover);

  try {
    const newBook = await book.save();
    res.redirect(`books`);
  } catch {
    createNewPage(res, book, true);
  }
});

// eslint-disable-next-line require-jsdoc
function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imgType.includes(cover.type)) {
    book.coverImg = new Buffer.from(cover.data, 'base64');
    book.coverImgType = cover.type;
  }
}


// create new book
// eslint-disable-next-line require-jsdoc
async function createNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };
    if (hasError) params.errorMessage = 'Error Creating Book';
    res.render('books/new', params);
    console.error(hasError);
  } catch {
    res.redirect('/books');
  }
}


module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');
const {
  authenticatedOnly: authenticatedOnlyMiddleware,
  guestOnly: guestOnlyMiddleware,
} = require('../middleware/auth');


// All Authors Route
router.get('/authors', async (req, res) => {
  const searchOptions = {};
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i');
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query,
    });
  } catch {
    res.redirect('/');
  }
});

// New Author Route
router.get('/authors/new', (req, res) => {
  res.render('./authors/new', {author: new Author()});
});

// create Author Route
router.post('/authors', async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await author.save();
    res.redirect(`authors/${author.id}`);
  } catch {
    res.render('authors/new', {
      author: author,
      errorMessage: 'error',
    });
  }
});

// Edit author Route
router.get('/authors/:id/edit', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({author: author}).limit(3).exec();
    res.render('authors/edit', {
      author: author,
      booksByAuthor: books,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});


router.get('/authors/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({author: author.id});
    res.render('authors/show', {
      author: author,
      booksByAuthor: books,
    });
  } catch {
    res.redirect('/');
  }
});


router.put('/authors/:id', async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (err) {
    if (author == null) {
      console.log(err);
      res.redirect('/');
    } else {
      res.render('authors/edit', {
        author: author,
        errorMessage: 'error updating Author',
      });
    }
  }
});


// delete
router.delete('/authors/:id', async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.remove();
    res.redirect('/authors');
  } catch {
    if (author == null) {
      res.redirect('/');
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});

module.exports = router;

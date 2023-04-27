const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book')

// All authors Route
router.get('/',  async (req, res) => {
    // Search feature
    let searchOptions = {}
    if(req.query.name != null && req.query.name !== ''){  // if the user passed a name field
        searchOptions.name = new RegExp(req.query.name, 'i')
    }    
    try{
        const authors = await Author.find(searchOptions)
        res.render('authors/index', { 
            authors: authors,
            searchOptions: req.query  // to repopulate the name field
        })
    } catch {
        res.redirect('/')
    }
})

// New Author Route its position is quite important
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author()})
})

// Create author route
router.post('/',  async (req, res) => {
    // Create an author
    const author = new Author({
        name: req.body.name
    })
    try{
        const newAuthor = await author.save()
         res.redirect(`authors/${newAuthor.id}`)
         //res.redirect('authors')
    } catch {
        res.render('authors/new', {
            author: author, // the input field will be fill with the author's name
            errorMessage: "Error creating Author" 
        })
    }
    //res.send(req.body.name) // implementing body-parser
})

router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id}).limit(6).exec()
        res.render('authors/show', {
            author: author,
            booksByAuthor: books 
        })
    } catch {
        //console.log(err)
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author})
    } catch {
        res.redirect('/authors')
    }
    
})

router.put('/:id', async (req, res) => {
    let author;
    try{
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
        //res.redirect('authors')
    } catch {
        // if the try block fails
        if( author == null){
            res.redirect('/')
        }
        else{
            res.render('authors/edit', {
            author: author, // the input field will be fill with the author's name
            errorMessage: "Error updating Author" 
        })
        }
    }
})

router.delete('/:id', async (req, res) => {
    let author;
    try{
        author = await Author.findById(req.params.id)
        
        await author.remove()
        res.redirect(`/authors`)
        //res.redirect('authors')
    } catch {
        // if the try block fails
        if( author == null){
            res.redirect('/')
        }
        else{
           res.redirect(`/authors/${author.id}`)
        }
    }
})

module.exports = router
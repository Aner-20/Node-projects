const express = require('express');
const router = express.Router();
//const path = require('path')
//const multer = require('multer') // is used to work with file, in this case images
//const fs = require('fs')
const Book = require('../models/book');
const Author = require('../models/author')
//const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
/*
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))   // null: no errors
    }
})
*/
// All Books Route
router.get('/', async (req, res) => {
    let query = Book.find()
    if (req.query.title != null && req.query.title != ""){
        query = query.regex('title', new RegExp(req.query.title, 'i'))   // book.title
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != ""){
        query = query.lte('publishDate', req.query.publishedBefore)   // book.title
    }
    if (req.query.publishedAfter != null && req.query.publishedafter != ""){
        query = query.gte('publishDate', req.query.publishedAfter)   // book.title
    }
    try{
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions: req.query // gain access to the variables
        })
    } catch {
        res.redirect('/')
    }
})

// New Book Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
    
})

// Create Book Route
// upload.single('cover') is no longer required since it gets a string not a file
// upload.single('name of the cover that the user selects')
router.post('/',  async (req, res) => {
    //const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        //coverImageName: fileName,
        description: req.body.description
    })

    saveCover(book, req.body.cover)

    try{
        const newBook = await book.save()
        //res.redirect(`books/${newBook.id}`)
        res.redirect('books')
    } catch {
        /*if (book.coverImageName != null){
            removeBookCover(book.coverImageName) // call it only if there is a cover

        }*/
         renderNewPage(res, book, true)
    }

})
/*
function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.err(err)
    })
}*/
// Update Book route
router.put('/:id', async (req, res) => {
    let book
  
    try {
      book = await Book.findById(req.params.id)
      book.title = req.body.title
      book.author = req.body.author
      book.publishDate = new Date(req.body.publishDate)
      book.pageCount = req.body.pageCount
      book.description = req.body.description
      if (req.body.cover != null && req.body.cover !== '') {
        saveCover(book, req.body.cover)
      }
      await book.save()
      res.redirect(`/books/${book.id}`)
    } catch {
      if (book != null) {
        renderEditPage(res, book, true)
      } else {
        redirect('/')
      }
    }
  })


// Show book route
router.get('/:id', async (req, res) => {
    try {
        //populate() to get author's name
        const book = await Book.findById(req.params.id).populate('author').exec()
        res.render('books/show', { book: book })
    } catch {
        res.redirect('/')
    }

})

// Edit Book Route
router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        renderEditPage(res, book)
    } catch {
        res.redirect('/')
    }
   
})



// Delete Book Page
router.delete('/:id', async (req, res) => {
    let book
    try {
      book = await Book.findById(req.params.id)
      await book.remove()
      res.redirect('/books')
    } catch {
      if (book != null) {
        res.render('books/show', {
          book: book,
          errorMessage: 'Could not remove book'
        })
      } else {
        res.redirect('/')
      }
    }
  })
  

async function renderNewPage(res, book, hasError = false){
    renderFormPage(res, book, 'new', hasError)
}


async function renderEditPage(res, book, hasError = false){
    renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError = false){
    try{
        const authors =  await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) {
            if (form == 'edit'){
                params.errorMessage = "Error Updated Book"

            } else{
                params.errorMessage = "Error Creating Book"
            }
        }
        if (hasError) params.errorMessage = "Error Creating Book"
        res.render(`books/${form}`, params)
    } catch {
        res.redirect('/books')
    }
}


function saveCover(book, coverEncoded){
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)){
        // buffer conversion
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}


module.exports = router
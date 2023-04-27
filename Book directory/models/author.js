const mongoose = require('mongoose')
const Book = require('./book')
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
})

// Adding a constraint (action before the user remove something)
authorSchema.pre('remove', function(next){
    Book.find({ author: this.id}, (err, books) => {
        if(err){
            next(err) // preventing from removing
        }
        else if (books.length > 0){
            next(new Error('This author has books still'))
        }
        else{
            next() // remove the author
        }
    })
})

module.exports = mongoose.model('Author', authorSchema)
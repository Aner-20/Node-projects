const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom')    // render HTML inside Node.js, {}: to get only the desired portion
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String,
    },
    description: {
        type: String,
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    slug:{
        type: String,
        required: true,
        unique: true
    },
    /*
    sanitizedHtml: {
        type: String,
        required: true
    }*/
})
// Validation
articleSchema.pre('validate', function(next){   // run function every time the user save, delete ecc...
    if(this.title){
        this.slug = slugify(this.title, {lower: true, strict: true})    // strict removes every character that aren't allowed in the URL (example: ;)
    }
    /*
    if(this.markdown){
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))    // marked(this.markdown): convert markdown to HTML, this latter is purified by dompurify from malicious code
    }
    */
    next()
});

module.exports = mongoose.model('Article', articleSchema)
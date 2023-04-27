const express = require('express');
const Article = require('./../models/article')
const router = express.Router();

router.get('/new', (req, res) => {   // everything that insert inside '/' is after /articles
    res.render('articles/new', {article: new Article()})
})


router.get('/edit/:id',  async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', {article: article})
})

// before /:id and findById
router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({slug: req.params.slug});   // findOne to return just one article
    if (article == null) res.redirect('/')
    res.render('articles/show', {article: article})   // the id of the newly created model
})
/*
router.post('/',  async (req, res) => {
    let article = new Article({    // in this case let is necessary
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    })
    try{
        article = await article.save(); 
        res.redirect(`/articles/${article.slug}`);   // before .id
    }
    catch(e){
        res.render('articles/new', {article: article})   // {article: article} in order to refill out the form
    }
})*/

router.post('/', async (req, res, next) => {
    req.article = new Article()
    next() // go to the next function saveArticleAndRedirect
}, saveArticleAndRedirect('new'))


router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next() // go to the next function saveArticleAndRedirect
}, saveArticleAndRedirect('edit'))





router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
})



 function saveArticleAndRedirect(path){
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        
        
        try{
            article = await article.save(); 
            res.redirect(`/articles/${article.slug}`);   // before .id
        }
        catch(e){
            res.render(`articles/${path}`, {article: article})   // {article: article} in order to refill out the form
        }
    }
}




module.exports = router;
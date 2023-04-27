const express = require("express");
const mongoose = require('mongoose');
const Article = require('./models/article');
const articleRouter = require('./routes/articles');
const methodOverride = require('method-override'); // quite important override the method get/post and allows the usage of the delete method in order to call router.delete


const app = express();

mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true, useUnifiedTopology: true})

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: false}))  // gaining access to the parameters of an article, it has to be first 
app.use(methodOverride('_method'))

app.get('/',  async (req, res) => {
    const articles = await Article.find().sort({createdAt: 'desc'});
    res.render("articles/index", {articles: articles})


    /*const articles = [{
        title: 'Test Article',
        createdAt: new Date(),
        description: 'Test description'
    },

    {
        title: "Another Article",
        createdAt: new Date(),
        description: 'Test description 2'
    }

]*/
    //const articles =  await Article.find()
    //res.render("articles/index", {articles: articles})
})

app.use('/articles', articleRouter);   // every articleRouter created is gonna be after /articles


app.listen(3000);
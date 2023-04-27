const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session')
const passport = require('passport')

require('./config/passport')(passport);

// DB config
const db = require('./config/keys').MongoURI;

// Connect to mongo
mongoose.connect(db, { useNewUrlParser: true})
    .then(() => console.log("MongoDb connected"))
    .catch(err => console.log(err))

app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extended: false}))  // is required for mongoDB, the forms

// Express Session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session())

// Connect flash
app.use(flash())

// Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next()
})

const PORT = process.env.PORT || 5000;

app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))


app.listen(PORT, console.log("Server started on port " + PORT))
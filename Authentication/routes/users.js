const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport');

// User model
const User = require('../models/User')

// Login page
router.get('/login', (req, res) => {
    res.render("Login")
})

// Register Page
router.get('/register', (req, res) => {
    res.render("Register")
})

// Register Handle
router.post('/register', (req, res) => {
    //console.log(req.body); // what the user passes in the inputs
    const { name, email, password, password2 } = req.body;
    let errors = [];


    //Check required fields
    if(!name || !email || !password || !password2){
        errors.push({ msg: "Please fill in all fields"})
    }

    // Check passwords match
    if(password !== password2){
        errors.push({ msg: "Passwords do not match"})
    }


    // Check pass length
    if(password.length < 6){
        errors.push( {msg: "Password should be at least 6 characters"})
    }


    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2

        })
    }
    else{
        // Validation passed
        User.findOne({ email: email})
            .then(user => {
                if(user){
                    // User exists
                    errors.push({ msg: "Email is already registered"})
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
            
                    })
                }
                else{
                    const newUser = new User({
                        name,
                        email,
                        password,
                    })
                    //console.log(newUser);
                    //res.send('hello')

                    // Hash password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) =>{
                            if(err) throw err;
                            // Set password to hashed
                            newUser.password = hash;
                            // Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in')
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                        }))
                }
            })
    }

})  

// Login handle
router.post('/login', (req, res, next) => {
    // local: localStrategy implementation
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})


// Logout handle
router.get('/logout', (req, res) => {
    req.logout(req.user, err => {
        if(err) return next(err)
        req.flash('success_msg', "You are logged out");
        res.redirect('/users/login')
    });
})

module.exports = router;

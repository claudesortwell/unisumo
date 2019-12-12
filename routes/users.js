const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User');

// Login Page
router.get('/login', function(req, res) {
    if(req.isAuthenticated()){
        res.redirect('/dashboard');
    } else {
        res.render('login', {title:'Login'});
    }
});

// Register Page
router.get('/register', function(req, res) {
    if(req.isAuthenticated()){
        res.redirect('/dashboard');
    } else {
        res.render('register', {title:'Register'});
    }
});

// Register Handle 
router.post('/register', (req, res) => {
    const { name, email,uni, password, password2 } = req.body;

    let errors = [];

    // Check required fields
    if(!name || !email || !password || !password2 || !uni){
        errors.push({msg: 'Please fill in all fields'});
    }

    // Check passwords match
    if(password !== password2){
        errors.push({msg: 'Passwords do not match'});
    }

    // Check pass length
    if(password.length < 6){
        errors.push({msg: 'Password should be at least 6 characters'});
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2 
        });
    } else {
        // Validation Passed
        User.findOne({email: email})
        .then(user => {
            if(user){
                // User exists
                errors.push({msg: 'Email is already registered'});

                res.render('register', {
                    errors,
                    name,
                    email,
                    uni,
                    password,
                    password2 
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    uni,
                    password
                });

                // Hash Password
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) =>{
                        if(err) throw err;

                        // Set password to hashed version
                        newUser.password = hash;
                        // Save user
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can log in');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                }))
            }
        });
    }
});

// Login handle
router.post('/login', (req, res, next) =>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout handle
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You have successfully been logged out');
    res.redirect('/users/login');
});


// 404 Error Page
router.get('/*', (req, res) => {
    if(req.isAuthenticated()) {
        res.render('404', {title: 'Page not found 404', auth: 'yes'});
    } else {
        res.render('404', {title: 'Page not found 404', auth: 'no'});
    }
});

module.exports = router;
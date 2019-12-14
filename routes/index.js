const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', function(req, res) {
    if(req.isAuthenticated()){
        res.render('welcome', {title:'Welcome', auth: 'yes'});
    } else {
        res.render('welcome', {title:'Welcome', auth: 'no'});
    }
});

// Dashboard Page
router.get('/dashboard', ensureAuthenticated, function(req, res) {
    if(req.user.payConfirmed){
        res.render('dashboard', {
            name: req.user.name,
            uni: req.user.uni,
            title:'Dashboard'
        });
    } else {
        req.flash('error_msg', 'To access ur dashboard you need to setup ur plan and payment options.');
        res.redirect('/pay');
    }
});

router.get('/pay', ensureAuthenticated, function(req, res) {
    res.render('pay', {title: 'Subscription Plans'})
});

module.exports = router;
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
    res.render('dashboard', {
        name: req.user.name,
        uni: req.user.uni,
        title:'Dashboard'
    });
});

// 404 Error Page (Must be last one)
router.get('/*', (req, res) => {
    if(req.isAuthenticated()) {
        res.render('404', {title: 'Page not found 404', auth: 'yes'});
    } else {
        res.render('404', {title: 'Page not found 404', auth: 'no'});
    }
});

module.exports = router;
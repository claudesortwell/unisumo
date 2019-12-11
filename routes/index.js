const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', function(req, res) {
    res.render('welcome', {title:'Welcome'});
});

// Dashboard Page
router.get('/dashboard', ensureAuthenticated, (req, res) => 
    res.render('dashboard', {
        name: req.user.name,
        uni: req.user.uni,
        title:'Dashboard'
    }));

module.exports = router;
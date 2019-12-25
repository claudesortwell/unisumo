const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureActiveSub } = require('../config/auth');
const fs = require("fs");

// Document router
router.get('/ed:id', ensureAuthenticated, ensureActiveSub, function(req, res) {
    
    // Subject.find({ownedUser: req.user._id})
    //     .then(subject => {
    //         sub = subject;
    //     })
    //     .catch(err => console.log(err));

    let sub = null;

    Document.findOne({_id: req.params.id, ownedBy: req.user._id})
        .then(document => {
            if(document == null) {
                res.redirect('/404');
            } else {
                res.render('docs', {
                    layout: 'dashboardlayout',
                    name: req.user.name,
                    email: req.user.email,
                    uni: req.user.uni,
                    subjects: sub,
                    document: document,
                    darkmode: req.user.darkMode,
                    title:'docs'
                });
            }
        })
        .catch(err => console.log(err));
   
});

module.exports = router;
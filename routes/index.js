const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureActiveSub } = require('../config/auth');
const fs = require("fs");
var http = require ('http');

// Welcome Page
router.get('/', function(req, res) {
    if(req.isAuthenticated()){
        res.render('welcome', {title:'Welcome', auth: 'yes'});
    } else {
        res.render('welcome', {title:'Welcome', auth: 'no'});
    }
});

// Dashboard Page
router.get('/dashboard', ensureAuthenticated, ensureActiveSub, function(req, res) {
    Subject.find({ownedUser: req.user._id})
        .then(subject => {
            res.render('home', {
                layout: 'dashboardlayout',
                name: req.user.name,
                darkmode: req.user.darkMode,
                uni: req.user.uni,
                subjects: subject, 
                title:'Dashboard'
            });
        })
        .catch(err => console.log(err));            
});

// Payment Page
router.get('/pay', ensureAuthenticated, function(req, res) {
    res.render('pay', {title: 'Subscription Plans', name:req.user.name, email:req.user.email})
});

// Add a subject
router.post('/addsub', ensureAuthenticated, ensureActiveSub, (req, res) => {
    const { name, icon } = req.body;
    const ownedUser = req.user._id;

    // Check required fields
    if(!name || !icon) {
        req.flash('error_msg', 'Please fill in all fields');
        res.redirect('/dashboard');
    } else {
        const newSubject = new Subject({
            name, 
            icon,
            ownedUser
        });
        newSubject.save()
            .then(subject => {
                req.flash('success_msg', 'Subject "' + subject.name + '"created successfully');
                res.redirect('back'); 
            })
            .catch(err => console.log(err));
    }

});
 

// Remove a subject (permanently)
router.get('/removesub/:id', ensureAuthenticated, ensureActiveSub, function(req, res) {

    var subjectId = req.params.id;
    Subject.deleteOne({_id:subjectId, ownedUser:req.user._id}, function(err){
        if(err){
            console.log(err);
            return;
        }
    });

    req.flash('success_msg', 'Subject was deleted sucessfully if you owned it.');
    res.redirect('back'); 
    
});

// Settings Page 
router.get('/dashboard/settings', ensureAuthenticated, ensureActiveSub, function(req, res, viewSubject) {

    Subject.find({ownedUser: req.user._id})
        .then(subject => {
            res.render('settings', {
                layout: 'dashboardlayout',
                email: req.user.email,
                uni: req.user.uni,
                name: req.user.name,
                darkmode: req.user.darkMode,
                subjects: subject, 
                title:'Settings'
            });
        })
        .catch(err => console.log(err));

});


// Update user
router.post('/dashboard/updateuser', ensureAuthenticated, ensureActiveSub, function(req, res) {
    let user = {};

    user.name = req.body.name;
    user.email = req.body.email;
    user.uni = req.body.uni;

    let query = {_id: req.user._id};

    User.updateOne(query, user, function(err) {
        if(err) {
            console.log(err)
        } else {
            req.flash('success_msg', 'Details updated sucessfully');
            res.redirect('/dashboard/settings');
        }
    });
});


// Update subject details
router.post('/dashboard/updatesubject/:id', ensureAuthenticated, ensureActiveSub, function(req, res) {
    let subject = {};

    subject.name = req.body.name;
    subject.icon = req.body.icon;

    let query = {_id: req.params.id, ownedUser:req.user._id};

    Subject.updateOne(query, subject, function(err) {
        if(err) {
            console.log(err)
        } else {
            req.flash('success_msg', 'Subject updated sucessfully');
            res.redirect('/dashboard/settings');
        }
    });
});


// Enable dark mode
router.get('/darkmode', ensureAuthenticated, ensureActiveSub, function(req, res) {
    var tempDark = false;
    if(req.user.darkMode != true) {
        tempDark = true;
    }

    User.updateOne(
        {email: req.user.email},
        {$set: {darkMode: tempDark}},
      function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect('back');   
        }
    });
});


// Maq uni app page
router.get('/uniapp', ensureAuthenticated, ensureActiveSub, function(req, res) {
    http.get ({
        host: 'localhost',
        port: 8080,
        path: 'http://nodejs.org/'
    }, function (response) {
        console.log (response);
    });

    Subject.find({ownedUser: req.user._id})
        .then(subject => {
            res.render('maquni', {
                layout: 'dashboardlayout',
                email: req.user.email,
                uni: req.user.uni,
                name: req.user.name,
                darkmode: req.user.darkMode,
                subjects: subject, 
                title:'Uni Apps'
            });
        })
        .catch(err => console.log(err));
});


module.exports = router;
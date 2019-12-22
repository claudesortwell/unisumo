const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const mongoose = require('mongoose');

mongoose.connect(db, {useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected from index.js...'))
    .catch(err => console.log(err));

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
    if(req.user.planVer > 0){
        stripe.subscriptions.retrieve(
            req.user.stripeSubId,
            function(err, subscription) {
                if(err){
                    console.log(err);
                }

                switch(subscription.status){
                    case 'active':
                        Subject.find({ownedUser: req.user._id})
                            .then(subject => {
                                if(!subject) {
                                    res.render('home', {
                                        layout: 'dashboardlayout',
                                        name: req.user.name,
                                        darkmode: req.user.darkMode,
                                        uni: req.user.uni,
                                        title:'Dashboard'
                                    });
                                } else { 
                                    res.render('home', {
                                        layout: 'dashboardlayout',
                                        name: req.user.name,
                                        darkmode: req.user.darkMode,
                                        uni: req.user.uni,
                                        subjects: subject, 
                                        title:'Dashboard'
                                    });
                                }
                            })
                            .catch(err => console.log(err));
                        break;
                    case 'canceled':
                        req.flash('error_msg', 'You have canceled your subscription, please select a new plan and enter your details.');
                        res.redirect('/pay');
                        break;
                    case 'incomplete': case 'incomplete-expired': case 'unpaid': case 'past_due':
                        req.flash('error_msg', 'Payment Failed, please select a subscription and re enter your payment details');
                        res.redirect('/pay');
                        break;
                }
        
            }
        );
    } else {
        req.flash('error_msg', 'To access ur dashboard you need to setup ur plan and payment options.');
        res.redirect('/pay');
    }
});

// Payment Page
router.get('/pay', ensureAuthenticated, function(req, res) {
    res.render('pay', {title: 'Subscription Plans', name:req.user.name, email:req.user.email})
});

// Add a subject
router.post('/addsub', ensureAuthenticated, (req, res) => {
    const { name, icon, color } = req.body;
    const ownedUser = req.user._id;

    // Check required fields
    if(!name || !icon || !color) {
        req.flash('error_msg', 'Please fill in all fields');
        res.redirect('/dashboard');
    } else {
        const newSubject = new Subject({
            name, 
            icon,
            color,
            ownedUser
        });
        newSubject.save()
            .then(subject => {
                req.flash('success_msg', 'Subject created successfully');
                res.redirect('back'); 
            })
            .catch(err => console.log(err));
    }

});
 
// Remove a subject (permanently)
router.get('/removesub/:id', ensureAuthenticated, function(req, res) {

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
router.get('/dashboard/settings', ensureAuthenticated, function(req, res) {
    Subject.find({ownedUser: req.user._id})
        .then(subject => {
            if(!subject) {
                res.render('settings', {
                    layout: 'dashboardlayout',
                    name: req.user.name,
                    email: req.user.email,
                    uni: req.user.uni,
                    darkmode: req.user.darkMode,
                    title:'settings'
                });
            } else { 
                res.render('settings', {
                    layout: 'dashboardlayout',
                    email: req.user.email,
                    uni: req.user.uni,
                    name: req.user.name,
                    darkmode: req.user.darkMode,
                    subjects: subject, 
                    title:'settings'
                });
            }
        })
        .catch(err => console.log(err));
});

// Update user
router.post('/dashboard/updateuser', ensureAuthenticated, function(req, res) {
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
router.post('/dashboard/updatesubject/:id', ensureAuthenticated, function(req, res) {
    let subject = {};

    subject.name = req.body.name;
    subject.icon = req.body.icon;
    subject.color = req.body.colour;

    let query = {_id: req.params.id, ownedUser:req.user._id};

    Subject.updateOne(query, subject, function(err) {
        if(err) {
            console.log(err)
        } else {
            console.log(subject.colour);
            req.flash('success_msg', 'Subject updated sucessfully');
            res.redirect('/dashboard/settings');
        }
    });
});


// Enable dark mode
router.get('/darkmode', ensureAuthenticated, function(req, res) {
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

module.exports = router;
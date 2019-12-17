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
                        res.render('dashboard', {
                            name: req.user.name,
                            darkmode: req.user.darkMode,
                            uni: req.user.uni,
                            title:'Dashboard'
                        });
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
require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const {
    ensureAuthenticated
} = require('./config/auth');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const STRIPE_API = require('./config/stripe-functions.js');

// Init App
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

// Passport config
require('./config/passport')(passport);

// DB Config
db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, {
        useNewUrlParser: true
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Pulling in models
User = require('./models/User');
Subject = require('./models/Subject')
Document = require('./models/Document');

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static("public"))

// Bodyparser
app.use(express.urlencoded({
    extended: false
}));

// Express Session
app.use(session({
    secret: 'unisumoclaude',
    resave: false,
    saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.bad = req.flash('bad');
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/doc', require('./routes/doc'));
app.use('/users', require('./routes/users'));

// Processing Stripe Payment
app.use('/processPayment', ensureAuthenticated, (req, res) => {
    if (req.body.planId == null && req.body.footer != 'cardfooter') {
        req.flash('error_msg', "Please select card and enter card details.");
        res.redirect('/pay');
        return;
    }

    STRIPE_API.createCustomerAndSubscription(req.body, req.user).then(() => {
        setTimeout(function () {
            req.flash('success_msg', "Payment was successful, enjoy Unisumo");
            res.redirect('/dashboard');
        }, 2000);
    }).catch(err => {
        req.flash('error_msg', "Please try again. " + err.message);
        res.redirect('/pay');
    });
});

// If page not found
app.use('*', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('404', {
            title: 'Page not found 404',
            auth: 'yes'
        });
    } else {
        res.render('404', {
            title: 'Page not found 404',
            auth: 'no'
        });
    }
});


const PORT = process.env.PORT || 8001;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
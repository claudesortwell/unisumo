require('dotenv').config();
const express = require('express'); 
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const { ensureAuthenticated } = require('./config/auth');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const STRIPE_API = require('./config/stripe-functions.js');

// Init App
const app = express();
 
// Passport config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, {useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

const User = require('./models/User');

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static("public"))

// Bodyparser
app.use(express.urlencoded({extended: false}));

// Express Session
app.use(session({
    secret: 'unisumoclaude',
    resave: false,
    saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Conntect Flash
app.use(flash());

// Global Vars
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// Processing Stripe Payment
app.use('/processPayment', ensureAuthenticated, (req, res) => {
    if(req.body.planId == null && req.body.footer != 'cardfooter'){
        req.flash('error_msg', "Please select card and enter card details.");
        res.redirect('/pay');
        return;
    }

    STRIPE_API.createCustomerAndSubscription(req.body, req.user).then(() => {
        let user = {};
        user.name = req.user.name;
        user.email = req.user.email;
        user.uni = req.user.uni;
        user.password = req.user.password;
        user.date = req.user.date;
        user.planVer = req.body.planId;

        let query = {_id:req.user._id};

        User.updateOne(query, user, function(err){
            if(err){
                console.log(err)
                return;
            } else {
                res.redirect('/users/login');
            }
        });


    }).catch(err => {
        req.flash('error_msg', "Please try again. " + err.message);
        res.redirect('/pay');
    });
});

app.use('*', (req, res) => {
    if(req.isAuthenticated()) {
        res.render('404', {title: 'Page not found 404', auth: 'yes'});
    } else {
        res.render('404', {title: 'Page not found 404', auth: 'no'});
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`)); 
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()){
            return next();
        }

        req.flash('error_msg', 'Please log in to view the dashboard');
        res.redirect('/users/login');
    },

    ensureActiveSub: function(req, res, next) {
        if(req.user.planVer > 0){
            stripe.subscriptions.retrieve(
                req.user.stripeSubId,
                function(err, subscription) {
                    if(err){
                        console.log(err);
                    }

                    switch(subscription.status){
                        case 'active':
                            return next();
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
    }
}
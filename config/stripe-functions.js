require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const mongoose = require('mongoose');

// DB Config
const db = require('./keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, {useNewUrlParser: true })
    .then(() => console.log('Stripe mongoDB connected'))
    .catch(err => console.log(err));

// Creating subscription
function createCustomerAndSubscription(requestBody, user, req) {
    return stripe.customers.create({
      source: requestBody.stripeToken,
      email: user.email
    }).then(customer => {
      stripeCusID = customer.id;
      stripe.subscriptions.create({
          customer: customer.id,
          items: [
            {
              plan: requestBody.planId
            }
          ]
        },
        function(err, subscription) {
          if(err){
            console.log(err);
          } else {
            // Setting subscription ID in mongodb
            User.updateOne(
              {email: user.email},
              {$set: {stripeSubId: subscription.id, stripeCusId: customer.id}},
            function(err){
              if(err){
                console.log(err);
              } else {
                return;
              }
            })
          }
        }
      );
    });
  }
  
  
module.exports = {
  createCustomerAndSubscription
};
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

stripeCusID = '';
stripeSubID = '';

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
            stripeSubID = subscription.id;
            console.log(subscription.id);
          }
        }
      );
    });
  }
  
  
module.exports = {
  createCustomerAndSubscription,
  stripeSubID,
  stripeCusID
};
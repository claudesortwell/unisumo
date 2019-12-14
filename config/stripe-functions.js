require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

function createCustomerAndSubscription(requestBody, user) {
    return stripe.customers.create({
      source: requestBody.stripeToken,
      email: user.email
    }).then(customer => {
      stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            plan: requestBody.planId
          }
        ]
      });
    });
  }
  
  
module.exports = {
    createCustomerAndSubscription
};
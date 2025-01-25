const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const basePrices = {
  '3-pages': 175 * 3,   
  '4-pages': 175 * 4,   
  '5-pages': 175 * 5,   
};

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { plan, includeHosting } = req.body;
    let amount = basePrices[plan];

    if (!amount) {
      return res.status(400).send({ error: 'Invalid plan selected' });
    }

    if (includeHosting) {
      amount += 6000;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));

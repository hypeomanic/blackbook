import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('YOUR_STRIPE_PUBLIC_KEY_HERE');

function Payment() {
  return (
    <div>
      <h2>Upgrade to Pro Membership</h2>
      <p>Gain full access to the database and submit unlimited reports.</p>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}

export default Payment;

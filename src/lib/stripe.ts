import Stripe from "stripe";

const globalForStripe = globalThis as unknown as { stripe: Stripe };

function createStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // Return a placeholder during build — routes will fail at runtime if key is missing
    return new Stripe("sk_test_placeholder", {
      apiVersion: "2026-01-28.clover",
    });
  }
  return new Stripe(key, {
    apiVersion: "2026-01-28.clover",
  });
}

export const stripe = globalForStripe.stripe || createStripeClient();

if (process.env.NODE_ENV !== "production") globalForStripe.stripe = stripe;

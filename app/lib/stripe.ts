// everything dealing with cashout exp

import { Autour_One } from "next/font/google";
import Stripe from "stripe";

//create a stripe client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
  typescript: true,
});

//function to realize checkout

export const getStripeSession = async ({
  priceId,
  domainUrl,
  customerId,
}: {
  priceId: string;
  domainUrl: string;
  customerId: string;
}) => {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    billing_address_collection: "auto",
    line_items: [{ price: priceId, quantity: 1 }],
    payment_method_types: ["card"], //checkout these items in the page
    customer_update: {
      address: "auto", //update customer name if willing
      name: "auto",
    },
    success_url: `${domainUrl}/payment/success`,
    cancel_url: `${domainUrl}/payment/cancelled`,
  }); //initiate a new checkout session

  return session.url as string;
};

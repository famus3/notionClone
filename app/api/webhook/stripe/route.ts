import { stripe } from "@/app/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "@/app/lib/db";

//in prod: more webhooks
// card got abandonned, abandon email

export async function POST(req: Request) {
  const body = await req.text(); //body payload
  const signature = headers().get("Stripe-Signature") as string; //stripe signature , we can get headers as route not cached

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string //webhook secret from env variable
    );
  } catch (error: unknown) {
    return new Response("webhook error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  //listen for webhook events & return sth
  //if completed, create a new sub for the user {}

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    //get stripe customer id
    const customerId = String(session.customer);

    //fetch the user from the DB
    const user = await prisma.user.findUnique({
      where: {
        stripeCustomerId: customerId,
      },
    });

    if (!user) throw new Error("User not found...");

    //create a sub for a new user
    await prisma.subscription.create({
      data: {
        stripeSubscriptionId: subscription.id,
        userId: user.id,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        status: subscription.status,
        planId: subscription.items.data[0].plan.id,
        interval: String(subscription.items.data[0].plan.interval),
      },
    });
  }
  //create another event listener
  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await prisma.subscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        planId: subscription.items.data[0].price.id,
        currentPeriodStart: subscription.current_period_end,
        currentPeriodEnd: subscription.current_period_end,
        status: subscription.status,
      },
    });
  }

  return new Response(null, { status: 200 }); //status 200 means it works
}

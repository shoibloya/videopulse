import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

async function getUserStripeCustomerId(req: Request): Promise<string | null> {
  return process.env.TEST_STRIPE_CUSTOMER_ID || null;
}

export async function POST(req: Request) {
  const customerId = await getUserStripeCustomerId(req);
  if (!customerId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    // Retrieve active subscriptions (assuming a single active subscription).
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    const subscriptionId = subscriptions.data[0].id;

    // Cancel the subscription. You can choose to cancel immediately or at period end.
    const canceledSubscription = await stripe.subscriptions.del(subscriptionId);

    return NextResponse.json({
      message: "Subscription cancelled",
      subscription: canceledSubscription,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}

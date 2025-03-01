import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

// Replace this with your own authentication logic.
async function getUserStripeCustomerId(req: Request): Promise<string | null> {
  // For testing, you can use a fixed test customer ID.
  return process.env.TEST_STRIPE_CUSTOMER_ID || null;
}

export async function GET(req: Request) {
  const customerId = await getUserStripeCustomerId(req);
  if (!customerId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    // List all subscriptions for the customer and expand the price details.
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 1,
      expand: ["data.items.data.price"],
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ message: "No active subscription" });
    }

    const subscription = subscriptions.data[0];
    // Get the plan nickname if available; otherwise, use the price ID.
    const price = subscription.items.data[0].price;
    const plan = (price.nickname as string) || price.id;
    // Convert the current_period_end timestamp to an ISO date string.
    const nextBillingDate = new Date(subscription.current_period_end * 1000).toISOString();

    const responseData = {
      id: subscription.id,
      status: subscription.status,
      plan,
      nextBillingDate,
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

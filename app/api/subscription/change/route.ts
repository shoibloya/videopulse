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
    // Use the request URL's origin to set the return URL.
    const { origin } = new URL(req.url);
    // Create a Stripe Customer Portal session.
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/dashboard`, // Update this to your desired return URL
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.message || "Failed to create customer portal session",
      },
      { status: 500 }
    );
  }
}

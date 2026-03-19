import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any,
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const origin = req.headers.get("origin") || "http://localhost:3000";

    // 1. Search Stripe for the customer using their Gravity login email
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json(
        { error: "No active Stripe customer found for this email." },
        { status: 404 }
      );
    }

    const customerId = customers.data[0].id;

    // 2. Generate the secure link to their specific Stripe Billing Portal
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/settings`, // Sends them back here when they are done
    });

    return NextResponse.json({ url: portalSession.url });
    
  } catch (error: any) {
    console.error("Portal Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create portal link." },
      { status: 500 }
    );
  }
}
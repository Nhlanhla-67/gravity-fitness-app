import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe and bypass the strict TypeScript version check
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any, 
});

export async function POST(req: Request) {
  try {
    // 1. Catch the userId sent from the Settings page button
    const { userId } = await req.json(); 
    
    // Get the origin of the request (e.g., http://localhost:3000)
    const origin = req.headers.get("origin") || "http://localhost:3000";

    // Create the secure Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      client_reference_id: userId, // 2. Attach the user's ID to the Stripe session!
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/settings?canceled=true`,
    });

    // Return the checkout URL to the frontend
    return NextResponse.json({ url: session.url });
    
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong with checkout." },
      { status: 500 }
    );
  }
}
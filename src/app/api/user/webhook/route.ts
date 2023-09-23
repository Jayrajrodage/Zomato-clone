import { connect } from "@/dbConfig/dbConfig";
import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import getRawBody from "raw-body";
import { model } from "mongoose";
import order from "@/models/OrderModel";
import { NextApiRequest } from "next";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//Connect DB
connect();

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("Stripe-Signature") as string;
    console.log("signature", signature);
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error: any) {
      return new NextResponse(`Webhook Error: ${error.message}`, {
        status: 400,
      });
    }
    const session = event.data.object as Stripe.Checkout.Session;
    if (event.type === "checkout.session.completed") {
      const buyername = session.customer_details?.name;
      const phone = session.customer_details?.phone;
      const address = session.customer_details?.address?.line1;
      const metaData = session.metadata;
      const Restaurant = metaData?.Restaurantid;
      const email = metaData?.email;
      const Foodarray = await stripe.checkout.sessions.listLineItems(
        session.id
      );
      const Food = Foodarray.data;
      const imagesArray = JSON.parse(metaData!.images);
      const total = session?.amount_total;

      //Combine Food and FoodImages into a single array with images
      const combinedFoodArray = Food.map((foodItem: any, index: any) => ({
        ...foodItem,
        image: imagesArray[index],
      }));
      const newOrder = new order({
        buyername: buyername,
        Phone: phone,
        email: email,
        address: address,
        Restaurant: Restaurant,
        Food: combinedFoodArray,
        Total: total,
      });
      const savedorder = await newOrder.save();
      console.log(savedorder);
      return NextResponse.json({
        message: "Food Order created successfully",
        success: true,
        savedorder,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

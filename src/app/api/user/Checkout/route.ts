import { connect } from "@/dbConfig/dbConfig";
import { NextApiRequest } from "next";
import { NextResponse, NextRequest } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//Connect DB
connect();
export async function POST(request: NextRequest) {
  try {
    const { items, email }: any = await request.json();

    const Restaurantid = items[0].Restaurant._id;
    console.log(items, email, Restaurantid);
    const modifiedItems = items.map((item: any) => ({
      quantity: item.quantity,
      price_data: {
        currency: "INR",
        unit_amount: item.FoodPrice * 100,
        product_data: {
          name: item.FoodName,

          description: item.Restaurant.RestaurantName,
        },
      },
    }));
    //console.log(modifiedItems);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
      line_items: modifiedItems,
      phone_number_collection: {
        enabled: true,
      },
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/Success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/CartPage`,
      metadata: {
        email,
        images: JSON.stringify(items.map((item: any) => item.FoodImage)),
        Restaurantid,
      },
    });
    console.log(session);
    return NextResponse.json({
      session: session,
    });
    // // Create the order data object
    // const orderData = {
    //   name: session.metadata.name,
    //   Phone: session.custom_fields.Phone,
    //   email: session.metadata.email,
    //   address: session.metadata.address,
    //   Restaurant: items.Restaurant._id,
    //   Food: modifiedItems,
    // };
    // console.log(orderData);
    // // Save the order to the database
    // try {
    //   const newOrder = new order(orderData);
    //   await newOrder.save();
    //   return NextResponse.json({
    //     id: session.id,
    //   });
    // } catch (error) {
    //   return NextResponse.json({
    //     error: error,
    //   });
    // }
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

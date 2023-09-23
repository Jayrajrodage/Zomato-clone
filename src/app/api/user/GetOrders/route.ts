import { connect } from "@/dbConfig/dbConfig";
import Food from "@/models/Food";
import order from "@/models/OrderModel";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Connect DB
connect();
export async function GET(request: NextRequest) {
  try {
    const headersList = headers();
    const Email = headersList.get("Email");
    console.log(Email);
    const orders = await order.find({ email: Email }).populate("Restaurant");
    if (!orders) {
      return NextResponse.json({
        error: "No recent orders found",
        status: 400,
        success: false,
      });
    }

    return NextResponse.json({
      message: "found Food",
      success: true,
      status: 200,
      orders,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

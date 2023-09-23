import { connect } from "@/dbConfig/dbConfig";
import Admin from "@/models/AdminModel";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
//connect db
connect();

export async function GET(request: NextRequest) {
  try {
    const headersList = headers();
    const RestaurantType = headersList.get("RestaurantType");
    const SearchRestaurant = headersList.get("Search");
    if (!SearchRestaurant) {
      if (RestaurantType === "All") {
        const admin = await Admin.find({});
        if (!admin) {
          // Handle the case where admin is not found
          return NextResponse.json({
            error: "Restaurant data not found",
            success: false,
          });
        }

        // You can now use the 'admin' object to create your response
        return NextResponse.json({
          message: "Restaurant data retrieved successfully",
          Restaurant: admin,
          success: true,
        });
      } else {
        const admin = await Admin.find({ RestaurantType: RestaurantType });
        if (!admin) {
          // Handle the case where admin is not found
          return NextResponse.json({
            error: "Restaurant data not found",
            success: false,
          });
        }
        // You can now use the 'admin' object to create your response
        return NextResponse.json({
          message: "Restaurant data retrieved successfully",
          Restaurant: admin,
          success: true,
        });
      }
    }
    if (RestaurantType === "All") {
      const admin = await Admin.find({ $text: { $search: SearchRestaurant } });
      if (!admin) {
        // Handle the case where admin is not found
        return NextResponse.json({
          error: "Restaurant data not found",
          success: false,
        });
      }

      // You can now use the 'admin' object to create your response
      return NextResponse.json({
        message: "Restaurant data retrieved successfully",
        Restaurant: admin,
        success: true,
      });
    } else {
      const admin = await Admin.find(
        { RestaurantType: RestaurantType },
        { $text: { $search: SearchRestaurant } }
      );
      if (!admin) {
        // Handle the case where admin is not found
        return NextResponse.json({
          error: "Restaurant data not found",
          success: false,
        });
      }
      // You can now use the 'admin' object to create your response
      return NextResponse.json({
        message: "Restaurant data retrieved successfully",
        Restaurant: admin,
        success: true,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

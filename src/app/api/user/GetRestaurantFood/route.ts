import { connect } from "@/dbConfig/dbConfig";
import Food from "@/models/Food";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Admin from "@/models/AdminModel";

//Connect DB
connect();
export async function GET(request: NextRequest) {
  try {
    const headersList = headers();
    const RestaurantId = headersList.get("Restaurant");
    const foodtype = headersList.get("foodType");
    const SearchFood = headersList.get("Search");
    // Find the admin based on the provided email
    if (foodtype) {
      if (SearchFood) {
        const food = await Food.find({
          Restaurant: RestaurantId,
          FoodType: foodtype,
          $text: { $search: `"\"${SearchFood}\""`, $caseSensitive: false },
        })
          .populate("Restaurant")
          .lean();
        console.log(food);
        const Restaurant = await Admin.find({
          _id: RestaurantId,
        });
        return NextResponse.json({
          message: "found Food",
          success: true,
          status: 200,
          food,
          Restaurant,
        });
        console.log("jo");
      }
      const food = await Food.find({
        Restaurant: RestaurantId,
        FoodType: foodtype,
      })
        .populate("Restaurant")
        .lean();
      console.log(food);
      const Restaurant = await Admin.find({
        _id: RestaurantId,
      });

      return NextResponse.json({
        message: "found Food",
        success: true,
        status: 200,
        food,
        Restaurant,
      });
    }
    if (SearchFood) {
      const food = await Food.find({
        Restaurant: RestaurantId,
        $text: { $search: `"\"${SearchFood}\""`, $caseSensitive: false },
      })
        .populate("Restaurant")
        .lean();
      console.log(food);
      const Restaurant = await Admin.find({
        _id: RestaurantId,
      });
      return NextResponse.json({
        message: "found Food",
        success: true,
        status: 200,
        food,
        Restaurant,
      });
      console.log("jo");
    }
    const food = await Food.find({
      Restaurant: RestaurantId,
    })
      .populate("Restaurant")
      .lean();
    console.log(food);
    const Restaurant = await Admin.find({
      _id: RestaurantId,
    });

    return NextResponse.json({
      message: "found Food",
      success: true,
      status: 200,
      food,
      Restaurant,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

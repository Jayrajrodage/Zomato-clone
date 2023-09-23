import { connect } from "@/dbConfig/dbConfig";
import Food from "@/models/Food";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

//Connect DB
connect();
export async function GET(request: NextRequest) {
  try {
    const headersList = headers();
    const foodName = headersList.get("foodName");
    const vegornonveg = headersList.get("vegornonveg");

    if (vegornonveg === "All") {
      // Find the documents where FoodType matches
      const food = await Food.find({
        $text: { $search: `"\"${foodName}\""`, $caseSensitive: false },
      })
        .populate("Restaurant")
        .lean();
      console.log(food);

      if (!food) {
        return NextResponse.json({
          error: "Food not found",
          status: 400,
          success: false,
        });
      }

      return NextResponse.json({
        message: "found Food",
        success: true,
        status: 200,
        food,
      });
    } else {
      // Find the documents where FoodType matches
      const food = await Food.find({
        vegorNonveg: vegornonveg,
        $text: { $search: `"\"${foodName}\""`, $caseSensitive: false },
      })
        .populate("Restaurant")
        .lean();
      console.log(food);

      if (!food) {
        return NextResponse.json({
          error: "Food not found",
          status: 400,
          success: false,
        });
      }

      return NextResponse.json({
        message: "found Food",
        success: true,
        status: 200,
        food,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

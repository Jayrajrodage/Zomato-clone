"use client";
import React from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Button, Space } from "antd";
import "react-toastify/dist/ReactToastify.css";
import useFoodStore from "@/GlobalState/State";
const page = ({ params }: any) => {
  const { Food, addFoodTocart } = useFoodStore();
  const [data, setdata] = React.useState([]);
  const [selectedHotelType, setselectedHotelType] = React.useState("All");
  const [loading, setloading] = React.useState(false);

  const foodName = params.selectedFood;
  //console.log(foodName);
  const getdata = async () => {
    try {
      setloading(true);
      const response = await axios.get(`/api/user/GetFood`, {
        headers: {
          foodName: foodName,
          vegornonveg: selectedHotelType,
        },
      });
      if (!response.data.success) {
        toast.error(`${response.data.error}`);
      } else {
        setdata(response.data.food);
        //setRestaurantdata(response.data.Restaurant[0]);
        //console.log(response.data.food);
        //console.log(response.data.Restaurant[0]);
        //toast.success(`${response.data.message}`);
      }
    } catch (error: any) {
      console.log("Error while getting food data", error);
      toast.error(error.message);
    } finally {
      setloading(false);
    }
  };

  React.useEffect(() => {
    getdata();
  }, [selectedHotelType]);
  return (
    <div className="bg-yellow-50 p-5">
      <>
        <section className="text-gray-600 body-font bg-yellow-50 flex-1 p-3">
          <h1 className="mb-[2rem] font-bold text-3xl text-yellow-900 md:text-3xl">
            {foodName}
          </h1>
          <div className="flex flex-wrap gap-5">
            <div className="w-[11rem] mb-10">
              <label
                htmlFor="manufacturer"
                className="text-sm font-medium ml-1 text-stone-600"
              >
                Select Food type
              </label>
              <select
                id="manufacturer"
                className="mt-2 block w-full rounded-md border border-gray-100 bg-gray-100 px-2 py-2 shadow-sm outline-none focus:border-yellow-500 focus:ring focus:yellow-blue-200 focus:ring-opacity-50"
                onChange={(e) => setselectedHotelType(e.target.value)} // Attach onChange event handler
                value={selectedHotelType}
              >
                <option value="All">All</option>
                <option value="Pure-veg">Pure-Veg</option>
                <option value="Non-Veg">Non-Veg</option>
                <option value="Both">Both veg/Non-Veg</option>
              </select>
            </div>
          </div>
          {loading ? (
            <>
              <div className="">
                <div
                  className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-warning motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                >
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Loading...
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="container  mx-auto">
                <div className="flex flex-wrap -m-4">
                  {data.length > 0 ? (
                    data.map((food: any) => (
                      <div
                        className="lg:w-1/4 md:w-1/2 p-4 w-full rounded-xl shadow-xl border"
                        key={food._id}
                      >
                        <a className="block relative h-48 rounded overflow-hidden">
                          <img
                            alt="ecommerce"
                            className="object-cover object-center w-full h-full block hover:scale-125 transition duration-500 cursor-pointer "
                            src={food.FoodImage}
                          />
                        </a>
                        <div className="flex justify-between p-2">
                          <div>
                            <div className="mt-4">
                              <h3 className="text-gray-700 text-xs tracking-widest title-font mb-1">
                                {food.vegorNonveg}
                              </h3>

                              <h3 className="text-gray-700 text-sm tracking-widest title-font mb-1">
                                From {food.Restaurant.RestaurantName}
                              </h3>
                              <h2 className="text-gray-900 title-font text-lg font-medium">
                                {food.FoodName}
                              </h2>
                              <p className="mt-1">₹{food.FoodPrice}</p>
                            </div>
                          </div>
                          <Space wrap>
                            <div className="flex flex-col gap-4 mt-[1.7rems] px-2 py-5">
                              <Button
                                type="text"
                                className="text-white text-sm  bg-green-600 hover:bg-green-700"
                                onClick={(e: any) => {
                                  if (Food.length > 0) {
                                    if (
                                      Food[0].Restaurant._id ===
                                      food.Restaurant._id
                                    ) {
                                      addFoodTocart(food),
                                        toast.success(
                                          `${food.FoodName} Added To Cart`
                                        );
                                    } else {
                                      toast.error(
                                        "Cant add Food from multiple Restaurant"
                                      );
                                      toast.error(
                                        `Add Food only from ${Food[0].Restaurant.RestaurantName}`
                                      );
                                    }
                                  } else {
                                    addFoodTocart(food),
                                      toast.success(
                                        `${food.FoodName} Added To Cart`
                                      );
                                  }
                                }}
                              >
                                Add to cart
                              </Button>
                            </div>
                          </Space>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="lg:ml-6 md:ml-6 ml-5 flex justify-center font-bold text-2xl">
                      <h1>Food Not Found...!🙄 </h1>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </>

      <ToastContainer />
    </div>
  );
};

export default page;

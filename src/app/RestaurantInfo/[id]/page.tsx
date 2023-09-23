"use client";
import React from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Button, Space } from "antd";
import "react-toastify/dist/ReactToastify.css";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import useFoodStore from "@/GlobalState/State";
const page = ({ params }: any) => {
  const { Food, addFoodTocart, removeFoodFromCart } = useFoodStore();
  const [data, setdata] = React.useState([]);
  const [Restaurantdata, setRestaurantdata] = React.useState({
    RestaurantName: "",
    RestaurantType: "",
  });
  const [SerchFood, setSerchFood] = React.useState("");
  const [foodType, setfoodtype] = React.useState("");
  const [loading, setloading] = React.useState(false);
  const getdata = async () => {
    try {
      setloading(true);
      const response = await axios.get(`/api/user/GetRestaurantFood`, {
        headers: {
          Restaurant: `${params.id}`,
          Foodtype: foodType,
          Search: SerchFood,
        },
      });
      if (!response.data.success) {
        toast.error(`${response.data.error}`);
      } else {
        setdata(response.data.food);
        setRestaurantdata({
          RestaurantName: response.data.Restaurant[0]?.RestaurantName,
          RestaurantType: response.data.Restaurant[0]?.RestaurantType,
        });
        //console.log(response.data.food[0]?.Restaurant.RestaurantName);
        //console.log(response.data.food[0]?.Restaurant.RestaurantType);
        //console.log(response.data.Restaurant[0]);
        //toast.success(`${response.data.message}`);
      }
    } catch (error: any) {
      console.log("Error while getting data", error);
      //toast.error(error.message);
    } finally {
      setloading(false);
    }
  };
  React.useEffect(() => {
    getdata();
  }, [foodType, SerchFood]);
  return (
    <div className="flex-1 flex bg-yellow-50">
      <div
        style={{
          display: "flex",
          minHeight: "400px",
        }}
      >
        <div className="bg-yellow-50 ">
          <Sidebar collapsed collapsedWidth="140px">
            <Menu className="bg-yellow-50">
              <MenuItem onClick={() => setfoodtype("MainCourse")}>
                Main Course
              </MenuItem>
              <MenuItem onClick={() => setfoodtype("starters")}>
                Starters
              </MenuItem>
              <MenuItem onClick={() => setfoodtype("desserts")}>
                Desserts
              </MenuItem>
              <MenuItem onClick={() => setfoodtype("Roti")}>Roti</MenuItem>
              <MenuItem onClick={() => setfoodtype("Rice")}>Rice</MenuItem>
            </Menu>
          </Sidebar>
        </div>
      </div>

      <>
        <section className="text-gray-600 body-font bg-yellow-50 flex-1 p-3">
          <h1 className="mb-[2rem] font-bold text-2xl text-yellow-900 md:text-3xl">
            Welcome to {Restaurantdata && Restaurantdata.RestaurantName}
            <p className="inline text-lg ml-2">
              ({Restaurantdata && Restaurantdata.RestaurantType} )
            </p>
          </h1>
          <div className="text-gray-600 mb-10 flex flex-col">
            <label
              htmlFor="manufacturer"
              className="text-sm font-medium ml-1 text-stone-600 "
            >
              Search for Food
            </label>
            <input
              className="border-2 mt-3 border-gray-300 bg-white h-10 px-5 pr-16 w-[13rem] rounded-lg text-sm focus:outline-none"
              type="search"
              name="search"
              placeholder="Search"
              onChange={(e) => setSerchFood(e.target.value)}
            />
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
                    <>
                      {data.map((food: any) => (
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
                                  {food.FoodType}
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
                      ))}
                    </>
                  ) : (
                    <div className="ml-10 font-bold text-2xl">
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

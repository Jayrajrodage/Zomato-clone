"use client";
import React from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
const HotelCards = () => {
  const [data, setdata] = React.useState([]);
  const [selectedHotelType, setselectedHotelType] = React.useState("All");

  const [cardloading, setcardloading] = React.useState(false);
  const [SerchRestaurant, setSerchRestaurant] = React.useState("");
  const getdata = async () => {
    try {
      setcardloading(true);
      const response = await axios.get(`/api/user/GetRestaurants`, {
        headers: {
          RestaurantType: `${selectedHotelType}`,
          Search: SerchRestaurant,
        },
      });
      if (!response.data.success) {
        toast.error(`${response.data.error}`);
      } else {
        setdata(response.data.Restaurant);
        console.log(response.data.Restaurant);
        //toast.success(`${response.data.message}`);
      }
    } catch (error: any) {
      console.log("Error while getting data", error);
      toast.error(error.message);
    } finally {
      setcardloading(false);
    }
  };
  React.useEffect(() => {
    getdata();
  }, [selectedHotelType, SerchRestaurant]);
  return (
    <div>
      <div className="flex flex-col mt-5 ">
        <div className="flex justify-start mt-7 lg:px-16 md:px-10 px-8">
          <h2 className="mb-4 font-bold text-4xl text-yellow-900">
            Best Restaurant
          </h2>
        </div>
        <section className="text-gray-600 body-font bg-yellow-50 flex-1 px-5 mt-2">
          <div className="flex flex-wrap  gap-5">
            {" "}
            <div className="w-[11rem] mb-5 ml-2 lg:ml-[2.5rem]">
              <label
                htmlFor="manufacturer"
                className="text-sm font-medium ml-1 text-stone-600"
              >
                Select Restaurant type
              </label>
              <select
                id="manufacturer"
                className="mt-2 block w-full rounded-md border border-gray-100 bg-gray-100 px-2 py-2 shadow-sm outline-none focus:border-yellow-500 focus:ring focus:yellow-blue-200 focus:ring-opacity-50"
                onChange={(e) => setselectedHotelType(e.target.value)} // Attach onChange event handler
                value={selectedHotelType}
              >
                <option value="All">All</option>
                <option value="Pure-veg">Pure-Veg</option>
                <option value="Non-veg">Non-Veg</option>
                <option value="Both">Both veg/Non-Veg</option>
              </select>
            </div>
            <div className="text-gray-600 mb-10 flex flex-col">
              <label
                htmlFor="manufacturer"
                className="text-sm font-medium ml-1 text-stone-600 "
              >
                Search for Restaurant
              </label>
              <input
                className="border-2 mt-3 border-gray-300 bg-white h-10 px-5 pr-16 w-[13rem] rounded-lg text-sm focus:outline-none"
                type="search"
                name="search"
                placeholder="Search"
                onChange={(e) => setSerchRestaurant(e.target.value)}
              />
            </div>
          </div>

          <div className="container  mx-auto">
            {cardloading ? (
              <>
                <div className="flex justify-center">
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
                <div className="flex flex-wrap -m-4 lg:pl-10 ">
                  {data.length > 0 ? (
                    <>
                      {data.map((Restaurant: any) => (
                        <div className="lg:w-1/4 md:w-1/2 p-4 w-full">
                          <a className="block relative h-48 rounded overflow-hidden">
                            <Link href={`RestaurantInfo/${Restaurant._id}`}>
                              <img
                                alt="image"
                                className="object-cover object-center w-full h-full block hover:scale-125 transition duration-500 cursor-pointer"
                                src={Restaurant.RestaurantImage}
                              />
                            </Link>
                          </a>
                          <div className="flex justify-between p-2">
                            <div>
                              <div className="mt-4">
                                <h3 className="text-gray-800 text-lg tracking-widest title-font mb-1">
                                  {Restaurant.RestaurantType == "Both"
                                    ? "Veg/Non-veg"
                                    : Restaurant.RestaurantType}
                                </h3>
                                <h2 className="text-gray-900 title-font text-lg font-medium">
                                  {Restaurant.RestaurantName}
                                </h2>
                              </div>
                            </div>
                            <Link href={`RestaurantInfo/${Restaurant._id}`}>
                              <div className="flex flex-col mt-2 p-2 gap-3">
                                <button className=" p-2 bg-gradient-to-b from-yellow-200 to-yellow-300 hover:to-red-300 active:from-yellow-400 focus:from-red-400">
                                  Menu
                                </button>
                                <p>⭐⭐⭐⭐⭐</p>
                              </div>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <div className="lg:ml-10 md:ml-6 ml-5 flex justify-center font-bold text-2xl">
                        <h1>Restaurant Not Found...!🙄 </h1>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
        <ToastContainer />
      </div>
    </div>
  );
};

export default HotelCards;

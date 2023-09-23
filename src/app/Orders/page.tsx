"use client";
import React from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Button, Space } from "antd";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const page = () => {
  const [data, setdata] = React.useState([]);

  const [loading, setloading] = React.useState(false);
  const { user } = useUser();

  const userEamil = user && user.emailAddresses[0].emailAddress;
  const getdata = async () => {
    try {
      setloading(true);
      const response = await axios.get(`/api/user/GetOrders`, {
        headers: {
          Email: userEamil,
        },
      });
      if (!response.data.success) {
        toast.error(`${response.data.error}`);
      } else {
        setdata(response.data.orders);
        console.log(response.data.orders);
      }
    } catch (error: any) {
      console.log("Error while getting food data", error);
      toast.error(error.message);
    } finally {
      setloading(false);
    }
  };
  const subtotal = () => {};
  function formatDate(timestamp: any) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const suffix =
      day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
        ? "rd"
        : "th";

    const formattedDate = `${day}${suffix} ${months[month]} ${year} at ${
      hours % 12
    }:${(minutes < 10 ? "0" : "") + minutes} ${hours >= 12 ? "PM" : "AM"}`;

    return formattedDate;
  }
  React.useEffect(() => {
    getdata();
  }, [userEamil]);
  return (
    <div className="bg-yellow-50">
      {/* component */}
      <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto bg">
        {data.length > 0 ? (
          <>
            {data
              .map((order: any) => (
                <>
                  <div className="flex justify-start item-start space-y-2 flex-col mt-12">
                    <h1 className="text-sm dark:text-white lg:text-lg font-semibold leading-7 lg:leading-9 text-gray-800">
                      Order #{order._id}
                    </h1>
                    <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">
                      {formatDate(order.CreatedAt)}
                    </p>
                  </div>
                  <div className="mt-10 flex flex-col border shadow-xl xl:flex-row justify-center items-stretch w-full ">
                    <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                      <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                        <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">
                          From {order.Restaurant.RestaurantName}
                        </p>

                        <p className="text-lg md:text-xl mt-5 dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">
                          {order.status === "Processing" ? (
                            <>Status : Processing🍵</>
                          ) : order.status === "Shipped" ? (
                            <>Status : Shipped 🚚</>
                          ) : order.status === "Delivered" ? (
                            <>Status : Delivered 📦</>
                          ) : (
                            <>Status : canceled❌</>
                          )}
                        </p>
                        {order.Food.map((food: any) => (
                          <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
                            <div className="pb-4 md:pb-8 w-full md:w-40">
                              <>
                                <img
                                  className="w-full hidden md:block"
                                  src={food.image}
                                  alt="Food"
                                />
                                <img
                                  className="w-full md:hidden"
                                  src={food.image}
                                  alt="Food"
                                />
                              </>
                            </div>

                            <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                              <div className="w-full flex flex-col justify-start items-start space-y-8">
                                <>
                                  <h3 className="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">
                                    {food.description}
                                  </h3>
                                  <div className="flex justify-start items-start flex-col space-y-2">
                                    <p className="text-sm dark:text-white leading-none text-gray-800">
                                      <span className="text-gray-900 ">
                                        Quantity:
                                      </span>{" "}
                                      <b>{food.quantity}</b>
                                    </p>
                                    <p className="text-sm dark:text-white leading-none text-gray-800">
                                      <span className="text-gray-900 ">
                                        Price:{" "}
                                      </span>{" "}
                                      <b> ₹{food.price.unit_amount / 100}</b>
                                    </p>
                                  </div>
                                </>
                              </div>
                              <div className="flex justify-between space-x-8 items-start w-full">
                                <p className="text-base dark:text-white xl:text-lg leading-6">
                                  <p className="text-base mb-2 dark:text-white xl:text-lg leading-6">
                                    Price
                                  </p>
                                  ₹{food.price.unit_amount / 100}
                                </p>
                                <p className="text-base dark:text-white xl:text-lg leading-6 text-gray-800">
                                  <p className="text-base mb-2 dark:text-white xl:text-lg leading-6">
                                    Quantity
                                  </p>
                                  {food.quantity}
                                </p>
                                <p className="text-base dark:text-white xl:text-lg font-semibold leading-6 text-gray-800">
                                  <p className="text-base mb-2 dark:text-white xl:text-lg leading-6">
                                    Total
                                  </p>
                                  ₹
                                  {(food.price.unit_amount / 100) *
                                    food.quantity}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-center   md:flex-row flex-col w-full  xl:w-[29rem] space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                      <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6 ">
                        <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                          Summary
                        </h3>
                        <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                          <div className="flex justify-between w-full">
                            <p className="text-base dark:text-white leading-4 text-gray-800">
                              Subtotal
                            </p>
                            <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                              ₹{order?.Total / 100}
                            </p>
                          </div>

                          <div className="flex justify-between items-center w-full">
                            <p className="text-base dark:text-white leading-4 text-gray-800">
                              Shipping
                            </p>
                            <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                              ₹0
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">
                            Total
                          </p>
                          <p className="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">
                            ₹{order?.Total / 100}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))
              .reverse()}
          </>
        ) : (
          <>
            <div className="flex justify-center flex-col items-center h-screen">
              <h1 className="text-yellow-900 font-bold text-3xl">
                No Recent orders
              </h1>
              <Link href="/">
                <div className="py-10 text-center">
                  <p
                    className="px-12 inline bg-gradient-to-b from-yellow-200 to-yellow-300 cursor-pointer hover:to-red-300 active:from-yellow-400 focus:from-red-400 focus:ring focus:outline-none
                font-semibold py-3"
                  >
                    GO BACK
                  </p>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default page;

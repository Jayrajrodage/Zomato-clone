"use client";
import React, { useEffect } from "react";
import useFoodStore from "@/GlobalState/State";
import Link from "next/link";

const page = () => {
  const { clearCart } = useFoodStore();
  useEffect(() => {
    useFoodStore.persist.rehydrate();
    clearCart();
  }, []);
  return (
    <div className="h-screen">
      {/* component */}
      <div className="bg-yellow-50 h-screen flex justify-center items-center ">
        <div className="bg-yellow-50 p-6  md:mx-auto">
          <svg
            viewBox="0 0 24 24"
            className="text-green-600 w-16 h-16 mx-auto my-6"
          >
            <path
              fill="currentColor"
              d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
            ></path>
          </svg>
          <div className="text-center">
            <h3 className="md:text-2xl text-base text-yellow-900 font-semibold text-center">
              Order Placed!
            </h3>
            <p className="text-gray-600 my-2">
              Thank you Your meal is delivered with <b>15 mins!</b>
            </p>
            <p> Have a great day!</p>

            <Link href="/Orders">
              <div className="py-10 text-center">
                <p
                  className="px-12 inline bg-gradient-to-b from-yellow-200 to-yellow-300 cursor-pointer hover:to-red-300 active:from-yellow-400 focus:from-red-400 focus:ring focus:outline-none
                font-semibold py-3"
                >
                  Order Details
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

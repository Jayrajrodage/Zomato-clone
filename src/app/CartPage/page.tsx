"use client";
import React, { useEffect } from "react";
import useFoodStore from "@/GlobalState/State";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { useUser, SignInButton } from "@clerk/nextjs";

const page = () => {
  const { Food, removeFoodFromCart, addFoodTocart } = useFoodStore();
  const [disable, setdisable] = React.useState(false);
  console.log(Food);
  useEffect(() => {
    useFoodStore.persist.rehydrate();
  }, []);

  // Calculate the grand total
  const grandTotal = Food.reduce((total: any, item: any) => {
    const itemTotal = item.FoodPrice * item.quantity;
    return total + itemTotal;
  }, 0);

  const { user } = useUser();
  const userEamil = user && user.emailAddresses[0].emailAddress;
  // stripe payment
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );
  const handleCheckout = async () => {
    setdisable(true);
    const stripe = await stripePromise;
    //const res = await axios.post("/api/user/Checkout", { Food, userEamil });
    const response = await fetch("/api/user/Checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: Food, email: userEamil }),
    });
    const checkoutSession = await response.json();
    console.log(checkoutSession);
    // Redirecting user/customer to Stripe Checkout
    const result: any = await stripe?.redirectToCheckout({
      sessionId: checkoutSession.session.id,
    });
    setdisable(false);
    console.log(result);
    if (result.error) {
      alert(result?.error.message);
    }
  };
  return (
    <div className="">
      <div className=" bg-yellow-50 pt-10">
        <h1 className="mb-10 text-center text-2xl text-yellow-900 font-bold">
          Cart Items
        </h1>
        <div className="mx-auto max-w-5xl  justify-center px-6 md:flex md:space-x-6 xl:px-0">
          <div className="rounded-lg md:w-2/3">
            {user ? (
              <>
                {" "}
                {Food.length > 0 ? (
                  Food.map((foodItem: any) => (
                    <div
                      key={foodItem._id}
                      className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start"
                    >
                      <img
                        src={foodItem.FoodImage}
                        alt="product-image"
                        className="w-full max-h-[7.5rem] object-cover rounded-lg"
                      />
                      <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                        <div className="mt-5 sm:mt-0">
                          <h2 className="text-lg font-bold text-gray-900">
                            {foodItem.FoodName}
                          </h2>
                          <p className="mt-1 text-sm text-gray-700">
                            from {foodItem.Restaurant.RestaurantName}(
                            {foodItem.Restaurant.RestaurantType === "Both"
                              ? "veg/Non-veg"
                              : foodItem.Restaurant.RestaurantType}
                            )
                          </p>
                        </div>
                        <div className="mt-4 flex justify-between im sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                          <div className="flex items-center border-gray-100">
                            <span
                              className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50"
                              onClick={() => removeFoodFromCart(foodItem._id)}
                            >
                              {" "}
                              -{" "}
                            </span>
                            <input
                              className="h-8 w-8 border bg-white text-center text-xs outline-none"
                              type="number"
                              value={foodItem.quantity}
                              min="1"
                            />
                            <span
                              className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50"
                              onClick={() => addFoodTocart(foodItem)}
                            >
                              {" "}
                              +{" "}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <p className="text-sm">{foodItem.FoodPrice} ₹</p>
                            <svg
                              onClick={() => {
                                removeFoodFromCart(foodItem._id),
                                  toast.success(
                                    `${foodItem.FoodName} Removed from Cart`
                                  );
                              }}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-yellow-900 text-2xl font-extrabold h-screen ">
                    No items in Cart 😞
                  </div>
                )}
              </>
            ) : (
              <div className="h-screen  flex  justify-center items-center bg-yellow-50">
                <div className="p-3 rounded-xl text-center bg-gradient-to-b from-yellow-200 to-yellow-300 cursor-pointer hover:to-red-300 active:from-yellow-400 focus:from-red-400 focus:ring focus:outline-none">
                  <SignInButton
                    afterSignInUrl="/CartPage"
                    afterSignUpUrl="/CartPage"
                  />
                </div>
              </div>
            )}
          </div>
          {user ? (
            <>
              {" "}
              {Food.length > 0 && (
                <>
                  {/* <!-- Sub total --> */}
                  <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
                    <div className="mb-2 flex justify-between">
                      <p className="text-gray-700">Subtotal</p>
                      <p className="text-gray-700">₹{grandTotal}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-700">Shipping</p>
                      <p className="text-gray-700">₹0</p>
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between">
                      <p className="text-lg font-bold">Total</p>
                      <div className="">
                        <p className="mb-1 text-lg font-bold">
                          ₹{grandTotal} INR
                        </p>
                        <p className="text-sm text-gray-700">including GST</p>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={disable}
                      className="mt-6 w-full rounded-md py-1.5 font-medium bg-gradient-to-b from-yellow-200 to-yellow-300 hover:to-red-300 active:from-yellow-400 focus:from-red-400 cursor-pointer"
                    >
                      {disable ? "Redirecting" : "Check out"}
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default page;

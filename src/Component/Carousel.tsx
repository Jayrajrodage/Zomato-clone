"use client";
import React from "react";
import { Foodtype } from "./Constant/Foodtype";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Link from "next/link";
const carousel = () => {
  return (
    <div className="mt-[7rem]">
      <div className="flex justify-start lg:px-16 md:px-10 px-8">
        <h2 className="mb-4 font-bold text-4xl text-yellow-900">
          Best Food Items
        </h2>
      </div>
      <div className="flex justify-center items-center px-16 mt-5 cursor-pointer">
        <Swiper spaceBetween={15} slidesPerView={4}>
          {Foodtype.map((food, index) => (
            <SwiperSlide key={index} className="flex flex-col items-center">
              <Link href={`/Food/${food.search}`}>
                <img
                  src={food.img}
                  alt={food.name}
                  className="max-w-[200px] mb-2"
                />
              </Link>
              <p className="font-bold text-lg ml-[4.25rem]">{food.name}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default carousel;

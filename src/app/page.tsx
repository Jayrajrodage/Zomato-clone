import Image from "next/image";
import { Foodtype } from "@/Component/Constant/Foodtype";
import Hero from "@/Component/Hero";
import Carousel from "@/Component/Carousel";
import HotelCards from "@/Component/HotelCards";
import CartPage from "@/app/CartPage/page";

export default function Home() {
  return (
    <div className=" bg-yellow-50">
      <Hero />
      <Carousel />
      <HotelCards />
    </div>
  );
}

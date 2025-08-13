"use client";
import BodyPause from "./BodyPause";
import HomeBody from "./HomeBody";
import HomeProducts from "./HomeProducts";
import SaledProducts from "./SaledProducts";

export default function HomePage() {
  return (
    <div>
      <HomeBody />
      <HomeProducts />
      <SaledProducts />
      <BodyPause />
    </div>
  );
}

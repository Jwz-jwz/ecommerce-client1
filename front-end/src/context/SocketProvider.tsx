// context/SocketProvider.tsx
"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useProductContext } from "@/context/ProductContext";
import { useUserContext } from "./UserContext";

export default function SocketProvider() {
  const { fetchHomePageProducts, refreshProducts, fetchSaledProducts } =
    useProductContext();
  const { refreshOrders } = useUserContext();

  useEffect(() => {
    socket.on("connect", () => {
      //   console.log("🟢 Connected to WebSocket server");
    });

    socket.on("productCreated", (newProduct) => {
      fetchHomePageProducts();
      refreshProducts();
      fetchSaledProducts();
    });
    socket.on("productDeleted", (remainProducts) => {
      fetchHomePageProducts();
      refreshProducts();
      fetchSaledProducts();
    });
    socket.on("updatedProduct", (updatedProduct) => {
      fetchHomePageProducts();
      refreshProducts();
      fetchSaledProducts();
    });
    socket.on("orderCreated", (createdOrder) => {
      refreshProducts();
    });
    socket.on("updatedOrder", (updatedOrder) => {
      refreshOrders();
    });

    return () => {
      socket.off("productCreated");
      socket.off("productDeleted");
      socket.off("updatedProduct");
      socket.off("updatedOrder");
    };
  }, [fetchHomePageProducts, refreshProducts, fetchSaledProducts]);

  return null;
}

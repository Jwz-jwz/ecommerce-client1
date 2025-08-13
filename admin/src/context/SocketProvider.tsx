// context/SocketProvider.tsx
"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useProductContext } from "./ProductContext";
import { useOrderContext } from "./OrderContext";

export default function SocketProvider() {
  const { fetchProducts } = useProductContext();
  const { fetchOrders } = useOrderContext();

  useEffect(() => {
    socket.on("connect", () => {
      //   console.log("🟢 Connected to WebSocket server");
    });

    socket.on("productCreated", (newProduct) => {
      //   console.log("🆕 New product created:", newProduct);
      fetchProducts();
    });
    socket.on("productDeleted", (remainProducts) => {
      //   console.log("🆕 New product created:", newProduct);
      fetchProducts();
    });
    socket.on("updatedProduct", (updatedProduct) => {
      //   console.log("🆕 New product created:", newProduct);
      fetchProducts();
    });
    socket.on("orderCreated", (createdOrder) => {
      //   console.log("🆕 New product created:", newProduct);
      fetchProducts();
      fetchOrders();
    });

    return () => {
      socket.off("productCreated");
      socket.off("productDeleted");
      socket.off("updatedProduct");
      socket.off("orderCreated");
    };
  }, [fetchProducts]);

  return null;
}

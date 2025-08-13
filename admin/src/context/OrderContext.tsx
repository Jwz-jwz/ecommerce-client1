"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";

// Define a type that mimics mongoose's ObjectId
type ObjectId = string;

export interface CartItem {
  productId: ObjectId;
  selectedSize?: string;
  quantity?: number;
  _id?: ObjectId;
  price: number;
  sale?: number;
}

export interface TOrder {
  _id: ObjectId;
  userId: string;
  name: string;
  phoneNumber: string;
  email: string;
  delivery: string;
  info?: string;
  totalPrice?: string;
  cartItemToBackend: CartItem[];
  createdAt: Date;
  process: string;
}

interface OrderContextType {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  handleProcessChange: (orderId: string, newProcess: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

export const OrderContext = createContext<OrderContextType | undefined>(
  undefined
);

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider = ({ children }: OrderProviderProps) => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8368";

  const fetchOrders = async (page = 1, limit = 12) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_URL}/api/orders?page=${page}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const dataOrders = await response.json();

      if (dataOrders?.data) {
        setOrders(dataOrders.data.orders);
        setTotalPages(dataOrders.data.totalPages || 1);
        setPage(dataOrders.data.currentPage);
      } else {
        console.warn("No data property in API response:", dataOrders);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page, 10);
  }, [page]); // Empty dependency array to ensure it only runs once on mount

  const handleProcessChange = async (
    orderId: string | undefined,
    newProcess: string
  ) => {
    try {
      // console.log("Updating order:", orderId, "to process:", newProcess); // Debug log

      const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          process: newProcess,
        }),
      });

      // console.log("Response status:", response.status); // Debug log

      const data = await response.json();
      // console.log("Response data:", data); // Debug log

      if (data.success) {
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, process: newProcess } : order
          )
        );
        // alert("Захиалгын процесс амжилттай солигдлоо");
        toast.success("Захиалгын процесс амжилттай солигдлоо");
      } else {
        throw new Error(data.error || "Failed to update status");
      }
    } catch (error) {
      // console.error("Failed to update order process:", error);
      alert("Захиалгын процесс солиход алдаа гарлаа");
    }
  };
  const deleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || `HTTP error! Status: ${response.status}`;
        alert(errorMessage);
        throw new Error(errorMessage);
      }

      await fetchOrders(); // ✅ Re-fetch fresh, populated orders
      toast.success("Захиалга амжилттай устгагдлаа");
      // alert("Захиалга амжилттай устгагдлаа");
    } catch (error) {
      console.log(error);
    }
  };

  const contextValue: OrderContextType = {
    orders,
    loading,
    error,
    fetchOrders, // Exposing fetchOrders allows manual refreshing
    handleProcessChange,
    deleteOrder,
    refreshOrders: fetchOrders,
    page,
    setPage,
    totalPages,
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrderContext must be used within a OrderProvider");
  }
  return context;
};

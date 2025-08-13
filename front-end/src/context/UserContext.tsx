"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Product } from "./ProductContext";

type ProductId =
  | {
      _id: string;
      name: string;
      price: number;
      images: { url: string }[];
      sale: number;
    }
  | string;

type CartItem = {
  productId: ProductId;
  selectedSize?: string;
  quantity?: number;
  _id?: string;
  price: number;
  sale?: number;
};

type TUserOrder = {
  _id?: string;
  userId: string;
  name: string;
  phoneNumber: string;
  email: string;
  delivery: string;
  info?: string;
  totalPrice?: string;
  cartItemToBackend: CartItem[];
  createdAt: Date;
  process?: string;
};

interface UserContextType {
  sendUserIdToBackend: () => Promise<void>;
  likedProductIds: Product[];
  toggleLike: (productId: string) => Promise<void>;
  fetchLiked: () => Promise<void>;
  userOrders: TUserOrder[];
  loading: {
    orders: boolean;
    likes: boolean;
    user: boolean;
  };
  error: {
    orders: string | null;
    likes: string | null;
    user: string | null;
  };
  refreshOrders: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [likedProductIds, setLikedProductIds] = useState<Product[]>([]);
  const [userOrders, setUserOrders] = useState<TUserOrder[]>([]);
  const [loading, setLoading] = useState({
    orders: false,
    likes: false,
    user: false,
  });
  const [error, setError] = useState<{
    orders: string | null;
    likes: string | null;
    user: string | null;
  }>({
    orders: null,
    likes: null,
    user: null,
  });

  const { isSignedIn, isLoaded } = useUser();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
  const { user } = useUser();
  const { getToken } = useAuth();

  const sendUserIdToBackend = async () => {
    if (!user) return;

    setLoading((prev) => ({ ...prev, user: true }));
    setError((prev) => ({ ...prev, user: null }));

    try {
      const token = await getToken();
      await axios.post(
        `${API_URL}/api/user/`,
        {}, // No need to send userId explicitly – Clerk auth handles it
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error: unknown) {
      console.error("Error sending userId to backend:", error);
      setError((prev) => ({ ...prev, user: "Failed to register user" }));
    } finally {
      setLoading((prev) => ({ ...prev, user: false }));
    }
  };

  const fetchLiked = useCallback(async () => {
    if (!isSignedIn) return;

    setLoading((prev) => ({ ...prev, likes: true }));
    setError((prev) => ({ ...prev, likes: null }));

    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/user/likes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch liked products");
      }

      const data = await res.json();

      const likedArray = Array.isArray(data)
        ? data
        : Array.isArray(data.likes)
        ? data.likes
        : [];

      // const likedIds = likedArray.map(
      //   (product: { _id: string }) => product._id
      // );
      setLikedProductIds(likedArray);
    } catch (error: unknown) {
      console.error("Failed to fetch liked products:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch liked products";
      setError((prev) => ({
        ...prev,
        likes: errorMessage,
      }));
    } finally {
      setLoading((prev) => ({ ...prev, likes: false }));
    }
  }, [isSignedIn, getToken, API_URL]);

  const toggleLike = async (productId: string) => {
    if (!isSignedIn) {
      toast.info("Та сайтад нэвтэрсэн байх шаардлагатай.");
      return;
    }

    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/user/likes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        throw new Error("Failed to toggle like");
      }

      await fetchLiked();
    } catch (error: unknown) {
      console.error("Failed to toggle like:", error);
      // Optimistic update - revert on failure
      setLikedProductIds((prev) => {
        const isCurrentlyLiked = prev.some(
          (product) => product._id === productId
        );
        if (isCurrentlyLiked) {
          // Remove the product
          return prev.filter((product) => product._id !== productId);
        } else {
          // This is tricky - we don't have the full Product object here
          // You might need to fetch it or pass it from the component
          console.warn("Cannot add product to likes without full product data");
          return prev;
        }
      });
    }
  };
  const fetchOrders = useCallback(async () => {
    if (!isSignedIn) return;

    setLoading((prev) => ({ ...prev, orders: true }));
    setError((prev) => ({ ...prev, orders: null }));

    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/userorders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // Add cache control to prevent unnecessary refetching
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();
      if (data?.data) {
        setUserOrders(data.data);
      }
    } catch (error: unknown) {
      console.error("Failed to fetch orders:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch orders";
      setError((prev) => ({
        ...prev,
        orders: errorMessage,
      }));
    } finally {
      setLoading((prev) => ({ ...prev, orders: false }));
    }
  }, [isSignedIn, getToken, API_URL]);

  // Initialize data when user signs in
  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // Execute these in sequence to avoid overwhelming the API
        const initializeUserData = async () => {
          await sendUserIdToBackend();
          await fetchLiked();
          await fetchOrders();
        };

        initializeUserData();
      } else {
        // Clear data when signed out
        setLikedProductIds([]);
        setUserOrders([]);
      }
    }
  }, [isSignedIn, isLoaded]);

  const contextValue: UserContextType = {
    sendUserIdToBackend,
    likedProductIds,
    toggleLike,
    fetchLiked,
    userOrders,
    loading,
    error,
    refreshOrders: fetchOrders,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

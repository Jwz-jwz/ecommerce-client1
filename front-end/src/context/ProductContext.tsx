"use client";
import { useUser } from "@clerk/nextjs";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import type { UserResource } from "@clerk/types";

interface Timage {
  _id: string;
  url: string;
}

interface Tsize {
  stock?: number;
  _id: string;
  size: string;
}

// Define the Product interface
export interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  sale?: number;
  images?: Timage[];
  sizes?: Tsize[];
  stock?: number;
  categoryId: string;
  subCategoryId?: string;
}

// Define cart item with quantity
interface CartItem extends Product {
  stock?: number;
  quantity: number;
  selectedSize: Tsize | null;
}
// Define the context interface
interface ProductContextType {
  user: UserResource | null | undefined;

  loading: boolean;
  error: string | null;
  products: Product[];
  saledProducts: Product[];
  homeProducts: Product[];
  cartItems: CartItem[];
  addToCart: (
    product: Product,
    quantity: number,
    selectedSize: Tsize | null
  ) => void;
  removeFromCart: (_id: string, selectedSize: Tsize | null) => void;
  updateCartItemQuantity: (
    _id: string,
    quantity: number,
    selectedSize: Tsize | null
  ) => void;
  clearCart: () => void;
  increaseQuantity: () => void;
  decreaseQuantity: () => void;
  quantity: number;
  refreshProducts: () => void;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  selectedSubCategory: string;
  setSelectedSubCategory: (subCatId: string) => void;
  setQuantity: (quantity: number) => void;
  fetchHomePageProducts: () => Promise<void>;
  fetchSaledProducts: () => Promise<void>;
}

// Create context with proper typing
export const ProductContext = createContext<ProductContextType | undefined>(
  undefined
);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [saledProducts, setSaledProducts] = useState<Product[]>([]);
  const [homeProducts, setHomeProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const { user, isSignedIn } = useUser();

  const fetchProducts = async (
    page = 1,
    limit = 12,
    selectedCategory = "all",
    selectedSubCategory = ""
  ) => {
    try {
      setLoading(true);
      setError(null);
      let url = `${API_URL}/api/products?page=${page}&limit=${limit}`;

      if (
        selectedCategory &&
        selectedCategory !== "all" &&
        selectedCategory !== "sale"
      ) {
        url += `&categoryId=${selectedCategory}`;
      }

      if (selectedSubCategory) {
        url += `&subCategoryId=${selectedSubCategory}`;
      }

      if (selectedCategory === "sale") {
        url += `&categoryId=sale`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const dataProducts = await response.json();
      if (dataProducts?.data) {
        setProducts(dataProducts.data.products);
        setTotalPages(dataProducts.data.totalPages || 1);
        setPage(dataProducts.data.currentPage);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("error fetching products:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, 10, selectedCategory, selectedSubCategory);
  }, [page, selectedCategory, selectedSubCategory]);

  const fetchHomePageProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/products/homepage`);
      if (!response.ok) {
        let errorData = null;
        try {
          errorData = await response.json();
        } catch (err) {
          // if parsing fails, we fall back to status code message
        }
        const errorMessage =
          errorData?.message || `HTTP error! Status: ${response.status}`;
        toast.error(errorMessage);
        // Optionally: return early to skip parsing below
        return;
      }
      const dataProducts = await response.json();
      if (dataProducts?.data) {
        setHomeProducts(dataProducts.data);
      } else {
        console.warn("No data property in API response:", dataProducts);
        setHomeProducts([]);
      }
    } catch (error) {
      console.error("error fetching products:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
      toast.error("Бүтээгдэхүүн авахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const fetchSaledProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/products/saled`);
      if (!response.ok) {
        let errorData = null;
        try {
          errorData = await response.json();
        } catch (err) {
          // if parsing fails, we fall back to status code message
        }
        const errorMessage =
          errorData?.message || `HTTP error! Status: ${response.status}`;
        toast.error(errorMessage);
        // Optionally: return early to skip parsing below
        return;
      }
      const dataProducts = await response.json();
      if (dataProducts?.data) {
        setSaledProducts(dataProducts.data);
      } else {
        console.warn("No data property in API response:", dataProducts);
        setSaledProducts([]);
      }
    } catch (error) {
      console.error("error fetching products:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
      toast.error("Бүтээгдэхүүн авахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomePageProducts();
    fetchSaledProducts();
  }, []);

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (e) {
        console.error("Error parsing cart from localStorage:", e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = (
    product: Product,
    quantity: number,
    selectedSize: Tsize | null
  ) => {
    if (!product) {
      toast.error("Бүтээгдэхүүн олсонгүй. Дахин шалгана уу");
      return;
    }

    const stock = selectedSize?.stock ?? product.stock ?? 0;

    // ❗ Check if the product already exists in the cart
    const existingItem = cartItems.find(
      (item) =>
        item._id === product._id &&
        ((!item.selectedSize && !selectedSize) ||
          item.selectedSize?._id === selectedSize?._id)
    );

    const existingQuantity = existingItem?.quantity || 0;

    if (existingQuantity + quantity > stock) {
      toast.warning("Таны захиалга нөөцөөс хэтэрлээ! ");
      return;
    }

    setCartItems((prevCartItems) => {
      const existingItemIndex = prevCartItems.findIndex(
        (item) =>
          item._id === product._id &&
          ((!item.selectedSize && !selectedSize) ||
            item.selectedSize?._id === selectedSize?._id)
      );

      let updatedCart: CartItem[];

      if (existingItemIndex !== -1) {
        updatedCart = [...prevCartItems];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity,
        };
      } else {
        updatedCart = [
          ...prevCartItems,
          {
            ...product,
            quantity,
            selectedSize,
          },
        ];
      }

      return updatedCart;
    });

    // toast.success("Сагсанд нэмэгдлээ!");
    setQuantity(1);
  };

  const removeFromCart = (_id: string, selectedSize: Tsize | null) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter(
        (item) =>
          item._id !== _id || item.selectedSize?.size !== selectedSize?.size
      )
    );
  };

  const updateCartItemQuantity = (
    _id: string,
    updateQuantity: number,
    selectedSize: Tsize | null
  ) => {
    setCartItems((prevCartItems) => {
      return prevCartItems.map((item) => {
        const isSameProduct = item._id === _id;
        const isSameSize =
          selectedSize && item.selectedSize?.size === selectedSize.size;

        // Product with size
        if (selectedSize && isSameProduct && isSameSize) {
          return { ...item, quantity: item.quantity + updateQuantity };
        }

        // Product without size
        if (!selectedSize && isSameProduct && !item.selectedSize) {
          return { ...item, quantity: item.quantity + updateQuantity };
        }

        return item;
      });
    });
  };

  const clearCart = () => {
    setCartItems([]);

    // toast.info("Cart cleared");
  };
  const refreshProducts = () => {
    fetchProducts(page, 12, selectedCategory, selectedSubCategory);
  };

  const contextValue: ProductContextType = {
    user,
    loading,
    error,
    products,
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    quantity,
    refreshProducts,
    page,
    setPage,
    totalPages,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    homeProducts,
    saledProducts,
    setQuantity,
    fetchHomePageProducts,
    fetchSaledProducts,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};

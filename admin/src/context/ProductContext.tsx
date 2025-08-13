"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";

interface Timage {
  _id: string;
  url: string;
}
interface Tsize {
  _id: string;
  size: string;
  stock: number;
}
// Define the Product interface
interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string | undefined;
  sale?: number | undefined;
  images?: Timage[];
  sizes?: Tsize[] | undefined;
  categoryId: string;
  subCategoryId?: string;
  stock?: number;

  // Add other product properties here
}
interface TeditProduct {
  _id: string;
  name: string;
  price: number;
  sale?: number;
  description?: string;
  categoryId: string;
  subCategoryId?: string;
  sizes?: Tsize[];
  images?: Timage[];
}

// Define the context interface
interface ProductContextType {
  loading: boolean;
  error: string | null;
  products: Product[];
  createProduct: (productData: any) => Promise<void>;
  handleDeleteProduct: (_id: string) => Promise<void>;
  updateProduct: (editFormData: TeditProduct) => Promise<void>;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  selectedSubCategory: string;
  setSelectedSubCategory: (subCatId: string) => void;
  fetchProducts: () => Promise<void>;
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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const createProduct = async (productData: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        toast.error("Бүтээгдэхүүн нэмэхэд алдаа гарлаа");
        // throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (response.ok) {
        setProducts((prevProducts) => [...prevProducts, data.data]);

        toast.success("Бүтээгдэхүүн амжилттай бүртгэгдлээ");
      }

      return data;
    } catch (error) {
      toast.error("Алдаа гарлаа");
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      // console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDeleteProduct = async (_id: string) => {
    try {
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id }),
      };
      const response = await fetch(`${API_URL}/api/products`, options);
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
        return;
      }

      const data = await response.json();
      if (response.ok) {
        setProducts(data?.data);
        toast.success("Бүтээгдэхүүн амжилттай устгагдлаа");
      }
    } catch (error) {
      toast.error("Бүтээгдэхүүн устгахад алдаа гарлаа!");
      console.error("Error deleting product:", error);
    }
  };

  const updateProduct = async (editFormData: TeditProduct): Promise<void> => {
    try {
      setLoading(true);
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ editFormData }),
      };

      const response = await fetch(`${API_URL}/api/products`, options);

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
        return;
      }

      const data = await response.json();
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === editFormData._id ? data.data : product
        )
      );
      toast.success("Бүтээгдэхүүн амжилттай шинэчлэгдлээ");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Бүтээгдэхүүн шинэчлэхэд алдаа гарлаа"
      );
    } finally {
      setLoading(false);
    }
  };

  const contextValue: ProductContextType = {
    loading,
    error,
    products,
    createProduct,
    handleDeleteProduct,
    updateProduct,
    page,
    setPage,
    totalPages,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    fetchProducts,
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

"use client";
import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";

export interface TSubCategory {
  _id: string;
  name: string;
}

export interface TCategory {
  _id: string;
  name: string;
  subCat: TSubCategory[];
}

// Define the shape of the context value
interface CategoryContextType {
  categories: TCategory[];
  loading: boolean;
  error: string | null;
  refetchCategories: () => Promise<void>;
}

// Create context with correct typing
export const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider = ({ children }: CategoryProviderProps) => {
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8368";

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/categories`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const dataCategories = await response.json();
      //   console.log("API Response:", dataCategories);

      if (dataCategories?.data) {
        setCategories(dataCategories.data);
      } else {
        console.warn("No data property in API response:", dataCategories);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Log categories whenever they change
  useEffect(() => {
    // console.log("Categories updated:", categories);
  }, [categories]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const contextValue: CategoryContextType = {
    categories,
    loading,
    error,
    refetchCategories: fetchCategories,
  };

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error(
      "useCategoryContext must be used within a CategoryProvider"
    );
  }
  return context;
};

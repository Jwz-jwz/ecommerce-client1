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
  deleteCategory: (_id: string) => Promise<void>;
  deleteSubCategory: (_id: string, subId: string) => Promise<void>;
  addNewSubCat: (addNewSubCat: string, _id: string) => Promise<void>;
  newSubcategoryName: string;
  setNewSubcategoryName: React.Dispatch<React.SetStateAction<string>>;
  updateCategory: (_id: string, updateData: { name: string }) => Promise<void>;
  updateSubCategory: (
    _id: string,
    subId: string,
    updateData: { name: string }
  ) => Promise<void>;
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
  const [newSubcategoryName, setNewSubcategoryName] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8368";

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/categories`);

      if (!response.ok) {
        alert("Ангилал дуудаж авч ирэхэд алдаа гарлаа");
        // throw new Error(`API error: ${response.status}`);
      }

      const dataCategories = await response.json();
      //   console.log("API Response:", dataCategories);

      if (dataCategories?.data) {
        setCategories(dataCategories.data);
      } else {
        // console.warn("No data property in API response:", dataCategories);
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

  const deleteCategory = async (_id: string): Promise<void> => {
    try {
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id }),
      };

      const response = await fetch(`${API_URL}/api/categories`, options);
      console.log(response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || `HTTP error! Status: ${response.status}`;
        alert(errorMessage); // Show error message
        // throw new Error(errorMessage);
      }

      const data = await response.json();
      setCategories(data?.data);
    } catch (error) {
      console.log(error);
      alert(
        error instanceof Error
          ? error.message
          : "Ангилал устгахад алдаа гарлаа!"
      );
    }
  };

  const deleteSubCategory = async (
    _id: string,
    subId: string
  ): Promise<void> => {
    try {
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id, subId }),
      };

      const response = await fetch(`${API_URL}/api/categories/subCat`, options);
      console.log(response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || `HTTP error! Status: ${response.status}`;
        alert(errorMessage); // Show error message
        // throw new Error(errorMessage);
      }

      const data = await response.json();
      setCategories(data?.data);
    } catch (error) {
      console.log(error);
      alert(
        error instanceof Error
          ? error.message
          : "Дэд ангилал устгахад алдаа гарлаа!"
      );
    }
  };

  const addNewSubCat = async (subName: string, _id: string): Promise<void> => {
    try {
      // Check if subName is empty
      if (!subName || subName.trim() === "") {
        alert("Дэд ангилалын нэр хоосон байж болохгүй!");
        return;
      }

      setLoading(true);

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subName, _id }),
      };

      const response = await fetch(`${API_URL}/api/categories/subCat`, options);
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || `HTTP error! Status: ${response.status}`;
        alert(errorMessage); // Show error message
        // throw new Error(errorMessage);
      }

      const data = await response.json();
      setCategories(data?.data);
      setNewSubcategoryName(""); // Clear the input field
    } catch (error) {
      console.error("Error adding subcategory:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Дэд ангилал үүсгэхэд алдаа гарлаа!"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (
    _id: string,
    updateData: { name: string }
  ): Promise<void> => {
    try {
      if (!updateData.name || updateData.name.trim() === "") {
        alert(" Ангилалын нэр хоосон байж болохгүй!");
        return;
      }

      setLoading(true);

      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id, name: updateData.name }),
      };

      const response = await fetch(`${API_URL}/api/categories/update`, options);
      // console.log("Update category response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || `HTTP error! Status: ${response.status}`;
        alert(errorMessage); // Show error message
        // throw new Error(errorMessage);
      }

      const data = await response.json();
      setCategories(data?.data);
    } catch (error) {
      console.error("Error updating category:", error);
      alert(error instanceof Error ? error.message : "Error updating category");
    } finally {
      setLoading(false);
    }
  };

  // Add update subcategory function
  const updateSubCategory = async (
    _id: string,
    subId: string,
    updateData: { name: string }
  ): Promise<void> => {
    try {
      setLoading(true);

      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id, subId, name: updateData.name }),
      };

      const response = await fetch(
        `${API_URL}/api/categories/updatesub`,
        options
      );
      // console.log("Update subcategory response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || `HTTP error! Status: ${response.status}`;
        alert(errorMessage); // Show error message
        // throw new Error(errorMessage);
      }

      const data = await response.json();
      setCategories(data?.data);
    } catch (error) {
      console.error("Error updating subcategory:", error);
    } finally {
      setLoading(false);
    }
  };

  const contextValue: CategoryContextType = {
    categories,
    loading,
    error,
    refetchCategories: fetchCategories,
    deleteCategory,
    deleteSubCategory,
    addNewSubCat,
    newSubcategoryName,
    setNewSubcategoryName,
    updateCategory,
    updateSubCategory,
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

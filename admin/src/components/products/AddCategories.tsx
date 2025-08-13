"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Save,
  Edit,
  Trash2,
} from "lucide-react";
import { useCategoryContext } from "@/context/CategoryContext";

// Type definitions
type Category = {
  id: string;
  name: string;
  subcategories: Subcategory[];
};

type Subcategory = {
  id: string;
  name: string;
};

// API response types
type ApiResponse = {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
};

const CategoryManagement = () => {
  // Use the correct API URL from environment variables, with port 8368
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8368";
  const { refetchCategories } = useCategoryContext();

  // State management
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [savingCategoryId, setSavingCategoryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Add new category
  const handleAddCategory = () => {
    if (newCategory.trim() === "") return;

    const newCategoryObj: Category = {
      id: `cat-${Date.now()}`,
      name: newCategory,
      subcategories: [],
    };

    setCategories([...categories, newCategoryObj]);
    setNewCategory("");
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCategory();
    }
  };

  // Send category data to backend
  const handleCreateCategory = async (category: Category) => {
    try {
      setLoading(true);
      setSavingCategoryId(category.id);
      setError(null);

      // Format the data according to the backend's expected structure
      const requestData = {
        name: category.name,
        subCat: category.subcategories.map((subcat) => ({
          name: subcat.name,
        })),
      };

      // Send POST request to your backend API
      const response = await fetch(`${API_URL}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
      });

      // Check content type to avoid parsing non-JSON responses
      const contentType = response.headers.get("content-type");
      let result: ApiResponse;

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        // Handle non-JSON response
        const textResponse = await response.text();
        console.error("Received non-JSON response:", textResponse);
        throw new Error(
          "Server returned non-JSON response. Check server logs."
        );
      }

      if (!response.ok) {
        alert("Ангилал үүсгэхэд алдаа гарлаа");
        // throw new Error(result.message || "Failed to create category");
      }

      // Handle successful response
      // console.log("Category created successfully:", result.data);

      // Update the UI with the server-generated ID
      if (result.data && result.data._id) {
        // Update the category in the UI with the server-generated ID
        const updatedCategories = categories.map((cat) =>
          cat.id === category.id ? { ...cat, id: result.data._id } : cat
        );
        setCategories(updatedCategories);
      }
      // Remove the category from the UI after successful save
      setCategories(categories.filter((cat) => cat.id !== category.id));

      // Refresh categories
      refetchCategories();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while creating the category";
      setError(errorMessage);
      console.error("Error creating category:", err);
    } finally {
      setLoading(false);
      setSavingCategoryId(null);
    }
  };

  // Add new subcategory
  const handleAddSubcategory = (categoryId: string) => {
    if (newSubcategory.trim() === "") return;

    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          subcategories: [
            ...category.subcategories,
            { id: `subcat-${Date.now()}`, name: newSubcategory },
          ],
        };
      }
      return category;
    });

    setCategories(updatedCategories);
    setNewSubcategory("");
  };

  // Delete category
  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
  };

  // Delete subcategory
  const handleDeleteSubcategory = (
    categoryId: string,
    subcategoryId: string
  ) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          subcategories: category.subcategories.filter(
            (subcat) => subcat.id !== subcategoryId
          ),
        };
      }
      return category;
    });

    setCategories(updatedCategories);
  };

  // Toggle expansion of a category
  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prevExpanded) =>
      prevExpanded.includes(categoryId)
        ? prevExpanded.filter((id) => id !== categoryId)
        : [...prevExpanded, categoryId]
    );
  };

  // Toggle subcategory panel and select category
  const toggleSubcategoryPanel = (categoryId: string) => {
    setSelectedCategoryId(
      categoryId === selectedCategoryId ? null : categoryId
    );
    toggleCategoryExpansion(categoryId);
  };

  // Save category with subcategories to backend
  const handleSaveCategory = (categoryId: string) => {
    const categoryToSave = categories.find((cat) => cat.id === categoryId);
    if (categoryToSave) {
      handleCreateCategory(categoryToSave);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      <h2 className="text-lg font-medium mb-6 text-gray-800 border-b border-[var(--gray200)] pb-5">
        ✅ Шинэ ангилал үүсгэх
      </h2>

      {/* Add new category */}
      <div className="mb-6">
        <div className="flex items-center">
          <input
            type="text"
            onKeyPress={handleKeyPress}
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Ангилалын нэр оруулах"
            className="flex-grow p-2.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-r-md hover:bg-blue-700 transition-colors focus:outline-none flex items-center justify-center hover:cursor-pointer"
            disabled={loading}
          >
            <Plus size={18} className="mr-1" />
            <span>Нэмэх</span>
          </button>
        </div>
      </div>

      {/* Categories list */}
      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-md border border-dashed border-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mx-auto text-gray-400 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="text-gray-500">Одоогоор ангилал байхгүй байна</p>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="border border-[var(--gray200)] rounded-md overflow-hidden bg-white"
            >
              <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-[var(--gray200)]">
                <div className="font-medium">{category.name}</div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleSubcategoryPanel(category.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm border border-blue-600 px-3 py-1.5 rounded-md flex items-center transition-colors hover:bg-blue-50"
                  >
                    <Plus size={16} className="mr-1.5" />
                    <span>Дэд ангилал</span>
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-[var(--gray600)] hover:text-red-600 p-1.5 rounded transition-colors"
                    title="Delete category"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Expanded content */}
              {expandedCategories.includes(category.id) && (
                <div className="p-4 bg-white border-t border-gray-100">
                  {/* Subcategories */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Дэд ангилалууд
                    </h4>

                    {/* Subcategories list */}
                    <div className="space-y-2 mb-4">
                      {category.subcategories.length === 0 ? (
                        <p className="text-sm text-gray-400 italic py-2">
                          Дэд ангилал байхгүй байна
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 gap-2">
                          {category.subcategories.map((subcategory) => (
                            <div
                              key={subcategory.id}
                              className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded"
                            >
                              <span className="text-sm">
                                {subcategory.name}
                              </span>
                              <button
                                onClick={() =>
                                  handleDeleteSubcategory(
                                    category.id,
                                    subcategory.id
                                  )
                                }
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Add subcategory */}
                    <div className="flex">
                      <input
                        type="text"
                        value={newSubcategory}
                        onChange={(e) => setNewSubcategory(e.target.value)}
                        placeholder="Дэд ангилалын нэр"
                        className="flex-grow p-2 text-sm border rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddSubcategory(category.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAddSubcategory(category.id)}
                        className="bg-blue-600 text-white p-2 rounded-r hover:bg-blue-700 focus:outline-none"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Save button */}
                  {/* <div className="flex justify-end mt-4">
                    <button
                      onClick={() => handleSaveCategory(category.id)}
                      className={`flex items-center px-4 py-2 rounded font-medium transition-all ${
                        savingCategoryId === category.id
                          ? "bg-green-100 text-green-800 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                      disabled={loading || savingCategoryId === category.id}
                    >
                      {savingCategoryId === category.id ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Хадгалж байна...</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          <span>Хадгалах</span>
                        </>
                      )}
                    </button>
                  </div> */}
                </div>
              )}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleSaveCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded font-medium transition-all hover:cursor-pointer ${
                    savingCategoryId === category.id
                      ? "bg-green-100 text-green-800 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                  disabled={loading || savingCategoryId === category.id}
                >
                  {savingCategoryId === category.id ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Хадгалж байна...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      <span>Хадгалах</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;

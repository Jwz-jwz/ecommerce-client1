"use client";
import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Tag,
  RefreshCw,
  AlertCircle,
  Trash2,
  Edit2,
  SquarePlus,
  Plus,
  Check,
  X,
} from "lucide-react";
import {
  useCategoryContext,
  TCategory,
  TSubCategory,
} from "@/context/CategoryContext";

const CategoryDisplay = () => {
  const {
    categories,
    loading,
    error,
    refetchCategories,
    deleteCategory,
    deleteSubCategory,
    addNewSubCat,
    newSubcategoryName,
    setNewSubcategoryName,
    updateCategory,
    updateSubCategory,
  } = useCategoryContext();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Add these state variables for edit functionality
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editingSubCategoryId, setEditingSubCategoryId] = useState<
    string | null
  >(null);
  const [editingParentCategoryId, setEditingParentCategoryId] = useState<
    string | null
  >(null);
  const [editValue, setEditValue] = useState<string>("");

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );

    // Reset the subcategory input when collapsing a category
    if (expandedCategories.includes(categoryId)) {
      setNewSubcategoryName("");
    }
  };

  // Handle manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchCategories();
    setTimeout(() => setRefreshing(false), 500); // Visual feedback
  };

  // Start editing a category
  const startEditingCategory = (
    category: TCategory,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // Prevent category expansion toggle
    setEditingCategoryId(category._id);
    setEditValue(category.name);
  };

  // Start editing a subcategory
  const startEditingSubCategory = (
    categoryId: string,
    subCategory: TSubCategory,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setEditingParentCategoryId(categoryId);
    setEditingSubCategoryId(subCategory._id);
    setEditValue(subCategory.name);
  };

  // Save category edit
  const saveEditCategory = async (categoryId: string) => {
    if (editValue.trim()) {
      await updateCategory(categoryId, { name: editValue });
      cancelEdit();
    }
  };

  // Save subcategory edit
  const saveEditSubCategory = async (
    categoryId: string,
    subCategoryId: string
  ) => {
    if (editValue.trim()) {
      await updateSubCategory(categoryId, subCategoryId, { name: editValue });
      cancelEdit();
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingCategoryId(null);
    setEditingSubCategoryId(null);
    setEditingParentCategoryId(null);
    setEditValue("");
  };

  // Loading state
  if (loading && !refreshing) {
    return (
      <div className="bg-white shadow rounded-xl h-full flex justify-center items-center p-8">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[var(--gray600)]">
            Ангилалуудыг ачааллаж байна...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white shadow rounded-xl h-full p-6">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 flex flex-col items-center">
          <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
          <h3 className="font-medium mb-2">Ангилал ачааллахад алдаа гарлаа</h3>
          <p className="text-sm text-center">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md flex items-center transition-colors"
          >
            <RefreshCw size={16} className="mr-2" />
            Дахин ачааллах
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-xl h-full">
      <div className="p-5 border-b border-[var(--gray200)] flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">❇️ Ангилалууд</h2>

        <button
          onClick={handleRefresh}
          className={`text-gray-500 hover:text-blue-600 p-1.5 rounded-md hover:bg-blue-50 transition-colors hover:cursor-pointer ${
            refreshing ? "animate-spin text-blue-600" : ""
          }`}
          title="Дахин ачааллах"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {!categories || categories.length === 0 ? (
        <div className="p-6 flex flex-col items-center justify-center h-64">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Folder className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            Ангилал олдсонгүй
          </h3>
          <p className="text-gray-500 text-center max-w-xs">
            Та одоогоор ангилал үүсгээгүй байна. "Шинэ ангилал үүсгэх" товчыг
            ашиглан ангилал үүсгэнэ үү.
          </p>
        </div>
      ) : (
        <div className="p-4">
          <ul className="divide-y divide-gray-100">
            {categories.map((category) => (
              <li key={category._id} className="hover:bg-gray-50 rounded-md">
                <div className="p-3">
                  {/* Category header with expand/collapse */}
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => toggleCategory(category._id)}
                  >
                    <div className="text-blue-600 mr-3">
                      {expandedCategories.includes(category._id) ? (
                        <FolderOpen className="w-5 h-5" />
                      ) : (
                        <Folder className="w-5 h-5" />
                      )}
                    </div>

                    {editingCategoryId === category._id ? (
                      // Edit mode for categories
                      <div className="flex-grow flex items-center">
                        <input
                          type="text"
                          value={editValue}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              saveEditCategory(category._id);
                            }
                          }}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-grow p-1 border border-gray-300 rounded-md text-sm mr-2"
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            saveEditCategory(category._id);
                          }}
                          className="p-1 rounded-md bg-green-100 text-green-600 hover:bg-green-200 mr-1"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelEdit();
                          }}
                          className="p-1 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      // Display mode for categories
                      <>
                        <span className="font-medium text-gray-800 flex-grow">
                          {category.name}
                        </span>
                        <div className="flex items-center">
                          <button
                            onClick={(e) => startEditingCategory(category, e)}
                          >
                            <Edit2 className="w-3 h-3 text-gray-500 mr-2 hover:cursor-pointer" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCategory(category._id);
                            }}
                          >
                            <Trash2 className="w-3 h-3 text-gray-500 mr-2 hover:cursor-pointer" />
                          </button>
                        </div>
                      </>
                    )}

                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mr-2">
                        {category.subCat.length}
                      </span>

                      {expandedCategories.includes(category._id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Subcategories */}
                  {expandedCategories.includes(category._id) && (
                    <div className="mt-2 ml-8">
                      {category.subCat.length > 0 ? (
                        <ul className="space-y-1">
                          {category.subCat.map((subCategory) => (
                            <li
                              key={subCategory._id}
                              className="flex items-center justify-between p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              {editingSubCategoryId === subCategory._id &&
                              editingParentCategoryId === category._id ? (
                                // Edit mode for subcategories
                                <div className="flex items-center w-full">
                                  <Tag className="w-3 h-3 text-gray-500 mr-2" />
                                  <input
                                    type="text"
                                    value={editValue}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        saveEditSubCategory(
                                          category._id,
                                          subCategory._id
                                        );
                                      }
                                    }}
                                    onChange={(e) =>
                                      setEditValue(e.target.value)
                                    }
                                    className="flex-grow p-1 border border-gray-300 rounded-md text-sm mr-2"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() =>
                                      saveEditSubCategory(
                                        category._id,
                                        subCategory._id
                                      )
                                    }
                                    className="p-1 rounded-md bg-green-100 text-green-600 hover:bg-green-200 mr-1"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="p-1 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                // Display mode for subcategories
                                <>
                                  <div className="flex items-center">
                                    <Tag className="w-3 h-3 text-gray-500 mr-2" />
                                    <span className="text-sm text-gray-700">
                                      {subCategory.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <button
                                      onClick={(e) =>
                                        startEditingSubCategory(
                                          category._id,
                                          subCategory,
                                          e
                                        )
                                      }
                                    >
                                      <Edit2 className="w-3 h-3 text-gray-500 mr-2 hover:cursor-pointer" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        deleteSubCategory(
                                          category._id,
                                          subCategory._id
                                        )
                                      }
                                    >
                                      <Trash2 className="w-3 h-3 text-gray-500 mr-2 hover:cursor-pointer" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-gray-500 italic py-2">
                          Дэд ангилал байхгүй
                        </p>
                      )}

                      {/* Add new subcategory input - always show when category is expanded */}
                      <div className="mt-3">
                        <div className="flex items-center p-2 rounded-md bg-gray-50">
                          <div className="flex-1 mr-2">
                            <input
                              type="text"
                              value={newSubcategoryName}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  addNewSubCat(
                                    newSubcategoryName,
                                    category._id
                                  );
                                }
                              }}
                              onChange={(e) =>
                                setNewSubcategoryName(e.target.value)
                              }
                              className="w-full p-2 border border-gray-300 rounded-md text-sm"
                              placeholder="Дэд ангилал нэмэх"
                            />
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                addNewSubCat(newSubcategoryName, category._id)
                              }
                              className="p-1 rounded-md bg-green-100 text-green-600 hover:bg-green-200 mr-1"
                              title="Нэмэх"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategoryDisplay;

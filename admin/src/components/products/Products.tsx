"use client";
import { useCategoryContext } from "@/context/CategoryContext";
import { useProductContext } from "@/context/ProductContext";
import {
  Check,
  ChevronLeft,
  X,
  ChevronRight,
  Grid,
  List,
  Edit,
  Trash2,
  Package,
} from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "react-toastify";

// Define ProductProps type
type ProductProps = {
  _id: string;
  name: string;
  price: number;
  images?: Array<{
    _id: string;
    url: string;
  }>;
  description?: string;
  sale?: number;
  sizes?: Array<{ size: string; stock: number }>;
  categoryId: string;
  subCategoryId?: string;
  stock?: number;
};

// Define CategoryProps type
type CategoryProps = {
  _id: string;
  name: string;
  subCat: Array<{
    _id: string;
    name: string;
  }>;
};

interface UploadedImage {
  id: number;
  url: string;
  file?: File;
  uploaded?: boolean;
}

export default function AdminProduct() {
  const {
    products,
    handleDeleteProduct,
    updateProduct,
    loading,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    setPage,
    totalPages,
    page,
  } = useProductContext();
  const { categories } = useCategoryContext();

  // State for product editing
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductProps | null>(
    null
  );
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const [editFormData, setEditFormData] = useState({
    _id: "",
    name: "",
    price: 0,
    description: "",
    sale: 0,
    categoryId: "",
    subCategoryId: "",
    sizes: [] as Array<{ size: string; _id: string; stock: number }>,
    images: [] as Array<{ url: string; _id: string }>,
    stock: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Handler for category selection
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory("");
    setPage(1);
    if (categoryId !== "all" && categoryId !== "sale") {
      toggleCategory(categoryId);
    }
  };

  // Handler for subcategory selection
  const handleSubCategoryClick = (subCategoryId: string) => {
    setSelectedSubCategory(subCategoryId);
    setPage(1);
  };

  // Handler for edit product
  const handleEdit = (productId: string) => {
    const productToEdit = products.find(
      (p: ProductProps) => p?._id === productId
    );
    if (productToEdit) {
      setCurrentProduct(productToEdit);
      setEditFormData({
        _id: productId,
        name: productToEdit.name || "",
        price: productToEdit.price || 0,
        description: productToEdit.description || "",
        sale: productToEdit.sale || 0,
        categoryId: productToEdit.categoryId || "",
        subCategoryId: productToEdit.subCategoryId || "",
        sizes: productToEdit.sizes || [],
        images: productToEdit.images || [],
        stock: productToEdit.stock || 0,
      });
      setIsEditModalOpen(true);
    }
  };

  // Handler for form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "price" || name === "sale") {
      const numValue = value === "" ? 0 : parseFloat(value);
      setEditFormData({
        ...editFormData,
        [name]: numValue,
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value,
      });
    }
  };

  // Handler for form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentProduct) {
      const updatedProduct = {
        ...currentProduct,
        ...editFormData,
      };
      updateProduct(updatedProduct);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteImage = (_id: string) => {
    setEditFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img._id !== _id),
    }));
    if (currentProduct) {
      const updatedProduct = {
        ...currentProduct,
        images: currentProduct?.images?.filter((img) => img._id !== _id),
      };
      setCurrentProduct(updatedProduct);
    }
  };

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const tempId = Date.now();
    const file = files[0];
    const tempUrl = URL.createObjectURL(file);
    toast.warning(
      "Сонгогдсон зураг зөв бол заавал ногоон товчин дээр дарж баталгаажуулна уу!!!"
    );

    setUploadedImages((prev) => {
      const newImages = [
        ...prev,
        {
          id: tempId,
          url: tempUrl,
          file: file,
          uploaded: false,
        },
      ];
      return newImages;
    });

    e.target.value = "";
  };

  const uploadToCloudinary = async (imageId: number) => {
    const imageToUpload = uploadedImages.find((img) => img.id === imageId);
    if (!imageToUpload || !imageToUpload.file || imageToUpload.uploaded) return;

    setIsUploading(true);

    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!uploadPreset || !cloudName) {
      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? {
                ...img,
                uploading: false,
                error: "Missing Cloudinary configuration",
              }
            : img
        )
      );
      setIsUploading(false);
      return;
    }

    const data = new FormData();
    data.append("file", imageToUpload.file);
    data.append("upload_preset", uploadPreset || "");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const result = await response.json();
      const cloudinaryUrl = result?.secure_url;

      if (!cloudinaryUrl) {
        throw new Error("No URL received from Cloudinary");
      }

      setUploadedImages((prev) =>
        prev.map((img) => {
          if (img.id === imageId) {
            URL.revokeObjectURL(img.url);
            return {
              ...img,
              url: cloudinaryUrl,
              uploaded: true,
            };
          }
          return img;
        })
      );

      setEditFormData((prev) => ({
        ...prev,
        images: [
          ...prev?.images,
          {
            _id: result?.public_id || result?.asset_id || String(Date.now()),
            url: cloudinaryUrl,
          },
        ],
      }));

      if (currentProduct) {
        const updatedProduct = {
          ...currentProduct,
          images: [
            ...(currentProduct.images || []),
            {
              _id: result?.public_id || result?.asset_id || String(Date.now()),
              url: cloudinaryUrl,
            },
          ],
        };
        setCurrentProduct(updatedProduct);
      }

      const imageToUpload = uploadedImages.find((img) => img.id === imageId);
      if (imageToUpload && imageToUpload.url.startsWith("blob:")) {
        URL.revokeObjectURL(imageToUpload.url);
      }

      setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? {
                ...img,
                uploading: false,
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : img
        )
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (id: number) => {
    const imageToRemove = uploadedImages.find((img) => img.id === id);
    if (!imageToRemove) return;

    if (!imageToRemove.uploaded && imageToRemove.url.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Handler to close modal
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setCurrentProduct(null);
  };

  const categoryColors = [
    "bg-red-100 text-red-700",
    "bg-green-100 text-green-700",
    "bg-yellow-100 text-yellow-700",
    "bg-purple-100 text-purple-700",
    "bg-indigo-100 text-indigo-700",
    "bg-pink-100 text-pink-700",
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-2 sm:px-4 lg:px-6 py-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Category Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-800 pb-2 border-b flex items-center">
            <span className="mr-2">❇️</span>
            <span className="hidden sm:inline">Ангилалууд</span>
            <span className="sm:hidden">Categories</span>
          </h2>

          {/* Desktop/Tablet Category Display */}
          <div className="hidden sm:flex flex-wrap gap-2 lg:flex-nowrap lg:overflow-x-auto">
            {categories?.map((category: CategoryProps, index) => {
              const baseColor = categoryColors[index % categoryColors.length];
              return (
                <div key={category?._id} className="space-y-1 flex-shrink-0">
                  <div
                    className={`p-2.5 rounded-md cursor-pointer transition-all font-medium text-sm ${baseColor} ${
                      selectedCategory === category._id
                        ? "ring-2 ring-blue-400"
                        : ""
                    }`}
                    onClick={() => handleCategoryClick(category._id)}
                  >
                    {category.name}
                  </div>

                  {selectedCategory === category._id && category.subCat && (
                    <div className="mt-1 space-y-1 pl-3 border-l border-blue-400">
                      {category.subCat.map((subcat) => (
                        <div
                          key={subcat._id}
                          className={`p-2 text-xs rounded-md cursor-pointer transition-all ${
                            selectedSubCategory === subcat._id
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          }`}
                          onClick={() => handleSubCategoryClick(subcat._id)}
                        >
                          {subcat.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Category Display */}
          <div className="sm:hidden">
            <div className="grid grid-cols-2 gap-2">
              {categories?.slice(0, 4).map((category: CategoryProps, index) => {
                const baseColor = categoryColors[index % categoryColors.length];
                return (
                  <div
                    key={category?._id}
                    className={`p-3 rounded-md cursor-pointer transition-all font-medium text-sm text-center ${baseColor} ${
                      selectedCategory === category._id
                        ? "ring-2 ring-blue-400"
                        : ""
                    }`}
                    onClick={() => handleCategoryClick(category._id)}
                  >
                    {category.name}
                  </div>
                );
              })}
            </div>

            {/* Show more categories on mobile if needed */}
            {categories?.length > 4 && (
              <div className="mt-2 text-center">
                <button className="text-blue-600 text-sm font-medium">
                  + {categories.length - 4} бусад
                </button>
              </div>
            )}

            {/* Mobile Subcategories */}
            {selectedCategory &&
              categories?.find((c) => c._id === selectedCategory)?.subCat && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2">
                    {categories
                      .find((c) => c._id === selectedCategory)
                      ?.subCat.map((subcat) => (
                        <div
                          key={subcat._id}
                          className={`p-2 text-xs rounded-md cursor-pointer transition-all text-center ${
                            selectedSubCategory === subcat._id
                              ? "bg-blue-50 text-blue-600 font-medium ring-1 ring-blue-400"
                              : "bg-gray-50 text-gray-600"
                          }`}
                          onClick={() => handleSubCategoryClick(subcat._id)}
                        >
                          {subcat.name}
                        </div>
                      ))}
                  </div>
                </div>
              )}
          </div>

          {(selectedCategory || selectedSubCategory) && (
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedSubCategory("");
              }}
              className="mt-4 px-4 py-2 w-full text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <span className="hidden sm:inline">
                Бүх бүтээгдэхүүн харуулах
              </span>
              <span className="sm:hidden">Бүх бүтээгдэхүүн</span>
            </button>
          )}
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-96 bg-gray-50">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-sm sm:text-base text-gray-600">
                Ачааллаж байна
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="border-b border-gray-200 bg-gray-50 px-3 sm:px-6 py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                    <span className="mr-2">🛍️</span>
                    <span className="hidden sm:inline">
                      {selectedSubCategory
                        ? categories
                            ?.find((c) => c._id === selectedCategory)
                            ?.subCat?.find((s) => s._id === selectedSubCategory)
                            ?.name || ""
                        : selectedCategory && selectedCategory !== "all"
                        ? categories.find((c) => c._id === selectedCategory)
                            ?.name || ""
                        : "Бүх бүтээгдэхүүн"}
                    </span>
                    <span className="sm:hidden">Products</span>
                  </h2>

                  <div className="flex items-center gap-3">
                    <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
                      {products.length}{" "}
                      <span className="hidden sm:inline">products</span>
                    </span>

                    {/* View Toggle - Hidden on mobile for now */}
                    <div className="hidden lg:flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-1.5 rounded ${
                          viewMode === "list" ? "bg-white shadow-sm" : ""
                        }`}
                      >
                        <List size={16} />
                      </button>
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-1.5 rounded ${
                          viewMode === "grid" ? "bg-white shadow-sm" : ""
                        }`}
                      >
                        <Grid size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Display */}
              {products.length > 0 ? (
                <>
                  {/* Mobile Cards View */}
                  <div className="block sm:hidden divide-y divide-gray-200">
                    {products.map((product: ProductProps) => (
                      <div
                        key={product._id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex gap-3">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                              {product?.images && product.images.length > 0 ? (
                                <img
                                  src={product.images[0].url}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package
                                    size={20}
                                    className="text-gray-400"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-sm font-medium text-gray-900 truncate pr-2">
                                {product.name}
                              </h3>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleEdit(product?._id)}
                                  className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteProduct(product?._id)
                                  }
                                  className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-500">
                                  {categories.find(
                                    (c) => c._id === product.categoryId
                                  )?.name || "Unknown"}
                                </div>
                                {product?.sale ? (
                                  <div className="text-right">
                                    <div className="text-sm font-semibold text-gray-900">
                                      {Math.round(
                                        product.price -
                                          (product.price * product.sale) / 100
                                      ).toLocaleString()}
                                      ₮
                                    </div>
                                    <div className="text-xs text-gray-500 line-through">
                                      {product.price.toLocaleString()}₮
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-sm font-semibold text-gray-900">
                                    {product.price.toLocaleString()}₮
                                  </div>
                                )}
                              </div>

                              {product?.sale && product?.sale > 0 ? (
                                <div className="flex justify-end">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                    {product.sale}% OFF
                                  </span>
                                </div>
                              ) : (
                                ""
                              )}

                              <div className="text-xs text-gray-500">
                                {product?.sizes && product.sizes.length > 0 ? (
                                  <div className="flex flex-col  ">
                                    {product.sizes.map((s, index) => (
                                      <div
                                        key={product?._id + index}
                                        className="text-xs text-gray-500 "
                                      >
                                        <span>{s.size}</span>
                                        <span>- </span>
                                        <span>{s.stock}ш</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-500">
                                    {product.stock} ш
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tablet/Desktop Table View */}
                  <div className="hidden sm:block">
                    {/* Table header */}
                    <div className="grid grid-cols-12 lg:grid-cols-18 gap-4 px-4 sm:px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      <div className="col-span-3 lg:col-span-3">
                        Бүтээгдэхүүн
                      </div>
                      <div className="col-span-2 lg:col-span-2">Ангилал</div>
                      <div className="hidden lg:block lg:col-span-2">
                        Дэд ангилал
                      </div>
                      <div className="col-span-2 lg:col-span-3 text-center">
                        Зураг
                      </div>
                      <div className="col-span-2 lg:col-span-2 text-right">
                        Үнэ
                      </div>
                      <div className="col-span-1 lg:col-span-2 text-center">
                        Хямдрал
                      </div>
                      <div className="col-span-1 lg:col-span-2 text-center">
                        Нөөц
                      </div>
                      <div className="col-span-1 lg:col-span-2 text-center">
                        Үйлдэл
                      </div>
                    </div>

                    {/* Product rows */}
                    <div className="divide-y divide-gray-200">
                      {products.map((product: ProductProps) => (
                        <div
                          key={product._id}
                          className="grid grid-cols-12 lg:grid-cols-18 gap-4 px-4 sm:px-6 py-4 items-center hover:bg-gray-50 transition-colors"
                        >
                          <div className="col-span-3 lg:col-span-3">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </h3>
                          </div>
                          <div className="col-span-2 lg:col-span-2">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {categories.find(
                                (c) => c._id === product.categoryId
                              )?.name || "Unknown"}
                            </h3>
                          </div>

                          <div className="hidden lg:block lg:col-span-2">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {(() => {
                                const category = categories.find(
                                  (c) => c._id === product.categoryId
                                );
                                const subcategory = category?.subCat?.find(
                                  (sub) =>
                                    sub._id?.toString() ===
                                    product.subCategoryId?.toString()
                                );
                                return subcategory?.name || "Дэд ангилалгүй";
                              })()}
                            </h3>
                          </div>

                          <div className="col-span-2 lg:col-span-3 flex justify-center">
                            <div className="flex space-x-1 overflow-x-auto max-w-full">
                              {product?.images && product.images.length > 0 ? (
                                product.images
                                  .slice(0, 2)
                                  .map((image, index) => (
                                    <div
                                      key={index}
                                      className="h-12 w-12 lg:h-16 lg:w-16 flex-shrink-0 rounded overflow-hidden bg-gray-100 border border-gray-200"
                                    >
                                      <img
                                        src={image.url}
                                        alt={`${product.name} - image ${
                                          index + 1
                                        }`}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  ))
                              ) : (
                                <div className="h-12 w-12 lg:h-16 lg:w-16 flex items-center justify-center bg-gray-100 text-gray-400 text-xs rounded border border-gray-200">
                                  <Package size={16} />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-span-2 lg:col-span-2 text-right">
                            {product?.sale ? (
                              <div>
                                <span className="text-sm font-semibold text-gray-900">
                                  {Math.round(
                                    product.price -
                                      (product.price * product.sale) / 100
                                  ).toLocaleString()}
                                  ₮
                                </span>
                                <span className="block text-xs text-gray-500 line-through">
                                  {product.price.toLocaleString()}₮
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm font-semibold text-gray-900">
                                {product.price.toLocaleString()}₮
                              </span>
                            )}
                          </div>

                          <div className="col-span-1 lg:col-span-2 text-center">
                            {product?.sale ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {product.sale}%
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">-</span>
                            )}
                          </div>

                          <div className="col-span-1 lg:col-span-2 text-center">
                            {product?.sizes && product.sizes.length > 0 ? (
                              <div className="flex flex-col items-center ">
                                {product.sizes.map((s, index) => (
                                  <div
                                    key={product?._id + index}
                                    className="text-xs text-gray-500 "
                                  >
                                    <span>{s.size}</span>
                                    <span>- </span>
                                    <span>{s.stock}ш</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">
                                {product.stock} ш
                              </span>
                            )}
                          </div>

                          <div className="col-span-1 lg:col-span-2 flex justify-center">
                            <button
                              onClick={() => handleEdit(product?._id)}
                              className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-1.5 lg:px-3 lg:py-1.5 rounded text-xs font-medium transition-colors mr-0"
                            >
                              <Edit size={14} className="lg:hidden" />
                              <span className="hidden lg:inline">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product?._id)}
                              className="bg-red-50 text-red-600 hover:bg-red-100 p-1.5 lg:px-3 lg:py-1.5 rounded text-xs font-medium transition-colors mr-0"
                            >
                              <Trash2 size={14} className="lg:hidden" />
                              <span className="hidden lg:inline">Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 px-4">
                  <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-sm">
                    {selectedCategory
                      ? "Энэ ангилалд бүтээгдэхүүн байхгүй байна."
                      : "Бүтээгдэхүүн байхгүй байна."}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        {products.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 sm:gap-4 py-4">
            <button
              onClick={() => setPage(Math.max(page - 1, 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Mobile pagination - show only current page and total */}
            <div className="sm:hidden flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {page} / {totalPages}
              </span>
            </div>

            {/* Desktop pagination - show page numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 7) {
                  pageNumber = i + 1;
                } else if (page <= 4) {
                  pageNumber = i + 1;
                } else if (page >= totalPages - 3) {
                  pageNumber = totalPages - 6 + i;
                } else {
                  pageNumber = page - 3 + i;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`px-3 py-1 rounded-lg border transition-colors ${
                      page === pageNumber
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage(Math.min(page + 1, totalPages))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {isEditModalOpen && currentProduct && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-medium text-gray-900">
                Бүтээгдэхүүн засварлах
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500 p-2"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Left Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Product Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Бүтээгдэхүүний нэр
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={editFormData.name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        required
                      />
                    </div>

                    {/* Price and Sale in row on mobile */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-1 lg:gap-6">
                      <div>
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Үнэ (₮)
                        </label>
                        <input
                          type="number"
                          name="price"
                          id="price"
                          value={
                            editFormData.price === 0 ? "" : editFormData.price
                          }
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="sale"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Хямдрал (%)
                        </label>
                        <input
                          type="number"
                          name="sale"
                          id="sale"
                          value={
                            editFormData.sale === 0 ? "" : editFormData.sale
                          }
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-1 lg:gap-6">
                      <div>
                        <label
                          htmlFor="categoryId"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Ангилал
                        </label>
                        <select
                          id="categoryId"
                          name="categoryId"
                          value={editFormData.categoryId}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="">Ангилал сонгох</option>
                          {categories.map((category: CategoryProps) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="subCategoryId"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Дэд ангилал
                        </label>
                        <select
                          id="subCategoryId"
                          name="subCategoryId"
                          value={editFormData.subCategoryId}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="">Дэд ангилал сонгох</option>
                          {categories
                            .find(
                              (c: CategoryProps) =>
                                c._id === editFormData.categoryId
                            )
                            ?.subCat.map((subCategory) => (
                              <option
                                key={subCategory._id}
                                value={subCategory._id}
                              >
                                {subCategory?.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Description */}
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Товч мэдээлэл
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={editFormData.description}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>

                    {/* Product Images */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Зурагнууд
                      </label>

                      {/* Images Grid */}
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                        {currentProduct?.images?.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                              <img
                                src={image.url}
                                alt={`Product ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              onClick={() => handleDeleteImage(image?._id)}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}

                        {uploadedImages.map((image) => (
                          <div
                            key={image.id}
                            className="relative border rounded-lg overflow-hidden aspect-square"
                          >
                            <img
                              src={image.url}
                              alt="Product"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-1 right-1 flex gap-1">
                              {!image.uploaded && (
                                <button
                                  type="button"
                                  onClick={() => uploadToCloudinary(image?.id)}
                                  className="p-1 bg-green-500 rounded-full text-white hover:bg-green-600 shadow-sm"
                                  title="Upload to Cloudinary"
                                >
                                  <Check size={12} />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(image.id)}
                                className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600 shadow-sm"
                                title="Remove"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Image Button */}
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          multiple
                          accept="image/*"
                          onChange={handleImageSelection}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                          <svg
                            className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Зураг нэмэх
                        </button>
                      </div>
                    </div>

                    {/* Sizes/Stock Section */}
                    <div>
                      {editFormData?.sizes.length > 0 ? (
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Хэмжээ / Нөөц
                          </label>

                          {/* Existing sizes */}
                          <div className="space-y-2">
                            {editFormData.sizes.map((sizeObj, index) => (
                              <div
                                key={index}
                                className="flex gap-2 items-center"
                              >
                                <input
                                  type="text"
                                  value={sizeObj.size}
                                  placeholder="Size"
                                  onChange={(e) => {
                                    const updatedSizes = [
                                      ...editFormData.sizes,
                                    ];
                                    updatedSizes[index].size = e.target.value;
                                    setEditFormData({
                                      ...editFormData,
                                      sizes: updatedSizes,
                                    });
                                  }}
                                  className="flex-1 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                                <input
                                  type="number"
                                  value={
                                    sizeObj.stock === 0 ? "" : sizeObj.stock
                                  }
                                  placeholder="Stock"
                                  min={0}
                                  onChange={(e) => {
                                    const updatedSizes = [
                                      ...editFormData.sizes,
                                    ];
                                    updatedSizes[index].stock =
                                      parseInt(e.target.value) || 0;
                                    setEditFormData({
                                      ...editFormData,
                                      sizes: updatedSizes,
                                    });
                                  }}
                                  className="w-20 sm:w-24 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                                <button
                                  type="button"
                                  className="flex items-center justify-center h-10 w-10 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                  onClick={() => {
                                    const updatedSizes = [
                                      ...editFormData.sizes,
                                    ];
                                    updatedSizes.splice(index, 1);
                                    setEditFormData({
                                      ...editFormData,
                                      sizes: updatedSizes,
                                    });
                                  }}
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Add new size */}
                          <div className="flex gap-2 items-center pt-2 border-t border-gray-200">
                            <input
                              type="text"
                              placeholder="Хэмжээ"
                              id="newSizeInput"
                              className="flex-1 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                            <input
                              type="number"
                              placeholder="Нөөц"
                              id="newStockInput"
                              min={0}
                              className="w-20 sm:w-24 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                            <button
                              type="button"
                              className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                              onClick={() => {
                                const sizeInput = document.getElementById(
                                  "newSizeInput"
                                ) as HTMLInputElement;
                                const stockInput = document.getElementById(
                                  "newStockInput"
                                ) as HTMLInputElement;
                                const newSize = sizeInput.value.trim();
                                const newStock = parseInt(
                                  stockInput.value.trim()
                                );

                                if (!newSize) {
                                  alert("Хэмжээ оруулна уу");
                                  return;
                                }
                                if (isNaN(newStock) || newStock < 0) {
                                  alert("Stock оруулна уу");
                                  return;
                                }
                                if (
                                  editFormData.sizes.some(
                                    (s) => s.size === newSize
                                  )
                                ) {
                                  alert(
                                    "Энэ хэмжээ аль хэдийн нэмэгдсэн байна"
                                  );
                                  return;
                                }

                                setEditFormData({
                                  ...editFormData,
                                  sizes: [
                                    ...editFormData.sizes,
                                    { size: newSize, stock: newStock, _id: "" },
                                  ],
                                });

                                sizeInput.value = "";
                                stockInput.value = "";
                              }}
                            >
                              Нэмэх
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label
                            htmlFor="stock"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Нөөц (size-р ангилахгүй барааны нөөц)
                          </label>
                          <input
                            type="number"
                            name="stock"
                            id="stock"
                            value={
                              editFormData.stock === 0 ? "" : editFormData.stock
                            }
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    onClick={handleCloseModal}
                  >
                    Болих
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    Хадгалах
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

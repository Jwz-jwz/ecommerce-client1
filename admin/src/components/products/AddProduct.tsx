"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  ImagePlus,
  ChevronDown,
  Check,
  Plus,
  Edit2,
  PlusCircle,
  PlusIcon,
} from "lucide-react";
import { useCategoryContext } from "@/context/CategoryContext";
import { useProductContext } from "@/context/ProductContext";
import { toast } from "react-toastify";

const AddProductForm = () => {
  // API URL from environment variables
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8368";

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { categories } = useCategoryContext();

  // Form state
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [sale, setSale] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [sizeInput, setSizeInput] = useState<string>("");
  const [stockSizeInput, setStockSizeInput] = useState("");
  const [stockInput, setStockInput] = useState("");
  // const [editingSize, setEditingSize] = useState<number | null>(null);
  const [isSaled, setIsSaled] = useState<boolean>(false);
  const [isSized, setIsSized] = useState<boolean>(false);
  const { createProduct } = useProductContext();
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  // Define types for TypeScript
  interface SubCategory {
    _id: string;
    name: string;
  }

  interface Category {
    _id: string;
    name: string;
    subCat: SubCategory[];
  }

  interface UploadedImage {
    id: number;
    url: string;
    file?: File;
    uploaded?: boolean;
  }

  // Category selection state
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  // Handle form submission
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!name || !price || !selectedCategory) {
      setError("Бүтээгдэхүүний мэдээллийг бүрэн оруулна уу.");
      return;
    }

    // Prepare product data for context
    const productData = {
      name,
      price,
      sale,
      categoryId: selectedCategory,
      subCategoryId: selectedSubCategory,
      description,
      images: images,
      sizes: isSized
        ? sizes.map(({ size, stock }) => ({ size: size, stock }))
        : [],

      stock: stockInput,
    };

    createProduct(productData);
    // console.log(productData?.description);

    // Optionally reset the form
    setName("");
    setPrice("");
    setSale("");
    setDescription("");
    setImages([]);
    setSizes([]);
    setUploadedImages([]);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setStockInput("");
  };

  // Category selection handlers
  const toggleCategorySelection = (category: Category) => {
    setActiveCategory(category);
    setSelectedCategory(category._id);
    setSelectedSubCategory(null);
  };

  const toggleSubcategorySelection = (subCat: SubCategory) => {
    setSelectedSubCategory(subCat._id);
  };

  const getSelectedCategoryText = () => {
    if (!selectedCategory) return "Select a category";

    const category = categories.find(
      (cat: Category) => cat._id === selectedCategory
    );
    if (!category) return "Select a category";

    let text = category.name;

    if (selectedSubCategory) {
      const subCat = category.subCat.find(
        (sub) => sub._id === selectedSubCategory
      );
      if (subCat) {
        text += ` > ${subCat.name}`;
      }
    }

    return text;
  };

  // Size interface
  interface Size {
    id: number;
    size: string;
    stock: number;
  }

  // Size handling
  const addSize = () => {
    if (!sizeInput.trim() || !stockSizeInput.trim()) return;

    const parsedStock = parseInt(stockSizeInput.trim());
    if (isNaN(parsedStock) || parsedStock < 0) {
      alert("Invalid stock number");
      return;
    }

    const newSize: Size = {
      id: Date.now(),
      size: sizeInput.trim(),
      stock: parsedStock,
    };

    setSizes([...sizes, newSize]);
    setSizeInput("");
    setStockSizeInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSize();
    }
  };

  const removeSize = (id: number) => {
    setSizes(sizes.filter((size) => size.id !== id));
  };
  // Image handling

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Store the file for later upload
    const tempId = Date.now();
    const file = files[0]; // Explicitly store reference to file

    // Create a temporary object URL for preview
    const tempUrl = URL.createObjectURL(file);
    toast.warning(
      "Сонгогдсон зураг зөв бол заавал ногоон товчин дээр дарж баталгаажуулна уу!!!"
    );

    // Add to uploadedImages for display, but mark as not uploaded yet
    setUploadedImages((prev) => {
      const newImages = [
        ...prev,
        {
          id: tempId,
          url: tempUrl,
          file: file, // Store the file reference
          uploaded: false,
        },
      ];

      // Log after updating
      console.log("Updated images:", newImages);
      return newImages;
    });

    // Reset the input after storing the file
    e.target.value = "";
  };
  const uploadToCloudinary = async (imageId: number) => {
    // Find the image to upload
    const imageToUpload = uploadedImages.find((img) => img.id === imageId);
    if (!imageToUpload || !imageToUpload.file || imageToUpload.uploaded) return;

    setLoading(true);
    setError(null);

    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const data = new FormData();
    data.append("file", imageToUpload.file);
    data.append("upload_preset", uploadPreset || "");
    console.log(data);

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

      // Update the uploadedImages entry with the new URL and mark as uploaded
      setUploadedImages((prev) =>
        prev.map((img) => {
          if (img.id === imageId) {
            // Revoke the old object URL to prevent memory leaks
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

      // Add to the images array for form submission
      setImages((prev) => [...prev, cloudinaryUrl]);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (id: number) => {
    // Find the image to remove
    const imageToRemove = uploadedImages.find((img) => img.id === id);
    if (!imageToRemove) return;

    // If this was a temporary preview (not uploaded), clean up the object URL
    if (!imageToRemove.uploaded && imageToRemove.url.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    // If this was an uploaded image, also remove from the images array
    if (imageToRemove.uploaded) {
      setImages((prev) => prev.filter((url) => url !== imageToRemove.url));
    }

    // Remove from uploadedImages array
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Add a cleanup effect for object URLs
  useEffect(() => {
    return () => {
      // Clean up any remaining object URLs when component unmounts
      uploadedImages.forEach((img) => {
        if (!img.uploaded && img.url.startsWith("blob:")) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [uploadedImages]);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-2">
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-xl font-semibold text-gray-700">
          📦 Бүтээгдэхүүн нэмэх
        </h1>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-4">
          <p className="text-red-500">Хадгалж байна. Түр хүлээнэ үү...</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-t-lg">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-bold text-gray-700"
                  >
                    Барааны нэр :
                  </label>
                  <span className="text-red-500 text-2xl">***</span>
                </div>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-[#F4F4F4]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <label
                    htmlFor="price"
                    className="block text-sm font-bold text-gray-700"
                  >
                    Үнэ :
                  </label>
                  <span className="text-red-500 text-2xl">***</span>
                </div>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-[#F4F4F4]"
                />
              </div>
              <div className="space-y-2 flex items-center gap-4 ">
                <label
                  htmlFor="price"
                  className="block text-sm font-bold text-gray-700 m-0"
                >
                  Хямдралтай эсэх
                </label>
                <input
                  type="checkbox"
                  className="toggle "
                  onClick={() => setIsSaled(!isSaled)}
                />
                {/* <input type="checkbox" onClick={() => setIsSaled(!isSaled)} /> */}
              </div>

              {isSaled ? (
                <div className="space-y-2">
                  <label
                    htmlFor="sale"
                    className="block text-sm font-medium text-gray-700"
                  ></label>
                  <input
                    type="text"
                    placeholder="Sale"
                    id="sale"
                    name="sale"
                    value={sale}
                    onChange={(e) => setSale(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-[#F4F4F4]"
                  />
                </div>
              ) : (
                ""
              )}

              <div className="space-y-2">
                <div className="flex gap-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Ангилал :
                  </label>
                  <span className="text-red-500 text-2xl">***</span>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setCategoryDropdownOpen(!categoryDropdownOpen)
                    }
                    className="mt-1 relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <span className="block truncate">
                      {getSelectedCategoryText()}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </button>

                  {categoryDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-80 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      <div className="flex">
                        {/* Categories column */}
                        <div className="w-1/2 border-r">
                          {categories.length > 0 ? (
                            categories.map((category) => (
                              <div
                                key={category._id}
                                onClick={() =>
                                  toggleCategorySelection(category)
                                }
                                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                                  activeCategory?._id === category._id
                                    ? "bg-gray-100"
                                    : ""
                                }`}
                              >
                                {category.name}
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-gray-500">
                              No categories available
                            </div>
                          )}
                        </div>

                        {/* Subcategories column */}
                        <div className="w-1/2">
                          {activeCategory ? (
                            activeCategory.subCat.length > 0 ? (
                              activeCategory.subCat.map((subcategory) => (
                                <div
                                  key={subcategory._id}
                                  onClick={() =>
                                    toggleSubcategorySelection(subcategory)
                                  }
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                                >
                                  <span>{subcategory.name}</span>
                                  {selectedSubCategory === subcategory._id && (
                                    <Check className="h-4 w-4 text-green-600" />
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-gray-500">
                                No subcategories
                              </div>
                            )
                          ) : (
                            <div className="px-4 py-2 text-gray-500">
                              Select a category
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-bold text-gray-700"
                >
                  Барааны дэлгэрэнгүй :
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-[#F4F4F4] "
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Зураг оруулах :
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-[var(--gray600)]">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                        <span>Choose product images</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleImageSelection}
                          accept="image/*"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>

                {/* Image Preview Grid */}

                <div className="mt-4 grid grid-cols-3 gap-4">
                  {uploadedImages.map((image) => (
                    <div
                      key={image.id}
                      className="relative border rounded-md overflow-hidden h-24 w-24"
                    >
                      <img
                        src={image.url}
                        alt="Product"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 flex space-x-1">
                        {/* Only show upload button for non-uploaded images */}
                        {!image.uploaded && (
                          <button
                            type="button"
                            onClick={() => uploadToCloudinary(image?.id)}
                            className="p-1 bg-green-500 rounded-full text-white hover:bg-green-600"
                            title="Upload to Cloudinary"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(image.id)}
                          className="p-1 bg-white rounded-full text-gray-500 hover:text-gray-700"
                          title="Remove"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 flex items-center gap-4 ">
                <label
                  htmlFor="price"
                  className="block text-sm font-bold text-gray-700 m-0"
                >
                  Size-р ангилах
                </label>
                <input
                  type="checkbox"
                  className="toggle "
                  onClick={() => setIsSized(!isSized)}
                />
              </div>

              {isSized ? (
                <div className="space-y-2 border rounded-md p-4">
                  <div className="flex gap-2 mb-2">
                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Хэмжээ :
                      </label>
                      <input
                        type="text"
                        value={sizeInput}
                        onChange={(e) => setSizeInput(e.target.value)}
                        // placeholder="e.g, s, m, l, 30ml, 50g"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#F4F4F4]"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Нөөц :
                      </label>
                      <input
                        type="number"
                        value={stockSizeInput}
                        onChange={(e) => setStockSizeInput(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#F4F4F4]"
                        min="0"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="invisible block text-xs font-medium text-gray-500 mb-1">
                        Нөөц
                      </label>
                      <button
                        type="button"
                        onClick={addSize}
                        className=" bg-blue-600  text-white p-2 rounded border border-gray-300 hover:cursor-pointer focus:outline-none"
                      >
                        + Нэмэх
                      </button>
                    </div>
                  </div>

                  {/* Display size list with stock */}
                  <div className="mt-4">
                    {sizes.length === 0 ? (
                      ""
                    ) : (
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-[var(--gray200)]">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Хэмжээ
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Нөөц
                              </th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Устгах
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-[var(--gray200)]">
                            {sizes.map((size) => (
                              <tr key={size.id}>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <span className="text-sm font-medium text-gray-900">
                                    {size.size}
                                  </span>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <span className="text-sm font-medium text-gray-900">
                                    {size.stock}
                                  </span>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    type="button"
                                    onClick={() => removeSize(size.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}
              {isSized ? (
                ""
              ) : (
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-bold text-gray-700"
                  >
                    Барааны нөөц (size-р ангилахгүй барааны нөөц)
                  </label>

                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={stockInput}
                    onChange={(event) => setStockInput(event.target.value)}
                    className="mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-[#F4F4F4]"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="p-6 w-full text-center ">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400 hover:cursor-pointer"
            >
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;

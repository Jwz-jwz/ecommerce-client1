import { Order } from "../models/order.js";
import { Product } from "../models/product.js"; // Make sure to import your Product model
import mongoose from "mongoose";

const CreateOrder = async (request, response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = request.auth.userId;
    const {
      name,
      phoneNumber,
      email,
      delivery,
      info,
      totalPrice,
      cartItemToBackend,
    } = request.body;

    // Check and update stock for each cart item
    for (const item of cartItemToBackend) {
      const { productId, selectedSize, quantity } = item;

      // Find the product
      const product = await Product.findById(productId).session(session);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      // Check if product has sizes
      if (product.sizes && product.sizes.length > 0) {
        // Product has sizes - check size-specific stock
        if (!selectedSize) {
          throw new Error(`Size must be selected for product: ${product.name}`);
        }

        const sizeIndex = product.sizes.findIndex(
          (size) => size.size === selectedSize
        );
        if (sizeIndex === -1) {
          throw new Error(
            `Size ${selectedSize} not found for product: ${product.name}`
          );
        }

        const currentSizeStock = product.sizes[sizeIndex].stock;
        if (currentSizeStock < quantity) {
          throw new Error(
            `Insufficient stock for ${product.name} (Size: ${selectedSize}). Available: ${currentSizeStock}, Requested: ${quantity}`
          );
        }

        // Update size-specific stock
        await Product.findByIdAndUpdate(
          productId,
          { $inc: { [`sizes.${sizeIndex}.stock`]: -quantity } },
          { session }
        );
      } else {
        // Product doesn't have sizes - check general stock
        if (product.stock < quantity) {
          throw new Error(
            `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${quantity}`
          );
        }

        // Update general stock
        await Product.findByIdAndUpdate(
          productId,
          { $inc: { stock: -quantity } },
          { session }
        );
      }
    }

    // Create the order after all stock checks pass
    const result = await Order.create(
      [
        {
          userId,
          name,
          phoneNumber,
          email,
          delivery,
          info,
          totalPrice,
          cartItemToBackend,
        },
      ],
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();

    const io = request.app.get("io");
    io.emit("orderCreated", result);

    response.status(201).json({
      success: true,
      data: result[0],
      message: "Order created successfully and stock updated",
    });
  } catch (error) {
    // Rollback the transaction on error
    await session.abortTransaction();

    console.error("Order creation error:", error);
    response.status(500).json({
      success: false,
      error: error.message || "Failed to create order",
    });
  } finally {
    session.endSession();
  }
};

const GetAllOrders = async (req, response) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 12) || 12;

    const query = {};

    const totalOrders = await Order.countDocuments(query);

    // Get orders and sort by createdAt (newest first)
    const orders = await Order.find(query)
      .populate("cartItemToBackend.productId")
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalOrders / limitNumber);

    response.status(200).json({
      success: true,
      data: {
        orders,
        currentPage: pageNumber,
        totalPages,
      },
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// Get orders for a specific user
const GetUserOrders = async (request, response) => {
  try {
    const userId = request.auth.userId;

    // Add validation to make sure userId exists
    if (!userId) {
      return response.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Get orders for this user and sort by createdAt (newest first)
    const orders = await Order.find({ userId })
      .populate("cartItemToBackend.productId")
      .sort({ createdAt: -1 });

    response.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    response.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
      error: error.message,
    });
  }
};

const updateOrder = async (request, response) => {
  try {
    const { orderId } = request.params;
    const { process } = request.body;

    // Validate orderId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return response.status(400).json({
        success: false,
        error: "Invalid order ID",
      });
    }

    // Update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { process: process } },
      { new: true }
    );

    if (!updatedOrder) {
      return response.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    const io = request.app.get("io");
    io.emit("updatedOrder", updatedOrder);

    response.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    response.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const DeleteOrder = async (request, response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = request.body;
    if (!orderId) {
      return response.status(400).json({
        success: false,
        message: "order id required",
      });
    }

    // Find the order first to get cart items for stock restoration
    const orderToDelete = await Order.findById(orderId).session(session);
    if (!orderToDelete) {
      return response.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Restore stock for each cart item
    for (const item of orderToDelete.cartItemToBackend) {
      const { productId, selectedSize, quantity } = item;

      const product = await Product.findById(productId).session(session);
      if (product) {
        if (product.sizes && product.sizes.length > 0 && selectedSize) {
          // Restore size-specific stock
          const sizeIndex = product.sizes.findIndex(
            (size) => size.size === selectedSize
          );
          if (sizeIndex !== -1) {
            await Product.findByIdAndUpdate(
              productId,
              { $inc: { [`sizes.${sizeIndex}.stock`]: quantity } },
              { session }
            );
          }
        } else {
          // Restore general stock
          await Product.findByIdAndUpdate(
            productId,
            { $inc: { stock: quantity } },
            { session }
          );
        }
      }
    }

    // Delete the order
    await Order.findByIdAndDelete(orderId).session(session);

    // Commit the transaction
    await session.commitTransaction();

    const remainingOrders = await Order.find();
    response.status(200).json({
      success: true,
      message: "Order deleted successfully and stock restored",
      data: remainingOrders,
    });
  } catch (error) {
    // Rollback the transaction on error
    await session.abortTransaction();

    console.error("Error deleting order:", error);
    response.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

export { CreateOrder, GetAllOrders, GetUserOrders, updateOrder, DeleteOrder };

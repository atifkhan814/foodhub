
import mongoose from "mongoose";
import Food from "../models/Food.models.js";
import Order from "../models/order.models.js";

// Create a new customer order
export const createOrder = async (req, res) => {
  try {
    const { customer, items, paymentMethod } = req.body;

    // Check customer details
    const requiredFields = [
      "fullName",
      "phone",
      "email",
      "address",
      "city",
    ];

    if (
      !customer ||
      requiredFields.some(
        (field) =>
          typeof customer[field] !== "string" ||
          !customer[field].trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required customer details.",
      });
    }

    // Check the food items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your order must contain at least one food item.",
      });
    }

    if (
      items.some(
        (item) =>
          !item ||
          typeof item.foodId !== "string" ||
          !mongoose.isValidObjectId(item.foodId)
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more food items are invalid.",
      });
    }

    // Validate the selected payment method
    const allowedPaymentMethods = [
      "Cash on Delivery",
      "Stripe Demo",
    ];

    const selectedPaymentMethod =
      paymentMethod || "Cash on Delivery";

    if (!allowedPaymentMethods.includes(selectedPaymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method.",
      });
    }

    // Get the actual food prices from MongoDB
    const foodIds = items.map((item) => item.foodId);

    const foods = await Food.find({
      _id: { $in: foodIds },
    });

    const foodMap = new Map(
      foods.map((food) => [food._id.toString(), food])
    );

    let total = 0;

    const orderItems = items.map((item) => {
      const food = foodMap.get(item.foodId);

      if (!food) {
        throw new Error(
          `Food item not found: ${item.foodId}`
        );
      }

      const price = Number(food.price);

      if (!Number.isFinite(price) || price < 0) {
        throw new Error(
          `Invalid price for ${food.name}`
        );
      }

      const quantity = 1;

      total += price * quantity;

      return {
        foodId: food._id,
        name: food.name,
        price,
        quantity,
      };
    });

    // Save the order in MongoDB
    const order = await Order.create({
      userId: req.user._id,

      orderNumber: `FH-${Date.now()}`,

      customer: {
        fullName: customer.fullName.trim(),
        phone: customer.phone.trim(),
        email: customer.email.trim(),
        address: customer.address.trim(),
        city: customer.city.trim(),
        notes:
          typeof customer.notes === "string"
            ? customer.notes.trim()
            : "",
      },

      items: orderItems,
      total,

      // Save the selected payment method
      paymentMethod: selectedPaymentMethod,

      // Payment starts as unpaid
      paymentStatus: "Unpaid",
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: order,
    });

  } catch (error) {
    console.error("Create order error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to place your order.",
    });
  }
};


// Get orders of the logged-in customer
export const getCustmorOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });

  } catch (error) {
    console.error("Get customer orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your orders.",
    });
  }
};


// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });

  } catch (error) {
    console.error("Get all orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch all orders.",
    });
  }
};


// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check valid order statuses
    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Dispatched",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    // Find the order and update its status
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    // Check if order exists
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      data: updatedOrder,
    });

  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update order status.",
    });
  }
};
